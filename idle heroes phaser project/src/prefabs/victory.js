import * as Util from '../utils/util';
import * as CustomPngSequencesRenderer from '../utils/custom-png-sequences-renderer.js';

class Victory extends Phaser.Group {
	constructor(game) {
		super(game);
		// this.createElena();
	}

	showWinMessage( lose = false){
		var container = document.getElementById("win-message");
		var containerWidth = container.offsetWidth * window.devicePixelRatio;
		var containerHeight = container.offsetHeight * window.devicePixelRatio;
		var containerX = container.getBoundingClientRect().left * window.devicePixelRatio;
		var containerY = container.getBoundingClientRect().top * window.devicePixelRatio;

		var tryAgain = document.getElementById("tryAgain");

		var winMessage;
		if(!lose) {
			winMessage = this.game.add.sprite(0, 0, "win-message");

		}else {
			winMessage = this.game.add.sprite(0, 0, "lose-message");

			this.game.time.events.add(2000, function(){

				tryAgain.classList += " show";

			}, this);
			
			console.log("lose");
		} 
		
		winMessage.anchor.set(0.5);
		winMessage.scale.x = containerWidth / winMessage.width;
		winMessage.scale.y = winMessage.scale.x;
		winMessage.x = containerX + winMessage.width/2;
		winMessage.y = containerY + winMessage.height/2;

		var finalScale = winMessage.scale.x;

		winMessage.scale.x = 0.01;
		winMessage.scale.y = 0.01;

		var scaleTween = this.game.add.tween(winMessage.scale).to({x: finalScale, y: finalScale},
			700, Phaser.Easing.Back.Out, true, 0);
		this.game.time.events.add(1100, function() {
			this.game.add.tween(winMessage).to({y: window.innerHeight * window.devicePixelRatio + winMessage.height}, 700, Phaser.Easing.Linear.InOut, true, 0);
			
			
		}, this);

	}

	animate() {
		this.gingerbread.alpha = 1;
		var finalY = this.gingerbread.y;
		this.gingerbread.y = window.innerHeight * window.devicePixelRatio;
		var tween = this.game.add.tween(this.gingerbread).to({y:finalY}, 2000, Phaser.Easing.Back.InOut, true, 0);
	}
}

export default Victory;