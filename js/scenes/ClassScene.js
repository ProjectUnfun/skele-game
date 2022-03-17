class ClassScene extends Phaser.Scene {
    constructor() {
        super("Class");
    }

    init(data) {
        // Store name input from last scene
        this.playerName = data.name;
    }

    create() {
        // Display instructional text
        this.displayInstructions();

        // Create class labels
        this.createClassLabels();

        // Create class descriptions
        this.createClassDescriptions();

        // Track the player selected class
        this.classSelected = null;

        // Create image buttons
        this.createImageButtons();

        // Create image button click event listeners
        this.createButtonListeners();
    }

    update() {
        // When class has been selected pass class selection and name input to game scene and start it
        if (this.classSelected !== null) {
            this.scene.start("Game", { name: this.playerName, class: this.classSelected });
        }
    }

    // Create the instruction text
    displayInstructions() {
        // Display instruction text
        this.message = this.add.text(395, 100, "Choose your class\n\nto start the game", {
            color: "#FFFFFF",
            fontSize: 36,
            fontStyle: "bold"
        }).setOrigin(0.5);
    }

    // Create text labels for classes
    createClassLabels() {
        // Fighter text label
        this.message = this.add.text(150, 225, "Fighter", {
            color: "#FF0000",
            fontSize: 36,
            fontStyle: "bold"
        }).setOrigin(0.5);

        // Ranger text label
        this.message = this.add.text(400, 225, "Ranger", {
            color: "#0000FF",
            fontSize: 36,
            fontStyle: "bold"
        }).setOrigin(0.5);

        // Caster text label
        this.message = this.add.text(650, 225, "Caster", {
            color: "#00FF00",
            fontSize: 36,
            fontStyle: "bold"
        }).setOrigin(0.5);
    }

    // Create text descriptions for classes
    createClassDescriptions() {
        // Fighter description text
        this.message = this.add.text(150, 510, " Melee Attack\nMed Energy Use\n  Med Damage", {
            color: "#FFFFFF",
            fontSize: 24,
            fontStyle: "bold"
        }).setOrigin(0.5);

        // Ranger description text
        this.message = this.add.text(400, 510, " Range Attack\nLow Energy Use\n  Low Damage", {
            color: "#FFFFFF",
            fontSize: 24,
            fontStyle: "bold"
        }).setOrigin(0.5);

        // Caster description text
        this.message = this.add.text(650, 510, " Range Attack\nHigh Energy Use\n  High Damage", {
            color: "#FFFFFF",
            fontSize: 24,
            fontStyle: "bold"
        }).setOrigin(0.5);
    }

    // Create the image buttons for class selection
    createImageButtons() {
        this.fighterButton = this.add.image(150, 350, "fighterIcon");
        this.fighterButton.setInteractive();

        this.rangerButton = this.add.image(400, 350, "rangerIcon");
        this.rangerButton.setInteractive();

        this.mageButton = this.add.image(650, 350, "mageIcon");
        this.mageButton.setInteractive();
    }

    // Create the listeners for the class image buttons
    createButtonListeners() {
        this.fighterButton.on('pointerdown', () => {
            this.classSelected = 1;
        });

        this.rangerButton.on('pointerdown', () => {
            this.classSelected = 2;
        });

        this.mageButton.on('pointerdown', () => {
            this.classSelected = 3;
        });
    }
}