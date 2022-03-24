class EndScene extends Phaser.Scene {
    constructor() {
        super("End");
    }

    init(data) {
        // Store name input from game scene
        this.playerName = data.name;
    }

    preload() { }

    create() {
        // Display the background image
        this.backgroundImage = this.add.image(0, 0, "skeleBG");
        this.backgroundImage.setOrigin(0);

        this.keyWasPressed = false;

        // Display Title Text
        this.gameName = this.add.text(395, 100, "Game Over", {
            color: "#DFDFDF",
            fontSize: 108,
            fontFamily: "Lucifer",
        }).setOrigin(0.5);

        // Display instruction text
        this.message = this.add.text(395, 200, "Press enter to play again", {
            color: "#DFDFDF",
            fontSize: 56,
            fontFamily: "Lucifer",
        }).setOrigin(0.5);

        // Display credits text
        this.unfun = this.add.text(400, 430, "Credits for art:\nStephen Challener, Johannes Sjölund, David Conway Jr.,\nCarlo Enrico Victoria,bluecarrot16, Michael Whitlock,\nMatthew Krohn, Thane Brimhall, laetissima, Joe White,\nNila122, DarkwallLKE, Tuomo Untinen, Daniel Eddeland,\ngr3yh47, Yamilian, ElizaWy, Dr. Jamgo, Casper Nilsson,\nJohann CHARLOT, Skyler Robert Colladay, Lanea Zimmerman,\nCharles Sanchez, Manuel Riecke, Daniel Armstrong\n\nCredits for music:\nbensound.com", {
            color: "#DFDFDF",
            fontSize: 20,
            fontStyle: "bold"
        }).setOrigin(0.5);

        // Display unfun text
        this.unfun = this.add.text(687, 570, "Brought to you by:\n  Project Unfun ", {
            color: "#DFDFDF",
            fontSize: 20,
            fontStyle: "bold"
        }).setOrigin(0.5);

        // SFX
        this.skeleDamagedAudio = this.sound.add("skeleHit", {
            loop: false,
            volume: 1.3,
        });

        // Track when the enter key is pressed
        this.returnKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);

        // When the enter key is pressed and something has been input, set the name
        this.returnKey.on("down", event => {
            this.keyWasPressed = true;
        });
    }

    update() {
        // Once name has been entered, start game scene passing the name
        if (this.keyWasPressed) {
            this.skeleDamagedAudio.play();
            document.getElementById("game-div").style.borderColor = "grey";
            this.scene.start("Class", { name: this.playerName });
        }
    }
}