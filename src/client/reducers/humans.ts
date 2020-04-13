import { ME, HUMAN_SET, PEER_REMOVE } from '../constants';
import { HumanActions } from '../actions/HumanActions';
import HumanService from '../networking/identity/human';
import omit = require('lodash/omit');
import { RemovePeerAction } from '../actions/PeerActions';

export type HumanIds = Record<string, string>

const currentHumanId = HumanService.getCurrentHumanId();

const defaultState: HumanIds = {
  [ME]: currentHumanId,
};

export default function humans(
  state = defaultState,
  action: HumanActions | RemovePeerAction,
) {
  switch (action.type) {
    case PEER_REMOVE:
      console.log('peer remove', action.payload)
      return omit(state, [action.payload.userId]);
    case HUMAN_SET:
      return {
        ...state,
        [action.payload.windowId]: action.payload.humanId,
      };
    default:
      return state;
  }
}
