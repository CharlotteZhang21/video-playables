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

        this.cta = new CtaButton(this.game);
        this.game.add.existing(this.cta);

        this.logo = new Logo(this.game);
        this.game.add.existing(this.logo);

        this.customEffects = new CustomEffects(this.game);




        if (PiecSettings.timer !== undefined) {
            this.game.time.events.add(4000, function() {
                document.getElementById("vungle-close").className = "visible";
            }, this);
        }

        this.videoPlayableStateController = new VideoPlayableStateController(this.game, 'videoBg', PiecSettings.script[PiecSettings.initialScript], PiecSettings.script, PiecSettings.variables);
        this.videoPlayableStateController.transitionToState('intro');
        /**debug**/
        // this.videoPlayableStateController.transitionToState('darkPath');

    }

    resize() {}

    render() {}

    update() {
        this.videoPlayableStateController.update();
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

        Tweener.moveToDom(
              this.logo.logo,
              'logo-final',
              PiecSettings.logoMoveDelay,
              PiecSettings.logoMoveDuration,
              Phaser.Easing.Quadratic.Out,
              function(sprite) {

                  Tweener[PiecSettings.logoAnimation](sprite, PiecSettings.logoAnimationDelay, PiecSettings.logoAnimationDuration);
              });

    }

}

export default Endcard;