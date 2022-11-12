export default class Buffers {
  constructor(context, musicInfo) {
    this.context = context;
    this.musicInfo = musicInfo;
    this.buffer = [];
  }

  async loadSound(url, index) {
    const response = await fetch(url);
    const data = await response.arrayBuffer();

    const audioBuffer = await this.context.decodeAudioData(data);
    this.buffer[index] = audioBuffer;
  }

  async loadAll() {
    const urls = [];
    this.musicInfo.forEach((element) => {
      urls.push(element[1].link);
    });

    for (let i = 0; i < urls.length; i += 1) {
      /* eslint-disable no-await-in-loop */
      await this.loadSound(urls[i], i);
    }
    return this.buffer;
  }
}
