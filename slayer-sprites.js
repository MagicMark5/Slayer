var images = {};
var sprites = {};

var time;
var timer;
var totalResources = 2;
var numResourcesLoaded = 0;
var fps = 30;
var FPS = 45;
var canvas = document.getElementById('scene');
var context = canvas.getContext("2d");

// Attack Animations

var canvasWidth = 555;
var canvasHeight = 245;
var curFrame = 0;
var currentCharge = 0;

// Player Position

var x = 0;
var y = 100;

var sx = 80; // shadow x position
var sw = 50; // shadow width
var shadow = false;

// Frame Position

var srcX = 0;
var srcY = 0;

var attacking = false;
var attForward = true;
var attTimer = 0;
var gravity = 0.9;

// Breathing 

var breathInc = 0.1;
var breathDir = 1;
var breathPos = 0;
var breathMax = 1.6;

function AttackAnimation(name, slotNum, spriteWidth, spriteHeight, verSpeed, horSpeed, frameCount, lastFrame) {
	this.name = name;
	this.slot = slotNum;
	this.spriteWidth = spriteWidth; // 1110 is perfect for 8 frames, 1249 for 9, 1380 for 10
	this.spriteHeight = spriteHeight;
	this.verSpeed = verSpeed;
	this.horSpeed = horSpeed;
	this.attack = function (name) {
		attacking = true;
		timer = setTimeout(drawAnim.bind(null, name, this.slot, frameCount, lastFrame, this.spriteWidth, this.spriteHeight, this.verSpeed, this.horSpeed), FPS);
    };
}

function loadImage(name, name2) {
  images[name] = new Image();
  images[name2] = new Image();
  images[name].onload = function() { 
      images[name2].loaded();
  }
  images[name2].loaded = function() { 
      resourceLoaded(name, name2);
  }
  images[name].src = "svgs/" + name + ".svg";
  images[name2].src = "svgs/" + name2 + ".svg";
}

function loadSprites(name, slotNum, spriteObj) {
  images[name] = new Image();
  images[name].onload = function() {
  	sprites[name] = new AttackAnimation(name, slotNum, spriteObj["w"], spriteObj["h"], spriteObj["verSpeed"], spriteObj["horSpeed"], spriteObj["frames"], spriteObj["lastFrame"]);
  }
  images[name].src = "svgs/" + name + ".svg";
}

function resourceLoaded(name, name2) {
  timer = setInterval(drawIdleSprite.bind(null, name, name2), 1000 / fps);
  context.rect(10, 10, 204, 15);
  context.stroke();
}

function frameUpdate(frameCount, lastFrame, spriteWidth, frameWidth) {
	console.log("frameUpdate is being called.");
	//curFrame = ++curFrame % frameCount; // for continuous looping
	if (attForward && attTimer < lastFrame) {
		curFrame++; // for 1 loop
		attTimer++;
		if (curFrame === frameCount && lastFrame !== frameCount) {
			attForward = false;
		} else if (curFrame === lastFrame) {
			attForward = true;
			curFrame = 0;
		}
	} else if (!attForward && attTimer < frameCount*2) {
		curFrame--;
		attTimer++;
		if (curFrame === 0) {
			attForward = true;
		}
	}
	
	srcX = curFrame * frameWidth;
	return srcX;
}

function drawAnim(name, slotNum, frameCount, lastFrame, spriteWidth, spriteHeight, verSpeed, horSpeed) {
    
	var frameWidth = spriteWidth/frameCount;
	var frameHeight = spriteHeight;
	    
    timer = setTimeout(function() {
			requestAnimationFrame(drawAnim.bind(null, name, slotNum, frameCount, lastFrame, spriteWidth, spriteHeight, verSpeed, horSpeed), FPS);
			frameUpdate(frameCount, lastFrame, spriteWidth, frameWidth);
			if (attTimer < lastFrame) {
				switch (name) {
				// WARRIOR ATTACK ANIMATION EFFECTS
					case "warrior-Shield-Up": 
					  break;
					case "warrior-Brute-Force": // Brute-Force
					  if (attTimer < 8) {
					  	x += horSpeed;
					  }
					  break;
					case "warrior-Sharp-Steel": // Sharp-Steel
					  if (attTimer < 8) {
					  	x += horSpeed;
					  }
					  break;
					case "warrior-Two-Hand-Slash": // Two-Hand-Slash
					  console.log("Timer is at " + attTimer);
					  if (attTimer > 3 && attTimer <= 13) {
					  	  shadow = true;
						  x += horSpeed;
						  sx += horSpeed;
						  if (attTimer <= 8) {
						    verSpeed -= gravity;
						  	y -= verSpeed;
						  	sw -= 5;
						  } else if (attTimer > 8) {
						  	verSpeed += gravity;
						  	y += verSpeed;
						  	sw += 5;
						  }
					  } else {
					  	shadow = false;
					  }
					  break;
				// MAGE ATTACK ANIMATION EFFECTS
					case "mage-Study": // Study
					  break;
					case "mage-White-Magic": // White-Magic
					  break;
					case "mage-Black-Magic": // Black-Magic
					  break;
					case "mage-Curse": // Curse
					  break;
				// ROGUE ATTACK ANIMATION EFFECTS
					case "rogue-Steal": // Steal
					  break;
					case "rogue-Agile-Strike": // Agile-Strike
					  break;
					case "rogue-Dagger-Assault": // Dagger-Assault
					  break;
					case "rogue-Assassinate": // Assassinate
					  break;           
				// PSYCHIC ATTACK ANIMATION EFFECTS
					case "psychic-Hypnosis": // Hypnosis
					  break;
					case "psychic-Lobotomy": // Lobotomy
					  break;
					case "psychic-Electro-Manipulation": // Electro-Manipulation
					  break;
					case "psychic-Mind-Eraser": // Mind-Eraser
					  break;
				}              
				if (attTimer !== frameCount) {
					context.clearRect(0, y - 11, canvas.width, canvas.height); // clear the canvas
				}
				if (shadow) {
					drawShadow(sx, sw);
				}
				context.drawImage(images[name], srcX, srcY, frameWidth, frameHeight, x, y, frameWidth, frameHeight);
			}
		}, FPS);
	if (attTimer === lastFrame) {
		stopAttack(timer, name);
	}
}

function drawFrenzyMeter(frenzyMeter, toggle) {
	var chargeMax = frenzyMeter*40;
	var charge = 0;
	var drain = 200;
	var frenzyTimer = 0;
	var boost = toggle;
	if (boost) {
		frenzyTimer = setInterval(function() {
			if (charge < 40) {
				charge++;
			} else if (charge === 40) {
				currentCharge = currentCharge + charge;
				clearInterval(frenzyTimer);
				context.beginPath();
				context.rect(12.5, 12.5, chargeMax, 10);
				context.fillStyle = "gold";
				context.fill();
				return;
			}
			context.clearRect(12.5, 12.5, 200, 10);
			context.beginPath();
			context.rect(12.5, 12.5, currentCharge + charge, 10);
			context.fillStyle = "gold";
			context.fill();
		}, 10);
	} else {
		currentCharge = 0;
		frenzyTimer = setInterval(function() {
			context.clearRect(12.5, 12.5, 200, 10);
			drain--;
			if (drain === 0) {
				clearInterval(frenzyTimer);
				context.clearRect(12, 12, 200, 11);
				return;
			}
			context.clearRect(12, 12, 201, 11);
			context.beginPath();
			context.rect(12.5, 12.5, drain, 10);
			context.fillStyle = "gold";
			context.fill();
		}, 5);
	}
};
  
function drawIdleSprite(name, name2) {
    if (!attacking) {
      context.clearRect(x, y, canvas.width, canvas.height); // clears the canvas 
	  context.drawImage(images[name], x + 26, y + 81);                 
	  context.drawImage(images[name2], x + 8, y + 3 - breathPos);
	} 
}

function updateBreath() {     // ***Setting frame rate using setTimeout***
	setTimeout(function() {
	  requestAnimationFrame(updateBreath);
	  if (breathDir === 1) {  // breath in
		breathPos -= breathInc;
		if (breathPos < -breathMax) {
		  breathDir = -1;
		}
	  } else {  // breath out
		breathPos += breathInc;
		if(breathPos > breathMax) {
		  breathDir = 1;
		}
	  }
	}, 1000 / fps);
}
updateBreath();

function drawShadow(sx, sw) {
	context.beginPath();
	context.ellipse(sx, 230, 4, sw, 90 * Math.PI/180, 0, 2 * Math.PI);
	context.fillStyle = "rgba(177, 177, 177, 0.1)";
	context.fill();
}

function stopAttack(t, name) {
	clearTimeout(t);
	attTimer = 0;
	x = 0;
	y = 100;
	sx = 80;
	//drawFrenzyMeter();
	attacking = false;
}

/*function updateBreath() {         // ***Setting frame rate using delta time***
	requestAnimationFrame(updateBreath);
	var now = new Date().getTime(),
		dt = now - (time || now);
		
	time = now;
	  
	  if (breathDir === 1) {  // breath in
		breathPos -= breathInc * dt; // increment breath by breathInc every ms
		if (breathPos < -breathMax) {
		  breathDir = -1;
		}
	  } else {  // breath out
		breathPos += breathInc * dt; // increment breath by breathInc every ms
		if(breathPos > breathMax) {
		  breathDir = 1;
		}
	  }
}
updateBreath(); */