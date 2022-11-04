import React, { Component } from "react";
import "./musicPlayer.scss";
import Buffers from "./buffer.service";

const MusicPublicUrl = process.env.PUBLICURL;
const MUSICINTEL = [
  { name: "Wondeful World", link: `${MusicPublicUrl}jazz1.mp3` },
  { name: "Sky is Crying", link: `${MusicPublicUrl}jazz2.mp3` },
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
    };
    this.playAudio = this.playAudio.bind(this);
    this.stopAudio = this.stopAudio.bind(this);
    this.toNextAudio = this.toNextAudio.bind(this);
    this.pauseAudio = this.pauseAudio.bind(this);
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

  playAudio() {
    const {
      isLoadingMusic, elapsed, source, bufferAudio, playedSongIndex, gainNode,
    } = this.state;
    if (isLoadingMusic) {
      alert("Audio still loading");
      return;
    }
    if (elapsed > 0) {
      this.audioContext.resume().catch((e) => {
        throw new Error(e);
      });
    } else {
      console.log(bufferAudio);
      source.buffer = bufferAudio[playedSongIndex];
      console.log(source);
      source.connect(gainNode);
      gainNode.connect(this.audioContext.destination);
      source.start();
    }
  }

  stopAudio() {
    const { source } = this.state;
    source.stop();
    this.setState({
      source: this.audioContext.createBufferSource(),
    }, () => {
      this.audioContext.suspend();
      console.log(this.audioContext);
    });
  }

  pauseAudio() {
    const { source } = this.state;
    if (this.audioContext.state === "running") {
      this.setState({
        elapsed:
          source.buffer.duration - this.audioContext.currentTime,
      });
      this.audioContext.suspend();
    }
  }

  toNextAudio() {
    this.stopAudio();
    this.setState((prevState) => ({
      playedSongIndex: prevState.playedSongIndex + 1,
      source: this.audioContext.createBufferSource(),
    }), () => {
      // eslint-disable-next-line react/destructuring-assignment
      console.log(this.state.playedSongIndex);
      this.init();
      this.playAudio();
    });
  }

  render() {
    return (
      <div id="musicplayer_full">
        <div id="controls">
          <button type="button" onClick={this.playAudio}>Play</button>
          <button type="button" onClick={this.pauseAudio}>Pause</button>
          <button type="button" onClick={this.stopAudio}>Stop</button>
          <button type="button" onClick={this.toNextAudio}>Next</button>
        </div>
      </div>
    );
  }
}

export default MusicPlayer;
