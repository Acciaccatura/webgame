const frame = Math.round(1000/60);

var canvas = document.getElementById("canvas");
canvas.width = 480;
canvas.height = 360;
const ctx = canvas.getContext("2d");

//Images:
var map_img = new Image(495, 315);
map_img.src = 'res/battlefield.png';
var back_img = new Image(512, 360);
back_img.src = 'res/backgr.png';



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

const platforms = [	new Thing(16, 186, 462, 10, 0, 0),
					new Thing(52, 96, 122, 10, 0, 0),
					new Thing(318, 96, 122, 10, 0, 0),
					new Thing(184, 5, 126, 10, 0, 0)	];
					
const player_frame_caps = [12, 5, 3, 10, 10, 20, 6];

class Player extends Thing {

	//dir: -1 for left, 1 for right
	//Note to self: x, y coordinates are between the character's feet
	
	constructor(x, y, width, height, imgx, imgy) {
		super(x, y, width, height, imgx, imgy);
		this.dir = 1;
		this.frame_pos = 0;
		this.action = 2;
		
		this.dx = 0.0;
		this.dy = 0.0;
		
		this.airborne = true;
		this.doublejump = false;
		
		this.img = new Image(480, 126);
		this.img.src = 'res/sprite_sheet.png';
		
		this.hitbox = null;
		
		this.counter = 0;
		this.counter_max = -1;
	}
	
	collideGround(thing) {
		if ((this.x + this.width >= thing.x && this.x <= thing.x + thing.width) && (this.y + this.height >= thing.y && this.y <= thing.y + thing.height))
			return true;
		else return false;
	}
	
	forces() {
		if (this.airborne) {
			this.x += Math.round(this.dx/2);
			if (++this.dy > 10)
				this.dy = 10;
			this.y += this.dy;
			if (this.action != 6) {
				this.action = 2;
				if (this.dy > 1)
					this.frame_pos = 2;
				else if (this.dy < -1)
					this.frame_pos = 0;
				else
					this.frame_pos = 1;
			}
		} else {
			this.x += this.dx;
			if (this.dx > 0)
				this.dx-= 1;
			else if (this.dx < 0)
				this.dx += 1;
			else if (this.action > 1 && this.action < 5)
				this.action = 0;
			this.dy = 0;
		}
		this.airborne = true;
		for (var i in platforms) {
			if (this.collideGround(platforms[i]) && this.y + this.height < platforms[i].y + platforms[i].height && this.dy >= 0) {
				this.y = platforms[i].y - this.height;
				this.airborne = false;
				this.doublejump = false;
				if (this.dy > 0) {
					this.frame_pos = 0;
					this.action = 1;
				}
				break;
			}
		}
	}
	
	move(dx) {
		this.dir = dx/Math.abs(dx);
		this.dx = dx;
		if (!this.airborne) {
			if (Math.abs(this.dx) <= 6)
				this.action = 3;
			else
				this.action = 4;
		}
	}
	
	neutrala() {
		if (!this.airborne) {
			if (this.action === 5) {
				if (this.frame_pos === 5 || this.frame_pos === 4)
					this.frame_pos = 7;
				else if (this.frame_pos === 11 || this.frame_pos === 10)
					this.frame_pos = 13;
			} else if (this.action === 0) {
				this.action = 5;
				this.frame_pos = 0;
			}
		} else {
			this.action = 6;
		}
	}
	
	//MOVEMENT FUNCTIONS HERE: AYY LMEO
	jump(dy) {
		if (!this.airborne) {
			this.airborne = true;
			this.action = 2;
			this.dy = -dy;
		} else if (!this.doublejump) {
			this.airborne = true;
			this.action = 2;
			this.dy = -dy;
			this.doublejump = true;
		}
	}
		
	//CALL LAST
	drawToCanvas() {
		if (!this.airborne)
			this.frame_pos++;
		if (this.frame_pos >= player_frame_caps[this.action]) {
			this.frame_pos = 0;
			if (this.action === 1 || this.action === 5)
				this.action = 0;
		} else if (this.action === 5) {
			if (this.frame_pos === 6 || this.frame_pos === 12) {
				this.action = 0;
				this.frame_pos = 0;
			}
		} else if (this.action === 6) {
			this.frame_pos++;
			if (this.frame_pos >= player_frame_caps[this.action]) {
				this.frame_pos = 0;
				this.action = 2;
			}
		}
		ctx.save();
		ctx.scale(this.dir, 1);
		ctx.drawImage(this.img, 64*this.frame_pos, 64*this.action, 64, 64, this.dir*this.x + this.img_x_offset + 20*(this.dir - 1)/(2), this.y + this.img_y_offset, 64, 64);
		ctx.restore();
	}
	

}

var camera = {
	x: 0,
	y: 0,
	width: 480,
	height: 360
};

var player1 = new Player(70, 130, 20, 36, -22, -17);

var game = function loop() {
	//logic
	player1.forces();
	//render
	ctx.drawImage(back_img, 0, 0);
	ctx.drawImage(map_img, 0, 0);
	player1.drawToCanvas();
};

setInterval(game, 40);