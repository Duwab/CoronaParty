import * as ChatActions from './ChatActions';
import * as NicknameActions from './NicknameActions';
import * as NotifyActions from './NotifyActions';
import * as constants from '../constants';
import Peer from 'simple-peer';
import forEach from 'lodash/forEach';
import _debug from 'debug';
import { iceServers } from '../window';
import { Dispatch, GetState } from '../store';
import { ClientSocket } from '../socket';
import { PeerHandler } from '../networking/connections/rtc/PeerHandler';
import { sendDataToPeer } from '../networking/connections/rtc/sendDataToPeer';
import { RtcMessage } from '../networking/connections/rtc/interfaces/message.interface';
import { Base64File } from '../networking/connections/rtc/interfaces/file.interface';

const debug = _debug('peercalls');

export interface Peers {
  [id: string]: Peer.Instance
}

export interface CreatePeerOptions {
  socket: ClientSocket
  user: { id: string }
  initiator: string
  stream?: MediaStream
}

/**
 * @param {Object} options
 * @param {Socket} options.socket
 * @param {User} options.user
 * @param {String} options.user.id
 * @param {Boolean} [options.initiator=false]
 * @param {MediaStream} [options.stream]
 */
export function createPeer (options: CreatePeerOptions) {
  const { socket, user, initiator, stream } = options;

  return (dispatch: Dispatch, getState: GetState) => {
    const userId = user.id;
    debug('create peer: %s, stream:', userId, stream);
    dispatch(NotifyActions.warning('Connecting to peer...'));

    const oldPeer = getState().peers[userId];
    if (oldPeer) {
      dispatch(NotifyActions.info('Cleaning up old connection...'));
      oldPeer.destroy();
      dispatch(removePeer(userId));
    }

    const peer = new Peer({
      initiator: userId === initiator,
      config: { iceServers },
      // Allow the peer to receive video, even if it's not sending stream:
      // https://github.com/feross/simple-peer/issues/95
      offerConstraints: {
        offerToReceiveAudio: true,
        offerToReceiveVideo: true,
      },
      stream,
    });

    const handler = new PeerHandler({
      socket,
      user,
      dispatch,
      getState,
    });

    peer.once(constants.PEER_EVENT_ERROR, handler.handleError);
    peer.once(constants.PEER_EVENT_CONNECT, handler.handleConnect);
    peer.once(constants.PEER_EVENT_CLOSE, handler.handleClose);
    peer.on(constants.PEER_EVENT_SIGNAL, handler.handleSignal);
    peer.on(constants.PEER_EVENT_TRACK, handler.handleTrack);
    peer.on(constants.PEER_EVENT_DATA, handler.handleData);

    dispatch(addPeer({ peer, userId }));
  };
}

export interface AddPeerParams {
  peer: Peer.Instance
  userId: string
}

export interface AddPeerAction {
  type: 'PEER_ADD'
  payload: AddPeerParams
}

export const addPeer = (payload: AddPeerParams): AddPeerAction => ({
  type: constants.PEER_ADD,
  payload,
});

export interface RemovePeerAction {
  type: 'PEER_REMOVE'
  payload: { userId: string }
}

export const removePeer = (userId: string): RemovePeerAction => ({
  type: constants.PEER_REMOVE,
  payload: { userId },
});

export interface DestroyPeersAction {
  type: 'PEERS_DESTROY'
}

export const destroyPeers = (): DestroyPeersAction => ({
  type: constants.PEERS_DESTROY,
});

export type PeerAction =
  AddPeerAction |
  RemovePeerAction |
  DestroyPeersAction;

export const sendMessage = (message: RtcMessage) =>
(dispatch: Dispatch, getState: GetState) => {
  const { peers } = getState();
  debug('Sending message type: %s to %s peers.',
    message.type, Object.keys(peers).length);
  switch (message.type) {
    case 'file':
      dispatch(ChatActions.addMessage({
        userId: constants.ME,
        message: 'Send file: "' +
          message.payload.name + '" to all peers',
        timestamp: new Date().toLocaleString(),
        image: message.payload.data,
      }));
      break;
    case 'nickname':
      dispatch(ChatActions.addMessage({
        userId: constants.PEERCALLS,
        message: 'You are now known as: ' + message.payload.nickname,
        timestamp: new Date().toLocaleString(),
        image: undefined,
      }));
      dispatch(NicknameActions.setNickname({
        userId: constants.ME,
        nickname: message.payload.nickname,
      }));
      window.localStorage &&
        (window.localStorage.nickname = message.payload.nickname);
      break;
    default:
      dispatch(ChatActions.addMessage({
        userId: constants.ME,
        message: message.payload,
        timestamp: new Date().toLocaleString(),
        image: undefined,
      }));
  }
  forEach(peers, (peer, userId) => {
    sendDataToPeer(peer, message);
  });
};

export const sendFile = (file: File) =>
async (dispatch: Dispatch, getState: GetState) => {
  const { name, size, type } = file;
  if (!window.FileReader) {
    dispatch(NotifyActions.error('File API is not supported by your browser'));
    return;
  }
  const reader = new window.FileReader();
  const base64File = await new Promise<Base64File>(resolve => {
    reader.addEventListener('load', () => {
      resolve({
        name,
        size,
        type,
        data: reader.result as string,
      });
    });
    reader.readAsDataURL(file);
  });

  sendMessage({ payload: base64File, type: 'file' })(dispatch, getState);
};
