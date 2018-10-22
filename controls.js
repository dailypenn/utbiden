var canvas, ctx, controller, joe, score, lives, items, item, loop;
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

$(function(){

    // get a refrence to the canvas and its context
    canvas=document.getElementById("canvas");
    ctx=canvas.getContext("2d");
    ctx.canvas.height = 500;
    ctx.canvas.width = 1400;
    canvasHeight = ctx.canvas.height;
    canvasWidth = ctx.canvas.width;

    var spawnRateOfX= 10;
    var objects=[];

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

    score = 0;
    lives = 3;

    var scoreElement = document.getElementById('score');
    scoreElement.innerHTML = 'Score: ' + score;

    var livesElement = document.getElementById('lives');
    livesElement.innerHTML = 'Lives: ' + lives;

    window.addEventListener("keydown", controller.keyListener);
    window.addEventListener("keyup", controller.keyListener);

    animate();

    function spawnRandomObject() {
        var item = items[Math.floor(Math.random()*items.length)];
        objects.push(item);
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

    function removeItem(item) {
      for (var i = 0; i < objects.length; i++) {
        var object = objects[i];
        if (object === item) {
          objects.splice(i, 1);
          break;
        }
      }
    }
    function animate(){
        // randomly spawn objects
        var randomTime = Math.random()*10;
        if (randomTime > 9.9) {
          spawnRandomObject();
        }

        // continually loop background image
        backgroundImageX -= maxVelocity;
        if (backgroundImageX < -canvasWidth) {
          backgroundImageX += canvasWidth;
        }

        // request another animation frame
        requestAnimationFrame(animate);

        ctx.clearRect(0,0,canvas.width,canvas.height);
        drawBackground();
        drawJoeBiden();

        if (controller.up && joe.jumping === false) {
          joe.y_velocity -= 30;
          joe.jumping = true;
        }

        joe.y_velocity += 1.5;// gravity
        joe.y += joe.y_velocity;
        joe.y_velocity *= 0.98;// friction

        // detect collision between joe and ground
        if (joe.y > 250) {
          joe.jumping = false;
          joe.y = 250;
          joe.y_velocity = 0;
        }

        // move each object down the canvas
        for(var i = 0; i < objects.length; i++) {
            var object = objects[i];
            object.x -= spawnRateOfX;
            ctx.drawImage(object.image, object.x, object.y, object.width, object.height);

            // check for collisions
            if (object.x - joe.x <= 10 && object.x - joe.x > 0 && Math.abs(object.y - joe.y) <= 70 && object.y - joe.y > 0) {
              if (object.type === 'cone') {
                incrementScore();
              } else if (object.type === 'squirrel') {
                decrementLives();
              }
            }

            if (object.x < 0) {
              removeItem(object);
              object.x = canvasWidth; // reset starting position of object
            }
        }

        function incrementScore() {
          score++;
          var scoreElement = document.getElementById('score');
          scoreElement.innerHTML = 'Score: ' + score;
        }

        function decrementLives() {
          lives--;

          if (lives === 0) { // end game

          }
          var livesElement = document.getElementById('lives');
          livesElement.innerHTML = 'Lives: ' + lives;
        }
    }
});
