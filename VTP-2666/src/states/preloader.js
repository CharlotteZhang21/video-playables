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
         this.game.load.image('logo', PiecSettings.assetsDir + 'logo.png');
         this.game.load.image('cta', PiecSettings.assetsDir + 'download.png');


         //----------*my customised preload*-----------
         this.game.load.image('btn_character', PiecSettings.assetsDir + 'character_1.png');

         this.game.load.image('pricey', PiecSettings.assetsDir + 'pricey.png');
         this.game.load.image('cheap', PiecSettings.assetsDir + 'cheap.png');

         /*============== collectibles ====================*/
         this.game.load.image('coin', PiecSettings.assetsDir + 'coin.png');
         this.game.load.image('coinStack', PiecSettings.assetsDir + 'coinstack.png');
         this.game.load.image('wallet', PiecSettings.assetsDir + 'wallet.png');

         this.game.load.image('healthBar', PiecSettings.assetsDir + 'healthbar.png');
         this.game.load.image('healthBar-fill', PiecSettings.assetsDir + 'healthbar-fill.png');

         this.game.load.image('circleBar', PiecSettings.assetsDir + 'circlebar.png');
         this.game.load.image('circleBar-fill', PiecSettings.assetsDir + 'circlebar-fill.png');

         this.game.load.image('projectile', PiecSettings.assetsDir + 'projectile.png');

         
         // this.game.load.image('cta-2', PiecSettings.assetsDir + 'download_2.png');

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