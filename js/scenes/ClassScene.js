class ClassScene extends Phaser.Scene {
    constructor() {
        super("Class");
    }

    init(data) {
        this.playerName = data.name;
    }

    create() {
        // Display instruction text
        this.message = this.add.text(395, 100, "Choose your class:\n\n click an image", {
            color: "#FFFFFF",
            fontSize: 36,
            fontStyle: "bold"
        }).setOrigin(0.5);

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

        this.classSelected = null;

        this.fighterButton = this.add.image(150, 350, "fighterIcon");
        this.fighterButton.setInteractive();
        this.fighterButton.on('pointerdown', () => {
            this.classSelected = 1;
        });

        this.rangerButton = this.add.image(400, 350, "rangerIcon");
        this.rangerButton.setInteractive();
        this.rangerButton.on('pointerdown', () => {
            this.classSelected = 2;
        });

        this.mageButton = this.add.image(650, 350, "mageIcon");
        this.mageButton.setInteractive();
        this.mageButton.on('pointerdown', () => {
            this.classSelected = 3;
        });
    }

    update() {
        // When class has been selected
        if (this.classSelected !== null) {
            this.scene.start("Game", { name: this.playerName, class: this.classSelected });
        }
    }
}