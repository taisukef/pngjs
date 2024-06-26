var PNG = function(){

	// initialize all members to keep the same hidden class
	this.width = 0;
	this.height = 0;
	this.bitDepth = 0;
	this.colorType = 0;
	this.compressionMethod = 0;
	this.filterMethod = 0;
	this.interlaceMethod = 0;

	this.colors = 0;
	this.alpha = false;
	this.pixelBits = 0;

	this.palette = null;
	this.pixels = null;
	this.trns = null;

};

PNG.prototype.getWidth = function(){
	return this.width;
};

PNG.prototype.setWidth = function(width){
	this.width = width;
};

PNG.prototype.getHeight = function(){
	return this.height;
};

PNG.prototype.setHeight = function(height){
	this.height = height;
};

PNG.prototype.getBitDepth = function(){
	return this.bitDepth;
};

PNG.prototype.setBitDepth = function(bitDepth){
	if ([2, 4, 8, 16].indexOf(bitDepth) === -1){
		throw new Error("invalid bith depth " + bitDepth);
	}
	this.bitDepth = bitDepth;
};

PNG.prototype.getColorType = function(){
	return this.colorType;
};

PNG.prototype.setColorType = function(colorType){

	//   Color    Allowed    Interpretation
	//   Type    Bit Depths
	//
	//   0       1,2,4,8,16  Each pixel is a grayscale sample.
	//
	//   2       8,16        Each pixel is an R,G,B triple.
	//
	//   3       1,2,4,8     Each pixel is a palette index;
	//                       a PLTE chunk must appear.
	//
	//   4       8,16        Each pixel is a grayscale sample,
	//                       followed by an alpha sample.
	//
	//   6       8,16        Each pixel is an R,G,B triple,
	//                       followed by an alpha sample.

	var colors = 0, alpha = false;

	switch (colorType){
		case 0: colors = 1; break;
		case 2: colors = 3; break;
		case 3: colors = 1; break;
		case 4: colors = 2; alpha = true; break;
		case 6: colors = 4; alpha = true; break;
		default: throw new Error("invalid color type");
	}

	this.colors = colors;
	this.alpha = alpha;
	this.colorType = colorType;
};

PNG.prototype.getCompressionMethod = function(){
	return this.compressionMethod;
};

PNG.prototype.setCompressionMethod = function(compressionMethod){
	if (compressionMethod !== 0){
		throw new Error("invalid compression method " + compressionMethod);
	}
	this.compressionMethod = compressionMethod;
};

PNG.prototype.getFilterMethod = function(){
	return this.filterMethod;
};

PNG.prototype.setFilterMethod = function(filterMethod){
	if (filterMethod !== 0){
		throw new Error("invalid filter method " + filterMethod);
	}
	this.filterMethod = filterMethod;
};

PNG.prototype.getInterlaceMethod = function(){
	return this.interlaceMethod;
};

PNG.prototype.setInterlaceMethod = function(interlaceMethod){
	if (interlaceMethod !== 0 && interlaceMethod !== 1){
		throw new Error("invalid interlace method " + interlaceMethod);
	}
	this.interlaceMethod = interlaceMethod;
};

PNG.prototype.setTRNS = function(trns) {
	this.trns = trns;
};

PNG.prototype.setPalette = function(palette){
	if (palette.length % 3 !== 0){
		throw new Error("incorrect PLTE chunk length");
	}
	if (palette.length > (Math.pow(2, this.bitDepth) * 3)){
		throw new Error("palette has more colors than 2^bitdepth");
	}
	this.palette = palette;
};

PNG.prototype.getPalette = function(){
	return this.palette;
};

/**
 * get the pixel color on a certain location in a normalized way
 * result is an array: [red, green, blue, alpha]
 */
PNG.prototype.getPixel = function(x, y){
	if (!this.pixels) throw new Error("pixel data is empty");
	if (x >= this.width || y >= this.height){
		throw new Error("x,y position out of bound");
	}
	var i = this.colors * this.bitDepth / 8 * (y * this.width + x);
	var pixels = this.pixels;

	switch (this.colorType){
		case 0: return [pixels[i], pixels[i], pixels[i], 255];
		case 2: return [pixels[i], pixels[i + 1], pixels[i + 2], 255];
		case 3:
			var alpha = 255;
			if (this.trns != null && this.trns[pixels[i]] != null) {
				alpha = this.trns[pixels[i]];
			}
			return [
			this.palette[pixels[i] * 3 + 0],
			this.palette[pixels[i] * 3 + 1],
			this.palette[pixels[i] * 3 + 2],
			alpha];
		case 4: return [pixels[i], pixels[i], pixels[i], pixels[i + 1]];
		case 6: return [pixels[i], pixels[i + 1], pixels[i + 2], pixels[i + 3]];
	}
};

/**
 * get the pixels of the image as a RGBA array of the form [r1, g1, b1, a1, r2, b2, g2, a2, ...]
 * Matches the api of canvas.getImageData
 */
PNG.prototype.getRGBA8Array = function() {
	const data = new Uint8ClampedArray(this.width * this.height * 4);
	for (let y = 0; y < this.height; y++) {
		for (let x = 0; x < this.width; x++) {
			const pixelData = this.getPixel(x, y);

			data[(y * this.width + x) * 4 + 0] = pixelData[0];
			data[(y * this.width + x) * 4 + 1] = pixelData[1];
			data[(y * this.width + x) * 4 + 2] = pixelData[2];
			data[(y * this.width + x) * 4 + 3] = pixelData[3];
		}
	}
	return data;
};

PNG.prototype.createSameClass = function() {
	const res = new PNG();
	res.width = this.width;
	res.height = this.height;
	res.bitDepth = this.bitDepth;
	res.colorType = this.colorType;
	res.compressionMethod = this.compressionMethod;
	res.filterMethod = this.filterMethod;
	res.interlaceMethod = this.interlaceMethod;
	res.colors = this.colors;
	res.alpha = this.alpha;
	res.pixelBits = this.pixelBits;
	return res;
};

export { PNG };
