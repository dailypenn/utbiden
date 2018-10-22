var context, controller, joe, score, lives, items, item, loop;
var maxVelocity = 10; // velocity of background image
var targetFPS = 33;
var backgroundImageX = 0;
var canvasHeight;
var canvasWidth;

// preload image variables
backgroundImage = new Image();
backgroundImage.src = 'assets/images/locustwalk.jpg';
joeImage = new Image();
joeImage.src = 'assets/images/joe+scooter.png';
coneImage = new Image();
coneImage.src = 'assets/images/icecream.png';
squirrelImage = new Image();
squirrelImage.src = 'assets/images/squirrel.jpg';


function init() {
  context = document.querySelector("canvas").getContext("2d");

  context.canvas.height = 500;
  context.canvas.width = 1400;
  canvasHeight = context.canvas.height;
  canvasWidth = context.canvas.width;

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
      if (event.keyCode === 38) controller.up = key_state;
    }
  };

  items = [
    {
      type: 'cone',
      x:1000,
      y:canvasHeight - 180,
      height:60,
      width:30,
      image: coneImage
    },
    {
      type: 'squirrel',
      x:1000,
      y:canvasHeight - 180,
      height:60,
      width:30,
      image: squirrelImage
    }
  ];

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

  // draw joe on scooter
  context.drawImage(joe.image, joe.x, joe.y, joe.width, joe.height);

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

function spawnItem() {
  item = items[Math.floor(Math.random()*items.length)];
  console.log('spawned: ' + item.type);
  context.drawImage(item.image, item.x, item.y, item.width, item.height);
}

function update() {
  var spawnedItem = false;
  var rand = Math.random()*10;
  if (rand > 7) {
    spawnItem();
    spawnedItem = true;
  }
  // incrementally change image position of background to scroll left
  backgroundImageX -= maxVelocity;
  if (backgroundImageX < -canvasWidth) {
    backgroundImageX += canvasWidth;
  }

  // move items across screen
  if (spawnedItem) {
    item.x -= maxVelocity;
  }

  // if joe eats ice cream increment score, otherwise lose a life
  if (spawnedItem && hasCollided()) {
    if (item.type === 'cone') {
      incrementScore();
    } else {
      decrementLives();
    }
  }

  if (controller.up && joe.jumping === false) {
    joe.y_velocity -= 30;
    joe.jumping = true;
  }

  joe.y_velocity += 2;// gravity
  joe.y += joe.y_velocity;
  joe.y_velocity *= 0.98;// friction

  // detect collision between joe and ground
  if (joe.y > 250) {
    joe.jumping = false;
    joe.y = 250;
    joe.y_velocity = 0;
  }
}

function hasCollided() {
  var xdiff = item.x - joe.x;
  //var ydiff = Math.abs(cone.y - joeBody.y);
  return (xdiff <= 10 && xdiff >= 0) ? true : false;
}

init();

setInterval(function() {
    update();
    draw();
}, 1000 / targetFPS);

window.addEventListener("keydown", controller.keyListener);
window.addEventListener("keyup", controller.keyListener);
