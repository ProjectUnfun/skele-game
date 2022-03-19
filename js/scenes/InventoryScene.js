class InventoryScene extends Phaser.Scene {
    constructor() {
        super("Inventory");
    }

    init() {
        // Create a reference to the game scene
        this.gameScene = this.scene.get("Game");
    }

    preload() {
        // Load the HTML page to be used as the inventory grid form
        this.load.html("grid", "inventory.html");
    }

    create() {
        // Display the inventory panel image
        this.backgroundImage = this.gameScene.add.image(10, 390, "bagPanel");
        this.backgroundImage.setOrigin(0);

        // Display inventory Text
        this.bagText = this.gameScene.add.text(55, 405, "Inventory", {
            color: "#000000",
            fontSize: 24,
            fontFamily: "Lucifer",
        }).setOrigin(0);

        this.bagGrid = this.add.dom(101, 510).createFromCache("grid");

        // Listen for toggle event from GameScene
        this.gameScene.events.on("toggleBag", () => {
            if (this.scene.isActive("Inventory")) {
                this.scene.sleep("Inventory");
                this.backgroundImage.setAlpha(0);
                this.bagText.setAlpha(0);
            } else if (!this.scene.isActive("Inventory")) {
                this.scene.wake("Inventory");
                this.backgroundImage.setAlpha(1);
                this.bagText.setAlpha(1);
            }
        });
    }
}