var canvas = document.getElementById("canvas");
var context = canvas.getContext("2d");
var width = canvas.width;
var height = canvas.height;

var xMinEntry = document.getElementById("xmin");
var xMaxEntry = document.getElementById("xmax");
var yMinEntry = document.getElementById("ymin");
var yMaxEntry = document.getElementById("ymax");
var canvasWidthEntry = document.getElementById("canvasWidth");

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

var zoomX = 1;
var zoomY = 1;

var g_midpoint_x = 0;
var g_midpoint_y = 0;

var g_range_x = 4;
var g_range_y = 4;

//canvas.addEventListener("mousedown", canvasClicked2, false);

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

	var xMin = parseFloat(xMinEntry.value); // why is a number input field's value a string?
	var xMax = parseFloat(xMaxEntry.value);
	var yMin = parseFloat(yMinEntry.value);
	var yMax = parseFloat(yMaxEntry.value);

	if (xMax < xMin) {
		xMax = xMin + 1;
	}
	if (yMax < yMin) {
		yMax = yMin + 1;
	}

	var canvasWidth = parseInt(canvasWidthEntry.value) || 2000;
	if (canvasWidth !== width) {
		canvas.width = canvasWidth;
		width = canvas.width;
	}

	canvas.height = width * (yMax - yMin) / (xMax - xMin);
	height = canvas.height;

	//console.log(xMin, xMax, yMin);

	
	var col = 0;
	var outer = setInterval(function() {
		if (col >= width) {
			clearInterval(outer);
		}
		else {
			//console.log(col);
			for (var row = 0; row < height; row++) {
				//var c_re = g_midpoint_x - g_range_x/2 + col*g_range_x/width; //(x_offset + col - width/2) / width * 4 / zoomX; //(col - width/2 + x_offset) / width / zoomX * 4; //(x_offset+(col-width/2))/(width*zoom);
				//var c_im = g_midpoint_y - g_range_y/2 + row*g_range_y/height; //(y_offset + row - height/2) / height * 4 / zoomX; //(y_offset+(row-height/2))/(width*zoom);
				var c_re = xMin + col/width * (xMax - xMin);
				var c_im = yMin + row/height * (yMax - yMin);
				var x = 0;
				var y = 0;
				var iteration = 0;
				while (x*x+y*y < 4 && iteration < max) {
					var x_new = x*x-y*y + c_re;
					y = 2*x*y + c_im;
					x = x_new;
					iteration++;
				}
				var scale = (iteration/max) * 360;
				var colour = [scale,100,50];
				drawPixel(col, row, colour);
			}
			col++;
		}
	}, 1);

}

function startButtonPressed() {
	x_offset = 0;
	y_offset = 0;
	zoom = defaultZoom;
	zoomX = 1;
	zoomY = 1;
	g_midpoint_x = 0;
	g_midpoint_y = 0;
	g_range_x = 4;
	g_range_y = 4;
	calculateImage();
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

var click1 = [];
var click2 = [];

var alreadyClicked = false;

function canvasClicked2() {
	if (!alreadyClicked) {
		click1 = [event.pageX - canvas.offsetLeft, event.pageY - canvas.offsetTop];
		alreadyClicked = true;
	}
	else if (alreadyClicked) {
		click2 = [event.pageX - canvas.offsetLeft, event.pageY - canvas.offsetTop];
		alreadyClicked = false;
		var c_maxX = Math.max(click1[0], click2[0]);
		var c_minX = Math.min(click1[0], click2[0]);
		var c_maxY = Math.max(click1[1], click2[1]);
		var c_minY = Math.min(click1[1], click2[1]);
		var c_midX = c_maxX - c_minX;
		var c_midY = c_maxY - c_minY;

		g_midpoint_x = g_range_x * (c_midX / width - 0.5);
		g_midpoint_y = g_range_y * (c_midY / height - 0.5);




		//console.log([minX, maxX, minY, maxY], [x_offset, y_offset], [zoomX, zoomY]);
		calculateImage();
	}
}