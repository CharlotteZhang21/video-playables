import * as Util from '../utils/util';

class ComboMessage extends Phaser.Group{
	constructor(game, comboMessage){
		super(game);
		this.createComboMessage(comboMessage);
		this.alpha = 0;
	}

	createComboMessage(comboMessage){
		var combo = this.game.add.sprite(0,0,comboMessage);
		combo.anchor.set(0.5);
		this.add(combo);
		this.combo = combo;
	}

	animateIn() {
		var alphaTween = this.game.add.tween(this).to({alpha:1}, 200, Phaser.Easing.Quadratic.Out, true, 0);
		var scaleTween = this.game.add.tween(this.combo.scale).to({x:1.05, y:1.05}, 200, Phaser.Easing.Quadratic.Out, true, 0);
		scaleTween.onComplete.add(function() {
			this.game.add.tween(this.combo.scale).to({x:0.9, y:0.9}, 1500, Phaser.Easing.Quadratic.Out, true, 0);
			this.game.add.tween(this).to({alpha: 0}, 500, Phaser.Easing.Quadratic.Out, true, 1000);
		}, this);
	}
}

export default ComboMessage;