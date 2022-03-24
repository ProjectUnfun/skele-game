class FighterPlayer extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, images, playerName) {
        super(scene, x, y, images);
        this.scene = scene;
        this.x = x;
        this.y = y;
        this.images = images;
        this.playerName = playerName;

        // Enable player physics
        this.scene.physics.world.enable(this);

        // Create animations
        this.createWalkAnimations();
        this.createAttackAnimations();

        // Set default animation status
        this.currentDirection = Direction.DOWN;
        this.setFrame(18);

        // Config combat
        this.configCombat();

        // Track item effect status
        this.starEffectOn = false;
        this.starAnimationOn = false;
        this.powerEffectOn = false;
        this.powerAnimationOn = false;

        // Config item effects
        this.configStarEffect();
        this.configPowerEffect();

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
        this.checkStarStatus();
        this.checkPowerStatus();
    }

    // Method configs combat
    configCombat() {
        // Config physics body
        this.body.setSize(32, 32);
        this.body.setOffset(16, 20);

        // Config natural health & mana restore
        this.healthRegenCount = 0;
        this.maxHealthRegenCount = 150;
        this.energyRegenCount = 0;
        this.maxEnergyRegenCount = 50;

        // Config health - melee needs to be able to take hits
        this.health = 12;
        this.maxHealth = 12;

        // Config energy - melee should be able to attack 9x before out of energy
        this.energy = 12;
        this.maxEnergy = 12;

        // Config attack value - melee should kill a monster in 3 hits
        this.attackValue = 3;

        // Track damage dealing status
        this.isAttacking = false;

        // Track damage receiving status
        this.canBeAttacked = true;

        // Track hitbox location
        this.hitboxLocation = {
            x: 0,
            y: 0,
        }

        // Create hitbox physics body
        this.hitbox = this.scene.add.image(this.x, this.y, "playerHitbox");

        // Enable hitbox physics
        this.scene.physics.world.enable(this.hitbox);

        // Set default hitbox status
        this.hitbox.setAlpha(0);
        this.makeHitboxInactive();
        this.hitboxIsActive = false;

        // Player hitbox vs monsters overlap method call
        this.scene.physics.add.overlap(this.hitbox, this.scene.monsters, this.handleEnemyAttacked, undefined, this);
    }

    // Method handles player attack hiting monster
    handleEnemyAttacked(hitbox, enemy) {
        if (this.powerEffectOn) {
            enemy.updateHealth(this.attackValue * 2);
        } else {
            enemy.updateHealth(this.attackValue);
        }
    }

    // Method handles hitbox location assignment
    checkAttack(cursors) {
        if (Phaser.Input.Keyboard.JustDown(cursors.space) && !this.isAttacking && this.energy > 0) {
            // Stop animations and movement, alter attacking flag
            this.anims.stop();
            this.body.setVelocity(0);
            this.isAttacking = true;

            // Determine direction, appropriate animation, and hitbox location
            if (this.currentDirection === Direction.DOWN) {
                this.anims.play("attackDown", true);
                this.hitboxLocation.x = this.x;
                this.hitboxLocation.y = this.y + 24;
            } else if (this.currentDirection === Direction.UP) {
                this.anims.play("attackUp", true);
                this.hitboxLocation.x = this.x;
                this.hitboxLocation.y = this.y - 16;
            } else if (this.currentDirection === Direction.LEFT) {
                this.anims.play("attackLeft", true);
                this.hitboxLocation.x = this.x - 16;
                this.hitboxLocation.y = this.y + 6;
            } else if (this.currentDirection === Direction.RIGHT) {
                this.anims.play("attackRight", true);
                this.hitboxLocation.x = this.x + 16;
                this.hitboxLocation.y = this.y + 6;
            }

            // Update location of hitbox
            this.hitbox.setPosition(this.hitboxLocation.x, this.hitboxLocation.y);

            // Activate hitbox for attack detection
            this.makeHitboxActive();

            // Play attack audio
            this.scene.meleeAttackAudio.play();

            // Deplete player energy for each attack
            if (!this.starEffectOn) this.energy--;

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

            // Process health regen
            if (this.healthRegenCount > this.maxHealthRegenCount) {
                this.healthRegenCount = 0;
                this.health += 1;
                if (this.health > this.maxHealth) this.health = this.maxHealth;
            } else {
                this.healthRegenCount++;
            }

            // Process mana regen
            if (this.energyRegenCount > this.maxEnergyRegenCount) {
                this.energyRegenCount = 0;
                this.energy += 1;
                if (this.energy > this.maxEnergy) this.energy = this.maxEnergy;
            } else {
                this.energyRegenCount++;
            }

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

    // Method handles updating health when damage is taken
    updateHealth(amount) {
        if (!this.starEffectOn) {
            this.health -= amount;
            if (this.health < 0) this.health = 0;
            this.scene.meleeDamagedAudio.play();
            this.scene.skeleAttackAudio.play();
            console.log(`Player: ${this.playerName} has been damaged`);
        } else {
            this.scene.shieldHitAudio.play();
            console.log("Player is impervious to damage when star effect is on.")
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

    // Method configs the star item effect
    configStarEffect() {
        this.starEffect = this.scene.add.sprite(this.x, this.y, "starEffect");

        this.starEffect.anims.create({
            key: "starPower",
            frames: this.anims.generateFrameNumbers("starEffect", {
                start: 0,
                end: 15,
            }),
            frameRate: 15,
        });

        this.scene.physics.world.enable(this.starEffect);
        this.starEffect.setAlpha(0);
        this.starEffect.depth = 4;
    }

    // Method handles star status effect
    checkStarStatus() {
        if (this.starEffectOn) {
            this.starEffect.setPosition(this.x + 6, this.y + 6);
            if (this.starAnimationOn === false) {
                this.starEffect.play({ key: "starPower", repeat: -1 });
                this.starEffect.setAlpha(1);
                this.starAnimationOn = true;
            }
        } else {
            if (this.starAnimationOn) this.starEffect.stop();
            this.starAnimationOn = false;
            this.starEffect.setAlpha(0);
        }
    }

    // Method configs the power up item effect
    configPowerEffect() {
        this.powerEffect = this.scene.add.sprite(this.x, this.y, "powerEffect");

        this.powerEffect.anims.create({
            key: "powerUp",
            frames: this.anims.generateFrameNumbers("powerEffect", {
                start: 0,
                end: 15,
            }),
            frameRate: 20,
        });

        this.scene.physics.world.enable(this.powerEffect);
        this.powerEffect.setAlpha(0);
        this.powerEffect.depth = 3;
    }

    // Method handles power status effect
    checkPowerStatus() {
        if (this.powerEffectOn) {
            this.powerEffect.setPosition(this.x, this.y + 6);
            if (this.powerAnimationOn === false) {
                this.powerEffect.play({ key: "powerUp", repeat: -1 });
                this.powerEffect.setAlpha(1);
                this.powerAnimationOn = true;
            }
        } else {
            if (this.powerAnimationOn) this.powerEffect.stop();
            this.powerAnimationOn = false;
            this.powerEffect.setAlpha(0);
        }
    }

    // Method generatesd frames for walking animations
    createWalkAnimations() {
        let rateOfFrames = 15;
        let repeatValue = 0;

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
    }

    // Method generates frames for attack animations
    createAttackAnimations() {
        let rateOfFrames = 20;
        let repeatValue = 0;

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
    }
}