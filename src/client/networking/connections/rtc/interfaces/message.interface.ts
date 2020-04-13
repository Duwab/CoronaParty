import { Base64File } from './file.interface';

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

export type RtcMessage = TextMessage | FileMessage | NicknameMessage
