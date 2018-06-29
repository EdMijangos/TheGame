

//constants
var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

var interval;
var frames = 0;
var images = {
  mario: 'images/mario.png',
  luigi:'images/Luigi.png',
  enemy:'images/goomba.png',
  bigEnemy:'images/Koopa.png',
  bigEnemy2:'images/Shy_Guy.png',
  bullet:'images/bullet.png',
  myBullet:'images/mybullet.png',
  bg: 'images/bg.png',
}
var enemies = [];
var killcount = 0;
var score = 0;
var firstBtn = document.getElementById("1p");
var secondBtn = document.getElementById("2p");
var bgSound = new Audio();
bgSound.src = 'Sound/mariobg.mp3';
bgSound.loop = true;
bgSound.volume = 0.5;
var winSound = new Audio();
winSound.src = 'Sound/clear.wav';
var shootSound = new Audio();
shootSound.src ='Sound/shoot.wav';
var enemyShoot = new Audio();
enemyShoot.src = 'Sound/enemy_shoot.wav';
enemyShoot.volume = 1;
var killSound = new Audio();
killSound.src = 'Sound/kill.wav';
var deathSound = new Audio();
deathSound.src = 'Sound/death.wav';
deathSound.volume = 1;


//classes
class Board {
  constructor(){
    this.x = 0;
    this.y = 0;
    this.width = canvas.width;
    this.height = canvas.height;
    this.speedY = 4;
    this.image = new Image();
    this.image.src = images.bg;
    this.image.onload = function (){
      this.draw();
    }.bind(this);
  }
  draw(){
    this.y+=this.speedY;
    if(this.y === this.height)this.y = 0;
    ctx.drawImage(this.image,this.x,this.y,this.width,this.height);
    ctx.drawImage(this.image,this.x,this.y-canvas.height,this.width,this.height);
  }
  gameOver(){
    ctx.font = "80px Arcade";
    ctx.fillStyle = "white"
    ctx.fillText("Game Over", 130,200);
    ctx.font = "20px Arcade";
    ctx.fillStyle = 'white';
    ctx.fillText("Press 'Esc' to reset", 220,250);
  }
  win(){
    ctx.font = "80px Arcade";
    ctx.fillStyle = "white"
    ctx.fillText("You win!", 220,250);
    ctx.font = "20px Arcade";
    ctx.fillStyle = 'white';
    ctx.fillText("Press 'Esc' to reset", 220,300);
  }
}


class Character {
  constructor(x=320,y=canvas.height, img){
    this.x = x;
    this.y = y;
    this.width = 32;
    this.height = 32;
    this.speedX = 1;
    this.speedY = 1;
    this.bullets = [];
    this.image = new Image();
    this.image.src = img;
    this.image.onload = function(){
      this.draw();
    }.bind(this);
  }

  draw(){
    ctx.drawImage(this.image, this.x,this.y,this.width,this.height);
  }

  isTouching(item){
    return  (this.x < item.x + item.width) &&
            (this.x + this.width > item.x) &&
            (this.y < item.y + item.height) &&
            (this.y + this.height > item.y);
  }
}

class Enemy extends Character{
  constructor(x,y,img){
    super(x,y,img);
    this.hp = 1; //no funciona
    this.speedX = 2;
    this.speedY = 2;
    this.scoreValue = 1;
  }
  draw(){
    this.y += this.speedY;
    ctx.drawImage(this.image,this.x,this.y,this.width,this.height);
  }
  shoot(){
    var bullet = new EnemyBullet(this);
    this.bullets.push(bullet);
  }
}

class BigEnemy extends Character{
  constructor(x,y,speedX,speedY,img){
    super(x,y,speedX,speedY,img);
    this.width = 56;
    this.height = 56;
    this.hp = 3; //no funciona
    this.scoreValue = 2;
  }
  draw(){
    this.y += this.speedY;
    ctx.drawImage(this.image,this.x,this.y,this.width,this.height);
  }
  shoot(){
    var bullet = new BigEnemyBullet(this);
    this.bullets.push(bullet);
  }
}

class BigEnemy2 extends Character{
  constructor(x,y,speedX,speedY,img){
    super(x,y,speedX,speedY,img);
    this.width = 48;
    this.height = 48;
    this.hp = 3; //no funciona
    this.speedY = 2.5;
    this.scoreValue = 2.5;
  }
  draw(){
    this.y += this.speedY;
    ctx.drawImage(this.image,this.x,this.y,this.width,this.height);
  }
  shoot(){
    var bullet = new BigEnemyBullet2(this);
    this.bullets.push(bullet);
  }
}


class Bullet{
  constructor(character){
    this.width = 16;
    this.height = 16;
    this.x = character.x+character.width/2-this.width/2;
    this.y = character.y-this.height;
    this.speedY = 10;
    this.image = new Image();
    this.image.src = images.myBullet;
    this.image.onload = function(){
      this.draw();
    }.bind(this);
  }
  draw() {
    this.y -= this.speedY;
    ctx.drawImage(this.image,this.x,this.y,this.width,this.height);
  }
}

class EnemyBullet extends Bullet{
  constructor(character){
  super(character);
  this.speedY = 5;
  this.image.src = images.bullet;
  }

  draw() {
    this.y += this.speedY;
    ctx.drawImage(this.image,this.x,this.y,this.width,this.height);
  }
}

class BigEnemyBullet extends Bullet{
  constructor(character){
  super(character);
  this.speedY = 1;
  this.speedX = 3;
  this.image.src = images.bullet;
  }

  draw() {
    if(this.x <= 96 + mario.width) this.speedX *= -1;
    this.y += this.speedY;
    ctx.drawImage(this.image,this.x,this.y,this.width,this.height);
    this.y += this.speedY;
    this.x -= this.speedX
    ctx.drawImage(this.image,this.x,this.y,this.width,this.height);
    this.y += this.speedY;
    this.x -= this.speedX;
    ctx.drawImage(this.image,this.x,this.y,this.width,this.height);
  }
}

class BigEnemyBullet2 extends Bullet{
  constructor(character){
  super(character);
  this.speedY = 1;
  this.speedX = 4;
  this.image.src = images.bullet;
  }

  draw() {
    this.y += this.speedY;
    ctx.drawImage(this.image,this.x,this.y,this.width,this.height);
    this.y += this.speedY;
    this.x += this.speedX
    ctx.drawImage(this.image,this.x,this.y,this.width,this.height);
    this.y += this.speedY;
    this.x += this.speedX;
    ctx.drawImage(this.image,this.x,this.y,this.width,this.height);
  }
}

//instances
var board;
var mario;
var luigi;


//main functions
function start(){
  interval = setInterval(update, 1000/60);
  board = new Board();
}

function update(){
  frames++;
  ctx.clearRect(0,0,canvas.width,canvas.height);
  board.draw();
  mario.draw();
  if(luigi)luigi.draw();
  scoreDraw();
  drawMyBullets();
  if(luigi)drawLuigiBullets();
  enemyCreate();
  checkWin();
}

function enemyCreate(){
  generateEnemies();
  drawEnemies();
  generateEnemyBullets();
  drawEnemyBullets();
  checkKill();
  if(luigi)checkLuigiKill();
}


//aux functions
function generateMyBullets(){
  var bullet = new Bullet(mario);
  mario.bullets.push(bullet);
}

function generateLuigiBullets(){
  var bullet = new Bullet(luigi);
  luigi.bullets.push(bullet);
}

function drawMyBullets(){
  mario.bullets.forEach(function(a){
    a.draw();
    if(a.y < -10)mario.bullets.splice(0,1);
  })
}

function drawLuigiBullets(){
  luigi.bullets.forEach(function(a){
    a.draw();
    if(a.y < -10)luigi.bullets.splice(0,1);
  })
}

function scoreDraw(){
  ctx.font = "30px Arcade";
  ctx.fillStyle = 'white';
  ctx.fillText('Score:', 20,500);
  ctx.fillText(score, 20,550);
}

function generateEnemies(){
  var ePosition = enemyPosition();
  if(frames%120 === 0 && killcount < 4){
    var enemy = new Enemy(ePosition,-40,images.enemy);
    enemies.push(enemy);
  } else generateSecondWave();
}

function generateSecondWave(){
  var ePosition = enemyPosition();
  if(frames%120 === 0 && killcount >= 4 && killcount < 7){
    var enemy = new BigEnemy(ePosition,-50,images.bigEnemy)
    enemies.push(enemy);
  } else generateThirdWave();
}

function generateThirdWave(){
  var ePosition = enemyPosition();
  if(frames%80 === 0 && killcount >= 7 && killcount < 15){
    var enemy = new BigEnemy(ePosition,-50,images.bigEnemy);
    enemies.push(enemy);
    var ePosition2 = enemyPosition();
    var enemy2 = new BigEnemy2(ePosition2,-50,images.bigEnemy2);
    enemies.push(enemy2);
  }else generateLastWave();
}

function generateLastWave(){
  var ePosition = enemyPosition();
  if(frames%80 === 0 && killcount >= 15 && killcount < 30){
    var enemy = new BigEnemy(ePosition,-50,images.bigEnemy);
    enemies.push(enemy);
    var ePosition2 = enemyPosition();
    var enemy2 = new BigEnemy2(ePosition2,-50,images.bigEnemy2);
    enemies.push(enemy2);
    var ePosition3 = enemyPosition();
    var enemy3 = new Enemy(ePosition3,-50,images.enemy);
    enemies.push(enemy3);
  }
}

function enemyPosition(){
  var index = Math.floor(Math.random()*(canvas.width-176));
  if(index < 112) return index + 112;
  else return index;
}

function drawEnemies(){
  enemies.forEach(function(a){
    a.draw();
    if(mario.isTouching(a)){
      checkDeath();
    } else if (luigi && luigi.isTouching(a)){
      checkDeath();
    }
    var index = enemies.indexOf(a);
    if(a.y >= canvas.height+a.height){
      enemies.splice(index,1);
    }
  })
}

function checkKill(){
  for(var i = 0; i<enemies.length; i++)
    for(var j = 0; j<mario.bullets.length; j++)
    if(enemies[i].isTouching(mario.bullets[j])){
      score += (enemies[i].scoreValue * 100)
      enemies.splice(i,1);
      mario.bullets.splice(j,1);
      killSound.play();
      killcount++;
    }
  }

  function checkLuigiKill(){
    for(var i = 0; i<enemies.length; i++)
      for(var j = 0; j<luigi.bullets.length; j++)
      if(enemies[i].isTouching(luigi.bullets[j])){
        score += (enemies[i].scoreValue * 100)
        enemies.splice(i,1);
        luigi.bullets.splice(j,1);
        killSound.play();
        killcount++;
    }
  }

function generateEnemyBullets(){
  if(frames%90 === 0)enemies.forEach(function(a){
    a.shoot();
    enemyShoot.play();
  })
}

function drawEnemyBullets(){
  enemies.forEach(function(b){
    b.bullets.forEach(function(c){
      c.draw();
      if(mario.isTouching(c)){
        checkDeath();
      }else if (luigi && luigi.isTouching(c)){
        checkDeath();
      }
    })
  })
}

function checkDeath(){
  clearInterval(interval);
  interval = undefined;
  board.gameOver();
  bgSound.pause();
  bgSound.currentTime = 0;
  deathSound.play();
}

function checkWin(){
  if(enemies.length === 0 && killcount >= 30){
  clearInterval(interval);
  interval = undefined;
  board.win();
  bgSound.pause();
  bgSound.currentTime = 0;
  winSound.play();
  }
}

function restart(){
  if (interval)return;
  else {
    frames = 0;
    killcount = 0;
    score = 0;
    enemies = [];
    mario.bullets = [];
    if(!luigi){
      mario.x = 304;
      mario.y = canvas.height-32;
    } else{
      mario.x = 216;
      mario.y = canvas.height-32;
      luigi.x = 382;
      luigi.y = canvas.height-32;
    }
    start();
    bgSound.currentTime = 0;
    bgSound.play();
  }
}

//listeners
firstBtn.onclick = function(){
  mario = new Character(304,canvas.height-32,images.mario);
  firstBtn.style.display = 'none';
  secondBtn.style.display = 'none';
  document.getElementById('instructions').style.display = 'none';
  canvas.style.display = 'block';
  start();
  bgSound.play();
}

secondBtn.onclick = function(){
  mario = new Character(216,canvas.height-32,images.mario);
  luigi = new Character(384,canvas.height-32,images.luigi);
  firstBtn.style.display = 'none';
  secondBtn.style.display = 'none';
  document.getElementById('instructions').style.display = 'none';
  canvas.style.display = 'block';
  start();
  bgSound.play();
}

addEventListener('keydown', function(e){
  switch(e.keyCode){
    case 37:
      if(mario.x === 96 + mario.width)return;
      mario.x -= 8;
      break;
    case 39:
      if (mario.x === canvas.width-128-mario.width)return;
      mario.x += 8;
      break;
    case  38:
      if(mario.y === 0)return;
      mario.y -=8;
      break;
    case 40:
      if(mario.y === canvas.height-mario.height)return;
      mario.y += 8;
      break;
    case 32:
      if(mario.bullets.length === 3)return;
      generateMyBullets();
      shootSound.play();
      break;
    case 27:
      restart();
      break;
  }
})

addEventListener('keydown', function(e){
  switch(e.keyCode){
    case 65:
      if(luigi.x <= 96 + luigi.width)return;
      luigi.x -= 8;
      break;
    case 68:
      if (luigi.x >= canvas.width-128-luigi.width)return;
      luigi.x += 8;
      break;
    case  87:
      if(luigi.y === 0)return;
      luigi.y -=8;
      break;
    case 83:
      if(luigi.y === canvas.height-luigi.height)return;
      luigi.y += 8;
      break;
    case 70:
      if(luigi.bullets.length === 3)return;
      generateLuigiBullets();
      shootSound.play();
      break;
    }
  })