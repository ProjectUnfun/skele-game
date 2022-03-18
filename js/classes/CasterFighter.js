class CasterPlayer extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, images, playerName) {
        super(scene, x, y, images);
        this.scene = scene;
        this.x = x;
        this.y = y;
        this.images = images;
        this.playerName = playerName;

        // Enable player physics
        this.scene.physics.world.enable(this);

        // Config combat
        this.configCombat();

        // Config natural health & mana restore
        this.healthRegenCount = 0;
        this.maxHealthRegenCount = 300;
        this.energyRegenCount = 0;
        this.maxEnergyRegenCount = 150;

        // Create animations
        this.createWalkAnimations();
        this.createAttackAnimations();

        // Set default animation status
        this.currentDirection = Direction.DOWN;
        this.setFrame(18);

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
        // Config physics body
        this.body.setSize(32, 36);
        this.body.setOffset(16, 20);

        // Config health - caster is a glass cannon
        this.health = 4;
        this.maxHealth = 4;

        // Config energy - caster should be able to attack 4x before out of energy
        this.energy = 4;
        this.maxEnergy = 4;

        // Config attack value - caster should kill a monster in 2 hits
        this.attackValue = 4;

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
        this.hitbox = this.scene.add.sprite(this.x, this.y, "tornado");

        // Create hitbox spell animation
        this.hitbox.anims.create({
            key: "windSpell",
            frames: this.anims.generateFrameNumbers("tornado", {
                start: 0,
                end: 15,
            }),
            frameRate: 50,
        });

        // Config hitbox physics
        this.scene.physics.world.enable(this.hitbox);
        this.hitbox.body.setSize(32, 48);
        this.hitbox.body.setOffset(44, 64);

        // Set default hitbox status
        this.hitbox.setAlpha(0);
        this.makeHitboxInactive();
        this.hitboxIsActive = false;

        // Player hitbox vs monsters overlap method call
        this.scene.physics.add.overlap(this.hitbox, this.scene.monsters, (hitbox, enemy) => {
            this.handleEnemyAttacked(enemy);
        });
    }

    handleEnemyAttacked(enemy) {
        enemy.updateHealth(this.attackValue);
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
            } else if (this.currentDirection === Direction.UP) {
                this.anims.play("attackUp", true);
            } else if (this.currentDirection === Direction.LEFT) {
                this.anims.play("attackLeft", true);
            } else if (this.currentDirection === Direction.RIGHT) {
                this.anims.play("attackRight", true);
            }

            // Set hitbox location where mouse was when attack was initiated
            this.hitboxLocation.x = this.scene.input.mousePointer.worldX;
            this.hitboxLocation.y = this.scene.input.mousePointer.worldY;

            this.hitbox.setPosition(this.hitboxLocation.x, this.hitboxLocation.y);

            // Activate hitbox for attack detection
            this.makeHitboxActive();

            // Make hitbox visible
            this.hitbox.setAlpha(1);

            // Play spell animation
            this.hitbox.play({ key: "windSpell", repeat: 0 });

            // Deplete player energy for each attack
            this.energy--;

            // Delay player attack repetition by .3 seconds
            this.scene.time.delayedCall(
                300,
                () => {
                    // Reset flag & deactivate hitbox
                    this.isAttacking = false;
                    this.hitbox.setAlpha(0);
                },
                [],
                this
            );
        } else {
            this.makeHitboxInactive();
        }
    }

    // Method make hitbox active for attack overlap checking
    makeHitboxActive() {
        // Activate hitbox overlap checking
        this.hitbox.body.checkCollision.none = false;
        this.hitboxIsActive = true;
    }

    // Method makes hitbox inactive to prevent attack overlap checking
    makeHitboxInactive() {
        // Deactivate hitbox overlap checking
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
        this.health -= amount;
        if (this.health < 0) this.health = 0;
        console.log(`Player: ${this.playerName} has been damaged`);
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

    // Method generates frames for attack animations
    createAttackAnimations() {
        let rateOfFrames = 15;
        let repeatValue = 0;

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
