import * as ContainerUtil from '../utils/container-util';
import * as AnimationsUtil from '../utils/animations-util';
import * as CustomPngSequencesRenderer from '../utils/custom-png-sequences-renderer.js';

class ChoiceButton extends Phaser.Group {
    constructor(game, assets, onSuccess, containerName) {
        super(game);

        // this.fxLayer = new Phaser.Group(this.game);

        this.button = new Phaser.Sprite(this.game, 0, 0, assets);
        this.button.tag = onSuccess;
        this.initialCtaWidth = this.button.width;
        this.button.anchor.set(0.5, 0.5);
        this.add(this.button);

        ContainerUtil.fitInContainer(this.button, containerName);

        this.button.bringToTop();

        this.button.x += this.button.width / 2;
        this.button.y += this.button.height / 2;

        this.addListener();
    }

    addListener() {
        this.button.inputEnabled = true;
        this.button.input.useHandCursor = true;
        this.button.events.onInputDown.add(function() {
            console.log(this.button.tag);
            this.game.global.currentVideoScript = PiecSettings.script[this.button.tag];
            this.game.onInteract.dispatch();
        }, this);
    }
}

export default ChoiceButton;