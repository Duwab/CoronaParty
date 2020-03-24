import { GAME_SELECT_ACTION } from '../constants';

export interface SelectGamePayload {
  gameRef: string
  options: any
}

export interface SetSelectedGameAction {
  type: string
  payload: string
}

export function selectGame(payload: string): SetSelectedGameAction {
  console.log('select game', payload);
  return {
    type: GAME_SELECT_ACTION,
    payload,
  };
}

export type GameActions = SetSelectedGameAction;
