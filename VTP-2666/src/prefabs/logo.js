import * as ContainerUtil from '../utils/container-util';

class Logo extends Phaser.Group {
	constructor(game) {
		super(game);

		this.logo = this.game.add.sprite(0, 0, 'logo');
		this.add(this.logo);
		this.initialLogoWidth = this.logo.width;
		ContainerUtil.fitInContainer(this.logo, "logo", 0.5, 0.5);

		this.logo.bringToTop();

	}

	//Animates from "logo" container to "final-logo" container
	animate() {
		var finalContainer = document.getElementById("logo-final");
		var finalContainerWidth = finalContainer.offsetWidth * window.devicePixelRatio;
		var finalContainerX = finalContainer.getBoundingClientRect().left * window.devicePixelRatio;
		var finalContainerY = finalContainer.getBoundingClientRect().top * window.devicePixelRatio;

		var newScale = finalContainerWidth/this.initialLogoWidth;

		var positionTween = this.game.add.tween(this.logo).to({x: finalContainerX, y: finalContainerY}, 1400, Phaser.Easing.Quadratic.InOut, true, 0);
		var scaleTween = this.game.add.tween(this.logo.scale).to({x: newScale, y: newScale}, 1400, Phaser.Easing.Quadratic.InOut, true, 0);
	}
}

export default Logo;