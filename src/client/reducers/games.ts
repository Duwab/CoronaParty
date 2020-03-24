import { GAME_SELECT_ACTION } from '../constants'
import { GameActions } from '../actions/GameActions'

export type GameStateType = Record<string, any>

const defaultState: GameStateType = {
  selectedGame: 'none'
};

export default function games(
  state = defaultState,
  action: GameActions,
) {
  switch (action.type) {
    case GAME_SELECT_ACTION:
      console.log('select game', action.payload);
      return {
        ...state,
        selectedGame: action.payload
      };
    default:
      return state;
  }
}
