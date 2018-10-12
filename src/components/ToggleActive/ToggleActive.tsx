import * as React from 'react';

export interface State {
  active: boolean;
}

export interface Props {
  render: (active: boolean, handler: () => void) => React.ReactNode;
}

export default class ToggleActive extends React.Component<Props, State> {
  state: State = { active: false };

  onChange = () => {
    this.setState(prev => {
      return { active: !prev.active };
    });
  };

  render() {
    const { render } = this.props;
    return render(this.state.active, this.onChange);
  }
}
