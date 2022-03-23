class BootScene extends Phaser.Scene {
    constructor() {
        super("Boot");
    }

    preload() {
        // Load the tiled map assets
        this.loadTiledMapAssets();

        // Load the spritesheets
        this.loadSpriteSheets();

        // Load icon images for class selection scene
        this.loadClassIcons();

        // Load the images
        this.loadImages();

        // Load the audio
        this.loadAudio();
    }

    // Load the assets for the tiled map
    loadTiledMapAssets() {
        this.load.image("terrain_atlas", "assets/level/terrain_atlas.png");
        this.load.tilemapTiledJSON("map", "assets/level/IterativeMap4.json");
    }

    // Load the spritesheets
    loadSpriteSheets() {
        // Player walking sprites
        this.load.spritesheet("meleeWalk", "assets/images/Players/meleeWalk.png", {
            frameWidth: 64,
            frameHeight: 64,
        });
        this.load.spritesheet("rangerWalk", "assets/images/Players/RangerWalk.png", {
            frameWidth: 64,
            frameHeight: 64,
        });
        this.load.spritesheet("mageWalk", "assets/images/Players/MageWalk.png", {
            frameWidth: 64,
            frameHeight: 64,
        });

        // Player attacking sprites
        this.load.spritesheet("meleeAttack", "assets/images/Players/meleeAttack.png", {
            frameWidth: 64,
            frameHeight: 64,
        });
        this.load.spritesheet("rangerAttack", "assets/images/Players/RangerAttack.png", {
            frameWidth: 64,
            frameHeight: 64,
        });
        this.load.spritesheet("mageAttack", "assets/images/Players/MageAttack.png", {
            frameWidth: 64,
            frameHeight: 64,
        });

        // Ranger class arrow sprite
        this.load.spritesheet("arrow", "assets/images/Players/hitboxImage.png", {
            frameWidth: 32,
            frameHeight: 32,
        });

        // Mage class spell sprite
        this.load.spritesheet("tornado", "assets/images/Players/tornado.png", {
            frameWidth: 128,
            frameHeight: 128,
        });

        // Star effect sprite
        this.load.spritesheet("starEffect", "assets/images/Players/iceshield.png", {
            frameWidth: 128,
            frameHeight: 128,
        });

        // Power effect sprite
        this.load.spritesheet("powerEffect", "assets/images/Players/firelion_down.png", {
            frameWidth: 64,
            frameHeight: 64,
        });

        // Item sprites
        this.load.spritesheet("potion", "assets/images/Items/Potion.png", {
            frameWidth: 32,
            frameHeight: 32,
        });
        this.load.spritesheet("star", "assets/images/Items/Coin.png", {
            frameWidth: 32,
            frameHeight: 32,
        });
        this.load.spritesheet("power", "assets/images/Items/PowerUp.png", {
            frameWidth: 32,
            frameHeight: 32,
        });

        // Monster walking sprites
        this.load.spritesheet("greenSkeleWalk", "assets/images/Mobs/GreenSkeleWalk.png", {
            frameWidth: 64,
            frameHeight: 64,
        });
        this.load.spritesheet("greySkeleWalk", "assets/images/Mobs/GreySkeleWalk.png", {
            frameWidth: 64,
            frameHeight: 64,
        });
        this.load.spritesheet("whiteSkeleWalk", "assets/images/Mobs/WhiteSkeleWalk.png", {
            frameWidth: 64,
            frameHeight: 64,
        });

        // Monster attacking sprites
        this.load.spritesheet("greenSkeleAttack", "assets/images/Mobs/GreenSkeleAttack.png", {
            frameWidth: 64,
            frameHeight: 64,
        });
        this.load.spritesheet("greySkeleAttack", "assets/images/Mobs/GreySkeleAttack.png", {
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

    // Load the images
    loadImages() {
        // Background image for title & class selection screens
        this.load.image("skeleBG", "assets/images/skullBG.png");

        // Fighter class hitbox (never seen, just used for physics body)
        this.load.image("playerHitbox", "assets/images/Players/hitboxImage.png");
    }

    // Method loads in the game audio
    loadAudio() {
        // Skele sounds
        this.load.audio("skeleDeath", ["assets/audio/EnemyDeath.wav"]);
        this.load.audio("skeleHit", ["assets/audio/Breaking-Bones.mp3"]);
        this.load.audio("skeleAttack", ["assets/audio/MonsterAttack.wav"]);

        // Melee sounds
        this.load.audio("meleeAttack", ["assets/audio/PlayerAttack.wav"]);
        this.load.audio("meleeHit", ["assets/audio/PlayerDamaged.wav"]);

        // Ranger sounds
        this.load.audio("rangerHit", ["assets/audio/RangerGrunt.mp3"]);
        this.load.audio("bowRelease", ["assets/audio/bowRelease.mp3"]);
        this.load.audio("arrowImpact", ["assets/audio/arrowHit.mp3"]);

        // Mage sounds
        this.load.audio("mageHit", ["assets/audio/mageHit.wav"]);
        this.load.audio("mageAttack", ["assets/audio/mageAttack.mp3"]);

        // Background music
        this.load.audio("bgTrack", ["assets/audio/epic.mp3"]);

        // Crystal sounds
        this.load.audio("crystal", ["assets/audio/coinCollect.mp3"]);
        this.load.audio("shieldHit", ["assets/audio/shieldHit.mp3"]);
        this.load.audio("shieldOn", ["assets/audio/shieldOn.mp3"]);
        this.load.audio("powerUp", ["assets/audio/powerUp.mp3"]);
    }

    // Start the next scene
    create() {
        this.scene.start("Name");
    }
}