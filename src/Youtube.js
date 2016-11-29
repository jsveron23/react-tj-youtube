import React, {
  Component,
  PropTypes
} from 'react';
import { extend as _extend } from 'lodash';

const __STATE__ = {
  '-1': 'unstart',
  '0' : 'end',
  '1' : 'playing',
  '2' : 'pause',
  '3' : 'buffering',
  '5' : 'video cued'
};

const __ERR__ = {
  '2'  : 'The request contains an invalid parameter value. For example, this error occurs if you specify a video ID that does not have 11 characters, or if the video ID contains invalid characters, such as exclamation points or asterisks.',
  '5'  : 'The requested content cannot be played in an HTML5 player or another error related to the HTML5 player has occurred.',
  '100': 'The video requested was not found. This error occurs when a video has been removed (for any reason) or has been marked as private.',
  '101': 'The owner of the requested video does not allow it to be played in embedded players.',
  '150': 'The owner of the requested video does not allow it to be played in embedded players.'
};

const noop = function() {};

/**
 * @class TJYoutube Component
 * @extends {React.Component}
 */
class Youtube extends Component {
  /**
   * @constructor
   * @param {object} props
   */
  constructor(props) {
    super(props);

    this.state = {
      width     : props.width,
      height    : props.height,
      videoId   : props.videoId,
      playerVars: _extend({
        fs            : 0,
        rel           : 0,
        origin        : window.location.href,
        autohide      : 1,
        showinfo      : 0,
        controls      : 2,
        disablekb     : 1,
        enablejsapi   : 1,
        playsinline   : 1,
        cc_load_policy: 1,
        iv_load_policy: 3,
        modestbranding: 0
      }, props.options),
      currentState: -1
    };

    this.player = null;
  }

  componentDidMount() {
    this.initPlayer();
  }

  componentWillUnmount() {
    this.player.destroy();
  }

  componentWillReceiveProps(nextProps) {
    const videoId = nextProps.videoId;

    if (videoId !== this.state.videoId) {
      this.setState({
        videoId: videoId
      });

      this.player.loadVideoById(videoId, 0);
    }
  }

  render() {
    return (
      <div id="player" />
    );
  }

  initPlayer() {
    this.player = new YT.Player('player', {
      width     : this.state.width,
      height    : this.state.height,
      videoId   : this.state.videoId,
      playerVars: this.state.playerVars,
      events    : {
        onReady      : ::this.onPlayerReady,
        onError      : ::this.onPlayerError,
        onStateChange: ::this.onPlayerStateChange
      }
    });
  }

  onPlayerReady(evt) {
    const { onPlayerReady } = this.props;

    onPlayerReady(this.player, evt);
  }

  onPlayerError(evt) {
    const
      { onPlayerError } = this.props,
      data   = evt.data,
      errMsg = __ERR__[evt.data.toString()];

    onPlayerError(errMsg, evt);
  }

  onPlayerStateChange(evt) {
    const
      { onPlayerStateChange } = this.props,
      data     = evt.data,
      stateMsg = __STATE__[data.toString()];

    onPlayerStateChange(stateMsg, evt);
  }
}

Youtube.defaultProps = {
  options            : {},
  width              : '100%',
  height             : '100%',
  onPlayerReady      : noop,
  onPlayerError      : noop,
  onPlayerStateChange: noop
};

Youtube.propTypes = {
  videoId: PropTypes.string.isRequired
};

export default Youtube;
