class NameScene extends Phaser.Scene {
    constructor() {
        super("Name");
    }

    preload() {
        // Load the HTML page to be used as the input form
        this.load.html("form", "form.html");
    }

    create() {
        // Store the user input player name
        this.playerName = "";

        // Track name acquisition status
        this.gotTheName = false;

        // Display Title Text
        this.gameName = this.add.text(395, 125, "Skele Game", {
            color: "#00FF00",
            fontSize: 72,
            fontStyle: "bold"
        }).setOrigin(0.5);

        // Display instruction text
        this.message = this.add.text(395, 250, "Type your name then press\n     the Enter key ", {
            color: "#FFFFFF",
            fontSize: 36,
            fontStyle: "bold"
        }).setOrigin(0.5);

        // Serve the input form HTML page
        this.nameInput = this.add.dom(395, 360).createFromCache("form");

        // Track when the enter key is pressed
        this.returnKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);

        // When the enter key is pressed and something has been input, set the name
        this.returnKey.on("down", event => {
            let name = this.nameInput.getChildByName("name");
            if (name.value != "") {
                this.playerName = name.value;
                this.gotTheName = true;
            }
        });
    }

    update() {
        // Once name has been entered, start game scene passing the name
        if (this.gotTheName) {
            this.scene.start("Class", { name: this.playerName });
        }
    }
}