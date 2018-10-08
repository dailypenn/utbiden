var context, controller, joeBody, score, lives, cone, groundObj, skyObj, loop;
var maxVelocity = 8; // velocity of background image
var targetFPS = 33;
var backgroundImageX = 0;
var canvasHeight;
var canvasWidth;
backgroundImage = new Image();
backgroundImage.src = 'assets/images/locustwalk.jpg';
joeBodyImage = new Image();
joeBodyImage.src = 'assets/images/biden+scooter.png';
coneImage = new Image();
coneImage.src = 'assets/images/icecream.png';

function init() {
  context = document.querySelector("canvas").getContext("2d");

  context.canvas.height = 500;
  context.canvas.width = 1400;
  canvasHeight = context.canvas.height;
  canvasWidth = context.canvas.width;

  joeBody = {
    height:150,
    jumping:true,
    width:100,
    x:100, // starting point
    x_velocity:0,
    y:0,
    y_velocity:0
  };

  controller = {
    up:false,
    keyListener:function(event) {
      var key_state = (event.type == "keydown") ? true : false;
      if (event.keyCode === 38) controller.up = key_state;
    }
  };

  cone = {
    x:1000,
    y:canvasHeight - 180,
    height:60,
    width:30
  }

  groundObj = {
    x:1000,
    y:canvasHeight - 180
  }

  skyObj = {
    x:1000,
    y:10
  }

  score = 0;
  lives = 3;
}

function draw() {
  //  draw background image
  context.globalAlpha = 1;
  context.globalCompositeOperation = 'source-over';
  // draw twice to cover wrap around
  context.drawImage(backgroundImage, backgroundImageX, 0, canvasWidth, canvasHeight);
  context.drawImage(backgroundImage, backgroundImageX + canvasWidth, 0, canvasWidth, canvasHeight);
  context.fillStyle = "rgba(255,255,255,0.1)";
  context.fillRect(0, 0, canvasWidth, canvasHeight);

  // draw scooter
  context.drawImage(joeBodyImage, joeBody.x, joeBody.y, joeBody.width, joeBody.height);

  // draw an ice cream cone
  context.drawImage(coneImage, cone.x, cone.y, cone.width, cone.height);

  var scoreElement = document.getElementById('score');
  scoreElement.innerHTML = 'Score: ' + score;

  var livesElement = document.getElementById('lives');
  livesElement.innerHTML = 'Lives: ' + lives;
}

function incrementScore() {
  score++;
  var scoreElement = document.getElementById('score');
  scoreElement.innerHTML = 'Score: ' + score;
}

function decrementLives() {
  lives--;
  // if lives = 0 end game
  if (lives === 0) {

  }
  var livesElement = document.getElementById('lives');
  livesElement.innerHTML = 'Lives: ' + lives;
}

function update() {
  // incrementally change image position of background to scroll left
  backgroundImageX -= maxVelocity;
  if (backgroundImageX < -canvasWidth) {
    backgroundImageX += canvasWidth;
  }

  // keep array that holds all sky and ground objects
  // pick an element through random index and spawn across screen

  // move random objects across screen
  cone.x -= maxVelocity;

  //console.log('joes x position: ' + joeBody.x);
  //console.log('cones x position: ' + cone.x);

  // if joe eats ice cream increment score
  if (isCone() === true) {
    console.log('has collided');
    incrementScore();
  } else if (isObject() === true) { // if joe hits object lose a life
    decrementLives();
  }

  if (controller.up && joeBody.jumping == false) {
    joeBody.y_velocity -= 30;
    joeBody.jumping = true;
  }

  joeBody.y_velocity += 2;// gravity
  joeBody.x += joeBody.x_velocity;
  joeBody.y += joeBody.y_velocity;
  joeBody.y_velocity *= 0.98;// friction

  // detect collision between joe and ground
  if (joeBody.y > 300) {
    joeBody.jumping = false;
    joeBody.y = 300;
    joeBody.y_velocity = 0;
  }
}

function isCone() {
  var xdiff = cone.x - joeBody.x;
  //var ydiff = Math.abs(cone.y - joeBody.y);
  return (xdiff <= 10 && xdiff >= 0) ? true : false;
}

function isObject() {
  return (joeBody.x === groundObj.x && joeBody.y === groundObj.y) ||
    (joeBody.x === skyObj.x && joeBody.x === skyObj.y) ? true : false;
}

init();

setInterval(function() {
    update();
    draw();
}, 1000 / targetFPS);

window.addEventListener("keydown", controller.keyListener);
window.addEventListener("keyup", controller.keyListener);
