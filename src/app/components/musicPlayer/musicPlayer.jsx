import React, { Component } from "react";
import "./musicPlayer.scss";
import { useLocation } from "react-router-dom";
import propTypes from "prop-types";
import Buffers from "./buffer.service";
import {
  MusicSeparator,
  MusicPlay,
  MusicPause,
  MusicStop,
  MusicNextSong,
  MusicPrevSong,
  MusicPlaylistIcon,
  MusicPlayingLogo,
} from "../illustrations/logosAndBg";

const MusicPublicUrl = process.env.PUBLICURL;

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
 * @param {MusicPlayer} WrappedComp
 * @returns The Music Player compenent
 * this HOC was created to enbale the use of useLocation hook without changing Music player from a class to a functional compoenent
 */

const HigherOrderComp = (WrappedComp) =>
  function _() {
    const { state } = useLocation();
    const musicList = [
      {
        id: 1,
        name: "Wondeful World",
        owner: "Louis Armstrong",
        link: `${MusicPublicUrl}music/${state.genre}/jazz1.mp3`,
      },
      {
        id: 2,
        name: "Sky is Crying",
        owner: "Gary B.B. Coleman",
        link: `${MusicPublicUrl}music/${state.genre}/jazz2.mp3`,
      },
      {
        id: 3,
        name: "Fly Me to the moon",
        owner: "Frank Sinatra",
        link: `${MusicPublicUrl}music/${state.genre}/jazz3.mp3`,
      },
      { id: 4, name: "Fever", owner: "Peggy Lee", link: `${MusicPublicUrl}music/${state.genre}/jazz4.mp3` },
    ];
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
          if (e.target.id === "prevSong") {
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
        if (Math.round(source.buffer.duration - this.startedSince) === 0) {
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
          <div id="songsList">
            <ul>
              {this.MusicList.map((song, i) => (
                <li key={song.id}>
                  <button id={i} className="song" type="button" onClick={this.switchSong}>
                    {song.name} <span className="owner_name"> by {song.owner}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div id="controls">
          <div id="separator">
            <MusicSeparator />
          </div>
          <div id="currentlyPlaying">
            <MusicPlayingLogo />
            <div>
              <span id="currentlyPlayingName">{this.MusicList[playedSongIndex].name}</span>
              <span id="currentlyPlayingSinger">{this.MusicList[playedSongIndex].owner}</span>
            </div>
          </div>
          <div>
            <div>
              <button
                id="prevSong"
                className={playedSongIndex === 0 ? "controlBtnNotActive" : "controlBtnActive"}
                type="button"
                onClick={this.switchSong}
              >
                <MusicPrevSong />
              </button>
              <button
                className={currentlyPlaying ? "controlBtnNotActive" : "controlBtnActive"}
                type="button"
                onClick={this.playAudio}
              >
                <MusicPlay />
              </button>
              <button
                className={!currentlyPlaying ? "controlBtnNotActive" : "controlBtnActive"}
                type="button"
                onClick={this.pauseAudio}
              >
                <MusicPause />
              </button>
              <button
                className={!currentlyPlaying ? "controlBtnNotActive" : "controlBtnActive"}
                type="button"
                onClick={() => this.stopAudio()}
              >
                <MusicStop />
              </button>
              <button
                className={playedSongIndex === this.MusicList.length - 1 ? "controlBtnNotActive" : "controlBtnActive"}
                type="button"
                onClick={this.switchSong}
                disabled={playedSongIndex === this.MusicList.length - 1}
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

export default HigherOrderComp(MusicPlayer);
