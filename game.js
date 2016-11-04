const frame = Math.round(1000/60);

var canvas = document.getElementById("canvas");
canvas.width = 480;
canvas.height = 360;

const ctx = canvas.getContext("2d");

var map_img = new Image(495, 315);
map_img.src = 'res/battlefield.png';
var player_img = new Image(480, 40);
player_img.src = 'res/sprite_sheet.png';
var back_img = new Image(512, 360);
back_img.src = 'res/background.png';

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

const player_frame_caps = [12];

class Player extends Thing {

	//dir: -1 for left, 1 for right
	//Note to self: x, y coordinates are between the character's feet
	
	constructor(x, y, width, height, imgx, imgy) {
		super(x, y, width, height, imgx, imgy);
		this.dir = 1;
		this.frame_pos = 0;
		this.action = 0;
	}
	
	drawToCanvas() {
		this.frame_pos++;
		if (this.frame_pos >= player_frame_caps[this.action])
			this.frame_pos = 0;
		ctx.drawImage(player_img, 40*this.frame_pos, 0, 40, 40, this.x + this.img_x_offset, this.y + this.img_y_offset, 40, 40);
	}

}

var camera = {
	x: 0,
	y: 0,
	width: 480,
	height: 360
};
var player1 = new Player(50, 50, 20, 36, -10, -2);

var game = function loop() {
	ctx.drawImage(map_img, 0, 0);
	player1.drawToCanvas();
};

setInterval(game, 100);