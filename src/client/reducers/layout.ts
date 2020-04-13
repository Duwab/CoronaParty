import { LAYOUT_CHANGE, LAYOUT_MODES } from '../constants';
import { LayoutActions } from '../actions/LayoutActions';

export type LayoutState = {
  mode: string
  widgets: {[key: string]: boolean}
}

const WIDGETS_PER_MODE: {[key: string]: {[key: string]: boolean}} = {
  [LAYOUT_MODES.DEFAULT]: {
    join: false,
    chat: true,
    sidebar: true,
    game: true,
  },
  [LAYOUT_MODES.SETUP]: {
    join: true,
    chat: false,
    sidebar: false,
    game: false,
  },
};

const defaultState: LayoutState = {
  mode: 'setup',
  widgets: WIDGETS_PER_MODE[LAYOUT_MODES.SETUP],
};

export default function layout(
  state = defaultState,
  action: LayoutActions,
): LayoutState {
  switch (action.type) {
    case LAYOUT_CHANGE:
      state.mode = action.payload.mode;
      state.widgets = WIDGETS_PER_MODE[action.payload.mode];
      return state;
    default:
      return state;
  }
}
