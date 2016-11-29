import React, { Component } from 'react';

// SASS
import './scss/app.scss';

// components
import Act    from './components/Act';
import Button from './components/Button';
import Input  from './components/Input';

// TJ Youtube API
import Youtube from 'react-tj-youtube';

/**
 * @class App
 */
export default class App extends Component {
  /**
   * @constructor
   * @param {object} props
   */
  constructor(props) {
    super(props);

    this.state = {
      command: '',
      videoId: 'zLMeDUBKmBs'
    };

    this.options = {
      fs      : 1,
      showinfo: 1
    }
  }

  render() {
    return (
      <div>
        <section className="cp">
          <h1 className="cp-title">Youtube API Component</h1>

          <div className="cp-actions">
            <Act title="Control Video">
              <Button title="Toggle video play/pause"
                      onClick={::this.handleToggleVideo} />
              <Button title="Stop video"
                      onClick={::this.handleStopVideo} />
            </Act>

            <Act title="Play by video id">
              <label>Video ID:</label>
              <Input playerholder="video id"
                     onKeyUp={::this.handleKeyUp} />
            </Act>
          </div>

          <div className="cp-wrap">
            <Youtube options={this.options}
                     command={this.state.command}
                     autoPlay={true}
                     width={640}
                     height={360}
                     videoId={this.state.videoId}
                     loop={true} />
          </div>
        </section>
      </div>
    );
  }

  handleToggleVideo(evt) {
    evt.preventDefault();

    this.setState({
      command: 'toggleVideo'
    });
  }

  handleStopVideo(evt) {
    evt.preventDefault();

    this.setState({
      command: 'stopVideo'
    });
  }

  handleKeyUp(text) {
    this.setState({
      videoId: text
    });
  }
};
