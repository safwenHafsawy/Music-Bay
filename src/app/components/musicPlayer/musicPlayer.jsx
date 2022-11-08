import React, { Component } from "react";
import "./musicPlayer.scss";
import Buffers from "./buffer.service";
import { MusicSeparator } from "../illustrations/logosAndBg";

const MusicPublicUrl = process.env.PUBLICURL;
const MUSICINTEL = [
  { id: 1, name: "Wondeful World", owner: "Louis Armstrong", link: `${MusicPublicUrl}jazz1.mp3` },
  { id: 2, name: "Sky is Crying", owner: "Gary B.B. Coleman", link: `${MusicPublicUrl}jazz2.mp3` },
];

class MusicPlayer extends Component {
  constructor() {
    super();
    this.audioContext = new AudioContext();
    this.keepTrack = undefined;
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
    this.toNextAudio = this.toNextAudio.bind(this);
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
    const buffer = new Buffers(this.audioContext, Object.values(MUSICINTEL));
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

  toNextAudio(e) {
    const { currentlyPlaying } = this.state;
    if (currentlyPlaying) this.stopAudio();
    this.setState(
      (prevState) => {
        if (e.target.className === "song") {
          return {
            playedSongIndex: parseInt(e.target.id, 10),
            source: this.audioContext.createBufferSource(),
          };
        }
        if (e.target.className === "prevAudio") {
          return {
            playedSongIndex: prevState.playedSongIndex - 1,
            source: this.audioContext.createBufferSource(),
          };
        }
        return {
          playedSongIndex: prevState.playedSongIndex + 1,
          source: this.audioContext.createBufferSource(),
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
    const newElapse = Math.round(parseFloat(e.target.value) * 1e2) / 1e2;
    this.stopAudio(newElapse, true).then(() => this.playAudio());
  }

  keepingTrackSongLength(isOn = false) {
    if (isOn)
      this.keepTrack = setInterval(() => {
        this.setState((prevState) => ({
          elapsed: prevState.elapsed + 1,
        }));
      }, 1000);
    else clearInterval(this.keepTrack);
  }

  render() {
    const { currentlyPlaying, volume, playedSongIndex, elapsed, source } = this.state;
    return (
      <div id="musicplayer_full">
        <div id="music_list">
          <h1>Available Songs</h1>
          <ul>
            {MUSICINTEL.map((song, i) => (
              <li key={song.id}>
                <button id={i} className="song" type="button" onClick={this.toNextAudio}>
                  {song.name} <span className="owner_name"> by {song.owner}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
        <div id="controls">
          <div id="separator">
            <MusicSeparator />
          </div>
          <div>
            <h6>{MUSICINTEL[playedSongIndex].name}</h6>
          </div>
          <div>
            <div>
              <button className="prevAudio" type="button" onClick={this.toNextAudio} disabled={playedSongIndex === 0}>
                Prev
              </button>
              <button type="button" onClick={this.playAudio} disabled={currentlyPlaying}>
                Play
              </button>
              <button type="button" onClick={this.pauseAudio} disabled={!currentlyPlaying}>
                Pause
              </button>
              <button type="button" onClick={() => this.stopAudio()} disabled={!currentlyPlaying}>
                Stop
              </button>
              <button type="button" onClick={this.toNextAudio} disabled={playedSongIndex === MUSICINTEL.length - 1}>
                Next
              </button>
            </div>
            <div>
              <input
                type="range"
                value={elapsed}
                onChange={this.timeShift}
                max={source && source.buffer ? source.buffer.duration : 0}
                id="song_progess"
              />
              {source && source.buffer ? parseFloat(source.buffer.duration / 60).toFixed(2) : ""}
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

export default MusicPlayer;
