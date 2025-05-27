export default class HelloWorldScene extends Phaser.Scene {
    constructor() {
        super("hello-world");
        this.ground = null; // Declare ground
        this.tung = null; // Declare tung
        this.obstaclesGroup = null; // Group for obstacles
        this.aereosGroup = null; // Group for aereos
        this.collectible = null; // Declare collectible
        this.cursors = null; // Declare cursors
        this.gameSpeed = 200; // Initialize gameSpeed
    }

    init() {
      // this is called before the scene is created
      // init variables
      // take data passed from other scenes
      // data object param {}
    }
    preload() {
        this.load.image('tung', 'images/tu-imagen-dino.png'); // Ensure the file path is correct
        this.load.image('ground', 'images/ground.png');
        this.load.image('obstacle', 'images/obstacle.png'); // Load obstacle image
        this.load.image('collectible', 'images/collectible.png'); // Load collectible image
        this.load.image('aereo', 'images/aereo.png'); // Ensure aereo image is loaded
    }

    create() {
        this.ground = this.add.tileSprite(400, 300, 800, 70, 'ground'); // Ensure ground is visible
        this.physics.add.existing(this.ground, true);

        this.tung = this.physics.add.sprite(100, 250, 'tung'); // Ensure tung is visible
        this.tung.setCollideWorldBounds(true);
        this.tung.setGravityY(200);
        this.tung.setScale(0.7); // Scale the character

        this.obstaclesGroup = this.physics.add.group(); // Group for obstacles
        this.aereosGroup = this.physics.add.group(); // Group for aereos

        this.collectible = this.physics.add.sprite(400, 200, 'collectible'); // Add collectible
        this.collectible.setScale(0.5); // Scale the collectible
        this.collectible.body.allowGravity = false; // Prevent gravity on collectible

        this.physics.add.collider(this.tung, this.ground); // Collision between tung and ground
        this.physics.add.collider(this.obstaclesGroup, this.ground); // Collision between obstacles and ground
        this.physics.add.collider(this.aereosGroup, this.ground); // Collision between aereos and ground
        this.physics.add.collider(this.tung, this.obstaclesGroup, this.hitObstacle, null, this); // Collision with obstacles
        this.physics.add.collider(this.tung, this.aereosGroup, this.hitObstacle, null, this); // Collision with aereos
        this.physics.add.overlap(this.tung, this.collectible, this.collectItem, null, this); // Add overlap logic

        this.cursors = this.input.keyboard.createCursorKeys();
        this.input.keyboard.on('keydown-SPACE', this.jump, this);

        // Spawn obstacles and aereos periodically
        this.time.addEvent({
            delay: 2000, // Spawn obstacle every 2 seconds
            callback: this.spawnObstacle,
            callbackScope: this,
            loop: true
        });

        this.time.addEvent({
            delay: 3000, // Spawn aereo every 3 seconds
            callback: this.spawnAereo,
            callbackScope: this,
            loop: true
        });
    }

    spawnObstacle() {
        const obstacle = this.obstaclesGroup.create(800, 250, 'obstacle'); // Spawn obstacle
        obstacle.setVelocityX(-this.gameSpeed);
        obstacle.setImmovable(true);
        obstacle.body.allowGravity = false;
    }

    spawnAereo() {
        const aereo = this.aereosGroup.create(800, Phaser.Math.Between(50, 150), 'aereo'); // Spawn aereo at random height
        aereo.setVelocityX(-this.gameSpeed);
        aereo.setImmovable(true);
        aereo.body.allowGravity = false;
    }

    collectItem(tung, collectible) {
        collectible.disableBody(true, true); // Disable and hide the collectible
        console.log("Collectible picked up!"); // Log message for debugging

        // Grant temporary immunity
        this.tung.setTint(0x00ff00); // Change tung's color to indicate immunity
        this.tung.isImmune = true; // Set an immunity flag

        // Temporarily disable collision between tung and obstacle
        this.physics.world.removeCollider(this.tungObstacleCollider);
        this.physics.world.removeCollider(this.tungAereoCollider); // Disable aereo collision

        this.time.delayedCall(3000, () => { // Remove immunity after 3 seconds
            this.tung.clearTint(); // Reset tung's color
            this.tung.isImmune = false; // Remove immunity flag

            // Re-enable collision between tung and obstacle
            this.tungObstacleCollider = this.physics.add.collider(this.tung, this.obstacle, this.hitObstacle, null, this);
            this.tungAereoCollider = this.physics.add.collider(this.tung, this.aereo, this.hitObstacle, null, this); // Re-enable aereo collision
        });
    }

    jump() {
        if (this.tung.body.touching.down) {
            this.tung.setVelocityY(-600);
        }
    }

    hitObstacle() {
        if (this.tung.isImmune) {
            console.log("Tung is immune and avoids the obstacle!");
            return; // Skip obstacle collision logic if immune
        }

        this.scene.pause();
        alert("¡Perdiste!");
        setTimeout(() => {
            this.scene.restart();
        }, 1000);
    }

    update() {
        this.ground.tilePositionX += this.gameSpeed * 0.02; // Move ground to the right

        this.obstaclesGroup.getChildren().forEach(obstacle => {
            if (obstacle.x < -obstacle.width) {
                obstacle.destroy(); // Remove obstacle if it goes off-screen
            }
        });

        this.aereosGroup.getChildren().forEach(aereo => {
            if (aereo.x < -aereo.width) {
                aereo.destroy(); // Remove aereo if it goes off-screen
            }
        });

        if (this.collectible.x < -this.collectible.width) {
            this.collectible.x = 800 + Phaser.Math.Between(0, 300); // Reset collectible position
        }

        this.collectible.x -= this.gameSpeed * 0.02; // Move collectible to the left
    }
}
