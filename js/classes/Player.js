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

        // Create animations
        this.createWalkAnimations();
        this.createAttackAnimations();

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
        this.checkAttack(cursors);
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

        // Track damage dealing status
        this.isAttacking = false;

        // Track hitbox location
        this.hitboxLocation = {
            x: 0,
            y: 0,
        }

        // Create hitbox physics body
        this.hitbox = this.scene.add.image(this.x, this.y, "playerHitbox");

        // Make hitbox invisible & enable physics
        this.hitbox.setAlpha(0);
        this.scene.physics.world.enable(this.hitbox);

        // Set default hitbox status
        this.makeHitboxInactive();
        this.hitboxIsActive = false;

        // Player hitbox vs monsters overlap method call
        this.scene.physics.add.overlap(this.hitbox, this.scene.monsters, this.handleEnemyAttacked, undefined, this);
    }

    // Method handles player attack hiting monster
    handleEnemyAttacked(hitbox, enemy) {
        if (enemy.canBeAttacked) {
            enemy.canBeAttacked = false;
            enemy.updateHealth(this.attackValue);

            this.scene.time.delayedCall(
                300,
                () => {
                    enemy.canBeAttacked = true;
                },
                [],
                this
            );
        }
    }

    // Method handles hitbox location assignment
    checkAttack(cursors) {
        if (Phaser.Input.Keyboard.JustDown(cursors.space) && !this.isAttacking) {
            // Stop animations and movement, alter attacking flag
            this.anims.stop();
            this.body.setVelocity(0);
            this.isAttacking = true;

            // Determine direction, appropriate animation, and hitbox location
            if (this.currentDirection === Direction.DOWN) {
                this.anims.play("attackDown", true);
                if (this.playerClass === PlayerClass.FIGHTER) {
                    this.hitboxLocation.x = this.x;
                    this.hitboxLocation.y = this.y + 24;
                } else if (this.playerClass === PlayerClass.RANGER) {
                    // TODO: add player arrow image cooresponding to facing direction and assign velocity
                } else if (this.playerClass === PlayerClass.CASTER) {
                    // TODO: get the location of the mouse click on the game screen and assign hitbox location to that
                }
            } else if (this.currentDirection === Direction.UP) {
                this.anims.play("attackUp", true);
                if (this.playerClass === PlayerClass.FIGHTER) {
                    this.hitboxLocation.x = this.x;
                    this.hitboxLocation.y = this.y - 16;
                } else if (this.playerClass === PlayerClass.RANGER) {
                    // TODO: add player arrow image cooresponding to facing direction and assign velocity
                } else if (this.playerClass === PlayerClass.CASTER) {
                    // TODO: get the location of the mouse click on the game screen and assign hitbox location to that
                }
            } else if (this.currentDirection === Direction.LEFT) {
                this.anims.play("attackLeft", true);
                if (this.playerClass === PlayerClass.FIGHTER) {
                    this.hitboxLocation.x = this.x - 16;
                    this.hitboxLocation.y = this.y + 6;
                } else if (this.playerClass === PlayerClass.RANGER) {
                    // TODO: add player arrow image cooresponding to facing direction and assign velocity
                } else if (this.playerClass === PlayerClass.CASTER) {
                    // TODO: get the location of the mouse click on the game screen and assign hitbox location to that
                }
            } else if (this.currentDirection === Direction.RIGHT) {
                this.anims.play("attackRight", true);
                if (this.playerClass === PlayerClass.FIGHTER) {
                    this.hitboxLocation.x = this.x + 16;
                    this.hitboxLocation.y = this.y + 6;
                } else if (this.playerClass === PlayerClass.RANGER) {
                    // TODO: add player arrow image cooresponding to facing direction and assign velocity
                } else if (this.playerClass === PlayerClass.CASTER) {
                    // TODO: get the location of the mouse click on the game screen and assign hitbox location to that
                }
            }

            // Update location of hitbox
            this.hitbox.setPosition(this.hitboxLocation.x, this.hitboxLocation.y);

            // Activate hitbox for attack detection
            this.makeHitboxActive();

            // Delay player attack repetition by .3 seconds
            this.scene.time.delayedCall(
                300,
                () => {
                    // Reset flag & deactivate hitbox
                    this.isAttacking = false;
                },
                [],
                this
            );
        } else {
            if (this.hitboxIsActive) {
                this.makeHitboxInactive();
            }
        }
    }

    // Method make hitbox active for attack overlap checking
    makeHitboxActive() {
        // Activate hitbox overlap checking
        this.hitbox.setActive(true);
        this.hitbox.body.checkCollision.none = false;
        this.hitboxIsActive = true;
    }

    // Method makes hitbox inactive to prevent attack overlap checking
    makeHitboxInactive() {
        // Deactivate hitbox overlap checking
        this.hitbox.setActive(false);
        this.hitbox.body.checkCollision.none = true;
        this.hitboxIsActive = false;
    }

    // Method handles idle status
    checkIdle(cursors) {
        // If none of the cursors are being pressed
        if (
            !cursors.left.isDown &&
            !cursors.right.isDown &&
            !cursors.up.isDown &&
            !cursors.down.isDown &&
            !this.isAttacking
        ) {
            // Stop animations
            this.anims.stop();

            // Check which direction player is facing and set frame
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

    // Method handles movement status
    checkMovement(cursors) {
        // Reset player velocity
        this.body.setVelocity(0);

        // Check which key is pressed; assign direction, velocity, and animations
        if (cursors.left.isDown && !this.isAttacking) {
            this.body.setVelocityX(-playerMoveSpeed);
            this.currentDirection = Direction.LEFT;
            this.anims.play("walkLeft", true);
        } else if (cursors.right.isDown && !this.isAttacking) {
            this.body.setVelocityX(playerMoveSpeed);
            this.currentDirection = Direction.RIGHT;
            this.anims.play("walkRight", true);
        } else if (cursors.up.isDown && !this.isAttacking) {
            this.body.setVelocityY(-playerMoveSpeed);
            this.currentDirection = Direction.UP;
            this.anims.play("walkUp", true);
        } else if (cursors.down.isDown && !this.isAttacking) {
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

    // Method generatesd frames for walking animations
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

    // Method generates frames for attack animations
    createAttackAnimations() {
        let rateOfFrames = 20;
        let repeatValue = 0;

        if (this.playerClass === PlayerClass.FIGHTER) {
            this.anims.create({
                key: "attackUp",
                frames: this.anims.generateFrameNumbers("meleeAttack", {
                    start: 0,
                    end: 5,
                }),
                frameRate: rateOfFrames,
                yoyo: true,
                repeat: repeatValue,
            });
            this.anims.create({
                key: "attackLeft",
                frames: this.anims.generateFrameNumbers("meleeAttack", {
                    start: 6,
                    end: 11,
                }),
                frameRate: rateOfFrames,
                yoyo: true,
                repeat: repeatValue,
            });
            this.anims.create({
                key: "attackDown",
                frames: this.anims.generateFrameNumbers("meleeAttack", {
                    start: 12,
                    end: 17,
                }),
                frameRate: rateOfFrames,
                yoyo: true,
                repeat: repeatValue,
            });
            this.anims.create({
                key: "attackRight",
                frames: this.anims.generateFrameNumbers("meleeAttack", {
                    start: 18,
                    end: 23,
                }),
                frameRate: rateOfFrames,
                yoyo: true,
                repeat: repeatValue,
            });
        } else if (this.playerClass === PlayerClass.RANGER) {
            this.anims.create({
                key: "attackUp",
                frames: this.anims.generateFrameNumbers("rangerAttack", {
                    start: 0,
                    end: 12,
                }),
                frameRate: rateOfFrames,
                yoyo: true,
                repeat: repeatValue,
            });
            this.anims.create({
                key: "attackLeft",
                frames: this.anims.generateFrameNumbers("rangerAttack", {
                    start: 13,
                    end: 25,
                }),
                frameRate: rateOfFrames,
                yoyo: true,
                repeat: repeatValue,
            });
            this.anims.create({
                key: "attackDown",
                frames: this.anims.generateFrameNumbers("rangerAttack", {
                    start: 26,
                    end: 38,
                }),
                frameRate: rateOfFrames,
                yoyo: true,
                repeat: repeatValue,
            });
            this.anims.create({
                key: "attackRight",
                frames: this.anims.generateFrameNumbers("rangerAttack", {
                    start: 39,
                    end: 51,
                }),
                frameRate: rateOfFrames,
                yoyo: true,
                repeat: repeatValue,
            });
        } else if (this.playerClass === PlayerClass.CASTER) {
            this.anims.create({
                key: "attackUp",
                frames: this.anims.generateFrameNumbers("mageAttack", {
                    start: 0,
                    end: 6,
                }),
                frameRate: rateOfFrames,
                yoyo: true,
                repeat: repeatValue,
            });
            this.anims.create({
                key: "attackLeft",
                frames: this.anims.generateFrameNumbers("mageAttack", {
                    start: 7,
                    end: 13,
                }),
                frameRate: rateOfFrames,
                yoyo: true,
                repeat: repeatValue,
            });
            this.anims.create({
                key: "attackDown",
                frames: this.anims.generateFrameNumbers("mageAttack", {
                    start: 14,
                    end: 20,
                }),
                frameRate: rateOfFrames,
                yoyo: true,
                repeat: repeatValue,
            });
            this.anims.create({
                key: "attackRight",
                frames: this.anims.generateFrameNumbers("mageAttack", {
                    start: 21,
                    end: 27,
                }),
                frameRate: rateOfFrames,
                yoyo: true,
                repeat: repeatValue,
            });
        }
    }
}