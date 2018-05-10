import LifeBar from '../prefabs/life-bar';

class BattleButton extends Phaser.Group {
	constructor(game) {
		super(game);

		/** elements **/
		this.button = new Phaser.Sprite(game, 0, 0, 'attack-button', 0);

		var knight_pt = new Phaser.Sprite(game, 0, 0, 'knight-portrait', 0),
			girl_pt = new Phaser.Sprite(game, 0, 0, 'girl-portrait', 0);

		this.portrait = {
			"0" : knight_pt,
			"2" : girl_pt,
			"5" : knight_pt
			
		}

		this.girlEnergyBar = new LifeBar(this.game, 'girl-portrait', false, 0);
		
		this.enemyEnergyBar = new LifeBar(this.game, 'death-icon', true, 0);

		
		/** add in the world **/

		this.add(this.button);
		this.add(this.girlEnergyBar);
		this.add(this.enemyEnergyBar);

		/** position and size **/

		this.button.anchor.set(0.5);

		this.button.x = this.game.global.windowWidth * window.devicePixelRatio / 2;
		this.button.y = this.game.global.windowHeight * window.devicePixelRatio / 2;

		if (this.game.global.windowHeight < this.game.global.windowWidth) {
			//landscape
			
			this.button.scale.x = this.game.global.windowWidth * window.devicePixelRatio * .3 / this.button.width;

			this.girlEnergyBar.x = this.button.x /2 + 200;

			this.enemyEnergyBar.x = this.button.x /2 + 200;

			this.girlEnergyBar.scale.x = this.button.scale.x / 2;
			this.girlEnergyBar.scale.y = this.button.scale.x / 2;

			this.enemyEnergyBar.scale.x = this.button.scale.x / 2;
			this.enemyEnergyBar.scale.y = this.button.scale.x / 2;
		} else {
			//portrait

			this.button.scale.x = this.game.global.windowWidth * window.devicePixelRatio * .5 / this.button.width;
			
			this.girlEnergyBar.x = this.button.x/2 + 100;

			this.enemyEnergyBar.x = this.button.x/2 + 100;

			this.girlEnergyBar.scale.x = this.button.scale.x/2.5;
			this.girlEnergyBar.scale.y = this.button.scale.y /2.5;

			this.enemyEnergyBar.scale.x = this.button.scale.x/2.5;
			this.enemyEnergyBar.scale.y = this.button.scale.y /2.5
			
				
		}

		this.button.scale.y = this.button.scale.x;



		/** set the initial state **/
		this.idleAnimation();

		this.button.alpha = 0;
		this.girlEnergyBar.alpha = 0;
		this.enemyEnergyBar.alpha = 0;


		this.girlEnergyBar.y = this.button.y + 150;

		this.enemyEnergyBar.y = this.button.y + 250;


		this.initPortrait();


		/** add text **/
		var fontSize = 18;
		var style = {
			font: fontSize + "px " + PiecSettings.fontFamily
		};

		var girlTextField = new Phaser.Text(this.game, 0, 0, "Power", style);
		girlTextField.x = this.girlEnergyBar.x;
		girlTextField.y = this.girlEnergyBar.y - 50;

		var enemyTextField = new Phaser.Text(this.game, 0, 0, "Power", style);
		enemyTextField.x = this.enemyEnergyBar.x ;
		enemyTextField.y = this.enemyEnergyBar.y - 50;

		this.setTextColor(girlTextField);
		this.setTextColor(enemyTextField);
		
		this.add(girlTextField);

		this.add(enemyTextField);

		this.girlTextField = girlTextField;
		this.enemyTextField = enemyTextField;

		this.girlTextField.alpha = 0;
		this.enemyTextField.alpha =0

	}

	setTextColor(textField) {

		var gradient = textField.context.createLinearGradient(0,0,0,textField.height);
		gradient.addColorStop(0, "#ffffff");
		gradient.addColorStop(1, "#dddddd");


		// textField.setShadow(2,3,'rgb(0,0,0)', 0);
		textField.fill = gradient;
		textField.stroke = "black";

	}

	initPortrait() {


		for ( var i in this.portrait){
			var pt = this.portrait[i];

			this.add(pt);

			pt.anchor.set(0.5);

			pt.x = this.button.x - 10;

			pt.y = this.button.y - 150;

			if (this.game.global.windowHeight < this.game.global.windowWidth) {
				pt.scale.x = this.game.global.windowWidth * window.devicePixelRatio * .3 / pt.width;
			} else {
				pt.scale.x = this.game.global.windowWidth * window.devicePixelRatio * .5 / pt.width;
			}

			pt.scale.y = pt.scale.x;

			pt.alpha = 0;

		}
	
	}

	idleAnimation() {
		var initialScale = this.button.scale.x;
		this.game.add.tween(this.button.scale).to({
			x: initialScale * 1.05,
			y: initialScale * 1.05,
		}, 100, Phaser.Easing.Quadratic.InOut, true, 0).loop().yoyo(true, 0);
	}

	hide() {

		var hideDelay = 0;

		if(this.game.global.interaction > 0) {
			this.girlEnergyBar.increaseLifeBar(40);
			hideDelay = 500;
		}

		//after showing the girl's energybar increasing hide the interface
		//otherwise do not delay

		this.game.time.events.add(hideDelay, function(){
			
			this.game.add.tween(this.button).to({
				alpha : 0
			}, 100, Phaser.Easing.Quadratic.InOut, true, 0);

			for(var i in this.portrait) {
				var pt = this.portrait[i];
				if( pt && pt.alpha != 0){
					this.game.add.tween(pt).to({
						alpha : 0
					}, 100, Phaser.Easing.Quadratic.InOut, true, 0);
				}
				
			}

			if(this.girlEnergyBar && this.girlEnergyBar.alpha != 0){
				this.game.add.tween(this.girlEnergyBar).to({
					alpha : 0
				}, 100, Phaser.Easing.Quadratic.InOut, true, 0);
			}

			if(this.enemyEnergyBar && this.enemyEnergyBar.alpha != 0){
				this.game.add.tween(this.enemyEnergyBar).to({
					alpha : 0
				}, 100, Phaser.Easing.Quadratic.InOut, true, 0);
			}

			if(this.girlTextField && this.girlTextField.alpha != 0){
				this.game.add.tween(this.girlTextField).to({
					alpha : 0
				}, 100, Phaser.Easing.Quadratic.InOut, true, 0);
			}


			if(this.enemyTextField && this.enemyTextField.alpha != 0){
				this.game.add.tween(this.enemyTextField).to({
					alpha : 0
				}, 100, Phaser.Easing.Quadratic.InOut, true, 0);
			}

		},this);
		
	}

	show() {
		this.game.add.tween(this.button).to({
			alpha: 1,
		}, 200, Phaser.Easing.Quadratic.InOut, true, 0);
	}

	showWithCharacter(i ,delay) {
		this.game.add.tween(this.button).to({
			alpha: 1,
		}, 200, Phaser.Easing.Quadratic.InOut, true, 0);

		this.game.add.tween(this.portrait[i]).to({
			alpha: 1,
		}, 200, Phaser.Easing.Quadratic.InOut, true, 0);

		this.game.add.tween(this.girlEnergyBar).to({
			alpha: 1,
		}, 200, Phaser.Easing.Quadratic.InOut, true, 0);


		this.game.add.tween(this.girlTextField).to({
			alpha: 1,
		}, 200, Phaser.Easing.Quadratic.InOut, true, 0);


		if(!PiecSettings.alwaysWin){
			//showEnemy's power
			var enemyBar = this.enemyEnergyBar;
			this.game.add.tween(enemyBar).to({
				alpha: 1,
			}, 200, Phaser.Easing.Quadratic.InOut, true, 0);

			this.game.add.tween(this.enemyTextField).to({
				alpha: 1,
			}, 200, Phaser.Easing.Quadratic.InOut, true, 0);
			
			//increasing bar animation
			enemyBar.increaseLifeBar(100, delay);
		
		}
		

	}

}

export default BattleButton;