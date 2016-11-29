import React, { Component } from 'react';

export default class Input extends Component {
  constructor(props) {
    super(props);

    this.state = {
      value: ''
    };
  }

  onKeyUp(evt) {
    const {
      onKeyUp
    } = this.props,
    text = evt.target.value;

    if (evt.keyCode === 13) {
      this.setState({
        value: text
      });

      onKeyUp(text);
    }
  }

  render() {
    return (
      <input type="text"
             onKeyUp={::this.onKeyUp}
             placeholder={this.props.placeholder} />
    );
  }
};
