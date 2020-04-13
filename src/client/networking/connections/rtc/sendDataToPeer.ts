import Peer from 'simple-peer';
import { RtcMessage } from './interfaces/message.interface';

export function sendDataToPeer(peer: Peer.Instance, message: RtcMessage) {
  peer.send(JSON.stringify(message));
}
