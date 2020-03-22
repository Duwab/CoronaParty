import * as NotifyActions from '../actions/NotifyActions'
import * as PeerActions from '../actions/PeerActions'
import * as constants from '../constants'
import _debug from 'debug'
import { Dispatch, GetState, ThunkResult } from '../store'
import socket, { ClientSocket } from '../socket'
import { SocketEvent, User } from '../../shared'
import { callId, userId } from '../window';
import { removePeer } from '../actions/PeerActions';
import { Instance } from 'simple-peer';

const debug = _debug('peercalls')

export interface SocketHandlerOptions {
  socket: ClientSocket
  roomName: string
  stream?: MediaStream
  dispatch: Dispatch
  getState: GetState
  userId: string
}

class SocketHandler {
  socket: ClientSocket
  roomName: string
  stream?: MediaStream
  dispatch: Dispatch
  getState: GetState
  userId: string

  otherWindows: SocketEvent['users'][] = [];

  constructor(options: SocketHandlerOptions) {
    this.socket = options.socket;
    this.roomName = options.roomName;
    this.stream = options.stream;
    this.dispatch = options.dispatch;
    this.getState = options.getState;
    this.userId = options.userId;
  }

  handleSignal = ({userId, signal}: SocketEvent['signal']) => {
    const {getState} = this;
    const peer = getState().peers[userId];
    // debug('socket signal, userId: %s, signal: %o', userId, signal);
    if (!peer) return debug('user: %s, no peer found', userId);
    peer.signal(signal)
  };
  handleUsers = ({initiator, users}: SocketEvent['users']) => {
    const {socket, stream, dispatch, getState} = this;
    debug('socket users: %o', users);
    this.dispatch(NotifyActions.info('Connected users: {0}', users.length));
    const {peers} = this.getState();
    console.log('add users', Object.keys(peers).length);
    debug('active peers: %o', Object.keys(peers));

    this.otherWindows.push({initiator, users});
    users
      .filter(
        user =>
          user.userId && !peers[user.userId] && user.userId !== this.userId)
      .forEach(user => PeerActions.createPeer({
        socket,
        user: {
          // users without id should be filtered out
          id: user.userId!,
        },
        initiator,
        stream,
      })(dispatch, getState));
  };

  emitReady() {
    console.log('emit ready');
    const {socket, roomName, userId} = this;
    socket.emit('ready', {
      room: roomName,
      userId
    });
  }

  // experimental adu
  rebuildPeers() {
    console.log('destroy users');
    const {peers} = this.getState();
    this.otherWindows.map(({initiator, users}) => {
      console.log('initiator', initiator);
      users.forEach(user => {
        const windowId = user.userId;
        if(windowId && windowId !== this.userId && windowId !== constants.ME) {
          this.rebuildSinglePeer(peers[windowId], windowId, constants.ME);
        }
      });
    });
  }

  rebuildSinglePeer(peer: Instance|void, windowId: string, initiator: string) {
    console.log('rebuildSinglePeer', windowId);

    const {socket, stream, dispatch, getState} = this;

    // remove existing peer
    // peer && peer.destroy();
    // dispatch(removePeer(windowId));

    // wait and recreate
    setTimeout(() => {
      PeerActions.createPeer({
        socket,
        user: {
          // users without id should be filtered out
          id: windowId!,
        },
        initiator,
        stream,
      })(dispatch, getState);
    }, 5000);
  }
}

export interface HandshakeOptions {
  socket: ClientSocket
  roomName: string
  userId: string
  stream?: MediaStream
}

const handlers: SocketHandler[] = [];

export function refreshPeers() {
  handlers.map(handler => handler.rebuildPeers());
}

interface RefreshPeersAction {
  type: string;
  payload: {}
}

export const refreshPeersDispatch = (): RefreshPeersAction => {
  console.log('you do something');
  // refreshPeers();
  handlers[handlers.length-1].emitReady();
  return {
    type: 'refresh-peers',
    payload: {},
  };
};


export function handshake(options: HandshakeOptions) {
  // MARKER : after handshake, we have window socket infos
  console.log('my handshake', options);
  const {socket, roomName, stream, userId} = options;

  return (dispatch: Dispatch, getState: GetState) => {
    const handler = new SocketHandler({
      socket,
      roomName,
      stream,
      dispatch,
      getState,
      userId,
    });

    handlers.push(handler);

    // remove listeneres to make seocket reusable
    socket.removeListener(constants.SOCKET_EVENT_SIGNAL, handler.handleSignal);
    socket.removeListener(constants.SOCKET_EVENT_USERS, handler.handleUsers);

    socket.on(constants.SOCKET_EVENT_SIGNAL, handler.handleSignal);
    socket.on(constants.SOCKET_EVENT_USERS, handler.handleUsers);

    debug('userId: %s', userId);
    debug('emit ready for room: %s', roomName);
    dispatch(NotifyActions.info('Ready for connections'));
    // MARKER : what we do when ready
    // might be emitted more often or have a complementary emission ("restore" for example)
    console.log('emit ready');
    socket.emit('ready', {
      room: roomName,
      userId,
    })
  }
}
