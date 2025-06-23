export default class HelloWorldScene extends Phaser.Scene {
  constructor() {
    super("hello-world");
    this.ground = null;
    this.tung = null;
    this.obstacle = null;
    this.collectible = null;
    this.cursors = null;
    this.gameSpeed = 200;
    this.aereosGroup = null;
    this.bombs = null; // Nuevo grupo de bombas
    this.bombTimer = null;
  }

  init() {}
  preload() {
    //this.load.image("tung", "Public/assets/9eiAAB.png");
    this.load.image("ground", "Public/assets/platforms.png");
    // this.load.image('obstacle', 'Public/assets/slime_green.png');
    this.load.image("collectible", "images/collectible.png");
    this.load.image("bomb", "Public/assets/bomb.png"); 
  }

  create() {
    //this.ground = this.add.image(400, 300, 800, 70, 'ground').setScale(4);
    this.ground = this.add.tileSprite(400, 300, 800, 70, "ground");
    this.physics.add.existing(this.ground);
    this.physics.add.collider(this.ground, this.tung);
    this.ground.body.immovable = true;
    this.ground.body.allowGravity = false;

    this.tung = this.physics.add.sprite(100, 150, "tung");
    this.tung.setCollideWorldBounds(true);
    this.tung.setGravityY(200);
    this.tung.setScale(2, 2);
    this.tung.setFlipX(true);

    this.obstacle = this.physics.add.sprite(800, 250, "obstacle");
    this.obstacle.setVelocityX(-this.gameSpeed);
    this.obstacle.setImmovable(true);
    this.obstacle.body.allowGravity = false;

    this.aereoObstacle = this.physics.add.sprite(800, 150, "obstacle");
    this.aereoObstacle.setVelocityX(-this.gameSpeed);
    this.aereoObstacle.setImmovable(true);
    this.aereoObstacle.body.allowGravity = false;
    this.physics.add.collider(this.aereoObstacle, this.ground);
    this.tungAereoObstacleCollider = this.physics.add.overlap(
      this.tung,
      this.aereoObstacle,
      this.hitObstacle,
      null,
      this
    );
    this.aereoObstacle.x = 2000; // Start off-screen
    this.nextIsAereo = false;

    this.collectible = this.physics.add.sprite(400, 200, "collectible");
    this.collectible.setScale(0.5);
    this.collectible.body.allowGravity = false;

    this.bombs = this.physics.add.group();
    this.bombTimer = this.time.addEvent({
      delay: 5000,
      callback: this.spawnBomb,
      callbackScope: this,
      loop: true,
    });

    this.physics.add.collider(this.tung, this.ground);
    this.physics.add.collider(this.obstacle, this.ground);
    this.physics.add.collider(this.collectible, this.ground);
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

    // Colisión entre tung y bombas: perder al colisionar
    this.physics.add.overlap(
      this.tung,
      this.bombs,
      this.hitObstacle,
      null,
      this
    );

    this.cursors = this.input.keyboard.createCursorKeys();
    this.input.keyboard.on("keydown-SPACE", this.jump, this);

    this.keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    this.keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
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
    // Si tung es inmune y el obstáculo es una bomba, solo destruye la bomba
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

    //alert("¡Perdiste!");
    console.log("Game Over! Restarting in 1 second...");
    this.scene.restart();
  }

  update() {
    this.ground.tilePositionX += this.gameSpeed * 0.02;

    // Movimiento de tung con "A" (izquierda) y "D" (derecha)
    if (this.keyA.isDown) {
      this.tung.setVelocityX(-200);
      this.tung.setFlipX(true);
    } else if (this.keyD.isDown) {
      this.tung.setVelocityX(200);
      this.tung.setFlipX(false);
    } else {
      this.tung.setVelocityX(0);
    }

    //if (this.cursors.down.isDown) {
    //this.tung.setScale(0.5, 1); // Más bajo
    //this.tung.y = 150; // Baja un poco la posición
    //} else {
    //this.tung.setScale(0.1, 0.5); // Altura normal
    //this.tung.y = 150; // Posición normal
    //}

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
