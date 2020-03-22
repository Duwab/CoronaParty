import classnames from 'classnames'
import React, { CSSProperties } from 'react'
import { connect } from 'react-redux';
import { State } from '../store';
import { ME, STREAM_TYPE_CAMERA } from '../constants';

export interface GameZoneProps {
  media: any
  visible: boolean
}

export interface GameZoneState {
  showKaraoke: boolean
}

const styles: CSSProperties = {
  textAlign: "center"
};

function mapStateToProps(state: State): GameZoneProps {
  const localStream = state.streams[ME];
  const visible = !!localStream &&
    localStream.streams.filter(s => s.type === STREAM_TYPE_CAMERA).length > 0;
  return {
    media: state.media,
    visible,
  }
}

const c = connect(mapStateToProps)

class GameZone extends React.PureComponent<GameZoneProps, GameZoneState> {

  constructor(props: any) {
    super(props);
    this.state = {showKaraoke: false};
  }

  startKaraoke() {
    console.log("let's start !");
    this.setState({showKaraoke: true});
  }

  render() {
    const {visible} = this.props;

    return visible && (
      <div className={classnames('game-container')}>
        <h3 style={styles}>Karaoke</h3>
        {this.state.showKaraoke && <div>
          <video width="560" height="315" controls autoPlay={true}>
            <source src="/res/gilber-montagne-les-sunlights-des-tropiques.mp4" type="video/mp4"></source>
          </video>
          <img className={classnames('disco-ball')} src="/res/disco-ball.gif" />
        </div>}
        {!this.state.showKaraoke && <button onClick={() => this.startKaraoke()}>Start singing</button>}
      </div>
    )
  }
}

export default c(GameZone)
