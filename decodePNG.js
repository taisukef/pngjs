import { PNGReader } from "./PNGReader.js";

if (!globalThis.ImageData) { // for Deno 1.10.2, ImageData not implemented yet
  class ImageData {
    constructor(data, w, h) {
      this.data = data;
      this.width = w;
      this.height = h;
    }
  }
  globalThis.ImageData = ImageData;
}

const decodePNG = (bin) => { // Uint8Array(png) -> ImageData
  const reader = new PNGReader(bin);
  const png = reader.parse();
	const imageData = new ImageData(png.getRGBA8Array(), png.width, png.height);
  return imageData;
};

const decodePNGs = (bin) => { // Uint8Array(png) -> ImageData
  const reader = new PNGReader(bin);
  const pngs = reader.parseMulti();
  const imgdatas = pngs.map(png => new ImageData(png.getRGBA8Array(), png.width, png.height));
  return imgdatas;
};

export { decodePNG, decodePNGs };
