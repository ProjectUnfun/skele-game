class Monster extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, images, id, monsterClass) {
        super(scene, x, y, images);
        this.scene = scene;
        this.x = x;
        this.y = y;
        this.images = images;
        this.id = id;
        this.monsterClass = monsterClass;

        // Enable player physics
        this.scene.physics.world.enable(this);

        // Config physics body
        this.body.setSize(32, 36);
        this.body.setOffset(16, 20);

        // Create walk animations
        this.createWalkAnimations();

        // Set default animation status
        this.currentDirection = Direction.DOWN;
        this.setFrame(18);

        // Config movement
        this.configMovement();

        // Add monster object to scene
        this.scene.add.existing(this);
    }

    update() {
        this.checkMovement();
    }

    // Method configures movement
    configMovement() {
        this.minStepCount = 32;
        this.maxStepCount = 64;
        this.stepCount = Math.floor(Math.random() * this.maxStepCount);
        if (this.stepCount < this.minStepCount) this.stepCount = this.minStepCount;
        this.isProcessing = false;
    }

    // Method handles movement option selection
    checkMovement() {
        // When monster has processed the current selection to completion
        if (this.stepCount < 0) this.isProcessing = false;

        // Process further or make new selection
        if (this.isProcessing) {
            this.stepCount--;
        } else {
            this.move(Math.floor(Math.random() * 4));
            this.stepCount = Math.floor(Math.random() * this.maxStepCount);
            if (this.stepCount < this.minStepCount) this.stepCount = this.minStepCount;
        }
    }

    // Method handles movement option execution
    move(movementOption) {
        // Reset monster velocity
        this.body.setVelocity(0);

        // Check which option is given; assign direction, velocity, animations, flag
        if (movementOption === 0) {
            this.body.setVelocityX(-monsterMoveSpeed);
            this.currentDirection = Direction.LEFT;
            this.anims.play("walkLeft", true);
            this.isProcessing = true;
        } else if (movementOption === 1) {
            this.body.setVelocityX(monsterMoveSpeed);
            this.currentDirection = Direction.RIGHT;
            this.anims.play("walkRight", true);
            this.isProcessing = true;
        } else if (movementOption === 2) {
            this.body.setVelocityY(-monsterMoveSpeed);
            this.currentDirection = Direction.UP;
            this.anims.play("walkUp", true);
            this.isProcessing = true;
        } else if (movementOption === 3) {
            this.body.setVelocityY(monsterMoveSpeed);
            this.currentDirection = Direction.DOWN;
            this.anims.play("walkDown", true);
            this.isProcessing = true;
        } else if (movementOption === 4) {
            this.body.setVelocity(0);
            this.anims.stop();
            this.isProcessing = true; // This is for the step count functionality
            if (this.currentDirection === Direction.DOWN) {
                this.setFrame(18);
            } else if (this.currentDirection === Direction.UP) {
                this.setFrame(0);
            } else if (this.currentDirection === Direction.LEFT) {
                this.setFrame(9);
            } else if (this.currentDirection === Direction.RIGHT) {
                this.setFrame(27);
            }
        }
    }

    // Method prepares mob for reactivation
    reactivate(locationArray) {
        this.setFrame(18);
        this.setPosition(locationArray[0], locationArray[1]);
        this.makeActive();
    }

    // Method generates movement frames for walking animations
    createWalkAnimations() {
        let rateOfFrames = 15;
        let repeatValue = -1;

        if (this.monsterClass === MonsterClass.WHITE) {
            this.anims.create({
                key: "walkUp",
                frames: this.anims.generateFrameNumbers("whiteSkeleWalk", {
                    start: 0,
                    end: 8,
                }),
                frameRate: rateOfFrames,
                repeat: repeatValue,
            });
            this.anims.create({
                key: "walkLeft",
                frames: this.anims.generateFrameNumbers("whiteSkeleWalk", {
                    start: 9,
                    end: 17,
                }),
                frameRate: rateOfFrames,
                repeat: repeatValue,
            });
            this.anims.create({
                key: "walkDown",
                frames: this.anims.generateFrameNumbers("whiteSkeleWalk", {
                    start: 18,
                    end: 26,
                }),
                frameRate: rateOfFrames,
                repeat: repeatValue,
            });
            this.anims.create({
                key: "walkRight",
                frames: this.anims.generateFrameNumbers("whiteSkeleWalk", {
                    start: 27,
                    end: 35,
                }),
                frameRate: rateOfFrames,
                repeat: repeatValue,
            });
        } else if (this.monsterClass === MonsterClass.GREY) {
            this.anims.create({
                key: "walkUp",
                frames: this.anims.generateFrameNumbers("greySkeleWalk", {
                    start: 0,
                    end: 8,
                }),
                frameRate: rateOfFrames,
                repeat: repeatValue,
            });
            this.anims.create({
                key: "walkLeft",
                frames: this.anims.generateFrameNumbers("greySkeleWalk", {
                    start: 9,
                    end: 17,
                }),
                frameRate: rateOfFrames,
                repeat: repeatValue,
            });
            this.anims.create({
                key: "walkDown",
                frames: this.anims.generateFrameNumbers("greySkeleWalk", {
                    start: 18,
                    end: 26,
                }),
                frameRate: rateOfFrames,
                repeat: repeatValue,
            });
            this.anims.create({
                key: "walkRight",
                frames: this.anims.generateFrameNumbers("greySkeleWalk", {
                    start: 27,
                    end: 35,
                }),
                frameRate: rateOfFrames,
                repeat: repeatValue,
            });
        } else if (this.monsterClass === MonsterClass.GREEN) {
            this.anims.create({
                key: "walkUp",
                frames: this.anims.generateFrameNumbers("greenSkeleWalk", {
                    start: 0,
                    end: 8,
                }),
                frameRate: rateOfFrames,
                repeat: repeatValue,
            });
            this.anims.create({
                key: "walkLeft",
                frames: this.anims.generateFrameNumbers("greenSkeleWalk", {
                    start: 9,
                    end: 17,
                }),
                frameRate: rateOfFrames,
                repeat: repeatValue,
            });
            this.anims.create({
                key: "walkDown",
                frames: this.anims.generateFrameNumbers("greenSkeleWalk", {
                    start: 18,
                    end: 26,
                }),
                frameRate: rateOfFrames,
                repeat: repeatValue,
            });
            this.anims.create({
                key: "walkRight",
                frames: this.anims.generateFrameNumbers("greenSkeleWalk", {
                    start: 27,
                    end: 35,
                }),
                frameRate: rateOfFrames,
                repeat: repeatValue,
            });
        }
    }
}