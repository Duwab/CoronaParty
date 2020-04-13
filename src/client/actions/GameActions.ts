import {
  GAME_SELECT_ACTION_REQUEST,
  GAME_PUSH_COMMAND_ACTION,
  GAME_APPLY_COMMAND_ACTION,
  GAME_SELECT_ACTION_CASCADE, GAME_PUSH_STATUS_ACTION
} from '../constants';
import { ClientSocket } from '../socket';
import { Dispatch, GetState } from '../store';
import HumanService from '../networking/identity/human';
import { GameEventType } from '../../shared';

let _socket: ClientSocket;
let _roomName: string;
let _userId: string;

/**
 * Game select: which game to select for all users
 */
export interface SetSelectedGameAction {
  type: typeof GAME_SELECT_ACTION_REQUEST | typeof GAME_SELECT_ACTION_CASCADE
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
    type: GAME_SELECT_ACTION_CASCADE,
    payload,
  };
}

/**
 * Game Command : something to do inside 1 game
 */

export interface GameCommand {
  gameCode: string
  command: string
  body?: object
}

export interface GameStatus {
  gameCode: string
  body?: object
}

export interface PushGameCommandAction {
  type: typeof GAME_PUSH_COMMAND_ACTION
  payload: GameCommand
}

export interface PushGameStatusAction {
  type: typeof GAME_PUSH_STATUS_ACTION
  payload: GameStatus
}

export interface ApplyGameCommandAction {
  type: typeof GAME_APPLY_COMMAND_ACTION
  payload: GameEventType
}

export function pushGameCommand(payload: GameCommand): PushGameCommandAction {
  _socket.emit('game:event', {
    humanId: HumanService.getCurrentHumanId(),
    userId: _userId,
    roomName: _roomName,
    gameCode: payload.gameCode,
    type: 'command',
    action: payload.command,
    body: payload.body,
  });
  return {
    type: GAME_PUSH_COMMAND_ACTION,
    payload,
  };
}

export function pushGameStatus(payload: GameStatus): PushGameStatusAction {
  _socket.emit('game:event', {
    humanId: HumanService.getCurrentHumanId(),
    userId: _userId,
    roomName: _roomName,
    gameCode: payload.gameCode,
    type: 'status',
    action: 'update',
    body: payload.body,
  });
  return {
    type: GAME_PUSH_STATUS_ACTION,
    payload,
  };
}

export function applyGameCommand(payload: GameEventType): ApplyGameCommandAction {
  return {
    type: GAME_APPLY_COMMAND_ACTION,
    payload,
  };
}


/**
 * Listen socket events
 */
export interface ListenGameEventsOptions {
  socket: ClientSocket
  roomName: string
  userId: string
}

export type GameActions = SetSelectedGameAction | PushGameCommandAction | PushGameStatusAction | ApplyGameCommandAction;

export function listenGameEvents({socket, roomName, userId}: ListenGameEventsOptions) {
  _socket = socket;
  _userId = userId;
  _roomName = roomName;
  return (dispatch: Dispatch, getState: GetState) => {
    socket.on('game:select', payload => {
      console.log('socket says you should select', payload.gameCode);
      dispatch(selectGameCascade(payload.gameCode));
    });
    socket.on('game:event', payload => {
      console.log('dispatch game event', payload);
      dispatch(applyGameCommand(payload));
    });
  };
}
