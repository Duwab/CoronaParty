import socket from '../socket';
import { ThunkResult } from '../store';
import { callId, userId } from '../window';
import * as NotifyActions from './NotifyActions';
import * as SocketActions from './SocketActions';
import * as GameActions from './GameActions';

export interface InitAction {
  type: 'INIT'
  payload: Promise<void>
}

interface InitializeAction {
  type: 'INIT'
}

const initialize = (): InitializeAction => ({
  type: 'INIT',
});

export const init = (): ThunkResult<Promise<void>> =>
async (dispatch, getState) => {
  return new Promise(resolve => {
    socket.on('connect', () => {
      dispatch(GameActions.listenGameEvents({
        socket,
        roomName: callId,
        userId,
      }));
      dispatch(NotifyActions.warning('Connected to server socket'));
      dispatch(SocketActions.handshake({
        socket,
        roomName: callId,
        userId,
      }));
      dispatch(initialize());
      resolve();
    });
    socket.on('disconnect', () => {
      dispatch(NotifyActions.error('Server socket disconnected'));
    });
  });
};
