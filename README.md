
PNG.js
======

PNG.js is a PNG decoder fully written in JavaScript. It works in Deno as
well as in (modern) browsers.

Usage
-----

``` js
import { decodePNG } from "https://taisukef.github.io/pngjs/decodePNG.js";

const imageData = decodePNG(bytes);
console.log(imageData);
```

Or:

``` js
import { PNGReader } from "https://taisukef.github.io/pngjs/PNGReader.js";

const reader = new PNGReader(bytes);
const png = reader.parse();

```

Or with options:

``` js
const png = reader.parse({ data: false });
```

Currently the only option is:

- `data` (*boolean*) - should it read the pixel data, or only the image information.

### PNG object

The PNG object contains all the data extracted from the image.

``` js
// most importantly
png.getWidth();
png.getHeight();
png.getPixel(x, y); // [red, blue, green, alpha]
png.getRGBA8Array(); // [r1, g1, b1, a1, r2, b2, g2, a2, ... ] - Same as canvas.getImageData
// but also
png.getBitDepth();
png.getColorType();
png.getCompressionMethod();
png.getFilterMethod();
png.getInterlaceMethod();
png.getPalette();
```

Using PNGReader in Deno
--------------------------

PNGReader accepts an `Uint8Array` object, returned by `Deno.readFile`, for example:

``` js
const buffer = await Deno.readFile('test.png');
const reader = new PNGReader(buffer);
const png = reader.parse();
```

Using PNGReader in the Browser
------------------------------

PNGReader accepts Uint8Array.

For example using FileReader with file input fields:

```js
const reader = new FileReader();

reader.onload = (event) => {
	const reader = new PNGReader(event.target.result);
	const png = reader.parse();
	console.log(png);
};

fileInputElement.onchange = () => {
	reader.readAsArrayBuffer(fileInputElement.files[0]);
};
```

Or instead of using input elements, fetch can also be used:

```js
const data = new Uint8Array(await (await fetch("image.png")).arrayBuffer());
const reader = new PNGReader(data);
const png = reader.parse();
console.log(png);
```
