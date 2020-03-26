import classnames from 'classnames';
import React, { RefObject } from 'react';
import { connect } from 'react-redux';
import { State } from '../store';
import { ME, STREAM_TYPE_CAMERA, GAMES_AVAILABLE_OPTIONS } from '../constants';
import Karaoke from './games/Karaoke';
import Example from './games/Example';
import Select from 'react-select';
import DebugComponent from './debug/Debug';
import { selectGameRequest } from '../actions/GameActions';

export interface GameZoneStateProps {
  media: any
  visible: boolean
  selectedGame: string
}

export interface GameZoneDispatchProps {
  selectGame: typeof selectGameRequest
}

export type GameZoneProps = GameZoneStateProps & GameZoneDispatchProps;

export interface GameZoneState {
}

function mapStateToProps(state: State): GameZoneStateProps {
  const localStream = state.streams[ME];
  const visible = !!localStream &&
    localStream.streams.filter(s => s.type === STREAM_TYPE_CAMERA).length > 0;
  return {
    media: state.media,
    visible,
    selectedGame: state.games.selectedGame,
  };
}

const mapDispatchToProps: GameZoneDispatchProps = {
  selectGame: selectGameRequest,
};

const c = connect(mapStateToProps, mapDispatchToProps);

class GameZone extends React.PureComponent<GameZoneProps, GameZoneState> {

  selectElementRef: RefObject<any> = React.createRef<any>();
  selectElementValue: {label: string, value: string} = GAMES_AVAILABLE_OPTIONS[0];

  constructor(props: any) {
    super(props);
    // next step : push "game change" info
    // make debug component clean
  }

  onChange(newValue: any) {
    this.props.selectGame(newValue.value);
    const selector = this.selectElementRef.current;
    selector && selector.blur();
  }

  render() {
    const {visible} = this.props;
    this.selectElementValue = GAMES_AVAILABLE_OPTIONS.filter(game => game.value === this.props.selectedGame)[0];

    return visible && (
      <div className={classnames('game-container')}>
        <Select ref={this.selectElementRef} value={this.selectElementValue} className={classnames('game-selector')}
                options={GAMES_AVAILABLE_OPTIONS} onChange={(v: any) => this.onChange(v)}/>
        {this.props.selectedGame && <h3>{this.props.selectedGame}</h3>}
        {this.props.selectedGame === 'karaoke' && <Karaoke/>}
        {this.props.selectedGame === 'keyboard' && <Example/>}
        {this.props.selectedGame === 'debug' && <DebugComponent/>}
      </div>
    );
  }
}

export default c(GameZone);
