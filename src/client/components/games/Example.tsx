import classnames from 'classnames'
import React, { CSSProperties, Ref, RefObject } from 'react'
import { connect } from 'react-redux';
import { State } from '../../store';
import { PlayerCoordinates, PositionManager } from './lib/movement/MoveHandler';

export interface GameExampleProps {
}

export interface GameExampleState {
  positionManager: PositionManager
  cssCoordinates: CSSProperties
}

function mapStateToProps(state: State): GameExampleProps {
  return {};
}

const c = connect(mapStateToProps);

class GameExample extends React.PureComponent<GameExampleProps, GameExampleState> {

  componentRef: RefObject<HTMLDivElement> = React.createRef<HTMLDivElement>();
  virusRef: RefObject<HTMLImageElement> = React.createRef<HTMLImageElement>();
  offsetX = 100;
  offsetY = 100;

  constructor(props: GameExampleProps) {
    super(props);
    const positionManager = new PositionManager({
      offsetX: 150,
      offsetY: 100,
      minX: 0,
      maxX: 300,
      minY: 0,
      maxY: 200,
    });
    this.state = {
      positionManager,
      cssCoordinates: {},
    };

    positionManager.onChange(coordinates => {
      this.applyCoordinates(coordinates);
    });
  }

  applyCoordinates(coordinates: PlayerCoordinates) {
    this.setState({
      cssCoordinates: {
        bottom: `${coordinates.y}px`,
        left: `${coordinates.x}px`,
      },
    });
  }

  componentDidMount(): void {
    const el = this.componentRef.current;
    el && el.focus();
    this.applyCoordinates(this.state.positionManager.getCoordinates());
  }

  componentWillUnmount(): void {
    this.state.positionManager.destroy();
  }

  render() {
    return (
      <div ref={this.componentRef} className={classnames('game-example')}>
        {/*This is an example*/}
        {/*<pre>{JSON.stringify(this.state.coordinates, null, 2)}</pre>*/}

        <div className={classnames('playground')}>
          <img ref={this.virusRef} src={'/res/virus.png'} style={this.state.cssCoordinates}/>
        </div>
      </div>
    );
  }
}

export default c(GameExample);
