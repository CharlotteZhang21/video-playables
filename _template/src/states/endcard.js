import CtaButton from '../prefabs/cta-button';
import * as CustomPngSequencesRenderer from '../utils/custom-png-sequences-renderer.js';

class Endcard extends Phaser.State {

    constructor() {
        super();
    }

    create() {

        this.game.scale.scaleMode = Phaser.ScaleManager.USER_SCALE;
        this.game.scale.setUserScale((1 / window.devicePixelRatio), (1 / window.devicePixelRatio), 0, 0);

        this.game.global.windowWidth = document.body.clientWidth;
        this.game.global.windowHeight = document.body.clientHeight;



        this.cta = new CtaButton(this.game);
        this.game.add.existing(this.cta);


        if (PiecSettings.timer !== undefined) {
            this.game.time.events.add(4000, function() {
                document.getElementById("vungle-close").className = "visible";
            }, this);
        }
    }

    resize() {
    }

    render() {
    }


}

export default Endcard;