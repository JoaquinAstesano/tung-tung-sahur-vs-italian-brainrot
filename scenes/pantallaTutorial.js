export default class PantallaTutorial extends Phaser.Scene {
  constructor() {
    super({ key: 'PantallaTutorial' });
  }

  preload() {
    this.load.image('controles', 'Public/assets/controles.png');
    this.load.image('WASD', 'Public/assets/WASD.png');
  }

  create() {
    this.add.rectangle(400, 300, 800, 600, 0x223355).setDepth(-1);
    this.add.text(400, 70, 'TUTORIAL', { fontSize: '36px', color: '#fff', fontFamily: 'Pixellaria', fontStyle: 'bold' }).setOrigin(0.5);
    this.add.text(400, 100, 'Learn to play', { fontSize: '20px', color: '#fff', fontFamily: 'Pixellaria' }).setOrigin(0.5);
    this.add.image(400, 220, 'WASD').setDisplaySize(140, 140).setOrigin(0.5);
    this.add.text(400, 155, 'JUMP', { fontSize: '18px', color: '#fff', fontFamily: 'Pixellaria' }).setOrigin(0.5);
    this.add.text(400, 280, 'DOWN', { fontSize: '18px', color: '#fff', fontFamily: 'Pixellaria' }).setOrigin(0.5);
    this.add.text(305, 230, 'LEFT', { fontSize: '18px', color: '#fff', fontFamily: 'Pixellaria' }).setOrigin(0.5);
    this.add.text(500, 230, 'RIGHT', { fontSize: '18px', color: '#fff', fontFamily: 'Pixellaria' }).setOrigin(0.5);
    const volver = this.add.text(70, 30, 'BACK', { fontSize: '20px', color: '#ff0', fontFamily: 'Pixellaria' }).setOrigin(0.5);
    volver.setInteractive({ useHandCursor: true });
    volver.on('pointerdown', () => {
      this.scene.start('PantallaMenu');
    });
  }
}
