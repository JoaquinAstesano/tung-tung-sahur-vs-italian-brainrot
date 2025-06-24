export default class HelloWorldScene extends Phaser.Scene {
  constructor() {
    super("hello-world");
    this.Ground = null;
    this.tung = null;
    this.obstacle = null;
    this.collectible = null;
    this.cursors = null;
    this.gameSpeed = 200;
    this.aereosGroup = null;
    this.bombs = null; 
    this.bombTimer = null;
  }

  init() {}
  preload() {
    this.load.image("tung", "Public/assets/9eiAAB.png");
    this.load.image("Ground", "Public/assets/Ground.png");
    this.load.image("Ground2", "Public/assets/Ground2.png");
    this.load.image("bomb", "Public/assets/bomb.png");
    // this.load.image("coin", "Public/assets/coin.png");
    // Fondos parallax
    this.load.image("bg", "Public/assets/parallax-mountain-bg.png");
    this.load.image("fgTrees", "Public/assets/parallax-mountain-foreGround-trees.png");
    this.load.image("far", "Public/assets/parallax-mountain-montain-far.png");
    this.load.image("mountains", "Public/assets/parallax-mountain-mountains.png");
    this.load.image("trees", "Public/assets/parallax-mountain-trees.png");
  }

  create() {
    // Fondos parallax
    this.bg = this.add.tileSprite(0, 300, 1600, 600, "bg").setScrollFactor(0);
    this.far = this.add.tileSprite(0, 300, 1600, 600, "far").setScrollFactor(0);
    this.mountains = this.add.tileSprite(0, 300, 1600, 600, "mountains").setScrollFactor(0);
    this.trees = this.add.tileSprite(0, 300, 1600, 600, "trees").setScrollFactor(0);
    this.fgTrees = this.add.tileSprite(0, 300, 1600, 600, "fgTrees").setScrollFactor(0);

    this.Ground2 = this.add.tileSprite(0, 260, 1600, 24, "Ground2");
    

    this.Ground = this.add.tileSprite(400, 300, 800, 70, "Ground");
    this.physics.add.existing(this.Ground);
    this.physics.add.collider(this.Ground, this.tung);
    this.Ground.body.immovable = true;
    this.Ground.body.allowGravity = false;

    this.tung = this.physics.add.sprite(100, 150, "tung");
    this.tung.setCollideWorldBounds(true);
    this.tung.setGravityY(200);
    this.tung.setScale(0.3, 0.4);
    this.tung.setFlipX(true);

    this.obstacle = this.physics.add.sprite(800, 250, "obstacle");
    this.obstacle.setVelocityX(-this.gameSpeed);
    this.obstacle.setImmovable(true);
    this.obstacle.body.allowGravity = false;

    this.aereoObstacle = this.physics.add.sprite(800, 180, "obstacle");
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

    this.collectible = this.physics.add.sprite(400, 200 , "bomb"); 
    this.collectible.setScale(0.5);
    this.collectible.body.allowGravity = false;

    this.bombs = this.physics.add.group();
    this.bombTimer = this.time.addEvent({
      delay: 5000,
      callback: this.spawnBomb,
      callbackScope: this,
      loop: true,
    });

    this.physics.add.collider(this.tung, this.Ground);
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

    // Salto con W
    this.input.keyboard.on("keydown-W", this.jump, this);

    // Agacharse con S
    this.input.keyboard.on("keydown-S", () => {
      if (this.tung.body.touching.down) {
        this.tung.setScale(0.15, 0.2);
      }
    }, this);
    this.input.keyboard.on("keyup-S", () => {
      this.tung.setScale(0.3, 0.4);
      this.tung.y = 215;
    }, this);
    
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

    // Ir al menú principal después de perder
    console.log("Game Over! Volviendo al menú...");
    this.scene.start('PantallaMenu');
  }

  update() {
    // Parallax
    this.bg.tilePositionX += this.gameSpeed * 0.005;
    this.far.tilePositionX += this.gameSpeed * 0.01;
    this.mountains.tilePositionX += this.gameSpeed * 0.015;
    this.trees.tilePositionX += this.gameSpeed * 0.02;
    this.fgTrees.tilePositionX += this.gameSpeed * 0.025;

    this.Ground.tilePositionX += this.gameSpeed * 0.02;
    this.Ground2.tilePositionX += this.gameSpeed * 0.02;
    // Movimiento con WASD
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
        this.obstacle.X = 2000;
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
  }
}
