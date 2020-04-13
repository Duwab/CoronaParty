import {
  GAME_APPLY_COMMAND_ACTION,
  GAME_SELECT_ACTION_CASCADE,
  GAME_SELECT_ACTION_REQUEST,
  GAME_SELECTED_DEFAULT,
} from '../constants';
import { GameActions } from '../actions/GameActions';
import { GameEventType } from '../../shared';

export type GameStateType = {
  selectedGame: string
  eventToApply?: GameEventType
}


const defaultState: GameStateType = {
  selectedGame: GAME_SELECTED_DEFAULT,
};

export default function games(
  state = defaultState,
  action: GameActions,
): GameStateType {
  switch (action.type) {
    case GAME_SELECT_ACTION_REQUEST:
    case GAME_SELECT_ACTION_CASCADE:
      return {
        ...state,
        selectedGame: action.payload,
      };
    case GAME_APPLY_COMMAND_ACTION:
      console.log('apply in store', action);
      return {
        ...state,
        eventToApply: action.payload,
      };
    default:
      return state;
  }
}
