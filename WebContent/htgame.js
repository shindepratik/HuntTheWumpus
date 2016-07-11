function Wumpus(point) {
	var gp = new GamePiece();
	gp.evade = Wumpus_evade;
	return gp.construct("Wumpus",point,"You smell a wumpus","You have been eaten by a wumpus!");	
}

function Wumpus_evade(dir) {
	this.move(dir);
	if ( this.isTouching(game.hero) ) {
		this.evade(randomDirection());
	}
	//highlight(this.x,this.y,"purple");
}


// Bats
function Bats(point) {
	var gp = new GamePiece();
	return gp.construct("Bats",point,"You hear flapping","Bats carried you away!");	
}

// Pit
function Pit(point) {
	var gp = new GamePiece();
	return gp.construct("Pit",point,"You feel a breeze","You fell down a pit!");	
}

// Hero
function Hero(point) {
	var gp = new GamePiece();
	gp.arrows = 5;
	return gp.construct("Hero",point,"","");
}

// Arrow
function Arrow(point) {
	var gp = new GamePiece();
	return gp.construct("Arrow",point,"","You found an arrow!");
}

/* Game Pieces include hero, wumpus, pit, bats, and arrow. They all share certain properties, i.e. a location point on the game board */
function GamePiece() {
	this.name;
	this.message;
	this.x;
	this.y;
}

function GamePiece_construct(name,point,adjacentMessage,touchingMessage) {
	this.name = name;
	this.adjacentMessage = adjacentMessage;
	this.touchingMessage = touchingMessage;
	this.x = point.x;
	this.y = point.y;
	return this;
}

/* Checks to see if this game piece is in an adjacent space to the argument game piece */
function GamePiece_isAdjacent(gp) {
	if ( Math.abs(this.x - gp.x) <=1 && Math.abs(this.y - gp.y) <=1 ) {
		return true;
	} else {
		return false;
	}
}

/* Checks to see if this game piece is touching (i.e. in the same space) as the argument game piece */
function GamePiece_isTouching(gp) {
	if ( this.x == gp.x &&  this.y == gp.y ) {
		return true;
	} else {
		return false;
	}
}

/* Change the game piece's location on the board by one square, based on direction */
function GamePiece_move(dir) {
	switch(dir) {
		case "left":
			if ( this.x > 0 ) this.x--;
			break;
		case "up":
			if ( this.y > 0 ) this.y--;
			break;
		case "right":
			if ( this.x < game.board.space.length-1 ) this.x++;
			break;
		case "down":
			if ( this.y < game.board.space[0].length-1 ) this.y++;
			break;
		default:
			// do nothing
			break;
	}
}

GamePiece.prototype.construct = GamePiece_construct;
GamePiece.prototype.isAdjacent = GamePiece_isAdjacent;
GamePiece.prototype.isTouching = GamePiece_isTouching;
GamePiece.prototype.move = GamePiece_move;

// All-encompassing game object
function Game() {
	this.width; // width of board in spaces
	this.height; // height of board in spaces
	this.arrowsLeft;
	this.feedback;
	this.board;
	this.hero;
	this.pit;
	this.bats;
	this.wumpus;
}

function Game_init() {
	var defaultWidth = 5;
	var defaultHeight = 5;
	var minWidth = 2;
	var minHeight = 2;
	var maxWidth = 12;
	var maxHeight = 12;

	this.arrowsLeft = 5;
	this.feedback = new Feedback;

	if ( arguments.length == 2 ) {
		this.width = arguments[0].parseInt();
		this.height = arguments[1].parseInt();
	} else {
		this.width = defaultWidth;
		this.height = defaultHeight;
	}
	if ( this.width > maxWidth || this.height > maxHeight ) {
		alert("That's a byting off more than you can chew.");
		this.width = defaultWidth;
		this.height = defaultHeight;
	}
	if ( this.width < minWidth || this.height < minHeight ) {
		alert("Please. Let's try something more interesting.");
		this.width = defaultWidth;
		this.height = defaultHeight;
	}

	this.board = buildBoard(this.width,this.height);

	// Random space
	this.bats = new Bats(this.board.getRandomSpace());
	//highlight(myBats.x,myBats.y,"purple");
	
	// Random EMPTY space -- not the same place as bats
	this.pit = new Pit(this.board.getRandomEmptySpace());
	//highlight(myPit.x,myPit.y,"black");

	// Random space -- may be same place as bats or pit!
	this.wumpus = new Wumpus(this.board.getRandomSpace());
	//highlight(myWumpus.x,myWumpus.y,"red");

	this.extraArrow = new Arrow(this.board.getRandomEmptySpace());

	this.hero = new Hero(this.board.getRandomEmptySpace());
	
	this.board.space[this.hero.x][this.hero.y] = this.hero;
	// Call move to highlight, check adjacent
	move("standstill");

	return this;
}

function Game_updateArrows(i) {	
	this.arrowsLeft += i;
	document.getElementById("arrowsLeft").innerHTML = this.arrowsLeft;
}

function Game_win(){
	window.alert("Congrats!!You Won The Game!!")


    document.location.replace("Winner");
    //window.location = "./Result.jsp";
}

function Game_lose() {
	window.alert("Phew!!You Lost!!")
    document.location.replace("Loser");
	

//        window.location = "./game.jsp";
}

function Game_end() {
	// Hide the controls
	document.getElementById("movementControls").style.display = document.getElementById("arrowControls").style.display = "none";
}

Game.prototype.init = Game_init;
Game.prototype.win = Game_win;
Game.prototype.lose = Game_lose;
Game.prototype.end = Game_end;

Game.prototype.updateArrows = Game_updateArrows;

function GameBoard() {
	this.space;	
	//this.getRandomEmptySpace;
}

function GameBoard_construct(x,y) {
	//alert("constructing board of size " + x + "," + y);
	this.space = new Array(x);
	for ( var i = 0; i < y; i++ ) {
		this.space[i] = new Array(y);
	}
	//alert("Board size is " + this.space.length + "x" + this.space[0].length);
}


function GameBoard_getRandomPoint() {
	return { "x":Math.floor(Math.random()*this.space.length), "y":Math.floor(Math.random()*this.space[0].length) };
}

function GameBoard_getRandomSpace() {
	var point = this.getRandomPoint();
	
	this.space[point.x][point.y] = "occupied";
	return point;
}

function GameBoard_getRandomEmptySpace() {
	var point = this.getRandomPoint();
	if ( this.space[point.x][point.y] == undefined ) {
		
		this.space[point.x][point.y] = "occupied";
		return { "x":point.x, "y":point.y };
	} else {
		return this.getRandomEmptySpace();
	}
}


GameBoard.prototype.construct = GameBoard_construct;
GameBoard.prototype.getRandomPoint = GameBoard_getRandomPoint;
GameBoard.prototype.getRandomSpace = GameBoard_getRandomSpace;
GameBoard.prototype.getRandomEmptySpace = GameBoard_getRandomEmptySpace;

function Feedback() {
	if ( !document.getElementById("feedback") ) {
		//create feedback element
		var feedbackElement = document.createElement('div');
		// set ID of feedback element
		feedbackElement.id = "feedback";
		// Append feedback element to HTML body
		document.getElementsByTagName("body")[0].appendChild(feedbackElement);
	}
	this.message = document.getElementById("feedback");
	return this;
}

function Feedback_addMessage(msg) {
	this.message.innerHTML += msg + "<br>";
}

function Feedback_clear() {
	this.message.innerHTML = "";
}

Feedback.prototype.addMessage = Feedback_addMessage;
Feedback.prototype.clear = Feedback_clear;



function checkTouch() {
	var isTouchingAnythingDangerous = false;
	if ( game.hero.isTouching(game.bats) ) {
		isTouchingAnythingDangerous = true;
		// remove current highlight
		highlight(game.hero.x,game.hero.y);
		pt = game.board.getRandomSpace();
		game.hero.x = pt.x;
		game.hero.y = pt.y;
		
		move("standstill");
		game.feedback.addMessage(game.bats.touchingMessage);
	}
	if ( game.hero.isTouching(game.pit) ) {
		isTouchingAnythingDangerous = true;
		game.feedback.addMessage(game.pit.touchingMessage);
		//endGame();
		game.lose();
	}
	if ( game.hero.isTouching(game.wumpus) ) {
		isTouchingAnythingDangerous = true;
		game.feedback.addMessage(game.wumpus.touchingMessage);
		//endGame();
		game.lose();
	}
	if ( game.hero.isTouching(game.extraArrow) ) {
		game.updateArrows(1);
		// Make extra arrow "invisible" by placing it off the board
		game.extraArrow.x = -1;
		game.extraArrow.y = -1;
		game.feedback.addMessage(game.extraArrow.touchingMessage);
	}
	return isTouchingAnythingDangerous;
}


function checkAdjacent() {
	if ( game.hero.isAdjacent(game.bats) ) game.feedback.addMessage(game.bats.adjacentMessage);
	if ( game.hero.isAdjacent(game.pit) ) game.feedback.addMessage(game.pit.adjacentMessage);
	if ( game.hero.isAdjacent(game.wumpus) ) game.feedback.addMessage(game.wumpus.adjacentMessage);
}


function highlight(x,y) {
	color = "pink";
	if ( arguments.length == 3 ) 
		color = arguments[2];
	cells = document.getElementById("gameBoard").getElementsByTagName("td");
	cells[x+y*document.getElementById("gameBoard").getElementsByTagName("tr")[0].getElementsByTagName("td").length].style.backgroundColor=color;
}

function shoot(dir) {
	if ( game.arrowsLeft > 0 ) {
		game.updateArrows(-1);
		var arrow = new GamePiece;
		arrow.construct("arrow",{"x":game.hero.x,"y":game.hero.y},"","");
		arrow.move(dir);
		if ( arrow.isTouching(game.wumpus) ) {
			game.feedback.addMessage("You WIN!!!");
			game.win();
		} else {
			game.wumpus.evade(randomDirection());
			move("standstill");
			game.feedback.addMessage("Drats! Missed!");
		}
	} else {
		game.feedback.addMessage("Out of arrows!");	
	}

}

function move(dir) {
	// remove current highlight
	highlight(game.hero.x,game.hero.y);
	// Clear feedback panel
	game.feedback.clear();
	// Move the hero
	game.hero.move(dir);
	// Updated feedback with current position
	game.feedback.addMessage("You are at " + game.hero.x + "," + game.hero.y);
	// add current highlight
	highlight(game.hero.x,game.hero.y,"red");
	// Check to see if the hero is touching anything
	if ( !checkTouch() ) {
		// otherwise, check if it is next to anything
		checkAdjacent();
	}
}

function randomDirection() {
	var dir;
	var x = Math.ceil(Math.random()*5);
	switch (x) {
		case 1:
			dir = "up";
			break;
		case 2:
			dir = "right";
			break;
		case 3:
			dir = "down";
			break;
		case 4:
			dir = "left";
			break;
		defaultcase:
			dir = "standstill";
			break;
	}
	return dir;
}


function buildBoard(x,y) {
	var boardHTML = '<table id="board">';
	for ( var i = 0; i < x; i++ ) {
		boardHTML += '<tr id="' + x + '">';
			for ( var j = 0; j < y; j++ ) {
				boardHTML += '<td></td>';
			}
		boardHTML += '</tr>';
	}
	
	boardHTML += '</table>';
	document.getElementById("gameBoard").innerHTML = boardHTML;	
		
	var myBoard = new GameBoard();
	myBoard.construct(x,y);
	
	return myBoard;
}