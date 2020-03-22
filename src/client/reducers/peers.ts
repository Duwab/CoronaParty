import forEach from 'lodash/forEach'
import omit from 'lodash/omit'
import Peer from 'simple-peer'
import { PeerAction } from '../actions/PeerActions'
import * as constants from '../constants'
import { MediaStreamAction } from '../actions/MediaActions'
import { RemoveStreamAction, StreamType } from '../actions/StreamActions'

export type PeersState = Record<string, Peer.Instance>

const defaultState: PeersState = {};

let localStreams: Record<StreamType, MediaStream | undefined> = {
  camera: undefined,
  desktop: undefined,
};

function handleRemoveStream(
  state: PeersState,
  action: RemoveStreamAction,
): PeersState {
  const stream = action.payload.stream;
  if (action.payload.userId === constants.ME) {
    _unsyncLocalStreamWithPeers(state, stream);
  }

  return state;
}

function handleMediaStream(
  state: PeersState,
  action: MediaStreamAction,
): PeersState {
  console.log('handleMediaStream', action.status)
  if (action.status !== 'resolved') {
    return state;
  }
  const streamType = action.payload.type;
  const stream = action.payload.stream;
  if (
    action.payload.userId === constants.ME &&
    streamType
  ) {
    _syncLocalStreamWithPeers(state, streamType, stream);
    // setTimeout(() => _unsyncLocalStreamWithPeers(state, stream), 3000);
    setTimeout(() => _refreshLocalStreamWithPeers(state, streamType, stream), 1000);
  }
  return state;
}

// stream : ce dont on dispose en local
// track : le slot pour ce stream dans la connexion p2p
function _syncLocalStreamWithPeers(state: PeersState, streamType: StreamType, newLocalStream: MediaStream) {
  console.log(`sync local ${streamType} with others`);
  const previousLocalStream = localStreams[streamType];
  forEach(state, peer => {
    previousLocalStream && previousLocalStream.getTracks().forEach(track => {
      peer.removeTrack(track, previousLocalStream);
    });
    newLocalStream.getTracks().forEach(track => {
      console.log('track', track);
      peer.addTrack(track, newLocalStream);
    });
  });
  localStreams[streamType] = newLocalStream;
}

function _refreshLocalStreamWithPeers(state: PeersState, streamType: StreamType, stream: MediaStream) {
  console.log('refresh');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const truc: any = window;
  truc.playWithMe = {
    peers: state,
    streamType,
    currentStream: localStreams[streamType],
    newStream: stream
  };
}

function _unsyncLocalStreamWithPeers(state: PeersState, stream: MediaStream) {
  console.log(`UN-sync local stream with others`)
  forEach(state, peer => {
    stream.getTracks().forEach(track => {
      peer.removeTrack(track, stream);
    });
  });
}

export default function peers(
  state = defaultState,
  action: PeerAction | MediaStreamAction | RemoveStreamAction,
): PeersState {
  switch (action.type) {
    case constants.PEER_ADD:
      // MARKER
      console.log('peer add')
      return {
        ...state,
        [action.payload.userId]: action.payload.peer,
      }
    case constants.PEER_REMOVE:
      return omit(state, [action.payload.userId])
    case constants.PEERS_DESTROY:
      localStreams = {
        camera: undefined,
        desktop: undefined,
      }
      forEach(state, peer => peer.destroy())
      return defaultState
    case constants.STREAM_REMOVE:
      return handleRemoveStream(state, action)
    case constants.MEDIA_STREAM:
      console.log('I handle media stream');
      // MAKER : new stream declared => register properly to enable recurrent refresh
      // on passe ici quand on ajoute un media depuis sa fenetre => pas les streams des autres peers
      return handleMediaStream(state, action)
    default:
      return state
  }
}
