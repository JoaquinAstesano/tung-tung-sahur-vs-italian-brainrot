import PantallaOpciones from './scenes/pantallaOpciones.js';
import PantallaCreditos from './scenes/pantallaCreditos.js';
import PantallaMenu from './scenes/pantallaMenu.js';
import Game from './scenes/Game.js';
import PantallaTutorial from './scenes/pantallaTutorial.js';

const config = {
    type: Phaser.AUTO,
    pixelArt: true,
    width: 800,
    height: 300,
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
      min: {
        width: 800,
        height: 300,
      },
      max: {
        width: 1200,
        height: 600,
      },
    },
    physics: {
      default: "arcade",
      arcade: {
        gravity: { y: 1000 },
        debug: false,
      },
    },
    scene: [PantallaMenu, PantallaOpciones, PantallaCreditos, PantallaTutorial, Game],
  };
  
  window.game = new Phaser.Game(config);