import React, { Component } from "react";
import "./musicPlayer.scss";
import Buffers from "./buffer.service";

const MusicPublicUrl = "http://localhost:5050/public/music/";
const MusicUrls = [
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
    const { source, gainNode } = this.state;
    this.setState({ isLoadingMusic: true });
    source.connect(gainNode);
    gainNode.connect(this.audioContext.destination);
    const buffer = new Buffers(this.audioContext, Object.values(MusicUrls));
    const buffers = await buffer.loadAll();
    this.setState(
      {
        bufferAudio: [...buffers],
      },
      () => this.setState({ isLoadingMusic: false }),
    );
  }

  playAudio() {
    const { isLoadingMusic, elapsed, source, bufferAudio } = this.state;
    if (isLoadingMusic) {
      alert("Audio still loading");
      return;
    }
    if (elapsed > 0) {
      this.audioContext.resume().catch((e) => {
        throw new Error(e);
      });
    } else {
      source.buffer = bufferAudio[1];
      source.start();
    }
  }

  stopAudio() {
    this.state.source.stop();
    this.setState({
      source: this.audioContext.createBufferSource(),
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

  toNextAudio() {}

  render() {
    return (
      <div id="musicplayer_full">
        <div id="controls">
          <button type="button" onClick={this.playAudio}>Play</button>
          <button type="button" onClick={this.pauseAudio}>Pause</button>
          <button type="button" onClick={this.stopAudio}>Stop</button>
        </div>
      </div>
    );
  }
}

export default MusicPlayer;
