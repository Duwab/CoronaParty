import classnames from 'classnames';
import React, { CSSProperties, RefObject } from 'react';
import { connect } from 'react-redux';
import { State } from '../../store';
import ReactPlayer from 'react-player';
import { pushGameCommand, pushGameStatus } from '../../actions/GameActions';
import { GAME_CODES } from '../../constants';
import { GameEventType } from '../../../shared';
import { iceServers } from '../../window';

interface KaraokeStateProps {
  eventToApply?: GameEventType
}

interface KaraokeDispatchProps {
  push: typeof pushGameCommand
  pushStatus: typeof pushGameStatus
}

export type GameKaraokeProps = KaraokeStateProps & KaraokeDispatchProps;

export interface GameKaraokeState {
  showKaraoke: boolean
  playing: boolean
}

function mapStateToProps(state: State): KaraokeStateProps {
  const isCurrentGameEvent = state.games.eventToApply && state.games.eventToApply.gameCode === GAME_CODES.KARAOKE;
  return {
    eventToApply: isCurrentGameEvent ? state.games.eventToApply : undefined,
  };
}

const mapDispatchToProps: KaraokeDispatchProps = {
  push: pushGameCommand,
  pushStatus: pushGameStatus
};

const KARAOKE_COMMANDS = {
  PLAY: 'play',
  PAUSE: 'pause',
  REWIND: 'rewind',
  TRACK_SELECT: 'track-select',
};

const TRACKS = [
  {
    name: 'Gilbert',
    url: '/res/gilber-montagne-les-sunlights-des-tropiques.mp4',
  },
  {
    name: 'Un truc Youtube',
    url: 'https://www.youtube.com/watch?v=ysz5S6PUM-U',
  },
];

const c = connect(mapStateToProps, mapDispatchToProps);

class GameZone extends React.PureComponent<GameKaraokeProps, GameKaraokeState> {

  playerRef: RefObject<ReactPlayer> = React.createRef<ReactPlayer>();
  progress?: number;
  duration?: number;
  url = TRACKS[0].url;
  interval = setInterval(() => this.pushMyProgress(), 2000);

  constructor(props: GameKaraokeProps) {
    super(props);
    this.state = {
      showKaraoke: false,
      playing: false,
    };
  }

  pushCommand(name: string, body?: any) {
    this.props.push({
      command: name,
      gameCode: GAME_CODES.KARAOKE,
      body,
    });
  }

  pushStatus(body?: object) {
    this.props.pushStatus({
      gameCode: GAME_CODES.KARAOKE,
      body,
    });
  }

  startKaraoke() {
    this.setState({showKaraoke: true});
  }

  clickPlay() {
    this.pushCommand(KARAOKE_COMMANDS.PLAY);
  }

  clickPause() {
    this.pushCommand(KARAOKE_COMMANDS.PAUSE);
  }

  clickRewind() {
    this.pushCommand(KARAOKE_COMMANDS.REWIND);
  }

  clickChangeTrack() {
    this.pushCommand(KARAOKE_COMMANDS.TRACK_SELECT, TRACKS[1].url);
  }

  pushMyProgress() {
    if (this.playerRef.current) {
      this.pushStatus({
        progress: this.playerRef.current.getCurrentTime(),
        playing: this.state.playing,
      });
    }
  }

  render() {
    const newEvent = this.props.eventToApply;
    const player = this.playerRef.current;
    if (player) {
      if (newEvent) {
        if (newEvent.type === 'command') {
          console.log('the karaoke shall do this', newEvent);
          if (newEvent.action === KARAOKE_COMMANDS.PLAY) {
            this.setState({playing: true});
          }
          if (newEvent.action === KARAOKE_COMMANDS.PAUSE) {
            this.setState({playing: false});
          }
          if (newEvent.action === KARAOKE_COMMANDS.REWIND) {
            this.setState({playing: true});
            player.seekTo(0);
          }
          if (newEvent.action === KARAOKE_COMMANDS.TRACK_SELECT) {
            this.url = newEvent.body;
            this.setState({playing: true});
          }
        }
        if (newEvent.type === 'status') {
          const socketDelay = .1; // time taken by progress status to go from them to us
          const myTime = player.getCurrentTime();
          const theirTime = newEvent.body && newEvent.body.progress || -1;
          const theyArePlaying = newEvent.body && newEvent.body.playing;
          const hasGap = Math.abs(myTime - theirTime - socketDelay) >= 3;
          if (theirTime > 0 && hasGap) {
            player.seekTo(theirTime);
            this.setState({playing: theyArePlaying});
          }
        }
      }

      this.progress = player.getCurrentTime();
      this.duration = player.getDuration();
    }


    return (
      <div className={classnames('game-karaoke')}>
        {this.state.showKaraoke && <div>
          <ReactPlayer
            ref={this.playerRef}
            url={this.url}
            playing={this.state.playing}
          />

          <button onClick={() => this.clickPlay()}>play</button>
          <button onClick={() => this.clickPause()}>pause</button>
          <button onClick={() => this.clickRewind()}>rewind</button>
          <button onClick={() => this.clickChangeTrack()}>Switch</button>

          <div>
            progress: {this.progress}/{this.duration}
          </div>

          {this.state.playing && <img className={classnames('disco-ball')} src="/res/disco-ball.gif"/>}
        </div>}
        {!this.state.showKaraoke && <button onClick={() => this.startKaraoke()}>Start singing</button>}
      </div>
    );
  }
}

export default c(GameZone);
