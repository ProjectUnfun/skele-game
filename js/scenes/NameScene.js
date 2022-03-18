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

        // Display the background image
        this.backgroundImage = this.add.image(0, 0, "skeleBG");
        this.backgroundImage.setOrigin(0);

        // Display Title Text
        this.gameName = this.add.text(395, 100, "Legio Mortis", {
            color: "#DFDFDF",
            fontSize: 108,
            fontFamily: "Lucifer",
        }).setOrigin(0.5);

        // Display instruction text
        this.message = this.add.text(395, 300, "Enter your name:", {
            color: "#DFDFDF",
            fontSize: 48,
            fontFamily: "Lucifer",
        }).setOrigin(0.5);

        // Display credit text
        this.credits = this.add.text(670, 570, "Brought to you by:\n  Project Unfun ", {
            color: "#DFDFDF",
            fontSize: 20,
            fontStyle: "bold"
        }).setOrigin(0.5);

        // Serve the input form HTML page
        this.nameInput = this.add.dom(395, 375).createFromCache("form");

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