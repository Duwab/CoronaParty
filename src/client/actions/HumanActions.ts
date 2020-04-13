import { HUMAN_SET } from '../constants';

export interface BindHumanWindowPayload {
  windowId: string
  humanId: string
}

export interface BindHumanWindowAction {
  type: 'HUMAN_SET'
  payload: BindHumanWindowPayload
}

export function bindHumanWindow(payload: BindHumanWindowPayload): BindHumanWindowAction {
  return {
    type: HUMAN_SET,
    payload,
  };
}

export type HumanActions = BindHumanWindowAction
