class AppIcon extends Phaser.Group {
	constructor(game) {
		super(game);
		this.container = document.getElementById("app-icon");
		var containerWidth = this.container.offsetWidth * window.devicePixelRatio;
		var containerHeight = this.container.offsetHeight * window.devicePixelRatio;
		var containerX = this.container.getBoundingClientRect().left * window.devicePixelRatio;
		var containerY = this.container.getBoundingClientRect().top * window.devicePixelRatio;

		this.appIcon = this.game.add.sprite(0,0,"app-icon");
		this.appIcon.anchor.set(0.5);
		this.add(this.appIcon);

	}
}