import React, { Component } from "react";
import "./musicPlayer.scss";
import { useLocation } from "react-router-dom";
import propTypes from "prop-types";
import Buffers from "./buffer.service";
import NaviagtionWrapper from "../navigation/NaviagationWrapper";
import {
  MusicSeparator,
  MusicPlay,
  MusicPause,
  MusicStop,
  MusicNextSong,
  MusicPrevSong,
  MusicPlaylistIcon,
  MusicPlayingLogo,
  NotFound,
} from "../illustrations/logosAndBg";
import getMusicList from "./musicList";

/**
 * Helper functions
 */
function timeExtraction(fullLength, timePassed) {
  const timeLeft = fullLength - timePassed;
  let timeLeftMinutes = Math.floor(timeLeft / 60);
  let timeLeftSeconds = Math.round(timeLeft % 60);

  if (timeLeftMinutes < 10) timeLeftMinutes = "0".concat(timeLeftMinutes);
  if (timeLeftSeconds < 10) timeLeftSeconds = "0".concat(timeLeftSeconds);
  return timeLeftMinutes.concat(":", timeLeftSeconds);
}

/**
 *
 * @param {Class} Music Player component
 *
 * this HOC was created mainly to enbale the use of useLocation hook without changing Music player from a class to a functional component
 */

const HigherOrderComp = (WrappedComp) =>
  function _() {
    const { state } = useLocation();
    const musicList = getMusicList(state.genre);

    return <WrappedComp genre={state.genre} musicList={musicList} />;
  };

/* Class */
class MusicPlayer extends Component {
  constructor(props) {
    super(props);
    this.audioContext = new AudioContext();
    this.keepTrack = undefined;
    this.startedSince = 0;
    this.MusicList = props.musicList;
    this.state = {
      bufferAudio: [],
      gainNode: null,
      source: null,
      isLoadingMusic: false,
      playedSongIndex: 0,
      currentlyPlaying: false,
      volume: 100,
      elapsed: 0,
      isShifting: false,
    };
    this.playAudio = this.playAudio.bind(this);
    this.startingSource = this.startingSource.bind(this);
    this.stopAudio = this.stopAudio.bind(this);
    this.switchSong = this.switchSong.bind(this);
    this.pauseAudio = this.pauseAudio.bind(this);
    this.changeVolume = this.changeVolume.bind(this);
    this.timeShift = this.timeShift.bind(this);
    this.keepingTrackSongLength = this.keepingTrackSongLength.bind(this);
  }

  componentDidMount() {
    this.setState(
      {
        gainNode: this.audioContext.createGain(),
        source: this.audioContext.createBufferSource(),
      },
      () => {
        this.init();
      },
    );
  }

  componentWillUnmount() {
    const { currentlyPlaying } = this.state;
    if (currentlyPlaying) {
      this.stopAudio().then(() => this.audioContext.close());
    }
  }

  async init() {
    this.setState({ isLoadingMusic: true });
    const buffer = new Buffers(this.audioContext, Object.values(this.MusicList));
    const buffers = await buffer.loadAll();
    this.setState(
      {
        bufferAudio: [...buffers],
      },
      () => this.setState({ isLoadingMusic: false }),
    );
  }

  startingSource() {
    const { source, bufferAudio, playedSongIndex, gainNode, elapsed } = this.state;
    source.buffer = bufferAudio[playedSongIndex];
    source.connect(gainNode);
    gainNode.connect(this.audioContext.destination);
    source.start(0, elapsed);
  }

  playAudio() {
    const { isLoadingMusic, elapsed, isShifting } = this.state;
    if (isLoadingMusic) {
      // eslint-disable-next-line no-alert
      alert("Audio still loading");
      return;
    }
    if (elapsed > 0) {
      if (isShifting) {
        this.startingSource();
        this.setState({ isShifting: false });
      }
      this.audioContext.resume().catch((e) => {
        throw new Error(e);
      });
    } else {
      this.startingSource();
    }
    this.keepingTrackSongLength(true);
    this.setState({ currentlyPlaying: true });
  }

  pauseAudio() {
    this.setState(
      {
        currentlyPlaying: false,
      },
      () => this.audioContext.suspend().then(this.keepingTrackSongLength),
    );
  }

  stopAudio(elapsed_p = 0, isShifting_p = false) {
    const { source } = this.state;
    return new Promise((resolve) => {
      source.stop();
      this.startedSince = elapsed_p;
      this.keepingTrackSongLength();
      this.setState(
        {
          source: this.audioContext.createBufferSource(),
          elapsed: elapsed_p,
          currentlyPlaying: false,
          isShifting: isShifting_p,
        },
        resolve,
      );
    });
  }

  async switchSong(e) {
    const { currentlyPlaying } = this.state;
    if (currentlyPlaying) await this.stopAudio();
    this.setState(
      (prevState) => {
        const newSource = this.audioContext.createBufferSource();
        if (e) {
          if (e.target.className === "song") {
            return {
              playedSongIndex: parseInt(e.target.id, 10),
              source: newSource,
            };
          }
          if (e.target.closest("#prevSong")) {
            return {
              playedSongIndex: prevState.playedSongIndex - 1,
              source: newSource,
            };
          }
        }
        return {
          playedSongIndex: prevState.playedSongIndex + 1,
          source: newSource,
        };
      },
      () => {
        this.playAudio();
      },
    );
  }

  changeVolume(e) {
    const { gainNode, volume } = this.state;
    this.setState({ volume: e.target.value }, () => {
      gainNode.gain.value = volume / 100;
    });
  }

  timeShift(e) {
    const newElapsed = Math.round(parseFloat(e.target.value) * 1e2) / 1e2;
    this.startedSince = newElapsed;
    this.stopAudio(newElapsed, true).then(() => this.playAudio());
  }

  keepingTrackSongLength(isOn = false) {
    const { source, playedSongIndex } = this.state;

    if (isOn)
      this.keepTrack = setInterval(() => {
        if (Math.floor(source.buffer.duration - this.startedSince) === 0) {
          if (playedSongIndex + 1 < this.MusicList.length) {
            this.switchSong();
          } else {
            this.stopAudio(0);
          }
          return;
        }
        this.startedSince += 1;
        this.setState((prevState) => ({ elapsed: prevState.elapsed + 1 }));
      }, 1000);
    else clearInterval(this.keepTrack);
  }

  render() {
    const { currentlyPlaying, volume, playedSongIndex, elapsed, source } = this.state;
    const { genre } = this.props;
    return (
      <div id="musicplayer_full">
        <div id="music_list">
          <div id="heading">
            <MusicPlaylistIcon className="heading-logo" />
            <div id="heading-texts">
              <h1>{genre} Hits</h1>
              <p>
                Playlist - <span>{this.MusicList.length} songs</span>
              </p>
            </div>
          </div>
          {this.MusicList.length === 0 ? (
            <div id="emptyList">
              <NotFound />
              <h3>Oops ! looks there&apos;s no {genre} songs at this moment</h3>
            </div>
          ) : (
            <div id="songsList">
              <ul>
                {this.MusicList.map((song, i) => (
                  <li key={song[0]}>
                    <button id={i} className="song" type="button" onClick={this.switchSong}>
                      {song[1].name} <span className="owner_name"> by {song[1].owner}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        <div id="controls">
          <div id="separator">
            <MusicSeparator />
          </div>
          <div id="currentlyPlaying">
            <MusicPlayingLogo />
            {this.MusicList.length > 0 ? (
              <div>
                <span id="currentlyPlayingName">{this.MusicList[playedSongIndex][1].name}</span>
                <span id="currentlyPlayingSinger">{this.MusicList[playedSongIndex][1].owner}</span>
              </div>
            ) : null}
          </div>
          <div>
            <div>
              <button
                id="prevSong"
                className={
                  playedSongIndex === 0 || this.MusicList.length === 0 ? "controlBtnNotActive" : "controlBtnActive"
                }
                type="button"
                onClick={this.switchSong}
                disabled={playedSongIndex === 0 || this.MusicList.length === 0}
              >
                <MusicPrevSong />
              </button>
              <button
                className={currentlyPlaying || this.MusicList.length === 0 ? "controlBtnNotActive" : "controlBtnActive"}
                type="button"
                onClick={this.playAudio}
                disabled={currentlyPlaying || this.MusicList.length === 0}
              >
                <MusicPlay />
              </button>
              <button
                className={!currentlyPlaying ? "controlBtnNotActive" : "controlBtnActive"}
                type="button"
                onClick={this.pauseAudio}
                disabled={!currentlyPlaying}
              >
                <MusicPause />
              </button>
              <button
                className={!currentlyPlaying ? "controlBtnNotActive" : "controlBtnActive"}
                type="button"
                onClick={() => this.stopAudio()}
                disabled={!currentlyPlaying}
              >
                <MusicStop />
              </button>
              <button
                className={
                  playedSongIndex === this.MusicList.length - 1 || this.MusicList.length === 0
                    ? "controlBtnNotActive"
                    : "controlBtnActive"
                }
                type="button"
                onClick={this.switchSong}
                disabled={playedSongIndex === this.MusicList.length - 1 || this.MusicList.length === 0}
              >
                <MusicNextSong />
              </button>
            </div>
            <div id="song_progess_container">
              <input
                type="range"
                value={elapsed}
                onChange={this.timeShift}
                max={source && source.buffer ? source.buffer.duration : 0}
                id="song_progess"
              />
              <span id="time-display">
                {source && source.buffer ? timeExtraction(source.buffer.duration, this.startedSince) : "00:00"}
              </span>
            </div>
          </div>
          <div>
            <label htmlFor="volume">Volume</label>
            <input id="volume" type="range" onChange={this.changeVolume} value={volume} min={0} max={100} />
          </div>
        </div>
      </div>
    );
  }
}

MusicPlayer.propTypes = {
  genre: propTypes.string,
  musicList: propTypes.arrayOf(Object),
};

MusicPlayer.defaultProps = {
  genre: "",
  musicList: [],
};

export default NaviagtionWrapper(HigherOrderComp(MusicPlayer));
