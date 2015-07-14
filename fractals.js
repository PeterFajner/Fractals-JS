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

var x_offset = 0;
var y_offset = 0;
var defaultZoom = 0.25;
var zoom = defaultZoom;
var previous_click_x = 0;
var previous_click_y = 0;

var zoomConstant = 4;

canvas.addEventListener("mousedown", canvasClicked, false);

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

function calculateImage() {
	var col = 0;
	var outer = setInterval(function() {
		if (col >= width) {
			clearInterval(outer);
		}
		else {
			//console.log(col);
			for (var row = 0; row < height; row++) {
				var c_re = (x_offset+(col-width/2)/zoom)/(width);
				var c_im = (y_offset+(row-height/2)/zoom)/(width);
				var x = 0;
				var y = 0;
				var iteration = 0;
				while (x*x+y*y < 4 && iteration < max) {
					var x_new = x*x-y*y + c_re;
					y = 2*x*y + c_im;
					x = x_new;
					iteration++;
				}
				//var scale = (1-Math.log(iteration)/Math.log(max)) * 255;
				var scale = (iteration/max) * 360;
				var colour = [scale,100,50];
				//console.log(col, row, iteration, colour);
				drawPixel(col, row, colour);
			}
			col++;
		}
	}, 1);
	/*
	for (var col = 0; col < width; col++) {
		
	}*/
}

function startButtonPressed() {
	calculateImage();
	x_offset = 0;
	y_offset = 0;
	zoom = defaultZoom;
}

function canvasClicked() {
	click_x = (event.pageX - width/2) - canvas.offsetLeft; // apparently, the event gives the coordinates of the click wrt the screen, not the canvas, because intuitive behaviour is not webscale
	click_y = (event.pageY - height/2) - canvas.offsetTop;
	zoomProportion = zoom/defaultZoom;
	x_offset += (click_x) / zoomProportion;
	y_offset += (click_y) / zoomProportion;
	zoom *= 2;
	console.log("Events", event.pageX, event.pageY, "Clicks",  click_x, click_y, "Offsets", x_offset, y_offset, zoom, zoomProportion);
	previous_click_x = click_x;
	previous_click_y = click_y;
	calculateImage();

}