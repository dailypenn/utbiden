var canvas, ctx, controller, joe, items;
var maxVelocity = 10; // velocity of background image
var targetFPS = 33;
var backgroundImageX = 0;
var canvasHeight;
var canvasWidth;
var scooterSound;
var pauseLoop;
var bounce = true;
var pauseStart = false;
var buttonX;
var buttonY;
var buttonW;
var buttonH;
var currentButton;

// load images
backgroundImage = new Image();
backgroundImage.src = 'assets/images/locustwalk.jpg';
joeImage = new Image();
joeImage.src = 'assets/images/joe+scooter.png';
coneImage = new Image();
coneImage.src = 'assets/images/icecream.png';
squirrelImage = new Image();
squirrelImage.src = 'assets/images/squirrel.jpg';
startButton = new Image();
startButton.src = 'assets/images/start-button.png';


// load sounds
themeSound = document.createElement("audio");
themeSound.src = "assets/sounds/themesong.wav";
scooterSound = document.createElement("audio");
scooterSound.src = "assets/sounds/scooter.wav";
collectSound = document.createElement("audio");
collectSound.src = "assets/sounds/collect.wav";
bounceSound = document.createElement("audio");
bounceSound.src = "assets/sounds/bounce.wav";

// get reference to the canvas and its context
canvas = document.getElementById("canvas");
ctx = canvas.getContext("2d");
ctx.canvas.height = 500;
ctx.canvas.width = 1400;
canvasHeight = ctx.canvas.height;
canvasWidth = ctx.canvas.width;

canvas.addEventListener('click', function(event) {
  // Control that click event occurred within position of button
  // NOTE: This assumes canvas element is positioned at top left corner
  if (
    event.x > buttonX &&
    event.x < buttonX + buttonW &&
    event.y > buttonY &&
    event.y < buttonY + buttonH
  ) {
    // button logic
    if (currentButton === 'pauseButton') {
      pauseLoop = true;
      currentButton = 'resumeButton';
    } else if (currentButton === 'resumeButton') {
      pauseLoop = false;
      currentButton = 'pauseButton';
      gameLoop();
    } else if (currentButton === 'playAgain') {
      // reset lives and score variables
      lives = 3;
      score = 0;
      startGame();
    }
  }
});

if (!pauseStart) {
  runBackground();
}

var objects = [];
var score = 0;
var lives = 3;

joe = {
  width:150,
  height:200,
  x:100,
  y:0,
  x_velocity:0,
  y_velocity:0,
  jumping:true,
  image:joeImage
};

controller = {
  up:false,
  keyListener:function(event) {
    var key_state = (event.type == "keydown") ? true : false;
    if (event.keyCode === 38) {
      controller.up = key_state;
    }
  }
};

document.body.onkeyup = function(e){
    if(e.keyCode == 32){
        pauseGame();
    }
}

items = [
  {
    type: 'cone',
    x:canvasWidth,
    y:canvasHeight - 180,
    height:60,
    width:40,
    image: coneImage
  },
  {
    type: 'squirrel',
    x:canvasWidth,
    y:canvasHeight - 180,
    height:60,
    width:40,
    image: squirrelImage
  }
];

window.addEventListener("keydown", controller.keyListener);
window.addEventListener("keyup", controller.keyListener);

function spawnRandomObject() {
  var item = items[Math.floor(Math.random()*items.length)];
  var itemClone = {
    type:item.type,
    x:item.x,
    y:item.y,
    height:item.height,
    width:item.width,
    image:item.image
  }
  objects.push(itemClone);
}

function drawBackground() {
  ctx.globalAlpha = 1;
  ctx.globalCompositeOperation = 'source-over';
  // draw twice to cover wrap around
  ctx.drawImage(backgroundImage, backgroundImageX, 0, canvasWidth, canvasHeight);
  ctx.drawImage(backgroundImage, backgroundImageX + canvasWidth, 0, canvasWidth, canvasHeight);
  ctx.fillStyle = "rgba(255,255,255,0.1)";
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);
}

function drawJoeBiden() {
  ctx.drawImage(joe.image, joe.x, joe.y, joe.width, joe.height);
}

function drawStartButton() {
  // button size
  buttonX = 550;
  buttonY = 200;
  buttonW = 250;
  buttonH = 115;

  ctx.drawImage(startButton, buttonX, buttonY, 250, 115);
}

function drawPlayAgainButton() {
  // button size
  buttonX = 550;
  buttonY = 200;
  buttonW = 250;
  buttonH = 115;

  ctx.drawImage(startButton, buttonX, buttonY, 250, 115);
}

function removeItem(item) {
  for (var i = 0; i < objects.length; i++) {
    var object = objects[i];
    if (object === item) {
      objects.splice(i, 1);
      break;
    }
  }
}

function runBackground() {
  if (pauseStart) {
    return;
  }
  // continually loop background image
  backgroundImageX -= maxVelocity; // speed of moving background
  if (backgroundImageX < -canvasWidth) {
    backgroundImageX += canvasWidth;
  }
  requestAnimationFrame(runBackground);

  ctx.clearRect(0,0,canvas.width,canvas.height);
  drawBackground();
  drawStartButton();
  currentButton = 'startButton';
}

var v_increase = 0;
function gameLoop() {
  v_increase++;
  if (v_increase > 200 && v_increase % 200 === 0) {
    maxVelocity += 0.1;
  }
  if (pauseLoop) {
    return;
  }
  // randomly spawn objects
  var randomTime = Math.random()*10;
  if (randomTime > 9.9) {
    spawnRandomObject();
  }

  // continually loop background image
  backgroundImageX -= maxVelocity; // speed of moving background
  if (backgroundImageX < -canvasWidth) {
    backgroundImageX += canvasWidth;
  }

  // request another animation frame
  requestAnimationFrame(gameLoop);

  ctx.clearRect(0,0,canvas.width,canvas.height);
  drawBackground();
  drawJoeBiden();

  // draw score and lives
  ctx.fillStyle = "white";
  ctx.font = "bold 30px Arial";
  ctx.fillText("Score: " + score + "   " + "Lives: " + lives,
  (canvas.width / 2) - 650, (canvas.height / 2) - 200);

  if (controller.up && joe.jumping === false) {
    joe.y_velocity -= 30;
    joe.jumping = true;
    bounce = true;
  }

  joe.y_velocity += 1.5;// gravity
  joe.y += joe.y_velocity;
  joe.y_velocity *= 0.98;// friction

  // detect collision between joe and ground
  if (joe.y > 250) {
    joe.jumping = false;
    joe.y = 250;
    joe.y_velocity = 0;
    if (bounce) {
      joe.y_velocity -= 5; // bounce intensity
      joe.jumping = true;
      bounce = false;
      bounceSound.play();
    }
  }

  // move each object down the canvas
  for (var i = 0; i < objects.length; i++) {
    var object = objects[i];
    object.x -= maxVelocity;
    ctx.drawImage(object.image, object.x, object.y, object.width, object.height);

    // check for collisions, set collision radii
    if (object.x - joe.x <= 90 && object.x - joe.x > 0 &&
      Math.abs(object.y - joe.y) <= 220) {
        if (object.type === 'cone') {
          collectSound.play();
          incrementScore();
        } else if (object.type === 'squirrel') {
          decrementLives();
        }
        object.image = ''; // clear image after colliding
        removeItem(object);
      }

      if (object.x < 0) {
        removeItem(object);
      }
    }
  }

  function incrementScore() {
    score++;
  }

  function decrementLives() {
    lives--;
    if (lives === 0) { // end game
      pauseLoop = true;
      gameOver();
    }
  }

  function startGame() {
    themeSound.play();
    themeSound.loop = true;
    scooterSound.play();
    scooterSound.loop = true;
    pauseLoop = false;
    currentButton = 'pauseButton';
    pauseStart = true;
    gameLoop();
  }

  function pauseGame() {
    pauseLoop = true; 
  }

  function gameOver() {
    scooterSound.pause();
    // darken background image by applying black overlay
    ctx.beginPath();
    ctx.rect(0, 0, canvasWidth, canvasHeight);
    ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
    ctx.fill();

    ctx.fillStyle = "white";
    ctx.font = "bold 30px Arial";
    ctx.fillText("Game Over!" + " " + "Your High Score Is: " + score,
    (canvas.width / 2 - 250), (canvas.height / 2));

    drawPlayAgainButton();
    currentButton = 'playAgain';
  }
