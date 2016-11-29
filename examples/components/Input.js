import React, { Component } from 'react';

const noop = function() {};

class Input extends Component {
  constructor(props) {
    super(props);

    this.state = {
      value: props.value
    };
  }

  componentWillReceiveProps(nextProps) {
    const val = nextProps.value;

    this.setState({
      value: val
    });
  }

  onChange(evt) {
    const {
      onChange
    } = this.props,
    val = evt.target.value;

    this.setState({
      value: val
    });

    onChange(val);
  }

  render() {
    return (
      <input type={this.props.type}
             onChange={::this.onChange}
             value={this.state.value} />
    );
  }
};

Input.defaultProps = {
  type    : 'text',
  onChange: noop,
  value   : ''
};

export default Input;
