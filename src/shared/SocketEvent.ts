import { TypedEmitter, TypedEmitterKeys } from './TypedEmitter'
import { SignalData } from 'simple-peer'

export interface User {
  socketId: string
  userId?: string
}

export interface Ready {
  room: string
  userId: string
}

export type GameEventType = {
  userId: string
  humanId: string
  gameCode: string
  roomName: string
  type: string
  action: string
  body?: any
}

export interface SocketEvent {
  users: {
    initiator: string
    users: User[]
  }
  signal: {
    userId: string
    // eslint-disable-next-line
    signal: SignalData
  }
  connect: undefined
  disconnect: undefined
  ready: Ready
  'game:select': {
    userId: string
    roomName: string
    gameCode: string
  }
  'game:event': GameEventType
}

export type ServerSocket =
  Omit<SocketIO.Socket, TypedEmitterKeys> &
  TypedEmitter<SocketEvent>

export type TypedIO = SocketIO.Server & {
  to(roomName: string): TypedEmitter<SocketEvent>
}
