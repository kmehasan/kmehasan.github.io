// Variables for game elements
var canvas, ctx;
var player, obstacles, bg;
var score;
var gameSpeed;
var keys = {};
var player_height = 48
var player_width  = 68
const bg_image_width = 1704
const bg_image_height = 512
var bg_speed = 2
var jump_speed = 5
// Game initialization function
function init() {
	// Get canvas element and 2D context
	canvas = document.getElementById('gameCanvas');
	ctx = canvas.getContext('2d');
	// resize the canvas to fill browser window dynamically
	window.addEventListener('resize', resizeCanvas, false);
        
	function resizeCanvas() {
	  canvas.width = window.innerWidth;
	  canvas.height = window.innerHeight-10;

	  if(canvas.width<canvas.height) {
		bg_speed = 1
		gameSpeed = 2
		player_height = player_height/1.7
		player_width = player_width/1.7
		jump_speed = 2
	  }
				  
	  /**
	   * Your drawings need to be inside this function otherwise they will be reset when 
	   * you resize the browser window and the canvas goes will be cleared.
	   */
	}
	
	resizeCanvas();
	// Create player object
	player = {
		x: 50,
		y: canvas.height/2,
		width: player_width,
		height: player_height,
		jumping: false,
		jumpSpeed: 0,
		gravity: 0.5
	};
	bg = {
		x: 0,
		y: 0,
		width: canvas.width,
		height: canvas.height,
		speed: bg_speed
	};
	bg2 = {
		x: bg_image_width,
		y: 0,
		width: canvas.width,
		height: canvas.height,
		speed: 1
	};
	bg3 = {
		x: bg_image_width*2,
		y: 0,
		width: canvas.width,
		height: canvas.height,
		speed: 1
	};
	
	
	// Create array for obstacles
	obstacles = [];
	
	// Set initial score to zero
	score = 0;
	
	// Set initial game speed
	gameSpeed = 3;
	
	// Add event listeners for key presses
	document.addEventListener('keydown', function(event) {
		console.log('keydown',event)
		keys[event.code] = true;
	});
	document.addEventListener('keyup', function(event) {
		keys[event.code] = false;
	});
	canvas.addEventListener("touchstart", function(){
		keys["Space"] = true;
	}, false);
	canvas.addEventListener("touchend", function(){
		keys["Space"] = false;
	}, false);
	
	// Start game loop
	requestAnimationFrame(gameLoop);
}

// Game loop function
function gameLoop() {
	// Update game state
	update();
	
	// Clear canvas
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	
	// Draw game elements
	draw();
	
	// Call game loop again
	requestAnimationFrame(gameLoop);
}
var new_obs_height = 10;
var isDown = false;

// Function to update game state
function update() {
	// Reset game
	if(gameSpeed == 0 && keys['Enter']){
		console.log("reset")
		location.reload()
		return;
	}
	if(gameSpeed == 0) return
	// Update player position
	if (keys['Space']) {
		player.jumping = true;
		player.jumpSpeed = -1*jump_speed;
	}
	else {
		player.jumping = false;
		player.jumpSpeed = jump_speed;
	}
	if(gameSpeed != 0){
		bg.x  -= bg.speed
		bg2.x -= bg.speed
		bg3.x -= bg.speed
	}

	if(bg.x < -bg_image_width) bg.x += bg_image_width*3
	if(bg2.x < -bg_image_width) bg2.x += bg_image_width*3
	if(bg3.x < -bg_image_width) bg3.x += bg_image_width*3
	
	player.y += player.jumpSpeed;
	
	// Apply gravity to player if not jumping
	if (!player.jumping) {
		player.jumpSpeed += player.gravity;
	}
	
	// Keep player from falling through the ground
	if (player.y > canvas.height - player.height) {
		player.y = canvas.height - player.height;
		player.jumpSpeed = 0;
		player.jumping = false;
	}
	
	// Update obstacle positions
	for (var i = 0; i < obstacles.length; i++) {
		obstacles[i].x -= gameSpeed;
		
		// Remove obstacle if it goes off screen
		if (obstacles[i].x < -obstacles[i].width) {
			obstacles.splice(i, 1);
			i--;
		}
	}
	
	// Generate new obstacles randomly
	if (Math.random() < 0.02) {
		new_obs_height = Math.random() * canvas.height/2.1;
		isDown = Math.random() < 0.5
		obstacles.push({
			x: canvas.width,
			y: isDown ? canvas.height - new_obs_height : 0,
			width: 50,
			height: new_obs_height,
			down : isDown
		});
	}
	
	// Check for collision with obstacles
	for (var i = 0; i < obstacles.length; i++) {
		var obs = obstacles[i];
		
		if (player.x < obs.x + obs.width &&
			player.x + player.width > obs.x &&
			player.y < obs.y + obs.height &&
			player.y + player.height > obs.y) {
			// Player collided with obstacle
			// End game or take appropriate action
			gameSpeed = 0;
			gameOver();
			// document.getElementById('gameOver').style.display = 'block';
		}
	}
	
	// Increase score
	score++;
}
const player_images = ["assets/redbird-downflap.png","assets/redbird-downflap.png",
"assets/redbird-midflap.png","assets/redbird-midflap.png",
"assets/redbird-upflap.png","assets/redbird-upflap.png","assets/redbird-midflap.png","assets/redbird-midflap.png"]
var player_img_pos = 0
// Function to draw game elements
function draw() {
	// Draw bg
	var img = new Image;
	img.src = "assets/background.png";
	ctx.drawImage(img,
		0,0,
		bg_image_width,bg_image_height,
		bg.x, bg.y,
		bg_image_width,canvas.height,
		); // Or at whatever offset you like
	ctx.drawImage(img,
		0,0,
		bg_image_width,bg_image_height,
		bg2.x, bg2.y,
		bg_image_width,canvas.height,
		); // Or at whatever offset you like
	ctx.drawImage(img,
		0,0,
		bg_image_width,bg_image_height,
		bg3.x, bg3.y,
		bg_image_width,canvas.height,
		); // Or at whatever offset you like
	// ctx.drawImage(img,
	// 	0,0,
	// 	canvas.width-bg.x,bg_image_height,
	// 	canvas.width-bg.x, 0,
	// 	canvas.width-bg.x,canvas.height,
	// 	); // Or at whatever offset you like
		
	// Draw obstacles
	ctx.fillStyle = '#888888';
	for (var i = 0; i < obstacles.length; i++) {
		
		var img = new Image;
		// img.src = "https://raw.githubusercontent.com/samuelcust/flappy-bird-assets/master/sprites/pipe-green.png";
		img.src = obstacles[i].down ? "assets/pipe-green.png":"assets/pipe-green-down.png";
		// ctx.drawImage(img,obstacles[i].x, obstacles[i].y); // Or at whatever offset you like
		ctx.drawImage(img,
			0,0,
			52,320,
			obstacles[i].x, obstacles[i].y,
			obstacles[i].width, obstacles[i].height
			); // Or at whatever offset you like
		// ctx.fillRect(obstacles[i].x, obstacles[i].y, obstacles[i].width, obstacles[i].height);
		
	}
	// Draw player
	// ctx.fillStyle = '#000000';
	// ctx.fillRect(player.x, player.y, player.width, player.height);
	var img = new Image;
	img.src = player_images[player_img_pos];
	player_img_pos += 1
	if(player_img_pos >= player_images.length) player_img_pos = 0
	ctx.drawImage(img,
		0,0,
		34,24,
		player.x, player.y,
		player.width, player.height); // Or at whatever offset you like

	

	// Draw score
	ctx.fillStyle = '#000000';
	ctx.font = '20px Verdana';
	ctx.fillText('Score: ' + score, 10, 30);
}
// Function to end the game
function gameOver() {
	// Stop the game loop
	clearInterval(gameLoop);

	// Show the game over screen
	document.getElementById('finalScore').innerHTML = score;
	document.getElementById('gameOver').style.display = 'block';
}

// Function to restart the game
function restart() {
	location.reload()
}
init()
