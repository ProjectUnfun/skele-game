class GameItem extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, images, itemClass) {
        super(scene, x, y, images);
        this.scene = scene;
        this.x = x;
        this.y = y;
        this.images = images;
        this.itemClass = itemClass;

        // Enable physics
        this.scene.physics.world.enable(this);

        // Create animations
        this.createAnimations();

        // Add object to scene
        this.scene.add.existing(this);
    }

    update() {
        if (this.active) {
            this.anims.play("itemAnim", true);
        }
    }

    // Method destroys the item when collected by player
    removeFromGame() {
        this.setActive(false);
        this.setVisible(false);
        this.body.checkCollision.none = true;
        this.body.onOverlap = false;
        this.anims.stop();
        this.destroy();
    }

    // Method creates animation based on item class
    createAnimations() {
        let rateOfFrames = 8;
        let repeatValue = -1;

        if (this.itemClass === ItemClass.POTION) {
            this.anims.create({
                key: "itemAnim",
                frames: this.anims.generateFrameNumbers("potion", {
                    start: 0,
                    end: 11,
                }),
                frameRate: rateOfFrames,
                repeat: repeatValue,
            });
        } else if (this.itemClass === ItemClass.POWER) {
            this.anims.create({
                key: "itemAnim",
                frames: this.anims.generateFrameNumbers("power", {
                    start: 0,
                    end: 7,
                }),
                frameRate: rateOfFrames,
                repeat: repeatValue,
            });
        } else if (this.itemClass === ItemClass.STAR) {
            this.anims.create({
                key: "itemAnim",
                frames: this.anims.generateFrameNumbers("star", {
                    start: 0,
                    end: 5,
                }),
                frameRate: rateOfFrames,
                repeat: repeatValue,
            });
        }
    }
}