 import * as Atlas from '../atlas/index';
 import * as Util from '../utils/util';
 import * as Animations from '../animations.js';
 import * as CustomPngSequencesRenderer from '../utils/custom-png-sequences-renderer.js';

 class Preloader extends Phaser.State {

     constructor() {
         super();
         this.asset = null;
     }

     preload() {
         //setup loading bar
         // this.asset = this.add.sprite(this.game.width * 0.5 - 110, this.game.height * 0.5 - 10, 'preloader');
         // this.load.setPreloadSprite(this.asset);

         //Setup loading and its events
         this.load.onLoadComplete.addOnce(this.onLoadComplete, this);
         this.loadResources();
         // FxRenderer.preloadFx(this.game);
         CustomPngSequencesRenderer.preloadPngSequences(this.game);
         // WinMessages.preloadWinMessages(this.game);
     }

     update() {}

     loadResources() {

         this.game.load.image('logo', PiecSettings.assetsDir + 'logo.png');

         // if (PiecSettings.tooltip != null && PiecSettings.tooltip.src != null) {
         //    this.game.load.image('tooltip', PiecSettings.assetsDir + PiecSettings.tooltip.src);
         // }
        //  if (PiecSettings.tooltip.firstHandPosition != null){
        //     this.game.load.image('hand', PiecSettings.assetsDir + 'hand.png');
        // }

         this.game.load.image('cta', PiecSettings.assetsDir + 'cta.png');
         this.game.load.image('win-message', PiecSettings.assetsDir + 'victory.png');
         this.game.load.image('bar-bg', PiecSettings.assetsDir + 'enemy_bar_bg.png');
         this.game.load.image('bar-fill', PiecSettings.assetsDir + 'good_bar_fill.png');
         this.game.load.image('enemy-bar-fill', PiecSettings.assetsDir + 'enemy_bar_fill.png');
         this.game.load.image('background', PiecSettings.assetsDir + 'bg.jpg');
         this.game.load.image('gradient', PiecSettings.assetsDir + 'gradient.png');
         this.game.load.image('blue-icon', PiecSettings.assetsDir + 'blue_icon.png');
         this.game.load.image('death-icon', PiecSettings.assetsDir + 'death_icon.png');
         this.game.load.image('purple-icon', PiecSettings.assetsDir + 'purple_icon.png');
         this.game.load.image('win-message', PiecSettings.assetsDir + 'victory.png');
         this.game.load.image('lose-message', PiecSettings.assetsDir + 'lose.png');
         
         this.game.load.image('knight-portrait', PiecSettings.assetsDir + 'knight_portrait.png');
         this.game.load.image('girl-portrait', PiecSettings.assetsDir + 'girl_portrait.png');

         this.game.load.image('attack-button', PiecSettings.assetsDir + 'attack.png');

         this.game.global.animations = {};
         
         PiecSettings.animation = PiecSettings.animation || {};

         var defaultAnimation = {
            frameRate: 60,
            scale: 1,
         };
         
     }

     onLoadComplete() {
         this.game.state.start('endcard');
     }
 }

 export default Preloader;
