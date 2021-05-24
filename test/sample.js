import { PNGReader } from '../PNGReader.js';

const __dirname = ".";
const file = __dirname + "/../html/ubuntu-screenshot.png";

const bytes = await Deno.readFile(file);
console.log(bytes, bytes.length);
const t0 = performance.now();

const reader = new PNGReader(bytes);
const png = reader.parse();

const dt = performance.now() - t0;

console.log('benchmark took %d seconds and %d ms', dt, dt / 1e6);

console.log('pixels', png.pixels.length);
console.log('width', png.width, 'height', png.height, 'colors', png.colors);
console.log('colorType', png.colorType);
console.log('bitDepth', png.bitDepth);
console.log('colors', png.colors);

const t02 = performance.now();

for (let i = 0; i < png.width; i++){
	for (let j = 0; j < png.height; j++){
		png.getPixel(i, j);
	}
}

const dt2 = performance.now() - t02;
console.log('getPixel benchmark took %d seconds and %d ms', dt2, dt2 / 1e6);
