import {
  LAYOUT_CHANGE,
} from '../constants';

export interface ChangeLayoutAction {
  type: typeof LAYOUT_CHANGE
  payload: {
    mode: string
  }
}

export function changeLayout(mode: string): ChangeLayoutAction {
  return {
    type: LAYOUT_CHANGE,
    payload: {mode},
  };
}

export type LayoutActions = ChangeLayoutAction;
