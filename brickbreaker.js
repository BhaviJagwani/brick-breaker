
window.requestAnimFrame = (function(callback) {
        return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
        function(callback) {
          window.setTimeout(callback, 1000 / 60);
        };
      })();

var x, y;
var dx = 2, dy = 7;
var ballr= 10;
var width, height;
var paddlex, paddleh, paddlew;
var rightDown=false, leftDown= false;
var intervalId;
var pdx= 15;
var bricks, nrows, ncolumns, brickwidth, brickheight, padding;
var rowcolors = ["#26466D", "#36648B", "#4981CE", "#3299CC", "#00B2EE", "#63D1F4", "#8EE5EE"];
var paddlecolor = "#e7e7e7";
var ballcolor = "#a8a8a8";
var score=0;
var narcs= 13, rmult=7, wmult=5, centerX, centerY;
var frameId;


function onKeyDown(event){
  if(event.which == 37)
    leftDown= true;
  if(event.which == 39)
    rightDown= true;
}

function onKeyUp(event){
  if(event.which == 37)
    leftDown= false;
  if(event.which == 39)
    rightDown= false;
}

function circle(x,y,r) {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI*2, true);
  ctx.closePath();
  ctx.fill();
}

function rect(x,y,w,h) {
  ctx.beginPath();
  ctx.rect(x,y,w,h);
  ctx.closePath();
  ctx.fill();
}

function clear() {
  ctx.clearRect(0, 0, width, height);
}


function init() {
  ctx= document.getElementById('canvas').getContext("2d");
  canvas= document.getElementById('canvas');
  
  canvas.width = window.innerWidth * 0.88;
  canvas.height = window.innerHeight * 0.93;
  
  width= canvas.width;
  height= canvas.height;
  
  x= width/4;
  y= height/2;
  
  document.onkeydown =onKeyDown;
  document.onkeyup= onKeyUp;

  frameId = 0;
}

function init_paddle(){
  paddlex= width/2;
  paddleh=10;
  paddlew=120;
}

function initbricks() {
  nrows = 6;
  ncols = 10;
  padding = 7;

  brickwidth = (width/ncols) - padding;
  brickheight = 15;

  bricks = new Array(nrows);
  for (i=0; i < nrows; i++) {
    bricks[i] = new Array(ncols);
    for (j=0; j < ncols; j++) {
      bricks[i][j] = 1;
      }
  }
}

function drawBricks(){
  for(i=0; i< nrows; i++){
    ctx.fillStyle = rowcolors[i];
    for(j=0; j < ncols; j++){
      if(bricks[i][j] == 1)
        rect(j*(brickwidth+padding) + padding, i*(brickheight+padding) + padding, brickwidth, brickheight);
      }
    }
  var pscore= document.getElementById("score");
  pscore.innerHTML = "SCORE: "+score;
}

function initArcs() {
  var arcs = [];

  // create 20 arcs
  for( n = 0; n < narcs; n++) {
    var radius = (n + 1) * rmult;
    var width = (n + 1) * wmult;
    // between 0 and 2 PI
    var startingAngle = Math.random() * 2 * Math.PI;
    // 1 to 3 revolutions per second
    var speed = (Math.random() * 2) + 1;
    // between 0 and 1
    var opacity = (n / 20) * 0.75;

    arcs.push({
      radius: radius,
      startingAngle: startingAngle,
      width: width,
      opacity: opacity,
      speed: speed
    });
  }

  return arcs;
}

function drawArcs(arcs) {
  //ctx = canvas.getContext('2d');
  centerX = canvas.width / 2 ;
  centerY = canvas.height* 0.45;

  for( n = 0; n < arcs.length; n++) {
    ctx.save();
    ctx.beginPath();
    var thisArc = arcs[n];

    ctx.globalAlpha = thisArc.opacity;
    ctx.arc(centerX, centerY, thisArc.radius, thisArc.startingAngle, thisArc.startingAngle + Math.PI, true);
    ctx.lineWidth = thisArc.width;
    
    ctx.strokeStyle = '#517693';
    ctx.stroke();
    ctx.closePath();
    ctx.restore();
  }
}


function updateArcs(arcs, timeDiff) {
  for( n = 0; n < arcs.length; n++) {
    var thisArc = arcs[n];
    var angleDiff = thisArc.speed * timeDiff / 1000;
    thisArc.startingAngle -= angleDiff;
  }
}

function drawGame(){
  ctx.fillStyle = ballcolor;
  circle(x, y, ballr);

  if(leftDown) {
    if(paddlex - pdx > 0)
      paddlex -= pdx;
    }

  else if(rightDown) {
    if(paddlex + pdx < width - paddlew)
      paddlex += pdx;
    }

  ctx.fillStyle = paddlecolor;
  rect(paddlex, height-paddleh, paddlew, paddleh);

  drawBricks();

  rowheight = brickheight + padding;
  colwidth = brickwidth + padding;
  row = Math.floor(y/rowheight);
  col = Math.floor(x/colwidth);
  if (y < nrows * rowheight && row >= 0 && col >= 0 && bricks[row][col] == 1) {
    dy = -dy;
    bricks[row][col] = 0;
    score += 1;
    }

  var maxR= narcs*rmult;
  if(x > (centerX - maxR) && x < (centerX + maxR) && y > (centerY - maxR ) && y < (centerY+ maxR)) {
      dy= Math.pow(-1, Math.floor(Math.random()*2 +1))*Math.floor(Math.random()*10 +1);
      if(Math.pow(dy, 2) < 25)
        dy= 5;
      dx= Math.pow(-1, Math.floor(Math.random()*2 +1))*Math.floor(Math.random()*8 +1);
    }
  if (x + dx > width || x + dx < 0)
    dx = -dx;

  if (y + dy < 0)
    dy = -dy;
  else if (y + dy > height) {
      if (x + ballr > paddlex && x - ballr < paddlex + paddlew )
        dy = -dy;
      else {
        alert("Game over ! Your score: "+ score);
        window.cancelAnimationFrame(frameId);
        frameId = undefined;
        }
}

x += dx;
y += dy;
}

function animate(arcs, lastTime) {
  //ctx = canvas.getContext('2d');

  // update
  var time = (new Date()).getTime();
  var timeDiff = time - lastTime;
  updateArcs(arcs, timeDiff);

  // clear
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // draw
  drawArcs(arcs);
  drawGame(ctx);

  // request new frame
 if(frameId != undefined) {
    frameId= requestAnimFrame(function() {
      animate(arcs, time);
    });
}
}


function startGame(){
	if(frameId != 0)
		window.cancelAnimationFrame(frameId);
  //var canvas = document.getElementById('canvas');
  var arcs = initArcs();
  var time = (new Date()).getTime();
  ctx= canvas.getContext('2d');
  init();
  init_paddle();
  initbricks();

  drawGame(ctx);
  drawArcs(arcs);
  
  setTimeout(function(){
		animate(arcs, time);
}, 500); 
}