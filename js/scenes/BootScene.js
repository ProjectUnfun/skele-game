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
        this.load.spritesheet("playerWalk", "assets/images/WalkLPC.png", {
            frameWidth: 64,
            frameHeight: 64,
        });

        this.load.spritesheet("playerAttack", "assets/images/HammerLPC.png", {
            frameWidth: 64,
            frameHeight: 64,
        });

        this.load.spritesheet("monsterWalk", "assets/images/SkeleWalk.png", {
            frameWidth: 64,
            frameHeight: 64,
        });

        this.load.spritesheet("monsterAttack", "assets/images/SkeleAttack.png", {
            frameWidth: 64,
            frameHeight: 64,
        })
    }

    // Start the next scene
    create() {
        this.scene.start("Game");
    }
}