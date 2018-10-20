var config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  parent: document.getElementById('game-div'),
  physics: {
    default: 'arcade',
    arcade: {
      debug: true,
      //gravity: { y: 900 }
    }
  },
  scene: {
    preload: preload,
    create: create,
    update: update
  }
};

var game = new Phaser.Game(config);
var player;
var cursors;
var wood;

function preload ()
{
  this.load.image('tiles', 'assets/images/world.png');
  this.load.tilemapTiledJSON('map', 'assets/images/Mundo.json');
  this.load.atlas("player", "assets/images/player.png", "assets/images/player.json");
  this.load.image('wood', 'assets/images/wood.png');
}

function create ()
{
  const map = this.make.tilemap({ key: 'map' });
  const tileset = map.addTilesetImage("world", "tiles");
  const base = map.createStaticLayer("Fondo", tileset, 0, 0);
  const elementos = map.createStaticLayer("Elementos", tileset, 0, 0);
  elementos.setCollisionByProperty({ Collider1: true });

  wood = this.physics.add.image(400, 300, 'wood');
  wood.body.immovable = true;
  wood.body.allowGravity = false;

  player = this.physics.add.sprite(500, 500, 'player', '1.png');
  var bottomframeNames = this.anims.generateFrameNames('player', {
      start: 0, end: 4,
      prefix: '', suffix: '.png'
  });
  var rightframeNames = this.anims.generateFrameNames('player', {
      start: 5, end: 8,
      prefix: '', suffix: '.png'
  });
  var topframeNames = this.anims.generateFrameNames('player', {
      start: 9, end: 12,
      prefix: '', suffix: '.png'
  });
  var leftframeNames = this.anims.generateFrameNames('player', {
      start: 13, end: 16,
      prefix: '', suffix: '.png'
  });
  this.anims.create({ key: 'bottom', frames: bottomframeNames, frameRate: 5, repeat: -1 });
  this.anims.create({ key: 'right', frames: rightframeNames, frameRate: 5, repeat: -1 });
  this.anims.create({ key: 'top', frames: topframeNames, frameRate: 5, repeat: -1 });
  this.anims.create({ key: 'left', frames: leftframeNames, frameRate: 5, repeat: -1 });
  player.anims.play('bottom');
  cursors = this.input.keyboard.createCursorKeys();

  this.physics.add.collider(player, elementos);
  //this.physics.add.collider(player, wood);

  var collider = this.physics.add.overlap(player, wood, function (player){
    console.log("Colisiono: " + player.x + ":" + player.y);
  }, null, this);

  /*
  const debugGraphics = this.add.graphics().setAlpha(0.75);
  elementos.renderDebug(debugGraphics, {
    tileColor: null, // Color of non-colliding tiles
    collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255), // Color of colliding tiles
    faceColor: new Phaser.Display.Color(40, 39, 37, 255) // Color of colliding face edges
  });*/

  this.add.text(20, 550, 'VideoGame', { fontFamily: 'Arial', fontSize: 32, color: '#000' });
  this.key_W = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W)
  this.key_A = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A)
  this.key_S = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S)
  this.key_D = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D)
}


function update ()
{
  if (this.key_A.isDown)
  {
    player.setVelocityX(-160);
    player.setVelocityY(0);
    player.anims.play('left', true);
  }
  else if (this.key_D.isDown)
  {
    player.setVelocityX(160);
    player.setVelocityY(0);
    player.anims.play('right', true);
  }
  else if (this.key_W.isDown)
  {
    player.setVelocityY(-160);
    player.setVelocityX(0);
    player.anims.play('top', true);
  }
  else if (this.key_S.isDown)
  {
    player.setVelocityY(160);
    player.setVelocityX(0);
    player.anims.play('bottom', true);
  }
  else
  {
    player.setVelocityX(0);
    player.setVelocityY(0);
    player.anims.play('bottom');
  }
}
