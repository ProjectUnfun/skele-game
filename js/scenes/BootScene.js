class BootScene extends Phaser.Scene {
    constructor() {
        super("Boot");
    }

    preload() {
        // Load the tiled map assets
        this.loadTiledMapAssets();

        // Load the player and mob spritesheets
        this.loadSpriteSheets();

        // Load icon images for class selection scene
        this.loadClassIcons();
    }

    // Load the assets for the tiled map
    loadTiledMapAssets() {
        this.load.image("terrain_atlas", "assets/level/terrain_atlas.png");
        this.load.tilemapTiledJSON("map", "assets/level/IterativeMap4.json");
    }

    // Load the assets for movement and attack animations for player and mobs
    loadSpriteSheets() {

        // ***PLAYERS***
        this.load.spritesheet("meleeWalk", "assets/images/Players/meleeWalk.png", {
            frameWidth: 64,
            frameHeight: 64,
        });
        this.load.spritesheet("meleeAttack", "assets/images/Players/meleeAttack.png", {
            frameWidth: 64,
            frameHeight: 64,
        });
        this.load.spritesheet("rangerWalk", "assets/images/Players/RangerWalk.png", {
            frameWidth: 64,
            frameHeight: 64,
        });
        this.load.spritesheet("rangerAttack", "assets/images/Players/RangerAttack.png", {
            frameWidth: 64,
            frameHeight: 64,
        });
        this.load.spritesheet("mageWalk", "assets/images/Players/MageWalk.png", {
            frameWidth: 64,
            frameHeight: 64,
        });
        this.load.spritesheet("mageAttack", "assets/images/Players/MageAttack.png", {
            frameWidth: 64,
            frameHeight: 64,
        });

        // ***MOBS***
        this.load.spritesheet("greenSkeleWalk", "assets/images/Mobs/GreenSkeleWalk.png", {
            frameWidth: 64,
            frameHeight: 64,
        });
        this.load.spritesheet("greenSkeleAttack", "assets/images/Mobs/GreenSkeleAttack.png", {
            frameWidth: 64,
            frameHeight: 64,
        });
        this.load.spritesheet("greySkeleWalk", "assets/images/Mobs/GreySkeleWalk.png", {
            frameWidth: 64,
            frameHeight: 64,
        });
        this.load.spritesheet("greySkeleAttack", "assets/images/Mobs/GreySkeleAttack.png", {
            frameWidth: 64,
            frameHeight: 64,
        });
        this.load.spritesheet("whiteSkeleWalk", "assets/images/Mobs/WhiteSkeleWalk.png", {
            frameWidth: 64,
            frameHeight: 64,
        });
        this.load.spritesheet("whiteSkeleAttack", "assets/images/Mobs/WhiteSkeleAttack.png", {
            frameWidth: 64,
            frameHeight: 64,
        });
    }

    // Load the assets for setting up class selection scene
    loadClassIcons() {
        this.load.image("fighterIcon", "assets/images/ClassIcons/MeleeIcon.png");
        this.load.image("rangerIcon", "assets/images/ClassIcons/RangerIcon.png");
        this.load.image("mageIcon", "assets/images/ClassIcons/MageIcon.png");
    }

    // Load the assets for player and monster hitboxes
    loadHitboxingImages() {
        // Monster hitbox (never seen, just used for physics body)
        this.load.image("playerHitbox", "assets/images/Players/hitboxImage.png");

        // Monster hitbox (never seen, just used for physics body)
        this.load.image("monsterHitbox", "assets/images/Mobs/AttackBounds.png");
    }

    // Start the next scene
    create() {
        this.scene.start("Name");
    }
}