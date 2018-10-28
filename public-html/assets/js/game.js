var App = function() {};
var width = 288;
var height = 512;

App.prototype.start = function(){
  class GameScene extends Phaser.Scene{

    constructor (){
      super({key: 'GameScene', active: true})
      this.gameobjects = [];
      this.gameparameters = [];
      // 1000 pixeles por segundo.
      this.gameparameters.speed = -1 * Phaser.Math.GetSpeed(150, 1);
      this.gameparameters.gameover = false;
      this.gameparameters.hitfloor = false;
      this.gameparameters.score = -1;
      this.gameparameters.lastStart = 0;
    }

    preload(){
      this.load.image('background', 'assets/images/background-day.png');
      this.load.image('floor', 'assets/images/floor.png');
      this.load.image('pipe', 'assets/images/pipe-green.png');
      this.load.image('bird-1', 'assets/images/redbird-downflap.png');
      this.load.image('bird-2', 'assets/images/redbird-midflap.png');
      this.load.image('bird-3', 'assets/images/redbird-upflap.png');
      this.load.image('0', 'assets/images/0.png');
      this.load.image('1', 'assets/images/1.png');
      this.load.image('2', 'assets/images/2.png');
      this.load.image('3', 'assets/images/3.png');
      this.load.image('4', 'assets/images/4.png');
      this.load.image('5', 'assets/images/5.png');
      this.load.image('6', 'assets/images/6.png');
      this.load.image('7', 'assets/images/7.png');
      this.load.image('8', 'assets/images/8.png');
      this.load.image('9', 'assets/images/9.png');
      this.load.image('gameover', 'assets/images/gameover.png');

      this.load.audio('wing', [
          'assets/audio/wing.ogg',
          'assets/audio/wing.wav'
      ]);
      this.load.audio('point', [
          'assets/audio/point.ogg',
          'assets/audio/point.wav'
      ]);
      this.load.audio('hit', [
          'assets/audio/hit.ogg',
          'assets/audio/hit.wav'
      ]);
    }

    create(){
      this.gameparameters.gameover = false;
      this.gameparameters.hitfloor = false;
      this.gameparameters.score = -1;
      this.gameobjects.music_point = this.sound.add('point');
      this.gameobjects.music_wing = this.sound.add('wing');
      this.gameobjects.music_hit = this.sound.add('hit');

      this.keycodes_spacebar = this.input.keyboard.addKey(
        Phaser.Input.Keyboard.KeyCodes.SPACE);
      this.gameobjects.background = this.add.image(
        width * 0.5, height * 0.5, 'background');
      this.gameobjects.pipes = this.add.group();
      this.gameobjects.floor_1 = this.physics.add.image(
        0, height, 'floor').setOrigin(0, 0.5);
      this.gameobjects.floor_2 = this.physics.add.image(
        width, height, 'floor').setOrigin(0, 0.5);
      this.gameobjects.floor_1.body.immovable = true;
      this.gameobjects.floor_2.body.immovable = true;
      this.gameobjects.floor_1.body.moves = false;
      this.gameobjects.floor_1.allowGravity = false;
      this.gameobjects.floor_2.body.moves = false;
      this.gameobjects.floor_2.allowGravity = false;

      this.generate_pipe();
      this.gameobjects.pipes.setDepth(5);
      this.gameobjects.floor_1.setDepth(10);
      this.gameobjects.floor_2.setDepth(10);
      this.gameobjects.background.setDepth(0);

      if(!this.anims.get('fly')){
        this.anims.create({
          key: 'fly',
          frames: [
              { key: 'bird-1' },
              { key: 'bird-2' },
              { key: 'bird-3' },
          ],
          frameRate: 8,
          repeat: -1
        });
        this.anims.create({
          key: 'stop',
          frames: [
              { key: 'bird-1' },
          ],
          frameRate: 8,
          repeat: -1
        });

        this.anims.create({
          key: 's0', frames: [ { key: '0' },], frameRate: 1, repeat: 0
        });
        this.anims.create({
          key: 's1', frames: [ { key: '1' },], frameRate: 1, repeat: 0
        });
        this.anims.create({
          key: 's2', frames: [ { key: '2' },], frameRate: 1, repeat: 0
        });
        this.anims.create({
          key: 's3', frames: [ { key: '3' },], frameRate: 1, repeat: 0
        });
        this.anims.create({
          key: 's4', frames: [ { key: '4' },], frameRate: 1, repeat: 0
        });
        this.anims.create({
          key: 's5', frames: [ { key: '5' },], frameRate: 1, repeat: 0
        });
        this.anims.create({
          key: 's6', frames: [ { key: '6' },], frameRate: 1, repeat: 0
        });
        this.anims.create({
          key: 's7', frames: [ { key: '7' },], frameRate: 1, repeat: 0
        });
        this.anims.create({
          key: 's8', frames: [ { key: '8' },], frameRate: 1, repeat: 0
        });
        this.anims.create({
          key: 's9', frames: [ { key: '9' },], frameRate: 1, repeat: 0
        });
      }

      this.gameobjects.bird = this.physics.add.sprite(
        100, 100, 'bird-1').play('fly');
      this.gameobjects.bird.setDepth(12);
      this.gameobjects.bird.body.setCollideWorldBounds(true);

      this.physics.add.overlap(
        this.gameobjects.bird, this.gameobjects.pipes, this.hitObjects,
        null, this);
      this.physics.add.collider(
        this.gameobjects.bird, this.gameobjects.floor_1, this.hitFloor,
        null, this);
      this.physics.add.collider(
        this.gameobjects.bird, this.gameobjects.floor_2, this.hitFloor,
        null, this);

      this.gameobjects.score_1 = this.add.sprite(
        (width * 0.5) - 13, 100, '0');
      this.gameobjects.score_2 = this.add.sprite(
        (width * 0.5) + 13, 100, '1');
      this.gameobjects.score_1.setDepth(100);
      this.gameobjects.score_2.setDepth(100);
    }

    hitObjects(player, floor){
      this.gameOver();
    }

    hitFloor(player, floor){
      this.gameparameters.hitfloor = true;
      this.gameOver();
    }

    gameOver(){
      if(!this.gameparameters.gameover){
        this.gameobjects.bird.setVelocity(0, 0);
        this.gameobjects.music_hit.play();
        this.gameobjects.bird.play("stop");
        this.gameparameters.gameover = true;
        if(!this.gameparameters.hitfloor){
          for (var i = 0; i < this.gameobjects.pipes.getLength(); i++) {
            if(this.gameobjects.pipes.getChildren()[i].body.enable){
              this.gameobjects.pipes.getChildren()[i].body.enable = false;
            }
          }
        }
        this.add.image(width * 0.5, height * 0.5, 'gameover').setDepth(200);
      }
    }

    setScore(){
      var s1 = parseInt(this.gameparameters.score / 10);
      var s2 = this.gameparameters.score % 10;
      this.gameobjects.score_1.play("s" + s1);
      this.gameobjects.score_2.play("s" + s2);
    }

    update(time, delta){
      this.setScore();
      if (time - this.gameparameters.lastStart > 2000 &&
        this.gameparameters.hitfloor &&
        Phaser.Input.Keyboard.JustDown(this.keycodes_spacebar)){

        this.gameparameters.lastStart = time;
        this.scene.restart();

      }
      if(this.gameobjects.bird.body.velocity.y < 200){
        var t = this.gameobjects.bird.body.velocity.y / 200;
        var angle = 90 * t;
        if(this.gameparameters.gameover){
          angle = 90;
        }else{
          if(angle < 45){
            angle = 0;
          }
        }
        this.gameobjects.bird.angle = angle;
      }
      else{
        this.gameobjects.bird.angle = 90;
      }
      if(this.gameparameters.gameover){
        return;
      }
      this.move_world(delta);
      if (Phaser.Input.Keyboard.JustDown(this.keycodes_spacebar)){
        this.gameobjects.bird.setVelocity(0, -300);
        this.gameobjects.music_wing.play();
      }
    }

    move_world(delta){
      this.gameobjects.floor_1.x += this.gameparameters.speed * delta;
      this.gameobjects.floor_2.x += this.gameparameters.speed * delta;
      if(this.gameobjects.floor_1.x + this.gameobjects.floor_1.width < 0){
        this.gameobjects.floor_1.x = this.gameobjects.floor_2.x +
          this.gameobjects.floor_2.width;
      }
      if(this.gameobjects.floor_2.x + this.gameobjects.floor_2.width < 0){
        this.gameobjects.floor_2.x = this.gameobjects.floor_1.x +
          this.gameobjects.floor_1.width;
      }
      var tmp;
      for (var i = 0; i < this.gameobjects.pipes.getLength(); i++) {
        tmp = this.gameobjects.pipes.getChildren()[i];
        tmp.x += this.gameparameters.speed * delta;
      }
      for (var i = 0; i < this.gameobjects.pipes.getLength(); i++) {
        tmp = this.gameobjects.pipes.getChildren()[i];
        if(tmp.x + tmp.width < 0){
          this.gameobjects.pipes.remove(tmp, true, true);
          continue;
        }
        if(tmp.x < 50){
          if(tmp.main){
            this.generate_pipe();
            tmp.main = false;
          }
        }
      }
    }

    generate_pipe(){
      this.gameparameters.score++;
      if(this.gameparameters.score > 0){
        this.gameobjects.music_point.play();
      }
      var y = this.generate_random_range_pipes();
      var x = width + 52;
      var t = this.physics.add.image(x - 26, y - 160, 'pipe')
      t.setAngle(180);
      t.flipX = true;
      t.main = true;
      var t2 = this.physics.add.image(x - 26 , t.y + 320 + 120, 'pipe')
      this.gameobjects.pipes.add(t);
      this.gameobjects.pipes.add(t2);
      t.body.moves = false;
      t.allowGravity = false;
      t2.body.moves = false;
      t2.allowGravity = false;
      this.physics.add.collider(t , this.gameobjects.bird);
      this.physics.add.collider(t2 , this.gameobjects.bird);
    }

    generate_random_range_pipes(){
      return this.getRndInteger(100, 320);
    }

    getRndInteger(min, max) {
      return Math.floor(Math.random() * (max - min + 1) ) + min;
    }

  }
  // Escenas
	var scenes = [];
	scenes.push(GameScene);

  var config = {
    type: Phaser.AUTO,
    width: width,
    height: height,
    title: 'Flappy Bird',
    parent: 'game_parent',
    useTicker: true,
    physics: {
      default: 'arcade',
      arcade: {
        debug: false,
        gravity: {y: 600}
      }
    },
    scene	: scenes,
  };
  game = new Phaser.Game(config);
}

// Cargando el juego.
window.onload = function()
{
	'use strict';
  var app = new App();
	app.start();
}
