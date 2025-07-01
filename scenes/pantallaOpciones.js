export default class PantallaOpciones extends Phaser.Scene {
  constructor() {
    super({ key: 'PantallaOpciones' });
  }

  preload() {
    // No cargar música aquí
  }

  create() {
    this.add.rectangle(400, 300, 800, 600, 0x223355).setDepth(-1);
    this.add.text(400, 120, 'GAME OPTIONS', { fontSize: '48px', color: '#fff', fontFamily: 'Pixellaria', fontStyle: 'bold' }).setOrigin(0.5);
    this.add.text(400, 170, 'AUDIO SETTINGS', { fontSize: '32px', color: '#fff', fontFamily: 'Pixellaria' }).setOrigin(0.5);

    // Volumen Música
    this.add.text(250, 220, 'MUSIC', { fontSize: '24px', color: '#fff', fontFamily: 'Pixellaria' }).setOrigin(0.5, 0.5);
    this.musicBar = this.add.rectangle(400, 220, 200, 16, 0x8888ff).setOrigin(0.5);
    this.musicFill = this.add.rectangle(300, 220, 100, 16, 0x00ff00).setOrigin(0, 0.5);
    this.musicBar.setInteractive({ useHandCursor: true });
    this.musicBar.on('pointerdown', (pointer) => {
      let percent = Phaser.Math.Clamp((pointer.x - (400 - 100)) / 200, 0, 1);
      this.musicFill.width = percent * 200;
      // Aquí puedes ajustar el volumen de la música global
      if (this.sound && this.sound.volume !== undefined) this.sound.volume = percent;
    });

    // Volumen SFX
    this.add.text(250, 270, 'SFX', { fontSize: '24px', color: '#fff', fontFamily: 'Pixellaria' }).setOrigin(0.5, 0.5);
    this.sfxBar = this.add.rectangle(400, 270, 200, 16, 0x8888ff).setOrigin(0.5);
    this.sfxFill = this.add.rectangle(300, 270, 100, 16, 0xff8800).setOrigin(0, 0.5);
    this.sfxBar.setInteractive({ useHandCursor: true });
    this.sfxBar.on('pointerdown', (pointer) => {
      let percent = Phaser.Math.Clamp((pointer.x - (400 - 100)) / 200, 0, 1);
      this.sfxFill.width = percent * 200;
      // Aquí puedes ajustar el volumen de los efectos especiales globales
      this.registry.set('sfxVolume', percent);
    });

    const volver = this.add.text(70, 30, 'BACK', { fontSize: '20px', color: '#ff0', fontFamily: 'Pixellaria' }).setOrigin(0.5);
    volver.setInteractive({ useHandCursor: true });
    volver.on('pointerdown', () => {
      this.scene.start('PantallaMenu');
    });
  }
}
