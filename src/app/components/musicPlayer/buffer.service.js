export default class Buffers {
  constructor(context, urls) {
    this.context = context;
    this.urls = urls;
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
    this.urls.forEach((element) => console.log(element));
    for(let i in this.urls)
      await this.loadSound(this.urls[i], i);

    return this.buffer;
  }
}
