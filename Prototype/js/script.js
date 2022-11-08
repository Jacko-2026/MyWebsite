var CELL_SIZE = 20;

var GRID = [
	[1, 1, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 1, 1],
	[1, 1, 0, 1, 1, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1, 1],
	[0, 1, 1, 1, 1, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1, 1],
	[0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 0],
	[0, 0, 0, 0, 1, 1, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0],
	[0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1, 0, 0],
	[0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
	[0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
	[0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	[0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1],
	[0, 1, 0, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1],
	[0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1],
	[0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1]
];

var SCREEN_WIDTH = GRID[0].length*CELL_SIZE;
var SCREEN_HEIGHT = GRID.length*CELL_SIZE;

function Game(cellSize, screen_width, screen_height){
	this.cellSize = cellSize;
	this.screen_width = screen_width;
	this.screen_height = screen_height;
	this.cellsHorizontal = screen_width/cellSize;
	this.cellsVertical = screen_height/cellSize;
	this.undoBuffer = []
	
	this.paint = true;
		
	this.grid = this.buildGrid();
	this.finalGrid = GRID;
	this.linesFilled = this.analyzeBoardLines();
	this.columnsFilled = this.analyzeBoardColumns();
}

Game.prototype.buildGrid = function(){
	var grid = [];
	
	for(var i = 0; i < this.cellsVertical; i++){
		var line = [];
		for(var j = 0; j < this.cellsHorizontal; j++){
			line.push(0);
		}
		grid.push(line);
	}
	
	return grid;
}

Game.prototype.analyzeBoardLines = function(){
	var filledTiles = [];
	
	for(var i = 0; i < this.finalGrid.length; i++){
		var counts = [];
		var count = 0;
		for(var j = 0; j < this.finalGrid[i].length; j++){
			if(this.finalGrid[i][j] == 1){
				count++;
				if(j == this.finalGrid[i].length-1){
					counts.push(count);
				}
			}else if(count != 0){
				counts.push(count);
				count = 0;
			}
		}
		filledTiles.push(counts);
	}
	
	return filledTiles;
}

Game.prototype.analyzeBoardColumns = function(){
	var filledTiles = [];
	
	var grid = this.transpose(this.finalGrid);
	
	for(var i = 0; i < grid.length; i++){
		var counts = [];
		var count = 0;
		for(var j = 0; j < grid[i].length; j++){
			if(grid[i][j] == 1){
				count++;
				if(j == grid[i].length-1){
					counts.push(count);
				}
			}else if(count != 0){
				counts.push(count);
				count = 0;
			}
		}
		filledTiles.push(counts);
	}
	
	return filledTiles;
}

Game.prototype.transpose = function(matrix){
	var grid = [];
	for(var i = 0; i < matrix[0].length; i++){
		var aux = [];
		for(var j = 0; j < matrix.length; j++){
			aux.push(matrix[j][i]);
		}
		grid.push(aux);
	}
	return grid;
}

Game.prototype.alreadyClicked = function(row, col){
	switch(this.clickAction){
		case "ERASE":
			return this.grid[row][col] == 0;
		case "PAINT":
			return this.grid[row][col] == 1;
		case "BLOCK":
			return this.grid[row][col] == 2;
	}
}

Game.prototype.click = function(x, y){
	col = Math.floor(x/this.cellSize);
	row = Math.floor(y/this.cellSize);
	if(this.isValidLocation(x, y) && !this.alreadyClicked(row, col)){
		
		this.undoBuffer.push([[x,y], this.grid[row][col]]);
		
		switch(this.clickAction){
			case "ERASE":
				this.grid[row][col] = 0;
				break;
			case "PAINT":
				this.grid[row][col] = 1;
				break;
			case "BLOCK":
				this.grid[row][col] = 2;
				break;
		}	
	}
}

Game.prototype.isValidLocation = function(x, y){
	return (x >= 0 && x < SCREEN_WIDTH && y >=0 && y < SCREEN_HEIGHT);
}

Game.prototype.drawLine = function(startx, starty, endx, endy, color, line_width){
	context.strokeStyle = color;
	context.lineWidth = line_width;
	context.beginPath();
	context.moveTo(startx, starty);
	context.lineTo(endx, endy);
	context.stroke();
}

Game.prototype.render = function(){
	context.fillStyle = "#cccccc";
	context.fillRect(0, 0, this.screen_width, this.screen_height);
	
	context.fillStyle = "black";
	for(var i = 0; i < this.grid.length; i++){
		for(var j = 0; j < this.grid[i].length; j++){
			// Draw marks
			if(this.grid[i][j] == 1){
				context.fillStyle = "black";
				context.fillRect(this.cellSize*j, this.cellSize*i, this.cellSize, this.cellSize);	
			}else if(!this.gridComplete()){
				// Draw blocks
				if(this.grid[i][j] == 2){
					this.drawLine(this.cellSize*j, this.cellSize*i, this.cellSize*(j+1), this.cellSize*(i+1), "gray", 2);
					this.drawLine(this.cellSize*(j+1), this.cellSize*i, this.cellSize*j, this.cellSize*(i+1), "gray", 2);
				}
			}
		}
	}
	
	// Draw grid lines
	if(!this.gridComplete()){
		for(var i = 0; i < this.grid.length; i++){
			this.drawLine(0, i*this.cellSize, SCREEN_WIDTH, i*this.cellSize, "#1F1F1F", 1);
			if(i % 5 == 0){
				this.drawLine(0, i*this.cellSize, SCREEN_WIDTH, i*this.cellSize, "#1F1F1F", 3);
			}
		}
		
		for(var i = 0; i < this.grid[0].length; i++){
			this.drawLine(i*this.cellSize, 0, i*this.cellSize, SCREEN_HEIGHT, "#1F1F1F", 1);
			if(i % 5 == 0){
				this.drawLine(i*this.cellSize, 0, i*this.cellSize, SCREEN_HEIGHT, "#1F1F1F", 3);
			}
		}
	}
	
	// Draw hints
	context.font = "15px helvetica";
	context.fillStyle = "white";
	
	// Line hints
	for(var i = 0; i < this.linesFilled.length; i++){
		var hint = "| "
		for(var j = 0; j < this.linesFilled[i].length; j++){
			hint += this.linesFilled[i][j] + " | ";
		}
		if(hint == "| "){
			hint = "| 0 |";
		}
		context.fillText(hint, SCREEN_WIDTH+10, this.cellSize*(i+1)-7);
	}
	
	// Column hints
	var hint = ""
	for(var i = 0; i < this.grid[0].length; i++){
		hint += "----";
	}
	context.fillText(hint, 0, SCREEN_HEIGHT+10);
	
	for(var i = 0; i < this.columnsFilled.length; i++){
		for(var j = 0; j < this.columnsFilled[i].length; j++){
			hint = this.columnsFilled[i][j];
			if(hint == ""){
				hint = 0;
			}
			context.fillText(hint, this.cellSize*i+5, SCREEN_HEIGHT+this.cellSize*(j+1)+7);
		}
	}
}

Game.prototype.tileAt = function(x, y){
	var col = Math.floor(x/this.cellSize);
	var row = Math.floor(y/this.cellSize);
	
	return this.grid[row][col];
}

Game.prototype.undo = function(){
	if(this.undoBuffer.length == 0){
		return;
	}
	var action = this.undoBuffer.pop();
	var x = action[0][0];
	var y = action[0][1];
	var prevState = action[1];
	
	var col = Math.floor(x/this.cellSize);
	var row = Math.floor(y/this.cellSize);
	
	this.grid[row][col] = prevState;
}

Game.prototype.setClickAction = function(x, y){
	switch(this.tileAt(x, y)){
		case 0:
			this.clickAction = "PAINT";
			break;
		case 1:
			this.clickAction = "BLOCK";
			break;
		case 2:
			this.clickAction = "ERASE";
			break;
	}
}

Game.prototype.gridComplete = function(){
	for(var i = 0; i < this.grid.length; i++){
		for(var j = 0; j < this.grid[i].length; j++){
			if(this.grid[i][j] != 2 && this.grid[i][j] != this.finalGrid[i][j]){
				return false;
			}
		}
	}
	return true;
}

Game.prototype.update = function(){
}

canvas = document.getElementById("canvas");
context = canvas.getContext("2d");
canvas.width = SCREEN_WIDTH+800;
canvas.height = SCREEN_HEIGHT+600;

(function(){
	var game = new Game(CELL_SIZE, SCREEN_WIDTH, SCREEN_HEIGHT);
	
	var mousePressed = false;
	
	function mouseDown(e){
		mousePressed = true;
		game.setClickAction(e.x, e.y);
	}
	
	function mouseDrag(e){
		if(mousePressed){
			game.click(e.x, e.y);
		}
	}
	
	function mouseUp(e){
		mousePressed = false;
		game.click(e.x, e.y);
	}
	
	keys = {
		z: false,
		ctrl: false
	};
	
	function keyDown(e){
		if (event.keyCode == 90) {
			keys["z"] = true;
		} else if (event.keyCode == 17) {
			keys["ctrl"] = true;
		}

		if(keys["z"] && keys["ctrl"]){
			game.undo();	
		}
	}
	
	function keyUp(e){
		if (event.keyCode == 90) {
			keys["z"] = false;
		} else if (event.keyCode == 17) {
			keys["ctrl"] = false;
		}
	}
	
	document.addEventListener('mousedown', mouseDown, false);
	document.addEventListener('mousemove', mouseDrag, false);
	document.addEventListener('mouseup', mouseUp, false);
	document.addEventListener('keydown', keyDown, false);
	document.addEventListener('keyup', keyUp, false);
	
	setInterval(
        function(){
			game.update();
			game.render();
			
			
			//if(this.game.gridComplete()){
			//	console.log("GRID COMPLETE :D");
			//	return;
			//}
    }, 100)
})();