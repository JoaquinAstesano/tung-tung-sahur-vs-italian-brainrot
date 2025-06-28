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
    this.load.image("Ground1", "Public/assets/Ground1.png"); // <-- Añadido
    this.load.image("Ground2", "Public/assets/Ground2.png"); 
    this.load.image("bomb", "Public/assets/bomb.png");
    this.load.image("obstacle", "Public/assets/obstacle.png"); 
    // Fondos parallax
    this.load.image("cielo", "Public/assets/cielo.png");
    this.load.image("nubes" , "Public/assets/nubes.png");
    this.load.image("arboles1", "Public/assets/arboles1.png");
    this.load.image("arboles2", "Public/assets/arboles2.png");
  }

  create() {
    // Fondos parallax
    this.cielo = this.add.tileSprite(0, 300, 1600, 600, "cielo").setScrollFactor(0);
    this.nubes = this.add.tileSprite(0, 300, 1600, 600, "nubes").setScrollFactor(0);
    this.arboles1 = this.add.tileSprite(0, 300, 1600, 600, "arboles1").setScrollFactor(0);
    this.arboles2 = this.add.tileSprite(0, 300, 1600, 600, "arboles2").setScrollFactor(0);
    
    // Ajusta todos los ground para que estén juntos en la parte inferior del canvas 800x300
    // Ground1: 22px alto, Ground: 18px alto, Ground2: 24px alto (según tu preload)
    // Orden correcto: Ground1 (abajo), Ground (medio), Ground2 (arriba)
    // Ground1 (abajo del todo)
    this.Ground1 = this.add.tileSprite(400, 289, 800, 22, "Ground1"); // 300 - 22/2 = 289

    // Ground (en el medio)
    this.Ground = this.add.tileSprite(400, 278, 800, 18, "Ground");   // 289 - 22/2 + 18/2 = 278

    // Ground2 (arriba)
    this.Ground2 = this.add.tileSprite(400, 266, 800, 24, "Ground2"); // 278 - 18/2 + 24/2 = 266

    this.physics.add.existing(this.Ground);
    this.Ground.body.immovable = true;
    this.Ground.body.allowGravity = false;

    // Si quieres usar Ground2, agrégalo en otra posición más adelante
    // Por ejemplo:
    // this.Ground2 = this.add.tileSprite(400, 244, 800, 24, "Ground2");

    this.tung = this.physics.add.sprite(100, 150, "tung"); // Ajusta Y para que esté sobre el suelo
    this.tung.setCollideWorldBounds(true);
    this.tung.setGravityY(200);
    this.tung.setScale(0.3, 0.4);
    this.tung.setFlipX(true);

    this.physics.add.collider(this.tung, this.Ground);

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
    this.cielo.tilePositionX += this.gameSpeed * 0.005;
    this.nubes.tilePositionX += this.gameSpeed * 0.01;
    this.arboles1.tilePositionX += this.gameSpeed * 0.015;
    this.arboles2.tilePositionX += this.gameSpeed * 0.02;

    //this.Ground.tilePositionX += this.gameSpeed * 0.02;
    //this.Ground1.tilePositionX += this.gameSpeed * 0.02;
    //this.Ground2.tilePositionX += this.gameSpeed * 0.02;
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
        this.obstacle.x = 2000; // <-- Corregido (era .X)
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
