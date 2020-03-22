import classnames from 'classnames'
import React, { CSSProperties } from 'react'
import { connect } from 'react-redux';
import { State } from '../../store';

export interface GameKaraokeProps {}

export interface GameKaraokeState {
  showKaraoke: boolean
}

const styles: CSSProperties = {
  textAlign: 'center',
};

function mapStateToProps(state: State): GameKaraokeProps {
  return {};
}

const c = connect(mapStateToProps)

class GameZone extends React.PureComponent<GameKaraokeProps, GameKaraokeState> {

  constructor(props: GameKaraokeProps) {
    super(props);
    this.state = {showKaraoke: false};
  }

  startKaraoke() {
    this.setState({showKaraoke: true});
  }

  render() {
    return (
      <div className={classnames('game-karaoke')}>
        {this.state.showKaraoke && <div>
          <video width="560" height="315" controls autoPlay={true}>
            <source src="/res/gilber-montagne-les-sunlights-des-tropiques.mp4" type="video/mp4"></source>
          </video>
          <img className={classnames('disco-ball')} src="/res/disco-ball.gif" />
        </div>}
        {!this.state.showKaraoke && <button onClick={() => this.startKaraoke()}>Start singing</button>}
      </div>
    );
  }
}

export default c(GameZone);
