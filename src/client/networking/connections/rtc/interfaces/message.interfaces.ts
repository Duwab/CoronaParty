import { Base64File } from './file.interfaces';

export interface TextMessage {
  type: 'text'
  payload: string
}

export interface FileMessage {
  type: 'file'
  payload: Base64File
}

export interface NicknameMessage {
  type: 'nickname'
  payload: {
    nickname: string
  }
}

export interface HumanMessage {
  type: 'human'
  payload: {
    humanId: string
  }
}

export type RtcMessage = TextMessage | FileMessage | NicknameMessage | HumanMessage
