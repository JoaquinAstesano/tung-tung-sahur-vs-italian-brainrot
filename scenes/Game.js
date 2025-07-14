export default class Game extends Phaser.Scene {
  constructor() {
    super("Game");
    this.Ground = null;
    this.tung = null;
    this.obstacle = null;
    this.collectible = null;
    this.cursors = null;
    this.gameSpeed = 200;
    this.aereosGroup = null;
    this.bombs = null; 
    this.bombTimer = null;
    this.score = 0;
  }

  init() {}
  preload() {

    
    this.load.image("tung", "Public/assets/9eiAAB.png"); 
    this.load.image("bomb", "Public/assets/bomb.png");
    this.load.image("bombini", "Public/assets/bombini.png");
    this.load.image("obstacle", "Public/assets/tralalero tralala.png"); 
    this.load.image("Ground", "Public/assets/Ground.png");
    this.load.image("Ground1", "Public/assets/Ground1.png"); 
    this.load.image("Ground2", "Public/assets/Ground2.png");
    this.load.image("sprite-cielo", "Public/assets/Sprite-cielo.png");
    this.load.image("arboles1", "Public/assets/arboles1.png");
    this.load.image("arboles2", "Public/assets/arboles2.png");
    this.load.image("brrbrrpatapim2", "Public/assets/brrbrrpatapim2.png");
    this.load.audio('musicGame', 'Public/assets/BRR BRR PATAPIM FUNK.mp3'); 
  }

  create() {
    const musicMenu = this.sound.get('musicMenu');
    if (musicMenu && musicMenu.isPlaying) musicMenu.stop();
    if (!this.sound.get('musicGame')) {
      this.musicGame = this.sound.add('musicGame', { loop: true, volume: 0.1 });
      this.musicGame.play();
    } else {
      this.musicGame = this.sound.get('musicGame');
      if (!this.musicGame.isPlaying) this.musicGame.play();
      this.musicGame.setVolume(0.1);
    }
    this.cielo = this.add.tileSprite(400, 150, 800, 300, "sprite-cielo").setScrollFactor(0).setDepth(-10);
    this.arboles1 = this.add.tileSprite(400, 150, 800, 300, "arboles1").setScrollFactor(0);
    this.arboles2 = this.add.tileSprite(400, 150, 800, 300, "arboles2").setScrollFactor(0);
    this.Ground1 = this.add.tileSprite(400, 289, 800, 22, "Ground1"); 
    this.Ground = this.add.tileSprite(400, 278, 800, 18, "Ground");  
    this.Ground2 = this.add.tileSprite(400, 266, 800, 24, "Ground2"); 
    this.physics.add.existing(this.Ground);
    this.Ground.body.immovable = true;
    this.Ground.body.allowGravity = false;
    this.tung = this.physics.add.sprite(100, 150, "tung"); 
    this.tung.setCollideWorldBounds(true);
    this.tung.setGravityY(200);
    this.tung.setScale(0.3, 0.4);
    this.physics.add.collider(this.tung, this.Ground);
    this.obstacle = this.physics.add.sprite(800, 235, "obstacle");
    this.obstacle.setVelocityX(-this.gameSpeed);
    this.obstacle.setImmovable(true);
    this.obstacle.body.allowGravity = false;
    this.aereoObstacle = this.physics.add.sprite(800, 130, "bombini");
    this.aereoObstacle.setVelocityX(-this.gameSpeed);
    this.aereoObstacle.setImmovable(true);
    this.aereoObstacle.body.allowGravity = false;
    this.physics.add.collider(this.aereoObstacle, this.Ground);
    this.tungAereoObstacleCollider = this.physics.add.overlap(
      this.tung,
      this.aereoObstacle,
      this.hitObstacle,
      null,
      this
    );
    this.aereoObstacle.x = 2000; 
    this.nextIsAereo = false;
    this.collectible = this.physics.add.sprite(400, 200 , "brrbrrpatapim2"); 
    this.collectible.setScale(0.5);
    this.collectible.body.allowGravity = false;
    this.bombs = this.physics.add.group();
    this.bombTimer = this.time.addEvent({
      delay: 5000,
      callback: this.spawnBomb,
      callbackScope: this,
      loop: true,
    });
    this.physics.add.collider(this.obstacle, this.Ground);
    this.physics.add.collider(this.collectible, this.Ground);
    this.tungObstacleCollider = this.physics.add.overlap(
      this.tung,
      this.obstacle,
      this.hitObstacle,
      null,
      this
    );
    this.physics.add.overlap(
      this.tung,
      this.collectible,
      this.collectItem,
      null,
      this
    );
    this.physics.add.overlap(
      this.tung,
      this.bombs,
      this.hitObstacle,
      null,
      this
    );
    this.cursors = this.input.keyboard.createCursorKeys();
    this.keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
    this.keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    this.keyS = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
    this.keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
    this.input.keyboard.on("keydown-W", this.jump, this);
    this.input.keyboard.on("keydown-S", () => {
      if (this.tung.body.touching.down) {
        this.tung.setScale(0.15, 0.2);
        this.tung.y = this.Ground.y - this.Ground.height / 2 - (this.tung.displayHeight / 2) + 1;
      }
    }, this);
    this.input.keyboard.on("keyup-S", () => {
      this.tung.setScale(0.3, 0.4);
      this.tung.y = this.Ground.y - this.Ground.height / 2 - (this.tung.displayHeight / 2) + 1;
    }, this);
    this.scoreText = this.add.text(790, 10, 'Score: 0', {
      fontSize: '24px',
      fill: '#fff',
      fontFamily: 'Pixellaria',
      align: 'right',
      stroke: '#000',
      strokeThickness: 4
    }).setOrigin(1, 0);
  }

  spawnBomb() {
    const x = Phaser.Math.Between(0, 300);
    const bomb = this.bombs.create(x, 0, "bomb");
    bomb.setVelocityY(Phaser.Math.Between(200, 350));
    bomb.setGravityY(0);
    bomb.setCollideWorldBounds(false);
    bomb.setScale(0.5);
    bomb.body.allowGravity = false;
    bomb.outOfBoundsKill = true;
    bomb.checkWorldBounds = true;
    bomb.update = function () {
      if (this.y > 600) {
        this.destroy();
      }
    };
  }

  collectItem(tung, collectible) {
    collectible.disableBody(true, true);
    console.log("Collectible picked up!");

    this.tung.isImmune = true;

    this.time.delayedCall(7000, () => {
      this.tung.clearTint();
      this.tung.isImmune = false;
    });
  }

  jump() {
    if (this.tung.body.touching.down) {
      this.tung.setVelocityY(-600);
    }
  }

  hitObstacle(tung, obstacle) {
    if (this.tung.isImmune && obstacle.texture && obstacle.texture.key === "bomb") {
      obstacle.disableBody(true, true);
      return;
    }

    obstacle.disableBody(true, false);

    if (this.tung.isImmune) {
      console.log("Tung is immune and avoids the obstacle!");
      this.tung.isImmune = false;
      return;
    }

    const musicGame = this.sound.get('musicGame');
    if (musicGame && musicGame.isPlaying) musicGame.stop();

    this.score = 0;
    this.scoreText.setText('Score: ' + this.score);

    console.log("Game Over! Volviendo al menú...");
    this.scene.start('PantallaMenu');
  }

  update() {
    this.cielo.tilePositionX += this.gameSpeed * 0.005;
    this.arboles1.tilePositionX += this.gameSpeed * 0.015;
    this.arboles2.tilePositionX += this.gameSpeed * 0.02;
    this.Ground.tilePositionX += this.gameSpeed * 0.02;
    this.Ground1.tilePositionX += this.gameSpeed * 0.02;
    this.Ground2.tilePositionX += this.gameSpeed * 0.02;
    if (this.keyA.isDown) {
      this.tung.setVelocityX(-200);
      this.tung.setFlipX(true);
    } else if (this.keyD.isDown) {
      this.tung.setVelocityX(200);
      this.tung.setFlipX(false);
    } else {
      this.tung.setVelocityX(0);
    }
    if (!this.nextIsAereo) {
      if (this.obstacle.x < -this.obstacle.width) {
        this.obstacle.enableBody(
          true,
          this.obstacle.x,
          this.obstacle.y,
          true,
          true
        );
        this.obstacle.setVelocityX(-this.gameSpeed);
        this.obstacle.x = 800 + Phaser.Math.Between(0, 300);
        this.nextIsAereo = true;
        this.aereoObstacle.x = 2000;
      }
    } else {
      if (this.aereoObstacle.x < -this.aereoObstacle.width) {
        this.aereoObstacle.enableBody(
          true,
          this.aereoObstacle.x,
          this.aereoObstacle.y,
          true,
          true
        );
        this.aereoObstacle.setVelocityX(-this.gameSpeed);
        this.aereoObstacle.x = 800 + Phaser.Math.Between(0, 300);
        this.nextIsAereo = false;
        this.obstacle.x = 2000; 
      }
    }
    if (this.collectible.x < -this.collectible.width) {
      this.collectible.x = 800 + Phaser.Math.Between(0, 300);
    }
    this.collectible.x -= this.gameSpeed * 0.02;
    this.obstacle.x -= this.gameSpeed * 0.02;
    this.aereoObstacle.x -= this.gameSpeed * 0.02;
    this.bombs.children.iterate(function (bomb) {
      if (bomb && bomb.update) bomb.update();
    });
    if (this.tung.x < 0) {
      this.tung.x = 0;
    }
    if (this.tung.x > 300) {
      this.tung.x = 300;
    }
    this.score += 1;
    this.scoreText.setText('Score: ' + this.score);
  }
}
