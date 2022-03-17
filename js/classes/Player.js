class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, images) {
        super(scene, x, y, images);
        this.scene = scene;
        this.x = x;
        this.y = y;
        this.images = images;

        // Enable player physics
        this.scene.physics.world.enable(this);

        // Config physics body
        this.body.setSize(32, 36);

        this.createWalkAnimations();

        // Set default animation status
        this.currentDirection = Direction.DOWN;
        this.setFrame(18);

        // Make the game camera follow the player container
        this.scene.cameras.main.startFollow(this);

        // Add player to scene
        this.scene.add.existing(this);
    }

    update(cursors) {
        this.checkIdle(cursors);
        this.checkMovement(cursors);
    }

    checkIdle(cursors) {
        // If none of the cursors are being pressed
        if (
            !cursors.left.isDown &&
            !cursors.right.isDown &&
            !cursors.up.isDown &&
            !cursors.down.isDown
        ) {
            // Stop animations
            this.anims.stop();

            // Check which direction player is facing and set animation frame accordingly
            if (this.currentDirection === Direction.DOWN) {
                this.anims.play("meleeWalkDown", true);
                this.anims.stop();
                this.setFrame(18);
            } else if (this.currentDirection === Direction.UP) {
                this.anims.play("meleeWalkUp", true);
                this.anims.stop();
                this.setFrame(0);
            } else if (this.currentDirection === Direction.LEFT) {
                this.anims.play("meleeWalkLeft", true);
                this.anims.stop();
                this.setFrame(9);
            } else if (this.currentDirection === Direction.RIGHT) {
                this.anims.play("meleeWalkRight", true);
                this.anims.stop();
                this.setFrame(27);
            }
        }
    }

    checkMovement(cursors) {
        // Reset player velocity
        this.body.setVelocity(0);

        // Check which key is pressed; assign direction, velocity, and animations
        if (cursors.left.isDown) {
            this.body.setVelocityX(-playerMoveSpeed);
            this.currentDirection = Direction.LEFT;
            this.anims.play("meleeWalkLeft", true);
        } else if (cursors.right.isDown) {
            this.body.setVelocityX(playerMoveSpeed);
            this.currentDirection = Direction.RIGHT;
            this.anims.play("meleeWalkRight", true);
        } else if (cursors.up.isDown) {
            this.body.setVelocityY(-playerMoveSpeed);
            this.currentDirection = Direction.UP;
            this.anims.play("meleeWalkUp", true);
        } else if (cursors.down.isDown) {
            this.body.setVelocityY(playerMoveSpeed);
            this.currentDirection = Direction.DOWN;
            this.anims.play("meleeWalkDown", true);
        }
    }

    // Method generates movement frames for player walking animations
    createWalkAnimations() {
        let rateOfFrames = 15;
        let repeatValue = 0;

        this.anims.create({
            key: "meleeWalkUp",
            frames: this.anims.generateFrameNumbers("meleeWalk", {
                start: 0,
                end: 8,
            }),
            frameRate: rateOfFrames,
            repeat: repeatValue,
        });

        this.anims.create({
            key: "meleeWalkLeft",
            frames: this.anims.generateFrameNumbers("meleeWalk", {
                start: 9,
                end: 17,
            }),
            frameRate: rateOfFrames,
            repeat: repeatValue,
        });

        this.anims.create({
            key: "meleeWalkDown",
            frames: this.anims.generateFrameNumbers("meleeWalk", {
                start: 18,
                end: 26,
            }),
            frameRate: rateOfFrames,
            repeat: repeatValue,
        });

        this.anims.create({
            key: "meleeWalkRight",
            frames: this.anims.generateFrameNumbers("meleeWalk", {
                start: 27,
                end: 35,
            }),
            frameRate: rateOfFrames,
            repeat: repeatValue,
        });
    }
}