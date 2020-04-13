import Peer from 'simple-peer';

export interface PeersByWindowId {
  [id: string]: Peer.Instance
}
