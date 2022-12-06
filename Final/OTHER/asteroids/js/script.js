var canvas = document.getElementById('game');
var ctx = canvas.getContext('2d');

var players = [];
var enemies = [];
var lasers = [];
var ui = [];
var allSprites = [players, enemies, lasers, ui];

var leftPressed = false;
var rightPressed = false;
var upPressed = false;
var spacePressed = false;
var timeLastShot = 0;
var spawnTime;

document.addEventListener('keydown', keyDownHandler);
document.addEventListener('keyup', keyUpHandler);

function keyDownHandler(e) {
  if (e.keyCode == 37) {
    leftPressed = true;
  } else if (e.keyCode == 39) {
    rightPressed = true;
  } else if (e.keyCode == 38) {
    upPressed = true;
  } else if (e.keyCode == 32) {
    spacePressed = true;
  }
}

function keyUpHandler(e) {
  if (e.keyCode == 37) {
    leftPressed = false;
  } else if (e.keyCode == 39) {
    rightPressed = false;
  } else if (e.keyCode == 38) {
    upPressed = false;
  } else if (e.keyCode == 32) {
    spacePressed = false;
  }
}

function moveInDirection(position, angle, distance) {
  var newX, newY;
  newX = position.x + (distance * Math.sin(degToRad(angle)));
  newY = position.y + (-distance * Math.cos(degToRad(angle)));
  return {x: newX, y: newY};
}

function accelerate(sprite, direction, amount) {
  var vx = sprite.velocity.x;
  var vy = sprite.velocity.y;
  var dx = amount * Math.sin(degToRad(direction));
  var dy = -amount * Math.cos(degToRad(direction));
  sprite.velocity.x = vx + dx;
  sprite.velocity.y = vy + dy;
}

function degToRad(degrees) {
  var radians = (Math.PI/180) * degrees;
  return radians;
}

function addSprite(sprite, array) {
  array.push(sprite);
  return sprite;
}

function removeSprite(sprite, array) {
  array.splice(array.indexOf(sprite), 1);
}

function boxCollision(sprite1, sprite2) {
  if (!sprite1 || !sprite2) {
    return;
  }
  var box1 = sprite1.box;
  var box2 = sprite2.box;
  if (box1.x < box2.x + box2.w &&
      box1.x + box1.w > box2.x &&
      box1.y < box2.y + box2.h &&
      box1.h + box1.y > box2.y) {
    return true;
  }
  return false;
}

function wrapAround(sprite) {
  if (sprite.position.x < 0) {
    sprite.position.x = 400;
  } else if (sprite.position.x > 400) {
    sprite.position.x = 0;
  }
  if (sprite.position.y < 0) {
    sprite.position.y = 300;
  } else if (sprite.position.y > 300) {
    sprite.position.y = 0;
  }
}

var Ship = function() {
  this.position = {
    x: 200,
    y: 150
  };
  this.velocity = {
    x: 0,
    y: 0
  };
  this.rotation = 10;
  this.box = {
    x: this.position.x - 5,
    y: this.position.y - 5,
    w: 10,
    h: 10
  };
  this.frameCounter = 0; // used for blinking animation
  this.draw = function() {
    var now = performance.now();
    var timeElapsed = now - spawnTime;
    this.frameCounter++;
    if (timeElapsed < 3000 && this.frameCounter % 10 < 5) {
      // don't draw every other 5 frames to create blinking effect
      return;
    };
    var x = this.position.x;
    var y = this.position.y;
    var r = this.rotation;
    ctx.translate(x, y);
    ctx.rotate(degToRad(r));
    ctx.beginPath();
    ctx.moveTo(0, -10);
    ctx.lineTo(-5, 10);
    ctx.lineTo(5, 10);
    ctx.closePath();
    ctx.stroke();
    ctx.rotate(degToRad(-r));
    ctx.translate(-x, -y);
  };
  this.update = function() {
    var now = performance.now();
    var timeElapsed = now - spawnTime;

    /* Check for collisions with enemies */
    for (var i=0; i<enemies.length; i++) {
      if (boxCollision(this, enemies[i]) && timeElapsed > 3000) {
        removeSprite(this, players);
        addSprite(new gameOverText(), ui);
      }
    }

    if (leftPressed) {
      this.rotation -= 8;
    }
    if (rightPressed) {
      this.rotation += 8;
    }
    if (upPressed) {
      accelerate(this, this.rotation, 0.08);
    }
    if (spacePressed) {
      if (now - timeLastShot > 200) {
        var laser = new Laser();
        laser.position = this.position;
        laser.direction = this.rotation;
        addSprite(laser, lasers);
        timeLastShot = now;
      }
    }

    /* move */
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;

    /* apply drag */
    this.velocity.x /= 1.01;
    this.velocity.y /= 1.01;

    wrapAround(this);
    this.box.x = this.position.x - 5;
    this.box.y = this.position.y - 5;
  };
}

var Enemy = function() {
  this.position = {
    x: Math.random() * 400,
    y: Math.random() * 300
  };
  this.size = (20 * Math.random()) + 25;
  this.direction = Math.random() * 360;
  this.speed = Math.random() + 0.5;
  this.box = {
    x: this.position.x,
    y: this.position.y,
    w: this.size,
    h: this.size
  };
  this.draw = function() {
    var x = this.position.x;
    var y = this.position.y;
    ctx.translate(x, y);
    ctx.beginPath();
    ctx.rect(0, 0, this.size, this.size);
    ctx.stroke()
    ctx.translate(-x, -y);
  };
  this.update = function() {
    this.position = moveInDirection(this.position, this.direction, this.speed);
    wrapAround(this);
    this.box.x = this.position.x;
    this.box.y = this.position.y;
  };
}

var Laser = function() {
  this.position = {
    x: 0,
    y: 0
  };
  this.direction = 0;
  this.box = {
    x: this.position.x,
    y: this.position.y,
    w: 2,
    h: 2
  };
  this.draw = function() {
    var x =  this.position.x;
    var y = this.position.y;
    ctx.translate(x, y);
    ctx.beginPath();
    ctx.rect(0, 0, 2, 2);
    ctx.fill();
    ctx.translate(-x, -y);
  };
  this.update = function() {
    /* Delete this sprite when it goes off screen */
    if (this.position.y > 300 ||
        this.position.y < 0 ||
        this.position.x > 400 ||
        this.position.x < 0) {
      removeSprite(this, lasers);
    }
    /* Detect collisions with enemies */
    for (var i=0; i<enemies.length; i++) {
      if (boxCollision(this, enemies[i])) {
        if (enemies[i].size > 20) {
          /* 'Break' enemy into pieces */
          for (var j=0; j<4; j++) {
            var newEnemy = addSprite(new Enemy(), enemies);
            newEnemy.position.x = enemies[i].position.x;
            newEnemy.position.y = enemies[i].position.y;
            newEnemy.direction = (Math.random() * 90) + (90 * j);
            newEnemy.size = 15;
            newEnemy.box.h = 15;
            newEnemy.box.w = 15;
            newEnemy.speed = 0.7;
          }
        }
        removeSprite(enemies[i], enemies);
        removeSprite(this, lasers);
      }
    }
    this.position = moveInDirection(this.position, this.direction, 5);
    this.box.x = this.position.x;
    this.box.y = this.position.y;
  };
}

var gameOverText = function() {
  this.position = {
    x: 200,
    y: 150
  };
  this.draw = function() {
    var x = this.position.x;
    var y = this.position.y
    ctx.font = "16px monospace";
    ctx.textAlign = "center";
    ctx.fillText("GAME OVER", x, y);
  };
  this.update = function() {
  };
}

function startGame() {
  spawnTime = performance.now();
  addSprite(new Ship(), players);
  for (var i=0; i<4; i++) {
    addSprite(new Enemy(), enemies);
  }
  main();
}

function update() {
   for (var i=0; i<allSprites.length; i++) {
     var spriteCategory = allSprites[i];
     for (var j=0; j<spriteCategory.length; j++) {
       spriteCategory[j].update();
     }
  }
}

function render() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
   for (var i=0; i<allSprites.length; i++) {
     var spriteCategory = allSprites[i];
     for (var j=0; j<spriteCategory.length; j++) {
       spriteCategory[j].draw();
     }
  }
}

var main = function() {
  window.requestAnimationFrame(main); // Creates a callback loop
  update();
  render();
}

startGame();
