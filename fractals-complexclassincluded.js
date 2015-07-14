var canvas = document.getElementById("canvas");
var context = canvas.getContext("2d");
var width = canvas.width;
var height = canvas.height;

//var id = context.createImageData(1, 1);
//var data = id.data;
var data = context.getImageData(0, 0, width, height);

var black = [255, 255, 255, 1];
var white = [0, 0, 0, 1];

var max = 1000;
var logMax = Math.log(max);


function complex (r, i) {
	this.r = r;
	this.i = i;
	this.addComplex = function(other) {
		this.r += other.r;
		this.i += other.i;
	};
	this.multiplyComplex = function(other) {
		var r = this.r * other.r - this.i * other.i;
		var i = this.r * other.i + this.i * other.r;
		this.r = r;
		this.i = i;
	};
	this.square = function() {
		this.multiplyComplex(this);
	};
	this.abs = function() {
		return Math.sqrt(this.sqrAbs());
	};
	this.sqrAbs = function() {
		return this.r*this.r + this.i*this.i;
	};
}

function drawPixel(col, row, colour) {
	/*var index = (col + row * width) * 4;
	data[index+0] = colour[0];
	data[index+1] = colour[1];
	data[index+2] = colour[2];
	data[index+3] = colour[3];
	context.putImageData(data, 0, 0);*/

	//context.fillStyle = "rgb("+Math.round(colour[0])+","+Math.round(colour[1])+", "+Math.round(colour[2])+")";
	context.fillStyle = "hsl("+Math.round(colour[0])+","+Math.round(colour[1])+"%, "+Math.round(colour[2])+"%)";
	//context.fillStyle = "rgb(200.5,200.7,200.1)";
	//console.log(colour, context.fillStyle);
	context.fillRect(col, row, 1, 1);

}

for (var col = 0; col < width; col++) {
	console.log(col);
	for (var row = 0; row < height; row++) {
		/*
		var c = new complex((col-width/2)*2/width, (row-height/2)*2/width);
		var z = new complex(0,0);
		var iteration = 0;
		while (z.sqrAbs() <= 4 && iteration < max) {
			z.square();
			z.addComplex(c);
			iteration++;
		}*/
		var c_re = (col-width/2)*3/width;
		var c_im = (row-height/2)*3/width;
		var x = 0;
		var y = 0;
		var iteration = 0;
		while (x*x+y*y < 4 && iteration < max) {
			var x_new = x*x-y*y + c_re;
			y = 2*x*y + c_im;
			x = x_new;
			iteration++;
		}
		/*if (iteration < max) {
			drawPixel(col, row, white);
		}
		else {
			drawPixel(col, row, black);
		}*/
		//var scale = (1-Math.log(iteration)/Math.log(max)) * 255;
		var scale = (iteration/max) * 360;
		var colour = [scale,100,50];
		//console.log(col, row, iteration, colour);
		drawPixel(col, row, colour);
	}
}