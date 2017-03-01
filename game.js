/* this is where phaser code goes */
var wW = window.innerWidth;
var wH = window.innerHeight;
var speed = 6;


if (wW > wH){
	wW = wH / 1.5;
}


var score = 0;
var game = new Phaser.Game(wW, wH, Phaser.CANVAS,'', { preload: preload, create: create, update: update});
var cursorPositions = [];
var trumpLength = 40 * speed;
var trumps = [];
var transferSpeed = 1;


var throttle = wW/100 * (speed/3);


var startTime = Date.now();
var timeAllowed = 30;

//Brick/Wall Management
var brickTint = (random_int(99990,100000) / 100000) * 0xffffff;

var brickY = 0;
var brickX = 0;
var brickSize = wW/2000;
var brickStagger = random_int(0,brickSize * 604) //604px = brick picture width
var soundBiteLength = 9;
var slowThrottle = throttle / 2;
var fastThrottle = throttle;

timer = setInterval(function(){
	timeElapsed = Date.now() - startTime;
	document.getElementById("time").innerHTML = "Time: " + (timeAllowed - (timeElapsed/1000)).toFixed(2);
	if (timeAllowed - timeElapsed/1000  <= 0){
		clearInterval(timer);
		//alert("You finished with a score of " + score + "!");
	}
},10)




function preload() {
	game.load.image("background","assets/background.png");
    game.load.image("trump","https://images-na.ssl-images-amazon.com/images/I/71r4nHPkV0L.png");
    game.load.image("brick",'assets/brick.png');
    game.load.image("brickGlow",'assets/brick glow.png');

    for (i=1;i<=soundBiteLength;i++){
		game.load.audio("bite" + i,"sounds/bite" + i + ".ogg");
    }
}

function create() {
	backgroundSprite = game.add.sprite(0,wH,"background");
	backgroundSprite.anchor.setTo(0,1);
	backgroundSprite.scale.set(wW/1000);
	
	audio = [];
	for (i=1;i<=soundBiteLength;i++){
		audio.push(game.add.audio("bite" + i));
	}
	cursorX = game.input.x;
	cursorY = game.input.y;
	transferCounter = 0;
	brickGroup = game.add.group();
	for (i=trumpLength - 1;i>=0;i--){
		newTrump = game.add.sprite(cursorX,cursorY,"trump");
		newTrump.anchor.set(0.5);
		newTrump.scale.set((((trumpLength * 1.7) - i)/500)    *    (wW/500)/speed);
		cursorPositions.push([500,500]);
		trumps.push(newTrump);
	}
	
	brickSprite = game.add.sprite(random_int(0,wW),random_int(0,wH),"brickGlow");
	brickSprite.anchor.set(0.5);
	brickSprite.scale.set(brickSize);
	
}

function addBrick(){
	newBrick = game.add.sprite(0,0,"brick");
	newBrick.scale.set(brickSize);
	newBrick.anchor.setTo(0,1);
	newBrick.tint = brickTint
	brickTint = (random_int(99990,100000) / 100000) * 0xffffff;

	newBrick.x = brickX * newBrick.width * 0.98 - brickStagger;
	newBrick.y = wH - (brickY * newBrick.height * 0.98) - (wH - backgroundSprite.y);
	brickX += 1;
	if (newBrick.x + newBrick.width > wW){
		brickY++;
		brickStagger = random_int(0,604 * brickSize);
		brickX = 0;
		if (brickY * newBrick.height - (wH - backgroundSprite.y) > wH / 4){
			backgroundSprite.y += newBrick.height;
			brickGroup.forEach(function(brick){
				brick.y += newBrick.height;
			});
			newBrick.y += newBrick.height;
		}
	}
	brickGroup.add(newBrick);
}


function update() {

	cursorX = game.input.x;
	cursorY = game.input.y;

	if(game.input.pointer1.isDown || game.input.mousePointer.isDown){
		throttle = fastThrottle;
	}
	else{
		throttle = slowThrottle;
	}


	for (i=speed;i<trumpLength + speed;i++){
		if (i + speed > trumpLength){
			cursorPositions[i - speed][0] = cursorPositions[trumpLength - 1][0];
			cursorPositions[i - speed][1] = cursorPositions[trumpLength - 1][1];

		}
		else{
			cursorPositions[i - speed][0] = cursorPositions[i][0];
			cursorPositions[i - speed][1] = cursorPositions[i][1];
		}
	}



	var angle = Math.atan2(cursorY - cursorPositions[trumpLength - 1][1],cursorX - cursorPositions[trumpLength - 1][0]);
	
	var newX = Math.cos(angle) * throttle;
	var newY = Math.sin(angle) * throttle;

	var otherChangeX = (cursorX - cursorPositions[trumpLength - 1][0])/10
	var otherChangeY = (cursorY - cursorPositions[trumpLength - 1][1])/10

	var otherX = cursorPositions[trumpLength - 1][0] + otherChangeX;
	var otherY = cursorPositions[trumpLength - 1][1] + otherChangeY;
	

	if (Math.abs(otherChangeX) > Math.abs(newX)){
		cursorPositions[trumpLength - 1][0] = cursorPositions[trumpLength - 1][0] + newX;
	}
	else{
		cursorPositions[trumpLength - 1][0] = otherX;
	}
	if (Math.abs(otherChangeY) > Math.abs(newY)){
		cursorPositions[trumpLength - 1][1] = cursorPositions[trumpLength - 1][1] + newY;
	}
	else{
		cursorPositions[trumpLength - 1][1] = otherY;
	}

	for (i=0;i<trumpLength;i++){
		trumps[i].x = cursorPositions[i][0];
		trumps[i].y = cursorPositions[i][1];
	}
	
	if (collides(trumps[trumpLength - 1],brickSprite)){
		addBrick();
		brickSprite.x = random_int(0,wW);
		brickSprite.y = random_int(0,wH);
		brickSprite.tint = brickTint;
		game.stage.backgroundColor = random_color();
		score++;
		document.getElementById("score").innerHTML = "Bricks: " + score;
		audio[random_int(0,soundBiteLength - 1)].play();
	}
	
	
	
	
	transferCounter++;
	
}



function random_color(){
  return tinycolor({ h: random_int(0,100), s: 50, v: 95 }).toHex();

};        
function random_int(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};  

function collides (a,b){
        a.left  = a.x - a.width * a.anchor.x
        a.top  = a.y - a.height * a.anchor.y
        b.left  = b.x - b.width * b.anchor.x
        b.top  = b.y - b.height * b.anchor.y
    	if(a != undefined)
    	{
	    	return !(
		        ((a.top + a.height) < (b.top)) ||
		        (a.top > (b.top + b.height)) ||
		        ((a.left + a.width) < b.left) ||
		        (a.left > (b.left + b.width))
		    );	
    	}
};
