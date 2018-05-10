import * as CustomPngSequencesRenderer from '../utils/custom-png-sequences-renderer.js';

class CtaButton extends Phaser.Group {
	constructor(game) {
		super(game);

		this.button = new Phaser.Sprite(game, 0, 0, 'cta', 0);
		this.add(this.button);

		this.fitInContainer();

		this.initialCtaWidth = this.button.width;
		this.button.inputEnabled = true;
		this.button.input.useHandCursor = true;
		this.button.events.onInputDown.add(function() {
			doSomething('download');
		});
		if (this.game.global.windowHeight < this.game.global.windowWidth) {
			//Landscape, then mask % of it towards the left
			// this.applyMask();
		}

		this.trailLayer = this.game.add.group();
		this.initialYPosition = this.y;
	}

	applyMask() {
		var mask = this.game.add.graphics(0,0);
		mask.beginFill(0xffffff);
		mask.drawRect(
			this.game.global.windowWidth / 2 * window.devicePixelRatio,
			0, 
			this.game.global.windowWidth/2 * window.devicePixelRatio, 
			this.game.global.windowHeight * window.devicePixelRatio);
		this.mask = mask;
	}

	fitInContainer() {
		this.container = document.getElementById("cta-container");
		this.containerWidth = this.container.offsetWidth * window.devicePixelRatio;
		this.containerHeight = this.container.offsetHeight * window.devicePixelRatio;
		var containerX = this.container.getBoundingClientRect().left * window.devicePixelRatio;
		var containerY = this.container.getBoundingClientRect().top * window.devicePixelRatio;

		this.x = containerX;
		this.y = containerY;

		this.scale.x = this.containerWidth/this.button.width;
		this.scale.y = this.scale.x;
	}

	playTrail() {
		var container = document.getElementById("trail-container");
		var containerWidth = container.offsetWidth * window.devicePixelRatio;
		var containerHeight = container.offsetHeight * window.devicePixelRatio;
		var containerX = container.getBoundingClientRect().left * window.devicePixelRatio;
		var containerY = container.getBoundingClientRect().top * window.devicePixelRatio;

		console.log(containerX);
		console.log(containerY);
		console.log(containerWidth);
		console.log(containerHeight);
		var trailEffect = CustomPngSequencesRenderer.playPngSequence(this.game, PiecSettings.pngAnimations[1], this.trailLayer);
		this.trailLayer.alpha = 0.7;

		this.game.time.events.add(700, function() {
			this.vibrate();
		}, this);
	}

	vibrate() {
		var positionTween = this.game.add.tween(this).to({y: this.initialYPosition + 30}, 150, Phaser.Easing.Quadratic.InOut, true, 0);
			positionTween.onComplete.add(function() {
				this.game.add.tween(this).to({y: this.initialYPosition}, 150, Phaser.Easing.Quadratic.InOut, true, 0);
			}, this);
		this.game.camera.shake(0.007, 100);
	}

	animate() {

		var finalContainer = document.getElementById("cta-container-final");
		var finalContainerWidth = finalContainer.offsetWidth * window.devicePixelRatio;
		var finalContainerX = finalContainer.getBoundingClientRect().left * window.devicePixelRatio;
		var finalContainerY = finalContainer.getBoundingClientRect().top * window.devicePixelRatio;

		this.newScale = finalContainerWidth/this.initialCtaWidth;

		var positionTween = this.game.add.tween(this).to({x: finalContainerX, y: finalContainerY}, 1400, Phaser.Easing.Back.InOut, true, 0);
		var scaleTween = this.game.add.tween(this.scale).to({x: this.newScale, y: this.newScale}, 1400, Phaser.Easing.Back.InOut, true, 0);

		this.game.time.events.add(1400, function() {
			this.startPulseIdleAnimation();
		}, this);
	}

	startPulseIdleAnimation() {
		var finalContainer = document.getElementById("cta-container-final-2");
		var finalContainerWidth = finalContainer.offsetWidth * window.devicePixelRatio;
		var finalContainerX = finalContainer.getBoundingClientRect().left * window.devicePixelRatio;
		var finalContainerY = finalContainer.getBoundingClientRect().top * window.devicePixelRatio;

		var newScale2 = finalContainerWidth/this.initialCtaWidth;

		var idleScaleTween = this.game.add.tween(this.scale).to({x: newScale2, y: newScale2}, 1000, Phaser.Easing.Quadratic.InOut, true, 0, -1, true);
		var idlePositionTween = this.game.add.tween(this).to({x: finalContainerX, y: finalContainerY}, 1000, Phaser.Easing.Quadratic.InOut, true, 0, -1, true);
	}
}

export default CtaButton;