import { ClientSocket } from '../../../socket';
import { Dispatch, GetState } from '../../../store';
import * as NotifyActions from '../../../actions/NotifyActions';
import { SignalData } from 'simple-peer';
import * as constants from '../../../constants';
import * as StreamActions from '../../../actions/StreamActions';
import * as ChatActions from '../../../actions/ChatActions';
import HumanService from '../../identity/human';
import * as NicknameActions from '../../../actions/NicknameActions';
import * as HumanActions from '../../../actions/HumanActions';
import { removePeer } from '../../../actions/PeerActions';
import _debug from 'debug';
import { sendDataToPeer } from './sendDataToPeer';

const debug = _debug('peercalls');

export interface PeerHandlerOptions {
  socket: ClientSocket
  user: { id: string }
  dispatch: Dispatch
  getState: GetState
}

export class PeerHandler {
  socket: ClientSocket;
  user: { id: string };
  dispatch: Dispatch;
  getState: GetState;

  constructor(readonly options: PeerHandlerOptions) {
    this.socket = options.socket;
    this.user = options.user;
    this.dispatch = options.dispatch;
    this.getState = options.getState;
  }

  handleError = (err: Error) => {
    const {dispatch, getState, user} = this;
    debug('peer: %s, error %s', user.id, err.stack);
    dispatch(NotifyActions.error('A peer connection error occurred'));
    const peer = getState().peers[user.id];
    peer && peer.destroy();
    dispatch(removePeer(user.id));
  };

  handleSignal = (signal: SignalData) => {
    const {socket, user} = this;
    debug('peer: %s, signal: %o', user.id, signal);

    const payload = {userId: user.id, signal};
    socket.emit('signal', payload);
  };

  handleConnect = () => {
    const {dispatch, user, getState} = this;
    debug('peer: %s, connect', user.id);
    dispatch(NotifyActions.warning('Peer connection established'));

    const state = getState();
    const peer = state.peers[user.id];
    const localStream = state.streams[constants.ME];
    localStream && localStream.streams.forEach(s => {
      // If the local user pressed join call before this peer has joined the
      // call, now is the time to share local media stream with the peer since
      // we no longer automatically send the stream to the peer.
      s.stream.getTracks().forEach(track => {
        peer.addTrack(track, s.stream);
      });
    });
    const nickname = state.nicknames[constants.ME];
    if (nickname) {
      sendDataToPeer(peer, {
        payload: {nickname},
        type: 'nickname',
      });
    }

    const humanId = HumanService.getCurrentHumanId();
    sendDataToPeer(peer, {
      payload: {humanId},
      type: 'human',
    });
  };

  handleTrack = (track: MediaStreamTrack, stream: MediaStream) => {
    const {user, dispatch} = this;
    const userId = user.id;
    debug('peer: %s, track', userId);
    // Listen to mute event to know when a track was removed
    // https://github.com/feross/simple-peer/issues/512
    track.onmute = () => {
      console.log('on mute => do nothing');
      debug('peer: %s, track muted', userId);
      // dispatch(StreamActions.removeTrack({
      //   userId,
      //   stream,
      //   track,
      // }))
    };
    track.onunmute = () => {
      console.log('on unmute => do nothing');
      debug('peer: %s, track muted', userId);
      // dispatch(StreamActions.removeTrack({
      //   userId,
      //   stream,
      //   track,
      // }))
    };
    dispatch(StreamActions.addStream({
      userId,
      stream,
    }));
  };

  handleData = (buffer: ArrayBuffer) => {
    const {dispatch, getState, user} = this;
    const state = getState();
    const message = JSON.parse(new window.TextDecoder('utf-8').decode(buffer));
    debug('peer: %s, message: %o', user.id, message);
    switch (message.type) {
      case 'file':
        dispatch(ChatActions.addMessage({
          userId: user.id,
          message: message.payload.name,
          timestamp: new Date().toLocaleString(),
          image: message.payload.data,
        }));
        break;
      case 'nickname':
        dispatch(ChatActions.addMessage({
          userId: constants.PEERCALLS,
          message: 'User ' + HumanService.getUserNickname(state.nicknames, user.id) +
            ' is now known as ' + message.payload.nickname,
          timestamp: new Date().toLocaleString(),
          image: undefined,
        }));
        dispatch(NicknameActions.setNickname({
          userId: user.id,
          nickname: message.payload.nickname,
        }));
        break;
      case 'human':
        dispatch(HumanActions.bindHumanWindow({
          windowId: user.id,
          humanId: message.payload.humanId,
        }));
        break;
      default:
        dispatch(ChatActions.addMessage({
          userId: user.id,
          message: message.payload,
          timestamp: new Date().toLocaleString(),
          image: undefined,
        }));
    }
  };

  handleClose = () => {
    const {dispatch, user, getState} = this;
    dispatch(NotifyActions.error('Peer connection closed'));
    const state = getState();
    const userStreams = state.streams[user.id];
    userStreams && userStreams.streams.forEach(s => {
      dispatch(StreamActions.removeStream(user.id, s.stream));
    });
    dispatch(removePeer(user.id));
  };
}
