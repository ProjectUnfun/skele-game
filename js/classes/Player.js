class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, images, playerClass, playerName) {
        super(scene, x, y, images);
        this.scene = scene;
        this.x = x;
        this.y = y;
        this.images = images;
        this.playerClass = playerClass;
        this.playerName = playerName;

        // Enable player physics
        this.scene.physics.world.enable(this);

        // Config physics body
        this.body.setSize(32, 36);

        // Create walk animations
        this.createWalkAnimations();

        // Set default animation status
        this.currentDirection = Direction.DOWN;
        this.setFrame(18);

        // Create the user name text
        this.createNameText();

        // Make the game camera follow the player container
        this.scene.cameras.main.startFollow(this);

        // Add player to scene
        this.scene.add.existing(this);
    }

    update(cursors) {
        this.checkIdle(cursors);
        this.checkMovement(cursors);
        this.updateNameText();
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
                this.anims.play("walkDown", true);
                this.anims.stop();
                this.setFrame(18);
            } else if (this.currentDirection === Direction.UP) {
                this.anims.play("walkUp", true);
                this.anims.stop();
                this.setFrame(0);
            } else if (this.currentDirection === Direction.LEFT) {
                this.anims.play("walkLeft", true);
                this.anims.stop();
                this.setFrame(9);
            } else if (this.currentDirection === Direction.RIGHT) {
                this.anims.play("walkRight", true);
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
            this.anims.play("walkLeft", true);
        } else if (cursors.right.isDown) {
            this.body.setVelocityX(playerMoveSpeed);
            this.currentDirection = Direction.RIGHT;
            this.anims.play("walkRight", true);
        } else if (cursors.up.isDown) {
            this.body.setVelocityY(-playerMoveSpeed);
            this.currentDirection = Direction.UP;
            this.anims.play("walkUp", true);
        } else if (cursors.down.isDown) {
            this.body.setVelocityY(playerMoveSpeed);
            this.currentDirection = Direction.DOWN;
            this.anims.play("walkDown", true);
        }
    }

    // Method creates the name text
    createNameText() {
        this.nameText = this.scene.add.text(this.x, this.y - 44, this.playerName,
            {
                fontFamily: 'Arial, Helvetica, sans-serif',
                fontSize: 14,
            }).setOrigin(0.5, 0.5);
        this.updateNameText();
    }

    // Method updates the location of the name text
    updateNameText() {
        this.nameText.setFill("#FFFFFF");
        this.nameText.setText(this.playerName);
        this.nameText.setPosition(this.x, this.y - 44);
    }

    // Method generates movement frames for player walking animations
    createWalkAnimations() {
        let rateOfFrames = 15;
        let repeatValue = 0;

        if (this.playerClass === PlayerClass.FIGHTER) {
            this.anims.create({
                key: "walkUp",
                frames: this.anims.generateFrameNumbers("meleeWalk", {
                    start: 0,
                    end: 8,
                }),
                frameRate: rateOfFrames,
                repeat: repeatValue,
            });
            this.anims.create({
                key: "walkLeft",
                frames: this.anims.generateFrameNumbers("meleeWalk", {
                    start: 9,
                    end: 17,
                }),
                frameRate: rateOfFrames,
                repeat: repeatValue,
            });
            this.anims.create({
                key: "walkDown",
                frames: this.anims.generateFrameNumbers("meleeWalk", {
                    start: 18,
                    end: 26,
                }),
                frameRate: rateOfFrames,
                repeat: repeatValue,
            });
            this.anims.create({
                key: "walkRight",
                frames: this.anims.generateFrameNumbers("meleeWalk", {
                    start: 27,
                    end: 35,
                }),
                frameRate: rateOfFrames,
                repeat: repeatValue,
            });
        } else if (this.playerClass === PlayerClass.RANGER) {
            this.anims.create({
                key: "walkUp",
                frames: this.anims.generateFrameNumbers("rangerWalk", {
                    start: 0,
                    end: 8,
                }),
                frameRate: rateOfFrames,
                repeat: repeatValue,
            });
            this.anims.create({
                key: "walkLeft",
                frames: this.anims.generateFrameNumbers("rangerWalk", {
                    start: 9,
                    end: 17,
                }),
                frameRate: rateOfFrames,
                repeat: repeatValue,
            });
            this.anims.create({
                key: "walkDown",
                frames: this.anims.generateFrameNumbers("rangerWalk", {
                    start: 18,
                    end: 26,
                }),
                frameRate: rateOfFrames,
                repeat: repeatValue,
            });
            this.anims.create({
                key: "walkRight",
                frames: this.anims.generateFrameNumbers("rangerWalk", {
                    start: 27,
                    end: 35,
                }),
                frameRate: rateOfFrames,
                repeat: repeatValue,
            });
        } else if (this.playerClass === PlayerClass.CASTER) {
            this.anims.create({
                key: "walkUp",
                frames: this.anims.generateFrameNumbers("mageWalk", {
                    start: 0,
                    end: 8,
                }),
                frameRate: rateOfFrames,
                repeat: repeatValue,
            });
            this.anims.create({
                key: "walkLeft",
                frames: this.anims.generateFrameNumbers("mageWalk", {
                    start: 9,
                    end: 17,
                }),
                frameRate: rateOfFrames,
                repeat: repeatValue,
            });
            this.anims.create({
                key: "walkDown",
                frames: this.anims.generateFrameNumbers("mageWalk", {
                    start: 18,
                    end: 26,
                }),
                frameRate: rateOfFrames,
                repeat: repeatValue,
            });
            this.anims.create({
                key: "walkRight",
                frames: this.anims.generateFrameNumbers("mageWalk", {
                    start: 27,
                    end: 35,
                }),
                frameRate: rateOfFrames,
                repeat: repeatValue,
            });
        }
    }
}