import classnames from 'classnames';
import React, { RefObject } from 'react';
import { connect } from 'react-redux';
import { State } from '../../store';

export interface DebugProps {
}

export interface DebugState {
}

function mapStateToProps(state: State): DebugProps {
  return {};
}

const c = connect(mapStateToProps);

class DebugComponent extends React.PureComponent<DebugProps, DebugState> {

  componentRef: RefObject<HTMLDivElement> = React.createRef<HTMLDivElement>();

  constructor(props: DebugProps) {
    super(props);
  }

  render() {
    return (
      <div ref={this.componentRef} className={classnames('debug-view')}>
        Debug component
      </div>
    );
  }
}

export default c(DebugComponent);
