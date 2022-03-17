const Direction = {
    DOWN: 1,
    UP: 2,
    LEFT: 3,
    RIGHT: 4
};

const playerMoveSpeed = 160;

class GameScene extends Phaser.Scene {
    constructor() {
        super("Game");
    }

    create() {
        this.createInputCursors();
        this.createMap();
        this.createPlayer();
        this.addCollisions();
    }

    update() {
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
        this.player = new Player(this, 96, 160, "meleeWalk");
    }

    // Method creates collisions between map and creatures
    addCollisions() {
        // Player vs map blocked layer
        this.physics.add.collider(this.player, this.map.blockedLayer);
    }
}