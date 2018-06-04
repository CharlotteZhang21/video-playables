import CtaButton from '../prefabs/cta-button';
import Logo from '../prefabs/logo';
import CustomEffects from '../prefabs/custom-effects';

import VideoPlayableStateController from '../prefabs/video-playable-state-controller';
import * as CustomPngSequencesRenderer from '../utils/custom-png-sequences-renderer.js';
import * as Tweener from '../utils/tweener';

class Endcard extends Phaser.State {

    constructor() {
        super();
    }

    create() {

        this.game.scale.scaleMode = Phaser.ScaleManager.USER_SCALE;
        this.game.scale.setUserScale((1 / window.devicePixelRatio), (1 / window.devicePixelRatio), 0, 0);

        this.game.global.windowWidth = document.body.clientWidth * window.devicePixelRatio;
        this.game.global.windowHeight = document.body.clientHeight * window.devicePixelRatio;

        this.game.onGameComplete.add(this.onGameComplete, this);
        this.game.onClose.add(this.closeAndMute, this);

        this.cta = new CtaButton(this.game);
        this.game.add.existing(this.cta);
        
        this.customEffects = new CustomEffects(this.game);




        if (PiecSettings.timer !== undefined) {
            this.game.time.events.add(4000, function() {
                document.getElementById("vungle-close").className = "visible";
            }, this);
        }

        this.videoPlayableStateController = new VideoPlayableStateController(this.game, 'videoBg', PiecSettings.script[PiecSettings.initialScript], PiecSettings.script, PiecSettings.variables, PiecSettings.audios, PiecSettings.initialAudio);
        this.videoPlayableStateController.transitionToState(PiecSettings.initialScript);
        /**debug**/
        // this.videoPlayableStateController.transitionToState('darkPath');

        this.setController();

    }

    setController() {
      this.cta.onInteract.add(function(){
            this.videoPlayableStateController.pauseAllAudio();
        }, this);
    }

    resize() {}

    render() {}

    update() {
        this.videoPlayableStateController.update();
    }

    closeAndMute() {
        this.videoPlayableStateController.pauseAllAudio();
    }

    onGameComplete(){
        //show cta and logo
        console.log('game completed');
        Tweener.moveToDom(
              this.cta.button,
              'cta-container-final',
              PiecSettings.ctaMoveDelay,
              PiecSettings.ctaMoveDuration,
              Phaser.Easing.Quadratic.Out,
              function(sprite) {

                  Tweener[PiecSettings.ctaAnimation](sprite, PiecSettings.ctaAnimationDelay, PiecSettings.ctaAnimationDuration);
              });

    }

}

export default Endcard;