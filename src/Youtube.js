import React, {
  Component,
  PropTypes
} from 'react';

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
      playerVars: {
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
      },
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
    const
      videoId = nextProps.videoId,
      command = nextProps.command,
      loop    = nextProps.loop;

    // console.log(command, this.state.currentState);

    if (command === 'toggleVideo') {
      if (this.state.currentState !== 1) {
        this.play();
      } else {
        this.pause();
      }
    } else if (command === 'stopVideo') {
      this.player.stopVideo();
    }

    if (videoId !== this.state.videoId) {
      this.setState({
        videoId: videoId
      });

      this.player.loadVideoById(videoId, 0);
    }
  }

  souldComponentUpdate() {
    return false;
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
    const {
      autoPlay,
      onPlayerReady
    } = this.props;

    if (autoPlay) {
      this.player.playVideo();
    }

    onPlayerReady(this.player, evt);
  }

  onPlayerError(evt) {
    const { onPlayerError } = this.props;

    onPlayerError(__ERR__[evt.data.toString()], evt);
  }

  onPlayerStateChange(evt) {
    const
      { onPlayerStateChange } = this.props,
      data  = evt.data,
      state = __STATE__[data.toString()];

    if (state === 'end' && this.props.loop) {
      this.play();
    }

    this.setState({
      currentState: data
    });

    onPlayerStateChange(evt);
  }

  play() {
    this.player.playVideo();
  }

  pause() {
    this.player.pauseVideo();
  }
}

Youtube.defaultProps = {
  autoPlay           : false,
  width              : '100%',
  height             : '100%',
  loop               : false,
  onPlayerReady      : noop,
  onPlayerError      : noop,
  onPlayerStateChange: noop
};

Youtube.propTypes = {
  videoId: PropTypes.string.isRequired
};

export default Youtube;
