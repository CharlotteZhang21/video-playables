class Tooltip extends Phaser.Group {
	constructor(game) {
		super(game);

		this.tooltip = false;

		if (PiecSettings.tooltip != null) {
			this.createTooltip();
			this.tooltip = true;
			if (PiecSettings.tooltip.firstHandPosition != null) {
				this.createHand();
				this.startHandIdleAnimation();
			}
		}
	}

	createTooltip() {
		var container = document.getElementById("grid-background");
		var containerWidth = container.offsetWidth * window.devicePixelRatio;
		var containerHeight = container.offsetHeight * window.devicePixelRatio;		
		var containerX = container.getBoundingClientRect().left * window.devicePixelRatio;
		var containerY = container.getBoundingClientRect().top * window.devicePixelRatio;

		if (PiecSettings.tooltip.src != null) {
			this.tooltip = this.game.add.sprite(0,0,'tooltip');
			this.add(this.tooltip);
			this.tooltip.scale.x = containerWidth / this.tooltip.width;
			this.tooltip.scale.y = this.tooltip.scale.x;
			this.tooltip.alpha = .7;
		}

		this.x = containerX;
		this.y = containerY;
	}

	createInstructionsTooltip() {
		var container = document.getElementById("instructions");
		var containerWidth = container.offsetWidth * window.devicePixelRatio;
		var containerHeight = container.offsetHeight * window.devicePixelRatio;		
		var containerX = container.getBoundingClientRect().left * window.devicePixelRatio;
		var containerY = container.getBoundingClientRect().top * window.devicePixelRatio;

		this.instructions = this.game.add.sprite(0,0,'instructions');
		this.instructions.x = containerX;
		this.instructions.y = containerY;
		this.instructions.scale.x = containerWidth / this.instructions.width;
		this.instructions.scale.y = this.instructions.scale.x;

		this.animateInstructions();
	}

	animateInstructions() {
		var currentY = this.instructions.y;
		this.instructions.y -= 50;
		this.instructions.alpha = 0;
		var tween = this.game.add.tween(this.instructions).to({y: currentY}, 1000, Phaser.Easing.Quadratic.InOut, true, 0);
		var alphaTween = this.game.add.tween(this.instructions).to({alpha: 1}, 1000, Phaser.Easing.Quadratic.InOut, true, 0);
		this.game.time.events.add(1000, function() {
			var idleTween = this.game.add.tween(this.instructions).to({y: currentY - 7}, 1000, Phaser.Easing.Quadratic.InOut, true, 0, 0, true).loop(true);
		}, this);
		if (this.game.global.windowHeight < this.game.global.windowWidth) {
			this.game.time.events.add(2000, function() {
				this.hideInstructions();
			},this);
		}
	}

	hideInstructions() {
		var currentY = this.instructions.y;
		var alphaTween2 = this.game.add.tween(this.instructions).to({alpha:0}, 500, Phaser.Easing.Quadratic.InOut, true, 0);
		var tween2 = this.game.add.tween(this.instructions).to({y: currentY + 50}, 500, Phaser.Easing.Quadratic.InOut, true, 0);
	}

	createHand() {

		var container = document.getElementById("hand");
		var containerWidth = container.offsetWidth * window.devicePixelRatio;
		var containerHeight = container.offsetHeight * window.devicePixelRatio;
		var containerX = container.getBoundingClientRect().left * window.devicePixelRatio;
		var containerY = container.getBoundingClientRect().top * window.devicePixelRatio;

		this.hand = this.game.add.sprite(0,0,'hand');
		this.add(this.hand);
		this.hand.scale.x = containerWidth/this.hand.width;
		this.hand.scale.y = this.hand.scale.x;

		this.hand.x = PiecSettings.tooltip.firstHandPosition[0] * this.game.global.tileWidthAfterScaling + this.game.global.tileWidthAfterScaling/.8;
		this.hand.y = PiecSettings.tooltip.firstHandPosition[1] * this.game.global.tileWidthAfterScaling + this.game.global.tileWidthAfterScaling/2.5;
	}

	startHandIdleAnimation() {
		var tween = this.game.add.tween(this.hand).to(
			{
				x: PiecSettings.tooltip.secondHandPosition[0] * this.game.global.tileWidthAfterScaling + this.game.global.tileWidthAfterScaling/.8,
				y: PiecSettings.tooltip.secondHandPosition[1] * this.game.global.tileWidthAfterScaling + this.game.global.tileWidthAfterScaling/2.5,
			},
			900,
			Phaser.Easing.Quadratic.InOut,
			true,
			0, -1, true);
	}

	startIdleAnimation() {
		// var tween = this.game.add.tween(this.scale).to({x:.9,y:.9}, 1000, Phaser.Easing.Quadratic.InOut, true, 0, -1, true);

	}

	hide() {
		if (this.tooltip) {
			var tween = this.game.add.tween(this).to({alpha: 0}, 500, Phaser.Easing.Quadratic.Out, true, 0);
		}
	}
}

export default Tooltip;