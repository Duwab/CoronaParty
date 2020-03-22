import { NICKNAME_SET, PEER_REMOVE, ME } from '../constants'
import { NicknameActions } from '../actions/NicknameActions'
import { RemovePeerAction } from '../actions/PeerActions'
import omit = require('lodash/omit')

export type Nicknames = Record<string, string | undefined>

const defaultState: Nicknames = {
  [ME]: localStorage && localStorage.nickname,
}

export default function nicknames(
  state = defaultState,
  action: NicknameActions | RemovePeerAction,
) {
  switch (action.type) {
    case PEER_REMOVE:
      return omit(state, [action.payload.userId])
    case NICKNAME_SET:
      return {
        ...state,
        [action.payload.userId]: action.payload.nickname,
      }
    default:
      return state
  }
}


const randomName = [
  "John Doe",
  "Smith",
  "Sponge Bob",
  "Rambo",
  "Luke",
  "Leia",
  "Xena",
  "Madonna"
];

const getRandomName = () => {
  const i = Math.floor(Math.random() * randomName.length);
  return randomName[i];
};

if (localStorage && !localStorage.nickname) {
  localStorage.nickname = getRandomName();
}
