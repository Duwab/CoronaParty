import active from './active';
import games from './games';
import notifications from './notifications';
import messages from './messages';
import peers from './peers';
import media from './media';
import streams from './streams';
import nicknames from './nicknames';
import humans from './humans';
import { combineReducers } from 'redux';

export default combineReducers({
  active,
  games,
  humans,
  notifications,
  messages,
  media,
  nicknames,
  peers,
  streams,
});
