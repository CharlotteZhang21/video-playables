import * as ContainerUtil from '../utils/container-util';

class InteractiveElement extends Phaser.Group {
    /*
    args:
     + src: reference to the asset to be used
     + container: htmlTag of the container to fit the button in
    */
    constructor(game, args) {
        super(game);

        this.initSignals();

        this.button = new Phaser.Sprite(this.game, 0, 0, args.src);
        this.button.anchor.set(0.5);
        this.button.x += this.button.width / 2;
        this.button.y += this.button.height / 2;
        this.add(this.button);

        ContainerUtil.fitInContainer(this.button, args.container);

        this.button.inputEnabled = true;
        this.button.input.useHandCursor = true;
        this.button.events.onInputDown.add(function() {
            this.onInteract.dispatch(this);
        }, this);

    }

    initSignals() {
        this.onInteract = new Phaser.Signal();
        this.onFail = new Phaser.Signal();
    }

    hide() {
    	if (this.alpha > 0)
        	this.alpha = 0;
    }

    show() {
    	if (this.alpha < 1)
    		this.alpha = 1;
    }

    disable() {
    	if (this.button.inputEnabled)
    		this.button.inputEnabled = false;
    	this.hide();
    }

    enable() {
    	if (!this.button.inputEnabled)
    		this.button.inputEnabled = true;
    	this.show();
    }

}

export default InteractiveElement;