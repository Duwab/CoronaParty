import classnames from 'classnames';
import React, { RefObject } from 'react';
import { connect } from 'react-redux';
import { State } from '../../store';
import { baseUrl, callId, userId, iceServers } from '../../window';
import { ME } from '../../constants';
import Peer from 'simple-peer';
import { StreamWithURL } from '../../reducers/streams';

export interface DebugProps {
  globalState: State
}

export interface DebugState {
}

function mapStateToProps(state: State): DebugProps {
  return {globalState: state};
}

function getUserPeerConnections(userId: string, state: State): boolean {
  // todo : array of all windows matching userId
  const peer = state.peers[userId];

  return !! peer;
}

function getUserStreamsConnections(userId: string, state: State): StreamWithURL[] {
  // todo : array of all windows matching userId
  const streamInfo = state.streams[userId];

  return streamInfo && streamInfo.streams || [];
}

const c = connect(mapStateToProps);

class DebugComponent extends React.PureComponent<DebugProps, DebugState> {

  componentRef: RefObject<HTMLDivElement> = React.createRef<HTMLDivElement>();

  constructor(props: DebugProps) {
    super(props);
  }

  getGlobalInfoTable() {
    return (<table>
      <tbody>
      <tr>
        <td>socketStatus</td>
        <td>todo</td>
      </tr>
      <tr>
        <td>userId</td>
        <td>{userId}</td>
      </tr>
      <tr>
        <td>nickname</td>
        <td>{this.props.globalState.nicknames[ME]}</td>
      </tr>
      <tr>
        <td>callId</td>
        <td>{callId}</td>
      </tr>
      <tr>
        <td>baseUrl</td>
        <td>{baseUrl}</td>
      </tr>
      <tr>
        <td>iceServers</td>
        <td>{JSON.stringify(iceServers, null, 2)}</td>
      </tr>
      </tbody>
    </table>)
  }

  render() {
    const {nicknames} = this.props.globalState;
    const users = [];

    for (const windowId in nicknames) {
      const userStreams = getUserStreamsConnections(windowId, this.props.globalState).map((stream, i) => {
        return (<li key={`stream-${windowId}-${i}`}>
          <pre>{JSON.stringify(stream, null, 2)}</pre>
        </li>);
      });
      users.push(<tr key={windowId}>
        <td>{nicknames[windowId]}</td>
        <td>{windowId} <i>(status)</i></td>
        <td>{getUserPeerConnections(windowId, this.props.globalState)}</td>
        <td>
          <ul>{userStreams}</ul>
        </td>
      </tr>);
    }

    return (
      <div ref={this.componentRef} className={classnames('debug-component')}>

        <div className={classnames('debug-section')}>
          <h3>Global</h3>
          {this.getGlobalInfoTable()}

          <h3>Users</h3>
          <table>
            <thead>
            <tr>
              <th>user</th>
              <th>windows <i>(status)</i></th>
              <th>peer connections</th>
              <th>streams</th>
            </tr>
            </thead>
            <tbody>
            {users}
            </tbody>
          </table>
        </div>

        <div className={classnames('debug-section')}>
          <h3>All state</h3>
          <pre>{JSON.stringify(this.props.globalState, null, 2)}</pre>
        </div>
      </div>
    );
  }
}

export default c(DebugComponent);
