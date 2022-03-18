class RangerPlayer extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, images, playerName) {
        super(scene, x, y, images);
        this.scene = scene;
        this.x = x;
        this.y = y;
        this.images = images;
        this.playerName = playerName;

        // Enable player physics
        this.scene.physics.world.enable(this);

        // Config physics body
        this.body.setSize(32, 36);
        this.body.setOffset(16, 20);

        // Config combat
        this.configCombat();

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
        // Config health - ranger needs some durability
        this.health = 6;
        this.maxHealth = 6;

        // Config energy - ranger should be able to attack 16x before out of energy
        this.energy = 16;
        this.maxEnergy = 16;

        // Config attack value - ranger should kill a monster in 4 hits
        this.attackValue = 2;

        // Track damage dealing status
        this.isAttacking = false;

        // Set the move speed of the arrows
        this.arrowSpeed = 300;

        // Track hitbox location
        this.hitboxLocation = {
            x: 0,
            y: 0,
        }

        // Create hitbox physics body
        this.hitbox = this.scene.add.sprite(this.x, this.y, "arrow");

        // Config hitbox physics
        this.scene.physics.world.enable(this.hitbox);

        // Set default hitbox status
        this.hitbox.setAlpha(0);
        this.makeHitboxInactive();
        this.hitboxIsActive = false;

        // Player hitbox vs monsters overlap method call
        this.scene.physics.add.overlap(this.hitbox, this.scene.monsters, (hitbox, enemy) => {
            this.handleEnemyAttacked(enemy);
            this.makeHitboxInactive();
        });

        // Hitbox vs map bounds collision call
        this.scene.physics.add.collider(this.hitbox, this.scene.map.blockedLayer, () => {
            this.makeHitboxInactive();
        });
    }

    // Method handles player attack hiting monster
    handleEnemyAttacked(enemy) {
        enemy.updateHealth(this.attackValue);
    }

    // Method handles hitbox location assignment
    checkAttack(cursors) {
        if (Phaser.Input.Keyboard.JustDown(cursors.space) && !this.isAttacking) {
            // Stop animations and movement, alter attacking flag
            this.anims.stop();
            this.body.setVelocity(0);
            this.isAttacking = true;

            // Determine direction, appropriate animation, and hitbox location & velocity
            if (this.currentDirection === Direction.DOWN) {
                this.anims.play("attackDown", true);
                this.hitboxLocation.x = this.x;
                this.hitboxLocation.y = this.y + 24;
                this.hitbox.angle = 0;
                this.hitbox.setPosition(this.hitboxLocation.x, this.hitboxLocation.y);
                this.hitbox.body.setVelocityY(this.arrowSpeed);
            } else if (this.currentDirection === Direction.UP) {
                this.anims.play("attackUp", true);
                this.hitboxLocation.x = this.x;
                this.hitboxLocation.y = this.y - 16;
                this.hitbox.angle = 180;
                this.hitbox.setPosition(this.hitboxLocation.x, this.hitboxLocation.y);
                this.hitbox.body.setVelocityY(-this.arrowSpeed);
            } else if (this.currentDirection === Direction.LEFT) {
                this.anims.play("attackLeft", true);
                this.hitboxLocation.x = this.x - 16;
                this.hitboxLocation.y = this.y + 6;
                this.hitbox.angle = 90;
                this.hitbox.setPosition(this.hitboxLocation.x, this.hitboxLocation.y);
                this.hitbox.body.setVelocityX(-this.arrowSpeed);
            } else if (this.currentDirection === Direction.RIGHT) {
                this.anims.play("attackRight", true);
                this.hitboxLocation.x = this.x + 16;
                this.hitboxLocation.y = this.y + 6;
                this.hitbox.angle = 270;
                this.hitbox.setPosition(this.hitboxLocation.x, this.hitboxLocation.y);
                this.hitbox.body.setVelocityX(this.arrowSpeed);
            }

            // Activate hitbox for attack detection
            this.makeHitboxActive();

            // Deplete player energy for each attack
            this.energy--;

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
        }
    }

    // Method make hitbox active for attack overlap checking
    makeHitboxActive() {
        // Activate hitbox overlap checking
        this.hitbox.setAlpha(1);
        this.hitbox.body.checkCollision.none = false;
        this.hitboxIsActive = true;
    }

    // Method makes hitbox inactive to prevent attack overlap checking
    makeHitboxInactive() {
        // Deactivate hitbox overlap checking
        this.hitbox.setAlpha(0);
        this.hitbox.body.checkCollision.none = true;
        this.hitbox.body.setVelocity(0);
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
    }

    // Method generates frames for attack animations
    createAttackAnimations() {
        let rateOfFrames = 15;
        let repeatValue = 0;

        this.anims.create({
            key: "attackUp",
            frames: this.anims.generateFrameNumbers("rangerAttack", {
                start: 0,
                end: 12,
            }),
            frameRate: rateOfFrames,
            repeat: repeatValue,
        });
        this.anims.create({
            key: "attackLeft",
            frames: this.anims.generateFrameNumbers("rangerAttack", {
                start: 13,
                end: 25,
            }),
            frameRate: rateOfFrames,
            repeat: repeatValue,
        });
        this.anims.create({
            key: "attackDown",
            frames: this.anims.generateFrameNumbers("rangerAttack", {
                start: 26,
                end: 38,
            }),
            frameRate: rateOfFrames,
            repeat: repeatValue,
        });
        this.anims.create({
            key: "attackRight",
            frames: this.anims.generateFrameNumbers("rangerAttack", {
                start: 39,
                end: 51,
            }),
            frameRate: rateOfFrames,
            repeat: repeatValue,
        });
    }
}
