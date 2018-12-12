var canvas, ctx, canvasHeight, canvasWidth, controller, joe, pauseLoop, badItems;
var maxVelocity = 12; // velocity of background image
var targetFPS = 33;
var backgroundImageX = 0;
var bounce = true;
var pauseStart = false;
var buttonX, buttonY, buttonW, buttonH;
var currentButton = 'startGame';
var objects = [];
var score = 0;
var lives = 3;
var v_increase = 0;

// add jump button for mobile users
if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
  document.getElementById('jump').style.display = 'block';
}

// load images
backgroundImage = new Image();
backgroundImage.src = 'assets/images/locust.jpg';
joeImage = new Image();
joeImage.src = 'assets/images/joe-scooter.png';
coneImage = new Image();
coneImage.src = 'assets/images/ice-cream-cone.png';
squirrelImage = new Image();
squirrelImage.src = 'assets/images/squirrel.png';
newsImage = new Image();
newsImage.src = 'assets/images/dp-newsstand.png';
startButton = new Image();
startButton.src = 'assets/images/start-button.png';
flyerImage = new Image();
flyerImage.src = 'assets/images/flyering-dude.png';

// load sounds and adjust speed/volume
themeSound = document.createElement('audio');
themeSound.src = 'assets/sounds/themesong.mp3';
scooterSound = document.createElement('audio');
scooterSound.src = 'assets/sounds/scooter_roll.mp3';
scooterSound.volume = 0.2;
iceCreamSound = document.createElement('audio');
iceCreamSound.src = 'assets/sounds/ice_cream_slurp.mp3';
iceCreamSound.playbackRate = 2.0;
bounceSound = document.createElement('audio');
bounceSound.src = 'assets/sounds/scooter_land.mp3';
bounceSound.playbackRate = 2.0;
dpSound = document.createElement('audio');
dpSound.src = 'assets/sounds/collectdp.mp3';
dpSound.volume = 0.5;
squirrelSound = document.createElement('audio');
squirrelSound.src = 'assets/sounds/squirrel_yelp.mp3';
squirrelSound.playbackRate = 2.0;
flyerSound = document.createElement('audio');
flyerSound.src = 'assets/sounds/flyer_man.mp3';
flyerSound.playbackRate = 2.0;
sounds = [themeSound, scooterSound, iceCreamSound, bounceSound, dpSound, squirrelSound, flyerSound];

// get reference to the canvas and its context
canvas = document.getElementById('canvas');
ctx = canvas.getContext('2d');
ctx.canvas.height = 550;
ctx.canvas.width = 1400;
canvasHeight = ctx.canvas.height;
canvasWidth = ctx.canvas.width;

if (!pauseStart) {
  runBackground();
}

joe = {
  width: 150,
  height: 200,
  x: 100,
  y: 0,
  x_velocity: 0,
  y_velocity: 0,
  jumping: true,
  image: joeImage
};

controller = {
  up: false,
  keyListener: (e) => {
    var key_state = e.type == 'keydown' ? true : false;
    var start = 0;
    if (e.keyCode === 38) {
      e.preventDefault();
      controller.up = key_state;
    }
  }
};

badItems = [
  {
    type: 'squirrel',
    x:canvasWidth,
    y:canvasHeight - 150,
    height:67,
    width:67,
    image: squirrelImage
  },
  {
    type: 'flyer',
    x: canvasWidth,
    y: canvasHeight - 230,
    height: 220,
    width: 170,
    image: flyerImage
  }
];

window.addEventListener('keydown', controller.keyListener);
window.addEventListener('keyup', controller.keyListener);

function playAllSounds() {
  if (themeSound.classList.contains('muted')) return;
  themeSound.play();
  themeSound.loop = true;
  scooterSound.play();
  scooterSound.loop = true;
}

function pauseAllSounds() {
  themeSound.pause();
  themeSound.loop = false;
  scooterSound.pause();
  scooterSound.loop = false;
}

function mute() {
  document.getElementById('mute').style.display = 'none';
  document.getElementById('unmute').style.display = 'block';
  pauseAllSounds();
  sounds.forEach(sound => sound.classList.add('muted'));
}

function unmute() {
  document.getElementById('unmute').style.display = 'none';
  document.getElementById('mute').style.display = 'block';
  sounds.forEach(sound => sound.classList.remove('muted'));
  playAllSounds();
}

function spawnBadItem() {
  var item = badItems[getRandomInt(badItems.length)];
  var itemClone = {
    type: item.type,
    x: item.x,
    y: item.y,
    height: item.height,
    width: item.width,
    image: item.image
  }
  objects.push(itemClone);
}

function spawnDP() {
  var dp_obj = {
    type: 'newsstand',
    x:canvasWidth,
    y:canvasHeight - 180,
    height:80,
    width:70,
    image: newsImage
  }
  objects.push(dp_obj);
}

function spawnCone() {
  var cone_obj = {
      type: 'cone',
      x:canvasWidth,
      y:canvasHeight - 230,
      height:80,
      width:60,
      image: coneImage
  }
  objects.push(cone_obj);
}

function drawBackground() {
  ctx.globalAlpha = 1;
  ctx.globalCompositeOperation = 'source-over';
  // draw twice to cover wrap around
  ctx.drawImage(backgroundImage, backgroundImageX, 0, canvasWidth, canvasHeight);
  ctx.drawImage(backgroundImage, backgroundImageX + canvasWidth, 0, canvasWidth, canvasHeight);
  ctx.fillStyle = "rgba(255,255,255,0)";
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);
}

function drawJoeBiden() {
  ctx.drawImage(joe.image, joe.x, joe.y, joe.width, joe.height);
}

// removes object from items array
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
  if (backgroundImageX < -canvasWidth) backgroundImageX += canvasWidth;
  requestAnimationFrame(runBackground);

  ctx.clearRect(0,0,canvas.width,canvas.height);
  drawBackground();
  document.getElementById('start').style.display = 'block';
}

function jump() {
  if (joe.jumping) return;
  joe.y_velocity -= 35; // higher number = bigger jump
  joe.jumping = true;
  bounce = true;
}

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

// main game loop
function gameLoop() {
  v_increase++;
  if (v_increase > 200 && v_increase % 200 === 0) maxVelocity += 0.3;
  if (pauseLoop) return;

  // control frequency of object spawning
  var randomTime = getRandomInt(250);
  if (getRandomInt(200) === 0) spawnBadItem();
  if (getRandomInt(2000) === 99) spawnDP();
  if (getRandomInt(100) === 0) spawnCone();

  // continually loop background image
  backgroundImageX -= maxVelocity; // speed of moving background
  if (backgroundImageX < -canvasWidth) backgroundImageX += canvasWidth;

  // request another animation frame
  requestAnimationFrame(gameLoop);

  ctx.clearRect(0,0,canvas.width,canvas.height);
  drawBackground();
  drawJoeBiden();

  // draw score and lives
  ctx.fillStyle = 'white';
  ctx.font = 'bold 45px Lato';
  ctx.fillText(`Score: ${score}     Lives: ${lives}`, 20, 55);

  if (controller.up) jump();

  joe.y_velocity += 1.5; // gravity
  joe.y += joe.y_velocity;
  joe.y_velocity *= 0.98; // friction

  // detect collision between joe and ground
  if (joe.y > 250) {
    joe.jumping = false;
    joe.y = 250;
    joe.y_velocity = 0;
    if (bounce) {
      joe.y_velocity -= 5; // bounce intensity
      joe.jumping = true;
      bounce = false;
      if (!bounceSound.classList.contains('muted')) bounceSound.play();
    }
  }

  // move each object down the canvas
  for (var i = 0; i < objects.length; i++) {
    var object = objects[i];
    object.x -= maxVelocity;
    ctx.drawImage(object.image, object.x, object.y, object.width, object.height);

    // check for collisions, set collision radii
    if (object.x - joe.x <= 90 && object.x - joe.x > 0 && Math.abs(object.y - joe.y) <= 200) {
      if (object.type === 'cone') {
        if (!iceCreamSound.classList.contains('muted')) iceCreamSound.play();
        incrementScore();
      } else if (object.type === 'squirrel') {
        if (!squirrelSound.classList.contains('muted')) squirrelSound.play();
        decrementLives();
      } else if (object.type === 'flyer') {
        if (!flyerSound.classList.contains('muted')) flyerSound.play();
        decrementLives();
      } else if (object.type === 'newsstand') {
        if (!dpSound.classList.contains('muted')) dpSound.play();
        incrementLives();
      }
      object.image = ''; // clear image after colliding
      removeItem(object);
    }

    if (object.x < -100) removeItem(object);
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

function incrementLives() {
  lives++;
}

function startGame() {
  playAllSounds();
  pauseLoop = false;
  pauseStart = true;
  gameLoop();
  document.getElementById('start').style.display = 'none';
  document.getElementById('pause').style.display = 'block';
  if (themeSound.classList.contains('muted')) {
    document.getElementById('unmute').style.display = 'block';
  } else {
    document.getElementById('mute').style.display = 'block';
  }
}

function pauseGame() {
  pauseAllSounds();
  pauseLoop = true;
  document.getElementById('pause').style.display = 'none';
  document.getElementById('resume').style.display = 'block';
}

function resumeGame() {
  playAllSounds();
  pauseLoop = false;
  gameLoop();
  document.getElementById('resume').style.display = 'none';
  document.getElementById('pause').style.display = 'block';
}

function gameOver() {
  scooterSound.pause();
  // darken background image by applying black overlay
  ctx.beginPath();
  ctx.rect(0, 0, canvasWidth, canvasHeight);
  ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
  ctx.fill();

  ctx.fillStyle = 'white';
  ctx.font = 'bold 35px Lato';
  ctx.fillText(`Game Over! Your score is: ${score}`, canvas.width / 2 - 230, canvas.height / 2 - 60);

  document.getElementById('start').style.display = 'block';
  lives = 3;
  score = 0;
  document.getElementById('pause').style.display = 'none';
  document.getElementById('resume').style.display = 'none';
  document.getElementById('mute').style.display = 'none';
  document.getElementById('unmute').style.display = 'none';

  maxVelocity = 12; // reset start speed
  objects = []; // clear all objects
}
