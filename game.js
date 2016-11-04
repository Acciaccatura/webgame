const frame = Math.round(1000/60);

var canvas = document.getElementById("canvas");
canvas.width = 480;
canvas.height = 360;

const ctx = canvas.getContext("2d");

var map = new Image(495, 315);
map.src = 'res/battlefield.png';

/*----------------
	Just for reference:
		Map size: 640 x 480
		Battlefield rectangle: (70, 60), (565, 375)
		
----------------*/


class Thing {
	
	constructor(x, y, width, height, imgx, imgy) {
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this.img_x_offset = imgx;
		this.img_y_offset = imgy;
	}
	
}

var ground = [];

class Player extends Thing {

	//dir: -1 for left, 1 for right
	//Note to self: x, y coordinates are between the character's feet
	
	constructor(x, y, width, height, imgx, imgy) {
		super(x, y, width, height, imgx, imgy);
		this.dir = 1;
	}

}

var camera = {
	x: 0,
	y: 0,
	width: 480,
	height: 360
}

var game = function loop() {
	ctx.drawImage(map, 0, 0);
}

setInterval(game, frame);