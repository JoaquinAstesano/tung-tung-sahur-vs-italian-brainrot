export default class PantallaTutorial extends Phaser.Scene {
  constructor() {
    super({ key: 'PantallaTutorial' });
  }

  preload() {
    // Cambia la ruta y el nombre si tu imagen de controles es diferente
    this.load.image('controles', 'Public/assets/controles.png');
    // Imagen WASD
    this.load.image('WASD', 'Public/assets/WASD.png');
  }

  create() {
    this.add.rectangle(400, 300, 800, 600, 0x223355).setDepth(-1);
    this.add.text(400, 70, 'TUTORIAL', { fontSize: '36px', color: '#fff', fontFamily: 'Arial', fontStyle: 'bold' }).setOrigin(0.5);
    this.add.text(400, 100, 'Aprende a jugar:', { fontSize: '20px', color: '#fff', fontFamily: 'Arial' }).setOrigin(0.5);
    // Imagen WASD 
    this.add.image(400, 220, 'WASD').setDisplaySize(140, 140).setOrigin(0.5);
    // Indicaciones de controles
    this.add.text(380, 155, 'SALTAR', { fontSize: '18px', color: '#fff', fontFamily: 'Arial' }).setOrigin(0.5);
    this.add.text(420, 280, 'AGACHARSE', { fontSize: '18px', color: '#fff', fontFamily: 'Arial' }).setOrigin(0.5);
    this.add.text(280, 230, 'IZQUIERDA', { fontSize: '18px', color: '#fff', fontFamily: 'Arial' }).setOrigin(0.5);
    this.add.text(520, 230, 'DERECHA', { fontSize: '18px', color: '#fff', fontFamily: 'Arial' }).setOrigin(0.5);
    const volver = this.add.text(70, 30, 'VOLVER', { fontSize: '20px', color: '#ff0', fontFamily: 'Arial' }).setOrigin(0.5);
    volver.setInteractive({ useHandCursor: true });
    volver.on('pointerdown', () => {
      this.scene.start('PantallaMenu');
    });
  }
}
