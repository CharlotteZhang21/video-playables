class DarkOverlay extends Phaser.Group {
	constructor(game) {
		super(game);

		this.graphics = game.add.graphics(0,0);

		if (PiecSettings.finalOverlay != null && PiecSettings.finalOverlay.color != null) {
			this.graphics.beginFill(PiecSettings.finalOverlay.color, 1);
		} else {
			this.graphics.beginFill(0x000000, 1);
		}
		this.graphics.drawRect(
			0, 
			0, 
			this.game.global.windowWidth * window.devicePixelRatio, 
			this.game.global.windowHeight * window.devicePixelRatio);

		this.add(this.graphics);

		if (PiecSettings.finalOverlay != null && PiecSettings.finalOverlay.alpha != null ){
			this.finalAlpha = PiecSettings.finalOverlay.alpha;	
		} else {
			this.finalAlpha = .5;
		}
		this.alpha = 0;

		// this.gradient = game.add.graphics(0,0);
		// this.gradient.beginFill(0x000000, 1);
		// this.gradient.drawRect(
		// 	0, 
		// 	0, 
		// this.game.global.windowWidth * window.devicePixelRatio, 
		// this.game.global.windowHeight * window.devicePixelRatio;
		this.createGradient();

	}

	createGradient() {
		var gradient = this.game.add.sprite(0,0,"gradient");
		gradient.scale.x = this.game.global.windowWidth * window.devicePixelRatio / gradient.width * 1.1;
		gradient.scale.y = this.game.global.windowHeight * window.devicePixelRatio * .25 / gradient.height;
		gradient.y = this.game.global.windowHeight * window.devicePixelRatio * 1.01 - gradient.height;
		gradient.x = -0.01 * gradient.width;
	}

	show() {
		var tween = this.game.add.tween(this).to({alpha: this.finalAlpha}, 1200, Phaser.Easing.Quadratic.In, true, 0);
	}

	showDuringBattle() {
		var tween = this.game.add.tween(this).to({alpha: this.finalAlpha}, 100, Phaser.Easing.Quadratic.In, true, 0);
	}


	hide() {
		if (this.alpha > 0)
			var tween = this.game.add.tween(this).to({alpha: 0}, 1000, Phaser.Easing.Quadratic.In, true, 0);
	}

	hideDuringBattle() {
		if (this.alpha > 0)
			var tween = this.game.add.tween(this).to({alpha: 0}, 800, Phaser.Easing.Quadratic.In, true, 0);
	}
}

export default DarkOverlay;