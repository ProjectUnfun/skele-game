class ScoreScene extends Phaser.Scene {
    constructor() {
        super("Score");
    }

    init() {
        // Create a reference to the game scene
        this.gameScene = this.scene.get("Game");
    }

    preload() {
        this.load.image("swordIcon", "assets/images/iconSword.png");
        this.load.image("skullIcon", "assets/images/iconSkull.png");
    }

    create() {
        // Setup methods
        this.setupUiElements();
        this.setupEvents();
    }

    // Method creates the counter text and icon
    setupUiElements() {
        // Create kills text
        this.killsText = this.add.text(500, 5, "Kills: 0", {
            fontSize: "24px",
            fill: "#fff",
            fontFamily: "Lucifer",
        });

        // Create mobs text
        this.mobsText = this.add.text(200, 5, "Monsters: 5", {
            fontSize: "24px",
            fill: "#fff",
            fontFamily: "Lucifer",
        });

        // Create kills icon
        this.killsIcon = this.add.image(475, 25, "swordIcon");
        this.killsIcon.setScale(1.2);

        // Create mobs icon
        this.mobsIcon = this.add.image(180, 20, "skullIcon");
    }

    // Method creates the event listener for counter updates
    setupEvents() {
        this.gameScene.events.on("updateScore", (kills, monsters) => {
            // Update fields
            this.killsText.setText(`Kills: ${kills}`);
            this.mobsText.setText(`Monsters: ${monsters}`);
        });
    }

    update() { }
}