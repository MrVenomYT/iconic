// Lightweight stub for discord-image-generation
const dummyPng = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=',
  'base64'
);

class BaseDIG {
  async getImage() {
    return dummyPng;
  }
}

module.exports = {
  Jail: BaseDIG,
  Rip: BaseDIG,
  Triggered: BaseDIG,
  Blur: BaseDIG,
  Wasted: BaseDIG
};
