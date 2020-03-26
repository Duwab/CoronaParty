import {
  GAME_SELECT_ACTION_CASCADE,
  GAME_SELECT_ACTION_REQUEST,
  GAME_SELECTED_DEFAULT
} from '../constants';
import { GameActions } from '../actions/GameActions';

export type GameStateType = Record<string, any>

const defaultState: GameStateType = {
  selectedGame: GAME_SELECTED_DEFAULT,
};

export default function games(
  state = defaultState,
  action: GameActions,
) {
  switch (action.type) {
    case GAME_SELECT_ACTION_REQUEST:
    case GAME_SELECT_ACTION_CASCADE:
      return {
        ...state,
        selectedGame: action.payload,
      };
    default:
      return state;
  }
}
