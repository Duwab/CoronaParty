import classnames from 'classnames';
import keyBy from 'lodash/keyBy';
import forEach from 'lodash/forEach';
import React from 'react';
import Peer from 'simple-peer';
import { Message } from '../actions/ChatActions';
import { dismissNotification, Notification } from '../actions/NotifyActions';
import { RtcMessage as MessageType } from '../networking/connections/rtc/interfaces/message.interfaces';
import { removeStream } from '../actions/StreamActions';
import { refreshPeersDispatch } from '../actions/SocketActions';
import * as constants from '../constants';
import Chat from './Chat';
import GameZone from './GameZone';
import { Join } from './Join';
import Notifications from './Notifications';
import { Side } from './Side';
import Toolbar from './Toolbar';
import Videos from './Videos';
import { getDesktopStream } from '../actions/MediaActions';
import { StreamsState } from '../reducers/streams';
import { Nicknames } from '../reducers/nicknames';
import { LAYOUT_MODES } from '../constants';
import { changeLayout } from '../actions/LayoutActions';

export interface AppProps {
  active: string | null
  dismissNotification: typeof dismissNotification
  init: () => void
  nicknames: Nicknames
  layoutMode: string
  layoutWidgets: Record<string, boolean>
  changeLayout: typeof changeLayout
  notifications: Record<string, Notification>
  messages: Message[]
  messagesCount: number
  peers: Record<string, Peer.Instance>
  play: () => void
  sendMessage: (message: MessageType) => void
  streams: StreamsState
  getDesktopStream: typeof getDesktopStream
  removeStream: typeof removeStream
  refreshPeersDispatch: typeof refreshPeersDispatch
  onSendFile: (file: File) => void
  toggleActive: (userId: string) => void
}

export interface AppState {
  chatVisible: boolean
}

export default class App extends React.PureComponent<AppProps, AppState> {
  state: AppState = {
    chatVisible: false,
  }

  // TODO : handle chat display using layout store
  handleShowChat = () => {
    this.setState({
      chatVisible: true,
    });
  }
  handleHideChat = () => {
    this.setState({
      chatVisible: false,
    });
  }
  handleToggleChat = () => {
    return this.state.chatVisible
      ? this.handleHideChat()
      : this.handleShowChat();
  }

  componentDidMount() {
    const {init} = this.props;
    init();
  }

  onHangup = () => {
    const localStreams = this.getLocalStreams();
    forEach(localStreams, s => {
      this.props.removeStream(constants.ME, s.stream);
      this.props.changeLayout(LAYOUT_MODES.SETUP);
    });
  };

  getLocalStreams() {
    const ls = this.props.streams[constants.ME];
    return ls ? keyBy(ls.streams, 'type') : {};
  }

  render() {
    const {
      dismissNotification,
      layoutWidgets,
      notifications,
      nicknames,
      messages,
      messagesCount,
      onSendFile,
      sendMessage,
    } = this.props;

    const chatVisibleClassName = classnames({
      'chat-visible': this.state.chatVisible,
    });

    const localStreams = this.getLocalStreams();
    console.log('app render', `${JSON.stringify(layoutWidgets)}`);

    return (
      <div className="app">

        <GameZone/>

        {
          layoutWidgets.sidebar &&
          <Side align='flex-end' left zIndex={2}>
            <Toolbar
              chatVisible={this.state.chatVisible}
              messagesCount={messagesCount}
              onToggleChat={this.handleToggleChat}
              onSendFile={onSendFile}
              onHangup={this.onHangup}
              stream={localStreams[constants.STREAM_TYPE_CAMERA]}
              desktopStream={localStreams[constants.STREAM_TYPE_DESKTOP]}
              onGetDesktopStream={this.props.getDesktopStream}
              onRemoveStream={this.props.removeStream}
            />
          </Side>
        }
        <Side className={chatVisibleClassName} top zIndex={1}>
          <Notifications
            dismiss={dismissNotification}
            notifications={notifications}
          />
          <Join/>
        </Side>
        <Chat
          messages={messages}
          nicknames={nicknames}
          onClose={this.handleHideChat}
          sendMessage={sendMessage}
          visible={this.state.chatVisible}
        />

        <Videos
          onChangeNickname={sendMessage}
          streams={this.props.streams}
          play={this.props.play}
          active={this.props.active}
          nicknames={this.props.nicknames}
          toggleActive={this.props.toggleActive}
        />
      </div>
    );
  }
}
