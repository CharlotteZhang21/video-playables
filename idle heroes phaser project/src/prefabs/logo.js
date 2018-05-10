class Logo extends Phaser.Group {
	constructor(game) {
		super(game);

		this.container = document.getElementById("logo");
		var containerWidth = this.container.offsetWidth * window.devicePixelRatio;
		var containerHeight = this.container.offsetHeight * window.devicePixelRatio;
		var containerX = this.container.getBoundingClientRect().left * window.devicePixelRatio;
		var containerY = this.container.getBoundingClientRect().top * window.devicePixelRatio;


		this.logo = this.game.add.sprite(0, 0, 'logo');
		this.logo.anchor.set(0.5, 0.5);
		this.add(this.logo);
		if (this.game.global.windowHeight < this.game.global.windowWidth) {
			//landscape
			
			this.initialLogoWidth = this.logo.width;
			this.initialLogoHeight = this.logo.height;

		} else {
			//portrait
			
			this.initialLogoWidth = this.logo.width/1.5;
			this.initialLogoHeight = this.logo.height/1.5;
		}
		
		this.logo.scale.x = containerWidth / this.initialLogoWidth;
		this.initialLogoScale = this.logo.scale.x;
		this.logo.scale.y = this.logo.scale.x;
		this.logo.x = containerX + this.logo.width/2;
		this.logo.y = containerY + this.logo.height/2;
		this.alpha = 1;

	}

	//Animates from "logo" container to "final-logo" container
	animate() {
		var finalContainer = document.getElementById("logo-final");
		var finalContainerWidth = finalContainer.offsetWidth * window.devicePixelRatio;
		var finalContainerX = finalContainer.getBoundingClientRect().left * window.devicePixelRatio;
		var finalContainerY = finalContainer.getBoundingClientRect().top * window.devicePixelRatio;

		var newScale = finalContainerWidth/this.initialLogoWidth;
		var scaleTween = this.game.add.tween(this.logo.scale).to({x: newScale, y: newScale}, 1000, Phaser.Easing.Quadratic.InOut, true, 0);

		var positionTween = this.game.add.tween(this.logo).to({x: finalContainerX + this.initialLogoWidth * newScale/2, y: finalContainerY + this.initialLogoHeight * newScale/2}, 1400, Phaser.Easing.Quadratic.InOut, true, 0);
		var rotationTween = this.game.add.tween(this.logo).to({angle: 360}, 1000, Phaser.Easing.Back.InOut, true, 0);
	}
}

export default Logo;