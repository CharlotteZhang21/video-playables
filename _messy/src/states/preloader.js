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

         this.game.load.image('cta', PiecSettings.assetsDir + 'download.png');
         this.game.load.image('cta-2', PiecSettings.assetsDir + 'download_2.png');

         // this.game.global.animations = {};

         // PiecSettings.animation = PiecSettings.animation || {};

         // var defaultAnimation = {
         //     frameRate: 60,
         //     scale: 1
         // };

     }

     onLoadComplete() {
         this.game.state.start('endcard');
     }
 }

 export default Preloader;