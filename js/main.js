var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: "game-div",
    scene: [
        BootScene,
        NameScene,
        ClassScene,
        GameScene,
        InventoryScene,
    ],
    dom: {
        createContainer: true
    },
    physics: {
        default: "arcade",
        arcade: {
            debug: true,
            gravity: {
                y: 0,
            },
        },
    },
    pixelArt: true,
    roundPixels: true,
};

var game = new Phaser.Game(config);