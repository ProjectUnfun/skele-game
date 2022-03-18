class PlayerArrow extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, images) {
        super(scene, x, y, images);
        this.scene = scene;
        this.x = x;
        this.y = y;
        this.images = images;

        // Enable player physics
        this.scene.physics.world.enable(this);

        // Add arrow object to scene
        this.scene.add.existing(this);
    }

    makeArrowActive() {
        this.setActive(true);
        this.setVisible(true);
        this.body.checkCollision.none = false;
        this.body.onOverlap = true;
    }

    makeArrowInactive() {
        this.setActive(false);
        this.setVisible(false);
        this.body.setVelocity(0);
        this.body.checkCollision.none = true;
        this.body.onOverlap = false;
    }
}