export default class PantallaCreditos extends Phaser.Scene {
  constructor() {
    super({ key: 'PantallaCreditos' });
  }

  create() {
    this.add.rectangle(400, 300, 800, 600, 0x223355).setDepth(-1);
    this.add.text(400, 120, 'CRÉDITOS', { fontSize: '48px', color: '#fff', fontFamily: 'Arial', fontStyle: 'bold' }).setOrigin(0.5);
    const volver = this.add.text(70, 30, 'VOLVER', { fontSize: '20px', color: '#ff0', fontFamily: 'Arial' }).setOrigin(0.5);
    volver.setInteractive({ useHandCursor: true });
    volver.on('pointerdown', () => {
      this.scene.start('PantallaMenu');
    });
  }
}
