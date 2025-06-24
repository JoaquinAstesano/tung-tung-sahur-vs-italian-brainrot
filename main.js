import PantallaOpciones from './scenes/pantallaOpciones.js';
import PantallaCreditos from './scenes/pantallaCreditos.js';
import PantallaMenu from './scenes/pantalla.js';
import HelloWorldScene from "./scenes/HelloWorldScene.js";
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
        debug: true,
      },
    },
    // List of scenes to load
    // Only the first scene will be shown
    // Remember to import the scene before adding it to the list
    scene: [PantallaMenu, PantallaOpciones, PantallaCreditos, PantallaTutorial, HelloWorldScene],
  };
  
  // Create a new Phaser game instance
  window.game = new Phaser.Game(config);