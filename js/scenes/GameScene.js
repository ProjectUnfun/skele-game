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

// Track movement velocity of player in game
const playerMoveSpeed = 160;

// Track movement velocity of monsters in game
const monsterMoveSpeed = 120;

// Track the ID of monsters
let monsterID = 0;

// Track the number of monsters
let numberOfMobs = 25;

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

        // Spawn the mobs
        this.spawnMonsters(numberOfMobs);

        // Create the player
        this.createPlayer();

        // Add collisions with the map
        this.addCollisions();
    }

    update() {
        // Call the player object update method
        this.player.update(this.cursors);
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

            // Get a random monster class selection
            classSelection = Math.floor(Math.random() * 3) + 1;

            // Create a new monster if there are no inactive monsters
            if (!monster) {
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

    // Method creates collisions between map and creatures
    addCollisions() {
        // Player vs map blocked layer
        this.physics.add.collider(this.player, this.map.blockedLayer);

        // Monsters vs map blocked layer
        this.physics.add.collider(this.monsters, this.map.blockedLayer);
    }
}