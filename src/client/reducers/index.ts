import active from './active';
import games from './games';
import notifications from './notifications';
import messages from './messages';
import peers from './peers';
import media from './media';
import streams from './streams';
import nicknames from './nicknames';
import { combineReducers } from 'redux';

export default combineReducers({
  active,
  games,
  notifications,
  messages,
  media,
  nicknames,
  peers,
  streams,
});
