import * as ContainerUtil from '../utils/container-util';
import * as AnimationsUtil from '../utils/animations-util';
import * as CustomPngSequencesRenderer from '../utils/custom-png-sequences-renderer.js';

class CtaButton extends Phaser.Group {
    constructor(game) {
        super(game);

        this.initSignals();

        this.fxLayer = new Phaser.Group(this.game);

        this.button = new Phaser.Sprite(this.game, 0, 0, 'cta');
        this.initialCtaWidth = this.button.width;
        this.add(this.button);

        ContainerUtil.fitInContainer(this.button, "cta-container", 0.5, 0.5);

        this.button.bringToTop();

        this.button.inputEnabled = true;
        this.button.input.useHandCursor = true;
        this.button.events.onInputDown.add(function() {

            this.onInteract.dispatch();
            this.game.time.events.add(50, function(){
                doSomething('download');
            },this);
        },this);

    }

    initSignals(){
        this.onInteract = new Phaser.Signal();
    }

    createTip() {
        this.tip = new Phaser.Sprite(this.game, 0, 0, 'tip');
        this.tip.anchor.set(0.5);
        this.add(this.tip);
        this.tip.scale.x = this.background.width * 0.67 / this.tip.width;
        this.tip.scale.y = this.tip.scale.x;
        this.tip.y = this.button.y + this.button.height * 0.2;
        this.tip.x = this.button.x + this.tip.width / 2 - this.button.width * 0.25;
    }

    showTip() {
        var initialY = this.tip.y;
        this.game.add.tween(this.tip).to({
            y: initialY - this.button.height,
        }, 700, Phaser.Easing.Quadratic.InOut, true, 0);

        this.game.time.events.add(2500, function() {
            this.game.add.tween(this.tip).to({
                y: initialY
            }, 700, Phaser.Easing.Quadratic.InOut, true, 0);
        }, this);
    }

    createBackground() {
        var container = document.getElementById("cta-background");
        var containerWidth = container.offsetWidth * window.devicePixelRatio;
        var containerHeight = container.offsetHeight * window.devicePixelRatio;
        var containerX = container.getBoundingClientRect().left * window.devicePixelRatio;
        var containerY = container.getBoundingClientRect().top * window.devicePixelRatio

        var myBitmap = new Phaser.BitmapData(this.game, 'myBitmap', containerWidth, containerHeight);
        var grd = myBitmap.context.createLinearGradient(0, 0, 0, containerHeight);
        grd.addColorStop(0, "#4835c4");
        grd.addColorStop(0.1, "#412cad");
        grd.addColorStop(0.5, "#362288");
        grd.addColorStop(1, "#362288");
        myBitmap.context.fillStyle = grd;
        myBitmap.context.fillRect(0, 0, containerWidth, containerHeight);

        this.background = this.game.add.sprite(containerX, containerY, myBitmap, null, this);
        console.log(this.x + ", " + this.y);
    }

    fitInContainer() {
        this.container = document.getElementById("cta-container");
        this.containerWidth = this.container.offsetWidth * window.devicePixelRatio;
        this.containerHeight = this.container.offsetHeight * window.devicePixelRatio;
        var containerX = this.container.getBoundingClientRect().left * window.devicePixelRatio;
        var containerY = this.container.getBoundingClientRect().top * window.devicePixelRatio;

        this.x = containerX;
        this.y = containerY;

        this.scale.x = this.containerWidth / this.button.width;
        this.scale.y = this.scale.x;
    }

    animate() {

        var finalContainer = document.getElementById("cta-container-final");
        var finalContainerWidth = finalContainer.offsetWidth * window.devicePixelRatio;
        var finalContainerX = finalContainer.getBoundingClientRect().left * window.devicePixelRatio;
        var finalContainerY = finalContainer.getBoundingClientRect().top * window.devicePixelRatio;

        console.log(finalContainerWidth);
        var newScale = finalContainerWidth / this.initialCtaWidth;
        var initialScale = this.button.scale.x;

        var positionTween = this.game.add.tween(this.button).to({ x: finalContainerX + this.button.width / initialScale * newScale / 2, y: finalContainerY + this.button.height / initialScale * newScale / 2 }, 1100, Phaser.Easing.Back.Out, true, 0);
        var scaleTween = this.game.add.tween(this.button.scale).to({ x: newScale, y: newScale }, 900, Phaser.Easing.Quadratic.InOut, true, 0);
        // this.spawnStars();
        this.spawnCookies();

        this.game.time.events.add(1100, function() {
            this.startPulseIdleAnimation();
        }, this);
    }

    startPulseIdleAnimation() {

        this.buttonOver = new Phaser.Sprite(this.game, 0, 0, 'cta-2');
        this.buttonOver.anchor.set(0.5, 0.5);
        this.buttonOver.x = this.button.x;
        this.buttonOver.y = this.button.y;
        this.buttonOver.scale.x = this.button.width / this.buttonOver.width;
        this.buttonOver.scale.y = this.buttonOver.scale.x;
        this.ctaLayer.add(this.buttonOver);

        this.buttonOver.alpha = 0;

        var initialScale = this.buttonOver.scale.x;

        var pulseTween = this.game.add.tween(this.buttonOver).to({ alpha: 1 }, 600, Phaser.Easing.Quadratic.InOut, true, 600).loop().yoyo(true, 0);
        this.game.add.tween(this.buttonOver.scale).to({ x: initialScale * 1.05, y: initialScale * 1.05 }, 600, Phaser.Easing.Quadratic.InOut, true, 600).loop().yoyo(true, 0);
        this.game.add.tween(this.button.scale).to({ x: initialScale * 1.05, y: initialScale * 1.05 }, 600, Phaser.Easing.Quadratic.InOut, true, 600).loop().yoyo(true, 0);

        this.game.time.events.add(200, function() {
            // this.spawnStars();
            this.spawnCookies();
        }, this);

        pulseTween.onLoop.add(function() {
            this.game.time.events.add(200, function() {
                // this.spawnStars();
                this.spawnCookies();
            }, this);
        }, this);

    }

}

export default CtaButton;