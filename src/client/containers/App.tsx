import { connect } from 'react-redux';
import { init } from '../actions/CallActions';
import { getDesktopStream, play } from '../actions/MediaActions';
import { dismissNotification } from '../actions/NotifyActions';
import { sendFile, sendMessage } from '../actions/PeerActions';
import { toggleActive, removeStream } from '../actions/StreamActions';
import App from '../components/App';
import { State } from '../store';
import { refreshPeersDispatch } from '../actions/SocketActions';
import { changeLayout } from '../actions/LayoutActions';

function mapStateToProps (state: State) {
  return {
    layoutMode: state.layout.mode,
    layoutWidgets: state.layout.widgets,
    streams: state.streams,
    peers: state.peers,
    notifications: state.notifications,
    nicknames: state.nicknames,
    messages: state.messages.list,
    messagesCount: state.messages.count,
    active: state.active,
  };
}

const mapDispatchToProps = {
  changeLayout,
  toggleActive,
  sendMessage,
  dismissNotification,
  getDesktopStream,
  removeStream,
  refreshPeersDispatch,
  init,
  onSendFile: sendFile,
  play,
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
