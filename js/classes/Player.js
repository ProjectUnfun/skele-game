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
        this.body.setOffset(16, 20);

        // Create walk animations
        this.createWalkAnimations();

        // Set default animation status
        this.currentDirection = Direction.DOWN;
        this.setFrame(18);

        // Config combat
        this.configCombat();

        // Create the user name text & health and energy bars
        this.createNameText();
        this.createHealthBar();
        this.createEnergyBar();

        // Make the game camera follow the player
        this.scene.cameras.main.startFollow(this);

        // Add player object to scene
        this.scene.add.existing(this);
    }

    update(cursors) {
        this.checkIdle(cursors);
        this.checkMovement(cursors);
        this.updateNameText();
        this.updateHealthBar();
        this.updateEnergyBar();
    }

    // Method configs combat
    configCombat() {
        if (this.playerClass === PlayerClass.FIGHTER) {
            // Config health - melee needs to be able to take hits
            this.health = 9;
            this.maxHealth = 9;

            // Config energy - melee should be able to attack 9x before out of energy
            this.energy = 9;
            this.maxEnergy = 9;

            // Config attack value - melee should kill in 3 hits
            this.attackValue = 3;
        } else if (this.playerClass === PlayerClass.RANGER) {
            // Config health - ranger should be mildly sturdy
            this.health = 6;
            this.maxHealth = 6;

            // Config energy - ranger should be able to attack 16x before out of energy
            this.energy = 16;
            this.maxEnergy = 16;

            // Config attack value - ranger should kill in 4 hits
            this.attackValue = 2;
        } else if (this.playerClass === PlayerClass.CASTER) {
            // Config health - mage should be glass cannon
            this.health = 4;
            this.maxHealth = 4;

            // Config energy - mage should be able to attack 4x before out of energy
            this.energy = 4;
            this.maxEnergy = 4;

            // Config attack value - mage should kill in 2 hits
            this.attackValue = 5;
        }

        // Track damage receiving status
        this.canBeAttacked = true;

        // Track damage dealing status
        this.isAttacking = false;
    }

    // Method handles idle status
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

            // Check which direction player is facing and set frame
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

    // Method handles movement status
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
        this.nameText.setPosition(this.x, this.y - 44);
    }

    // Method creates the health bar
    createHealthBar() {
        this.healthBar = this.scene.add.graphics();
        this.updateHealthBar();
    }

    // Method updates the location and fullness of health bar
    updateHealthBar() {
        this.healthBar.clear();
        this.healthBar.fillStyle(0xffffff, 1);
        this.healthBar.fillRect(this.x - 20, this.y - 36, 40, 5);
        this.healthBar.fillGradientStyle(0x00ff00, 0x00ff00, 4);
        this.healthBar.fillRect(
            this.x - 20,
            this.y - 36,
            (40 * this.health) / this.maxHealth,
            5
        );
    }

    // Method creates the energy bar
    createEnergyBar() {
        this.energyBar = this.scene.add.graphics();
        this.updateEnergyBar();
    }

    // Method updates the location and fullness of energy bar
    updateEnergyBar() {
        this.energyBar.clear();
        this.energyBar.fillStyle(0xffffff, 1);
        this.energyBar.fillRect(this.x - 20, this.y - 31, 40, 5);
        this.energyBar.fillGradientStyle(0x00aeff, 0x00aeff, 4);
        this.energyBar.fillRect(
            this.x - 20,
            this.y - 31,
            (40 * this.energy) / this.maxEnergy,
            5
        );
    }

    // Method generates movement frames for walking animations
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