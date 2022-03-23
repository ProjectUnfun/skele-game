// Enum for tracking 4 direction movement and attacking
const Direction = {
    DOWN: 1,
    UP: 2,
    LEFT: 3,
    RIGHT: 4
};

// Enum for tracking player class selection
const PlayerClass = {
    FIGHTER: 1,
    RANGER: 2,
    CASTER: 3,
}

// Enum for tracking monster class
const MonsterClass = {
    WHITE: 1,
    GREY: 2,
    GREEN: 3,
}

// Enum for tracking item class
const ItemClass = {
    POTION: 0,
    POWER: 1,
    STAR: 2,
}

// Track movement velocity of player in game
const playerMoveSpeed = 160;

// Track movement velocity of monsters in game
const monsterMoveSpeed = 160;

// Track the ID of monsters
let monsterID = 0;

// Track the number of monsters
let numberOfMonsters = 5;
let moreMonsters = 5;

// Locations for spawning monsters
const spawnLocations = [
    [352, 480],
    [800, 608],
    [1280, 224],
    [1200, 999],
    [640, 864],
    [128, 928],
    [1024, 96],
    [1056, 736],
    [650, 253],
    [480, 109],
    [75, 835],
    [944, 484],
    [293, 532],
    [1272, 938],
    [1296, 100],
    [891, 167],
    [600, 957],
    [869, 1063],
    [1341, 474],
]

class GameScene extends Phaser.Scene {
    constructor() {
        super("Game");
    }

    init(data) {
        // Store name passed from NameScene
        this.playerName = data.name;
        this.playerClass = data.class;
    }

    create() {
        // Create the input keys
        this.createInputCursors();

        // Create the in game map
        this.createMap();

        // Config the mobs
        this.configMonsters();

        // Config the items
        this.configItems();

        // Spawn the mobs
        this.spawnMonsters(numberOfMonsters);

        // Create the player
        this.createPlayer();

        // Add collisions with the map
        this.addCollisions();

        // Create audio
        this.createAudio();
    }

    update() {
        // Call the player object update method
        this.player.update(this.cursors);

        // If all mobs are dead, spawn double
        if (numberOfMonsters < 1) {
            moreMonsters *= 2;
            this.spawnMonsters(moreMonsters);
            numberOfMonsters = moreMonsters;
        }
    }

    // Method creates the game map using the GameMap class defined in ../classes/GameMap.js
    createMap() {
        this.map = new GameMap(
            this,
            "map",
            "terrain_atlas",
            "Ground",
            "Blocked",
            "Deco1"
        );
    }

    // Method creates the game input using Phaser method
    createInputCursors() {
        this.cursors = this.input.keyboard.createCursorKeys();
    }

    // Method creates the audio clips
    createAudio() {
        // Skele audio
        this.skeleDeathAudio = this.sound.add("skeleDeath", {
            loop: false,
            volume: 1.1,
        });
        this.skeleDamagedAudio = this.sound.add("skeleHit", {
            loop: false,
            volume: 1.3,
        });
        this.skeleAttackAudio = this.sound.add("skeleAttack", {
            loop: false,
            volume: 1.1,
        });

        // Melee audio
        this.meleeAttackAudio = this.sound.add("meleeAttack", {
            loop: false,
            volume: 0.8,
        });
        this.meleeDamagedAudio = this.sound.add("meleeHit", {
            loop: false,
            volume: 1.6,
        });

        // Ranger audio
        this.rangerBowAudio = this.sound.add("bowRelease", {
            loop: false,
            volume: 2.8,
        });
        this.rangerArrowAudio = this.sound.add("arrowImpact", {
            loop: false,
            volume: 2.2,
        });
        this.rangerDamagedAudio = this.sound.add("rangerHit", {
            loop: false,
            volume: 0.8,
        });

        // Mage audio
        this.mageAttackAudio = this.sound.add("mageAttack", {
            loop: false,
            volume: 1.8,
        });
        this.mageDamagedAudio = this.sound.add("mageHit", {
            loop: false,
            volume: 1.8,
        });

        // Crystal audio
        this.crystalFoundAudio = this.sound.add("crystal", {
            loop: false,
            volume: 0.8,
        });
        this.shieldHitAudio = this.sound.add("shieldHit", {
            loop: false,
            volume: 1.8,
        });
        this.shieldOnAudio = this.sound.add("shieldOn", {
            loop: true,
            volume: 1.2,
        })
        this.powerUpAudio = this.sound.add("powerUp", {
            loop: true,
            volume: 1.8,
        });
    }

    // Method creates the user player using the Player class defined in ../classes/Player.js
    createPlayer() {
        if (this.playerClass === PlayerClass.FIGHTER) {
            this.player = new FighterPlayer(this, 96, 160, "meleeWalk", this.playerName);
        } else if (this.playerClass === PlayerClass.RANGER) {
            this.player = new RangerPlayer(this, 96, 160, "rangerWalk", this.playerName);
        } else if (this.playerClass === PlayerClass.CASTER) {
            this.player = new CasterPlayer(this, 96, 160, "mageWalk", this.playerName);
        }

    }

    // Method creates a physics collection for monster containment
    configMonsters() {
        this.monsters = this.physics.add.group();

        // Run the update method of all children objects of the group
        // everytime the update method of this scene is called
        this.monsters.runChildUpdate = true;
    }

    // Method spawns the given number of monsters
    spawnMonsters(numberToMake) {
        // Field to spawn & reactivate monsters
        let monster;

        // Field tracks monster class
        let classSelection;

        // Array for random monster location
        let spawnLocation = [];

        // Loop until all monsters are created/reactivated
        for (let i = 0; i < numberToMake; i++) {
            //Get the first inactive monster in the group
            monster = this.monsters.getFirstDead();

            // Get a random spawn location
            spawnLocation = spawnLocations[Math.floor(Math.random() * 19)];

            // Create a new monster if there are no inactive monsters
            if (!monster) {
                // Get a random monster class selection
                classSelection = Math.floor(Math.random() * 3) + 1;

                if (classSelection === MonsterClass.WHITE) {
                    monster = new Monster(this, spawnLocation[0], spawnLocation[1], "whiteSkeleWalk", `monster-${monsterID}`, classSelection);
                } else if (classSelection === MonsterClass.GREY) {
                    monster = new Monster(this, spawnLocation[0], spawnLocation[1], "greySkeleWalk", `monster-${monsterID}`, classSelection);
                } else if (classSelection === MonsterClass.GREEN) {
                    monster = new Monster(this, spawnLocation[0], spawnLocation[1], "greenSkeleWalk", `monster-${monsterID}`, classSelection);
                }

                // Add the new monster to the group
                this.monsters.add(monster);

                // Add world bounds collision to monster
                monster.setCollideWorldBounds(true);

                // Increment the monster ID number
                monsterID++;
            } else {
                // Re-config inactive monster and reactivate it
                monster.makeActive(spawnLocation);
            }
        }
    }

    // Method creates a physics collection for item containment
    configItems() {
        this.items = this.physics.add.group();
        this.items.runChildUpdate = true;
    }

    // Method handles spawning of items when a monster dies
    spawnItem(locationX, locationY, monsterClass) {
        // Determine which item type should be spawned based on class of monster that died
        let itemClass;
        if (monsterClass === MonsterClass.GREEN) {
            itemClass = ItemClass.POTION;
        } else if (monsterClass === MonsterClass.GREY) {
            itemClass = ItemClass.POWER;
        } else if (monsterClass === MonsterClass.WHITE) {
            itemClass = ItemClass.STAR;
        }

        // Create item based on type determined above
        let newItem;
        if (itemClass === ItemClass.POTION) {
            if ((Math.floor(Math.random() * 11)) > 3) {
                newItem = new GameItem(this, locationX, locationY, "potion", itemClass);
            }
        } else if (itemClass === ItemClass.POWER) {
            if ((Math.floor(Math.random() * 11)) > 5) {
                newItem = new GameItem(this, locationX, locationY, "power", itemClass);
            }
        } else if (itemClass === ItemClass.STAR) {
            if ((Math.floor(Math.random() * 11)) > 6) {
                newItem = new GameItem(this, locationX, locationY, "star", itemClass);
            }
        }

        if (newItem) {
            this.items.add(newItem);
        }
    }

    // Method creates collisions between map vs creatures & creatures vs creatures
    addCollisions() {
        // Player vs map blocked layer
        this.physics.add.collider(this.player, this.map.blockedLayer);

        // Monsters vs map blocked layer
        this.physics.add.collider(this.monsters, this.map.blockedLayer);

        // Monster attacking player overlap event
        this.physics.add.overlap(this.player, this.monsters, (player, monster) => {
            monster.markAsAttacking();
        });

        // Player gathering item overlap event
        this.physics.add.overlap(this.player, this.items, (player, item) => {
            if (item.itemClass === ItemClass.POTION) {
                this.player.health = this.player.maxHealth;
                this.player.energy = this.player.maxEnergy;
                this.crystalFoundAudio.play();
                item.removeFromGame();
            } else if (item.itemClass === ItemClass.POWER && !this.player.powerEffectOn) {
                this.player.powerEffectOn = true;
                this.crystalFoundAudio.play();
                this.powerUpAudio.play();
                item.removeFromGame();
                this.time.delayedCall(
                    7500,
                    () => {
                        this.player.powerEffectOn = false;
                        this.powerUpAudio.stop();
                    },
                    [],
                    this
                );
            } else if (item.itemClass === ItemClass.STAR && !this.player.starEffectOn) {
                this.player.starEffectOn = true;
                item.removeFromGame();
                this.crystalFoundAudio.play();
                this.shieldOnAudio.play();
                this.time.delayedCall(
                    7500,
                    () => {
                        this.player.starEffectOn = false;
                        this.shieldOnAudio.stop();
                    },
                    [],
                    this
                );
            }
        });
    }
}