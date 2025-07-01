export default class PantallaCreditos extends Phaser.Scene {
  constructor() {
    super({ key: 'PantallaCreditos' });
  }

  preload() {
  }

  create() {
    this.add.rectangle(400, 300, 800, 600, 0x223355).setDepth(-1);
    this.add.text(400, 120, 'CREDITS', { fontSize: '48px', color: '#fff', fontFamily: 'Pixellaria', fontStyle: 'bold' }).setOrigin(0.5);
    const volver = this.add.text(70, 30, 'BACK', { fontSize: '20px', color: '#ff0', fontFamily: 'Pixellaria' }).setOrigin(0.5);
    volver.setInteractive({ useHandCursor: true });
    volver.on('pointerdown', () => {
      this.scene.start('PantallaMenu');
    });
    this.add.text(400, 200, 'Music: Abstraction - Music Loop Bundle', {
      fontSize: '18px',
      color: '#fff',
      fontFamily: 'Pixellaria',
      align: 'center',
      wordWrap: { width: 700 }
    }).setOrigin(0.5);
  }
}
