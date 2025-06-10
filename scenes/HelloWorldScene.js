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
    }

    init() {
    }
    preload() {
        this.load.image('tung', 'images/tu-imagen-dino.png');
        this.load.image('ground', 'Public/assets/platforms.png');
       // this.load.image('obstacle', 'Public/assets/slime_green.png');
        this.load.image('collectible', 'images/collectible.png');
    }

    create() {
        //this.ground = this.add.image(400, 300, 800, 70, 'ground').setScale(4);
        this.ground = this.add.tileSprite(400, 300, 800, 70, 'ground');
        this.physics.add.existing(this.ground);
        this.physics.add.collider(this.ground, this.tung);
        this.ground.body.immovable = true;
        this.ground.body.allowGravity = false;

        this.tung = this.physics.add.sprite(100, 250, 'tung');
        this.tung.setCollideWorldBounds(true);
        this.tung.setGravityY(200);
        this.tung.setScale(1);

        this.obstacle = this.physics.add.sprite(800, 250, 'obstacle');
        this.obstacle.setVelocityX(-this.gameSpeed);
        this.obstacle.setImmovable(true);
        this.obstacle.body.allowGravity = false;

        this.collectible = this.physics.add.sprite(400, 200, 'collectible');
        this.collectible.setScale(0.5);
        this.collectible.body.allowGravity = false;

        this.physics.add.collider(this.tung, this.ground);
        this.physics.add.collider(this.obstacle, this.ground);
        this.physics.add.collider(this.collectible, this.ground);
        this.tungObstacleCollider = this.physics.add.overlap(this.tung, this.obstacle, this.hitObstacle, null, this);
        this.physics.add.overlap(this.tung, this.collectible, this.collectItem, null, this);

        this.cursors = this.input.keyboard.createCursorKeys();
        this.input.keyboard.on('keydown-SPACE', this.jump, this);
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
        obstacle.disableBody(true, false)

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

        if (this.obstacle.x < -this.obstacle.width) {
            this.obstacle.enableBody(true, this.obstacle.x,  this.obstacle.y, true, true);
            this.obstacle.setVelocityX(-this.gameSpeed);
            this.obstacle.x = 800 + Phaser.Math.Between(0, 300);
        }

        if (this.collectible.x < -this.collectible.width) {
            this.collectible.x = 800 + Phaser.Math.Between(0, 300);
        }

        this.collectible.x -= this.gameSpeed * 0.02;
        this.obstacle.x -= this.gameSpeed * 0.02;
    }
}
