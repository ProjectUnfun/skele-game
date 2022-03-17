class BootScene extends Phaser.Scene {
    constructor() {
        super("Boot");
    }

    preload() {
        this.loadTiledMapAssets();
        this.loadSpriteSheets();
    }

    // Load the assets for the tiled map
    loadTiledMapAssets() {
        this.load.image("terrain_atlas", "assets/level/terrain_atlas.png");
        this.load.tilemapTiledJSON("map", "assets/level/IterativeMap4.json");
    }

    // Load the assets for movement and attack animations for player and mobs
    loadSpriteSheets() {
        this.load.spritesheet("meleeWalk", "assets/images/Players/meleeWalk.png", {
            frameWidth: 64,
            frameHeight: 64,
        });

        this.load.spritesheet("meleeAttack", "assets/images/Players/meleeAttack.png", {
            frameWidth: 64,
            frameHeight: 64,
        });

        this.load.spritesheet("greenSkeleWalk", "assets/images/Mobs/GreenSkeleWalk.png", {
            frameWidth: 64,
            frameHeight: 64,
        });

        this.load.spritesheet("greenSkeleAttack", "assets/images/Mobs/GreenSkeleAttack.png", {
            frameWidth: 64,
            frameHeight: 64,
        })
    }

    // Start the next scene
    create() {
        this.scene.start("Game");
    }
}