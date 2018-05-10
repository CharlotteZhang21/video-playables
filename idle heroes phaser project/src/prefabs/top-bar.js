import * as Util from '../utils/util';
import * as CustomPngSequencesRenderer from '../utils/custom-png-sequences-renderer.js';

class TopBar extends Phaser.Group {
	constructor(game) {
		super(game);
		this.currentWaffleCounterValue = 9;

		this.createTopBarBackground();
		this.createIdleWaffle();
		this.createWaffleCounter();
		this.waffleHappy = false;
	}

	createTopBarBackground() {
		var container = document.getElementById("top-bar");
		var containerWidth = container.offsetWidth * window.devicePixelRatio;
		var containerHeight = container.offsetHeight * window.devicePixelRatio;
		var containerX = container.getBoundingClientRect().left * window.devicePixelRatio;
		var containerY = container.getBoundingClientRect().top * window.devicePixelRatio;
		this.containerWidth = containerWidth;
		this.containerHeight = containerHeight;

		this.x = containerX;
		this.y = containerY;

		this.topBarBackground = this.game.add.sprite(0, 0, 'top-bar');
		this.add(this.topBarBackground);
		this.initialTopBarBackgroundWidth = this.topBarBackground.width;
		this.topBarBackground.scale.x = containerWidth / this.topBarBackground.width;
		this.topBarBackground.scale.y = this.topBarBackground.scale.x;
	}

	createIdleWaffle() {
		var waffle = CustomPngSequencesRenderer.playPngSequence(this.game, PiecSettings.pngAnimations[1], this);
		waffle.scale.y = (this.topBarBackground.height * .655) / waffle.height;
		waffle.scale.x = waffle.scale.y;
		waffle.x = this.topBarBackground.width * 0.495 - waffle.width/2;
		waffle.y = this.topBarBackground.height * 0.17;
		this.idleWaffle = waffle;
		this.add(waffle);
	}

	animateWaffle() {
		var waffle = CustomPngSequencesRenderer.playPngSequence(this.game, PiecSettings.pngAnimations[0], this);
		waffle.scale.y = (this.topBarBackground.height * .65) / waffle.height;
		waffle.scale.x = waffle.scale.y;
		waffle.x = this.topBarBackground.width * 0.495 - waffle.width/2;
		waffle.y = this.topBarBackground.height * 0.18;
		this.add(waffle);
	}

	createWaffleCounter() {
		this.fontSize = this.containerHeight * .9;
		var style = {
			font: "bold " + this.fontSize + "px " + PiecSettings.fontFamily,
		};

		this.textField = new Phaser.Text(this.game, 0, 0, this.currentWaffleCounterValue, style);
		this.textField.x = this.containerWidth/2;
		this.textField.y = this.topBarBackground.height - this.textField.height * 0.2;
		this.textField.anchor.set(0.5);
		this.textField.setShadow(2, 3, 'rgba(0,0,0,.5)', 0);
		this.textField.fill = 'white';
		this.add(this.textField);
	}

	decreaseWaffleCounter() {
		var scaleEffect = 1.4;
		this.currentWaffleCounterValue--;

		var tween = this.game.add.tween(this.textField.scale).to({x:scaleEffect, y:scaleEffect}, 100, Phaser.Easing.Linear.Non, true, 0);
		tween.onComplete.add(function() {
			this.textField.text = this.currentWaffleCounterValue;
			this.game.add.tween(this.textField.scale).to( {x: 1, y: 1}, 100, Phaser.Easing.Linear.None, true, 0);
		}, this);

		if (!this.waffleHappy) {
			this.waffleHappy = true;
			this.animateWaffle();
			this.idleWaffle.destroy();
			this.textField.bringToTop();
		}
		this.playStarBurst();
	}

	playStarBurst() {
		var starBurst = CustomPngSequencesRenderer.playPngSequence(this.game, PiecSettings.pngAnimations[3], this);
		starBurst.scale.x = (this.topBarBackground.width * .9) / starBurst.width;
		starBurst.scale.y = starBurst.scale.x;
		starBurst.x = this.idleWaffle.x + starBurst.width * .06;
		starBurst.y = this.idleWaffle.y + starBurst.height * .2;
		starBurst.anchor.set(0.5);
		starBurst.angle = 45 * this.currentWaffleCounterValue;
		this.add(starBurst);
	}

	getWaffleXCoord(){
		return this.idleWaffle.world.x;
	}

	getWaffleYCoord() {
		return this.idleWaffle.world.y;
	}

	animate() {
		var tween = this.game.add.tween(this).to({y: 0 - this.height}, 1500, Phaser.Easing.Back.InOut, true, 200);
	}

}

export default TopBar;