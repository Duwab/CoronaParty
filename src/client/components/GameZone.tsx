import classnames from 'classnames';
import React, { RefObject } from 'react';
import { connect } from 'react-redux';
import { State } from '../store';
import { ME, STREAM_TYPE_CAMERA } from '../constants';
import Karaoke  from './games/Karaoke';
import Example  from './games/Example';
import Select from 'react-select';

export interface GameZoneProps {
  media: any
  visible: boolean
}

export interface GameZoneState {
  selectedGame: string
}

interface SelectOption {
  value: string;
  label: string;
}

function mapStateToProps(state: State): GameZoneProps {
  const localStream = state.streams[ME];
  const visible = !!localStream &&
    localStream.streams.filter(s => s.type === STREAM_TYPE_CAMERA).length > 0;
  return {
    media: state.media,
    visible,
  };
}

const c = connect(mapStateToProps);

class GameZone extends React.PureComponent<GameZoneProps, GameZoneState> {

  componentRef: RefObject<any> = React.createRef<any>();

  constructor(props: any) {
    super(props);
    this.state = {
      selectedGame: 'none',
    };
  }

  onChange(newValue: any) {
    this.setState({ selectedGame: newValue.value});
    const selector = this.componentRef.current;
    selector && selector.blur();
  }

  render() {
    const {visible} = this.props;

    const options: SelectOption[] = [
      { value: 'karaoke', label: 'Karaoke' },
      { value: 'keyboard', label: 'Keyboard' },
      { value: 'none', label: 'None' },
    ];

    return visible && (
      <div className={classnames('game-container')}>
        <Select ref={this.componentRef} defaultValue={options[2]} className={classnames('game-selector')} options={options} onChange={(v: any) => this.onChange(v)}/>
        {this.state.selectedGame && <h3>{this.state.selectedGame}</h3>}
        {this.state.selectedGame === 'karaoke' && <Karaoke />}
        {this.state.selectedGame === 'keyboard' && <Example />}
      </div>
    );
  }
}

export default c(GameZone);
