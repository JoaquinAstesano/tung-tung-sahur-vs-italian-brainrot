export default class PantallaMenu extends Phaser.Scene {
  constructor() {
    super({ key: 'PantallaMenu' });
  }

  create() {
    this.add.rectangle(400, 300, 800, 600, 0x222244).setDepth(-1);
    this.add.text(400, 70, 'TUNG TUNG SAHUR VS ITALIAN BRAINROT', { fontSize: '36px', color: '#fff', fontFamily: 'Arial', fontStyle: 'bold' }).setOrigin(0.5);
    this.jugarText = this.add.text(400, 150, 'JUGAR', { fontSize: '36px', color: '#ff0', fontFamily: 'Arial' }).setOrigin(0.5);
    this.opcionesText = this.add.text(400, 200, 'OPCIONES', { fontSize: '20px', color: '#fff', fontFamily: 'Arial' }).setOrigin(0.5);
    this.creditosText = this.add.text(400, 235, 'CRÉDITOS', { fontSize: '20px', color: '#fff', fontFamily: 'Arial' }).setOrigin(0.5);
    this.tutorialText = this.add.text(400, 270, 'TUTORIAL', { fontSize: '20px', color: '#fff', fontFamily: 'Arial' }).setOrigin(0.5);

    this.jugarText.setInteractive({ useHandCursor: true });
    this.jugarText.on('pointerdown', () => {
      this.scene.start('hello-world');
    });

    this.opcionesText.setInteractive({ useHandCursor: true });
    this.opcionesText.on('pointerdown', () => {
      this.scene.start('PantallaOpciones');
    });

    this.creditosText.setInteractive({ useHandCursor: true });
    this.creditosText.on('pointerdown', () => {
      this.scene.start('PantallaCreditos');
    });

    this.tutorialText.setInteractive({ useHandCursor: true });
    this.tutorialText.on('pointerdown', () => {
      this.scene.start('PantallaTutorial');
    });
    // Puedes agregar eventos para opciones y créditos si lo deseas
    
  }
}
