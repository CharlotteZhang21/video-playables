import * as Util from '../utils/util';
import * as CustomPngSequencesRenderer from '../utils/custom-png-sequences-renderer.js';
import LifeBar from '../prefabs/life-bar';

class Enemy extends Phaser.Group {
	constructor (game) {
		super(game);
		this.createEnemy();
		this.enemyBar = new LifeBar(this.game);
		this.fitEnemyBarInContainer();
		this.dead = false;
	}

	setCta(cta){
		this.cta = cta;
		this.enemyBar.setCta(cta);
	}

	createEnemy() {

		var container = document.getElementById("dragon-container");
		var containerWidth = container.offsetWidth * window.devicePixelRatio;

		var aimCircle = this.game.add.sprite(0,0,'aim-circle');
		this.add(aimCircle);

		var enemy = CustomPngSequencesRenderer.playPngSequence(this.game, PiecSettings.pngAnimations[3], this);

		this.enemyIdle = enemy;
		this.add(enemy);

		var redEnemy = this.game.add.sprite(0, 0, 'dragon-red');
		redEnemy.x = this.enemyIdle.x;
		redEnemy.y = this.enemyIdle.y;
		redEnemy.scale.x = containerWidth/redEnemy.width;
		redEnemy.scale.y = redEnemy.scale.x;
		this.redEnemy = redEnemy;
		this.add(redEnemy);

		var whiteEnemy = this.game.add.sprite(0, 0, 'dragon-white');
		whiteEnemy.x = this.enemyIdle.x;
		whiteEnemy.y = this.enemyIdle.y;
		whiteEnemy.scale.x = containerWidth/whiteEnemy.width;
		whiteEnemy.scale.y = whiteEnemy.scale.x;
		this.whiteEnemy = whiteEnemy;
		this.add(whiteEnemy);

		this.redEnemy.alpha = 0;
		this.whiteEnemy.alpha = 0;

		aimCircle.scale.x = containerWidth / aimCircle.width;
		aimCircle.scale.y = aimCircle.scale.x;
		aimCircle.x = this.enemyIdle.x;
		aimCircle.y = this.enemyIdle.y + this.enemyIdle.height * 0.3;

		this.aimCircleInitialY = aimCircle.y;
		this.aimCircle = aimCircle;

		this.game.world.bringToTop(this.enemyIdle);
	}

	fitEnemyBarInContainer() {
		this.enemyBar.scale.x = this.enemyIdle.width / this.enemyBar.width;
		this.enemyBar.scale.y = this.enemyBar.scale.x;
		this.enemyBar.x = this.enemyIdle.x;
		this.enemyBar.y = this.aimCircle.y  + this.aimCircle.height * .95;
	}

	getEnemyYPosition() {
		return this.enemyIdle.y;
	}
	getEnemyYCenterPosition() {
		return this.enemyIdle.y + this.enemyIdle.height/2;
	}
	getEnemyXCenterPosition() {
		return this.enemyIdle.x + this.enemyIdle.width/2;
	}
	attacked() {
		if (!this.dead && this.enemyBar.amount - 7 <= 0) {
			var positionTween = this.game.add.tween(this).to({y:- 50}, 150, Phaser.Easing.Quadratic.InOut, true, 0);
			positionTween.onComplete.add(function() {
				this.game.add.tween(this).to({y:0}, 150, Phaser.Easing.Quadratic.InOut, true, 0);
			}, this);

			var redAlphaTween = this.game.add.tween(this.redEnemy).to({alpha: 1}, 500, Phaser.Easing.Quadratic.InOut, true, 0);
			redAlphaTween.onComplete.add(function() {
				// this.game.add.tween(this.redEnemy).to({alpha: 0}, 500, Phaser.Easing.Quadratic.InOut, true, 0);
				this.game.add.tween(this).to({alpha: 0}, 1000, Phaser.Easing.Quadratic.InOut, true, 0);
				this.game.add.tween(this.enemyBar).to({alpha: 0}, 1000, Phaser.Easing.Quadratic.InOut, true, 0);
			}, this);
		} else if (!this.dead) {
			var positionTween = this.game.add.tween(this).to({y:- 50}, 150, Phaser.Easing.Quadratic.InOut, true, 0);
			positionTween.onComplete.add(function() {
				this.game.add.tween(this).to({y:0}, 150, Phaser.Easing.Quadratic.InOut, true, 0);
			}, this);

			var whiteAlphaTween = this.game.add.tween(this.whiteEnemy).to({alpha: 1}, 150, Phaser.Easing.Quadratic.InOut, true, 0);
			whiteAlphaTween.onComplete.add(function() {
				this.game.add.tween(this.whiteEnemy).to({alpha: 0}, 150, Phaser.Easing.Quadratic.InOut, true, 0);
			}, this);

			var circleTween = this.game.add.tween(this.aimCircle).to({y:this.aimCircleInitialY + 80}, 150, Phaser.Easing.Quadratic.InOut, true, 0);
			circleTween.onComplete.add(function() {
				var circleTween = this.game.add.tween(this.aimCircle).to({y:this.aimCircleInitialY}, 150, Phaser.Easing.Quadratic.InOut, true, 0);
			}, this);
		}
		this.enemyBar.decreaseLifeBar(7);
	}
}

export default Enemy;