class GameScene extends Phaser.Scene {
    constructor() {
        super("Game");
    }

    create() {
        this.createMap();
    }

    update() { }

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
}