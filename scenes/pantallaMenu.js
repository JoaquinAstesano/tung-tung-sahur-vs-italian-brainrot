export default class PantallaMenu extends Phaser.Scene {
  constructor() {
    super({ key: 'PantallaMenu' });
  }

  preload() {
    this.load.audio('musicMenu', 'Public/assets/musicmenu.ogg');
  }

  create() {
    this.add.text(400, 70, 'TUNG TUNG SAHUR VS ITALIAN BRAINROT', { fontSize: '36px', color: '#fff', fontFamily: 'Pixellari', fontStyle: 'bold' }).setOrigin(0.5);
    this.jugarText = this.add.text(400, 150, 'PLAY', { fontSize: '36px', color: '#ff0', fontFamily: 'Pixellari' }).setOrigin(0.5);
    this.opcionesText = this.add.text(400, 200, 'GAME OPTIONS', { fontSize: '20px', color: '#fff', fontFamily: 'Pixellari' }).setOrigin(0.5);
    this.creditosText = this.add.text(400, 235, 'CREDITS', { fontSize: '20px', color: '#fff', fontFamily: 'Pixellari' }).setOrigin(0.5);
    this.tutorialText = this.add.text(400, 270, 'TUTORIAL', { fontSize: '20px', color: '#fff', fontFamily: 'Pixellari' }).setOrigin(0.5);

    this.jugarText.setInteractive({ useHandCursor: true });
    this.jugarText.on('pointerdown', () => {
      this.scene.start('Game');
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

    if (!this.sound.get('musicMenu')) {
      this.musicMenu = this.sound.add('musicMenu', { loop: true, volume: 0.1 });
      this.musicMenu.play();
    } else {
      this.musicMenu = this.sound.get('musicMenu');
      if (!this.musicMenu.isPlaying) this.musicMenu.play();
      this.musicMenu.setVolume(0.1);
    }
  }

}
