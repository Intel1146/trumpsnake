/* this is where phaser code goes */
var wW = window.innerWidth;
var wH = window.innerHeight;

var W = screen.width;
var H = screen.height;
var score = 0;
var game = new Phaser.Game(wW, wH, Phaser.CANVAS,'', { preload: preload, create: create, update: update});
var cursorPositions = [];
var trumpLength = 40;
var trumps = [];
var transferSpeed = 1;

var throttle = W/200;


var startTime = Date.now();
var timeAllowed = 30;



timer = setInterval(function(){
	timeElapsed = Date.now() - startTime;
	document.getElementById("time").innerHTML = "Time: " + (timeAllowed - (timeElapsed/1000)).toFixed(2);
	console.log(timeAllowed - timeElapsed/1000);
	if (timeAllowed - timeElapsed/1000  <= 0){
		clearInterval(timer);
		alert("You finished with a score of " + score + "!");
	}
},10)




function preload() {
    game.load.image("trump","https://images-na.ssl-images-amazon.com/images/I/71r4nHPkV0L.png");
    game.load.image("taco","brick.png");
}

function create() {
	game.stage.backgroundColor = random_color();
	cursorX = game.input.x;
	cursorY = game.input.y;
	transferCounter = 0;

	for (i=trumpLength - 1;i>=0;i--){
		newTrump = game.add.sprite(cursorX,cursorY,"trump");
		newTrump.anchor.set(0.5);
		newTrump.scale.set((((trumpLength * 1.7) - i)/500)    *    (W/1000));
		cursorPositions.push([500,500]);
		trumps.push(newTrump);
	}
	
	tacoSprite = game.add.sprite(random_int(0,wW),random_int(0,wH),"taco");
	tacoSprite.anchor.set(0.5);
	tacoSprite.scale.set(W/10000);
	
}

function update() {

	cursorX = game.input.x;
	cursorY = game.input.y;


	if (transferCounter == transferSpeed){
		


		transferCounter = 0;
		for (i=1;i<trumpLength;i++){
			
			
			
			cursorPositions[i - 1][0] = cursorPositions[i][0];
			cursorPositions[i - 1][1] = cursorPositions[i][1];
	
	
	
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
	
	if (collides(trumps[trumpLength - 1],tacoSprite)){
		tacoSprite.x = random_int(0,wW);
		tacoSprite.y = random_int(0,wH);
		game.stage.backgroundColor = random_color();
		score++;
		document.getElementById("score").innerHTML = "Score: " + score;
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