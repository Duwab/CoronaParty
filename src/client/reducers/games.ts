import { GAME_SELECT_ACTION, GAME_SELECTED_DEFAULT } from '../constants';
import { GameActions } from '../actions/GameActions';

export type GameStateType = Record<string, any>

const defaultState: GameStateType = {
  selectedGame: GAME_SELECTED_DEFAULT
};

export default function games(
  state = defaultState,
  action: GameActions,
) {
  switch (action.type) {
    case GAME_SELECT_ACTION:
      return {
        ...state,
        selectedGame: action.payload
      };
    default:
      return state;
  }
}
