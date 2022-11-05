import React, { Component } from "react";
import "./musicPlayer.scss";
import Buffers from "./buffer.service";
import { MusicSeparator } from "../illustrations/logosAndBg";

const MusicPublicUrl = process.env.PUBLICURL;
const MUSICINTEL = [
  { id: 1, name: "Wondeful World", link: `${MusicPublicUrl}jazz1.mp3` },
  { id: 2, name: "Sky is Crying", link: `${MusicPublicUrl}jazz2.mp3` },
];

class MusicPlayer extends Component {
  constructor() {
    super();
    this.audioContext = new AudioContext();
    this.state = {
      bufferAudio: [],
      gainNode: null,
      source: null,
      isLoadingMusic: false,
      playedSongIndex: 0,
      currentlyPlaying: false,
      volume: 100,
    };
    this.playAudio = this.playAudio.bind(this);
    this.stopAudio = this.stopAudio.bind(this);
    this.toNextAudio = this.toNextAudio.bind(this);
    this.pauseAudio = this.pauseAudio.bind(this);
    this.changeVolume = this.changeVolume.bind(this);
  }

  componentDidMount() {
    this.setState(
      {
        gainNode: this.audioContext.createGain(),
        source: this.audioContext.createBufferSource(),
      },
      () => {
        this.init();
      }
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
      () => this.setState({ isLoadingMusic: false })
    );
  }

  playAudio() {
    const {
      isLoadingMusic,
      elapsed,
      source,
      bufferAudio,
      playedSongIndex,
      gainNode,
    } = this.state;
    if (isLoadingMusic) {
      // eslint-disable-next-line no-alert
      alert("Audio still loading");
      return;
    }
    if (elapsed > 0) {
      this.audioContext.resume().catch((e) => {
        throw new Error(e);
      });
    } else {
      source.buffer = bufferAudio[playedSongIndex];
      source.connect(gainNode);
      gainNode.connect(this.audioContext.destination);
      source.start();
    }
    this.setState({ currentlyPlaying: true });
  }

  pauseAudio() {
    const { source } = this.state;
    this.setState(
      {
        elapsed: source.buffer.duration - this.audioContext.currentTime,
        currentlyPlaying: false,
      },
      () => this.audioContext.suspend()
    );
  }

  stopAudio() {
    const { source } = this.state;
    source.stop();
    this.setState({
      source: this.audioContext.createBufferSource(),
      elapsed: 0,
      currentlyPlaying: false,
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
      }
    );
  }

  changeVolume(e) {
    const { gainNode, volume } = this.state;
    this.setState({ volume: e.target.value }, () => {
      gainNode.gain.value = volume / 100;
    });
  }

  render() {
    const { currentlyPlaying, volume, playedSongIndex } = this.state;
    return (
      <div id="musicplayer_full">
        <div id="music_list">
          <h1>Available Songs</h1>
          <ul>
            {MUSICINTEL.map((song, i) => (
              <li key={song.id}>
                <button
                  id={i}
                  className="song"
                  type="button"
                  onClick={this.toNextAudio}
                >
                  {song.name}
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
            <button
              className="prevAudio"
              type="button"
              onClick={this.toNextAudio}
              disabled={playedSongIndex === 0}
            >
              Prev
            </button>
            <button
              type="button"
              onClick={this.playAudio}
              disabled={currentlyPlaying}
            >
              Play
            </button>
            <button
              type="button"
              onClick={this.pauseAudio}
              disabled={!currentlyPlaying}
            >
              Pause
            </button>
            <button
              type="button"
              onClick={this.stopAudio}
              disabled={!currentlyPlaying}
            >
              Stop
            </button>
            <button
              type="button"
              onClick={this.toNextAudio}
              disabled={playedSongIndex === MUSICINTEL.length - 1}
            >
              Next
            </button>
          </div>
          <div>
            <label htmlFor="volume">Volume</label>
            <input
              id="volume"
              type="range"
              onChange={this.changeVolume}
              value={volume}
              min={0}
              max={100}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default MusicPlayer;
