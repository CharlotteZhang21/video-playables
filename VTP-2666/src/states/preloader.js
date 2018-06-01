 import * as Atlas from '../atlas/index';
 import * as Util from '../utils/util';
 import * as CustomPngSequencesRenderer from '../utils/custom-png-sequences-renderer.js';

 class Preloader extends Phaser.State {

     constructor() {
         super();
         this.asset = null;
     }

     preload() {
         //Setup loading and its events
         this.load.onLoadComplete.addOnce(this.onLoadComplete, this);
         this.loadResources();
         CustomPngSequencesRenderer.preloadPngSequences(this.game);
     }

     update() {}

     loadResources() {
        if(document.getElementById('logo'))
             this.game.load.image('logo', PiecSettings.assetsDir + 'logo.png');
         this.game.load.image('cta', PiecSettings.assetsDir + 'cta.png');


         //----------*my customised preload*-----------
         this.game.load.image('spin', PiecSettings.assetsDir + 'spin.png');

     }

     onLoadComplete() {
         this.game.state.start('endcard');
     }
 }

 export default Preloader;