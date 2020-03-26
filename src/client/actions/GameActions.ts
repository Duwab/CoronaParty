import { GAME_SELECT_ACTION_REQUEST } from '../constants';
import { ClientSocket } from '../socket';
import { Dispatch, GetState } from '../store';

let _socket: ClientSocket;
let _roomName: string;
let _userId: string;

export interface SelectGamePayload {
  gameRef: string
  options: any
}

export interface SetSelectedGameAction {
  type: string
  payload: string
}

export function selectGameRequest(payload: string): SetSelectedGameAction {
  console.log('select game request', payload);
  _socket.emit('game:select', {
    userId: _userId,
    roomName: _roomName,
    gameCode: payload,
  });
  return {
    type: GAME_SELECT_ACTION_REQUEST,
    payload,
  };
}

export function selectGameCascade(payload: string): SetSelectedGameAction {
  return {
    type: GAME_SELECT_ACTION_REQUEST,
    payload,
  };
}

export interface ListenGameEventsOptions {
  socket: ClientSocket
  roomName: string
  userId: string
}

export type GameActions = SetSelectedGameAction;

export function listenGameEvents({socket, roomName, userId}: ListenGameEventsOptions) {
  _socket = socket;
  _userId = userId;
  _roomName = roomName;
  return (dispatch: Dispatch, getState: GetState) => {
    socket.on('game:select', payload => {
      console.log('socket says you should select', payload.gameCode);
      dispatch(selectGameCascade(payload.gameCode));
    });
  };
}
