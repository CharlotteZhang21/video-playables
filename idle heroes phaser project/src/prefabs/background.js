class Background extends Phaser.Group {
	constructor(game){
		super(game);

		// this.createBackground();

		this.createVideoBackground();

	}

	createBackground() {
		var background = this.game.add.sprite(0, 0, 'background');

		this.add(background);

		if (this.game.global.windowHeight > this.game.global.windowWidth) {
			this.scale.x = (this.game.global.windowHeight * window.devicePixelRatio) / this.height * 1.05;
			this.scale.y = this.scale.x;
			this.x = this.game.global.windowWidth * window.devicePixelRatio/2 - this.width/2;
			this.y = this.game.global.windowHeight * window.devicePixelRatio/2 - this.height/2 - 10;
		} else {
			this.scale.x = (this.game.global.windowHeight * window.devicePixelRatio) / this.height * 1.05;
			this.scale.y = this.scale.x;
			// if (this.height < this.game.global.windowHeight * window.devicePixelRatio) {
				
			// }
			this.x = this.game.global.windowWidth * window.devicePixelRatio/2 - this.width/2 - 10;
			this.y = this.game.global.windowHeight * window.devicePixelRatio/2 - this.height/2;
		}
	}
	
}

export default Background;