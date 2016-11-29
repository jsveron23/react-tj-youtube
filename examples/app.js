import React, { Component } from 'react';

// SASS
import './scss/app.scss';

// components
import Act    from './components/Act';
import Button from './components/Button';
import Input  from './components/Input';
import Text   from './components/Text';

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
      videoId     : '09R8_2nJtjg',
      videoMsg    : '',
      currentState: '',
      volume      : 100
    };

    this.options = {
      fs      : 1,
      showinfo: 1
    }
  }

  componentWillUnmount() {
    this.interval && clearInterval(this.interval);
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
              <Button title="Play video"
                      onClick={::this.handlePlayVideo} />
              <Button title="Pause video"
                      onClick={::this.handlePauseVideo} />
              <Button title="Stop video"
                      onClick={::this.handleStopVideo} />
            </Act>

            <Act title="Volume">
              <Input type="range"
                     onChange={::this.handleVolume}
                     value={this.state.volume} />
            </Act>

            <Act title="Play by video id">
              <label>Video ID:</label>
              <Input onChange={::this.handleVideoId}
                     value={this.state.videoId} />
            </Act>

            <Act title="Video state">
              <Text label="Video state:"
                    text={this.state.stateMsg} />
            </Act>
          </div>

          <div className="cp-wrap">
            <Youtube options={this.options}
                     width={640}
                     height={360}
                     videoId={this.state.videoId}
                     onPlayerReady={::this.onPlayerReady}
                     onPlayerStateChange={::this.onPlayerStateChange}
                     onPlayerError={::this.onPlayerError} />
          </div>
        </section>
      </div>
    );
  }

  onPlayerReady(player, evt) {
    this.player = player;
    this.player.playVideo();

    // @TODO
    // parformance better
    this.interval = setInterval(() => {
      this.setState({
        volume: this.player.isMuted() ? 0 : this.player.getVolume()
      });
    }, 500);
  }

  onPlayerStateChange(msg, evt) {
    this.setState({
      currentState: evt.data,
      stateMsg    : `${msg}(${evt.data})`
    });
  }

  onPlayerError(msg, evt) {
    console.error(msg);
  }

  handleToggleVideo(evt) {
    evt.preventDefault();

    if (this.state.currentState === 1) {
      this.player.pauseVideo();
    } else {
      this.player.playVideo();
    }
  }

  handlePlayVideo(evt) {
    this.player.playVideo();
  }

  handlePauseVideo(evt) {
    this.player.pauseVideo();
  }

  handleStopVideo(evt) {
    evt.preventDefault();

    this.player.stopVideo();
  }

  handleVolume(val) {
    this.setState({
      volume: val
    });

    this.player.unMute();
    this.player.setVolume(parseInt(val, 10));
  }

  handleVideoId(val) {
    this.setState({
      videoId: val
    });
  }
};
