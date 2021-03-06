export const ACTIVE_SET = 'ACTIVE_SET';
export const ACTIVE_TOGGLE = 'ACTIVE_TOGGLE';

export const ALERT = 'ALERT';
export const ALERT_DISMISS = 'ALERT_DISMISS';
export const ALERT_CLEAR = 'ALERT_CLEAR';

export const INIT = 'INIT';

export const ME = '_me_';
export const PEERCALLS = '[PeerCalls]';

export const LAYOUT_CHANGE = 'LAYOUT_CHANGE';
export const LAYOUT_MODES = {
  DEFAULT: 'default',
  SETUP: 'setup',
};

export const NOTIFY = 'NOTIFY';
export const NOTIFY_DISMISS = 'NOTIFY_DISMISS';
export const NOTIFY_CLEAR = 'NOTIFY_CLEAR';

export const MESSAGE_ADD = 'MESSAGE_ADD';

export const MEDIA_ENUMERATE = 'MEDIA_ENUMERATE';
export const MEDIA_STREAM = 'MEDIA_STREAM';
export const MEDIA_VIDEO_CONSTRAINT_SET = 'MEDIA_VIDEO_CONSTRAINT_SET';
export const MEDIA_AUDIO_CONSTRAINT_SET = 'MEDIA_AUDIO_CONSTRAINT_SET';
export const MEDIA_PLAY = 'MEDIA_PLAY';

export const NICKNAME_SET = 'NICKNAME_SET';
export const HUMAN_SET = 'HUMAN_SET';

export const PEER_ADD = 'PEER_ADD';
export const PEER_REMOVE = 'PEER_REMOVE';
export const PEERS_DESTROY = 'PEERS_DESTROY';

export const PEER_EVENT_ERROR = 'error';
export const PEER_EVENT_CONNECT = 'connect';
export const PEER_EVENT_CLOSE = 'close';
export const PEER_EVENT_SIGNAL = 'signal';
export const PEER_EVENT_TRACK = 'track';
export const PEER_EVENT_DATA = 'data';

export const SOCKET_EVENT_SIGNAL = 'signal';
export const SOCKET_EVENT_USERS = 'users';

export const STREAM_ADD = 'PEER_STREAM_ADD';
export const STREAM_REMOVE = 'PEER_STREAM_REMOVE';
export const STREAM_TRACK_REMOVE = 'PEER_STREAM_TRACK_REMOVE';

export const STREAM_TYPE_CAMERA = 'camera';
export const STREAM_TYPE_DESKTOP = 'desktop';


interface GameSelectOption {
  value: string
  label: string
}
export const GAME_SELECT_ACTION_REQUEST = 'GAME_SELECT_ACTION_REQUEST';
export const GAME_SELECT_ACTION_CASCADE = 'GAME_SELECT_ACTION_CASCADE';
export const GAME_PUSH_COMMAND_ACTION = 'GAME_PUSH_COMMAND_ACTION';
export const GAME_PUSH_STATUS_ACTION = 'GAME_PUSH_STATUS_ACTION';
export const GAME_APPLY_COMMAND_ACTION = 'GAME_APPLY_COMMAND_ACTION';

export const GAME_CODES = {
  KARAOKE: 'karaoke',
  KEYBOARD: 'keyboard',
  DEBUG: 'debug',
  NONE: 'none',
};

export const GAME_SELECTED_DEFAULT = GAME_CODES.KARAOKE;
export const GAMES_AVAILABLE_OPTIONS: GameSelectOption[] = [
  {value: GAME_CODES.KARAOKE, label: 'Karaoke'},
  {value: GAME_CODES.KEYBOARD, label: 'Keyboard'},
  {value: GAME_CODES.DEBUG, label: 'Debug'},
  {value: GAME_CODES.NONE, label: 'None'},
];
