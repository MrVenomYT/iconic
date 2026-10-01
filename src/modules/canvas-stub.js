// Lightweight stub for canvas to prevent native C++ compilation issues
const dummyPng = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=',
  'base64'
);

class FakeCanvas {
  constructor(w = 100, h = 100) {
    this.width = w;
    this.height = h;
  }
  getContext() {
    return {
      drawImage: () => {},
      beginPath: () => {},
      arc: () => {},
      closePath: () => {},
      clip: () => {},
      fillStyle: '',
      fillRect: () => {},
      fillText: () => {}
    };
  }
  toBuffer() {
    return dummyPng;
  }
}

module.exports = {
  createCanvas: (w, h) => new FakeCanvas(w, h),
  loadImage: async () => ({ width: 100, height: 100 }),
  Canvas: FakeCanvas
};
