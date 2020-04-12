import { readDocumentMeta } from './networking/readDocumentMeta';

export const createObjectURL = (object: unknown) =>
  window.URL.createObjectURL(object)
export const revokeObjectURL = (url: string) => window.URL.revokeObjectURL(url)

export const baseUrl = readDocumentMeta('baseUrl')
export const callId = readDocumentMeta('callId')
export const userId = readDocumentMeta('userId')
export const iceServers = JSON.parse(readDocumentMeta('iceServers')!)

export const MediaStream = window.MediaStream
