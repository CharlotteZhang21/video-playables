import * as CustomPngSequencesRenderer from '../utils/custom-png-sequences-renderer.js';
import LifeBar from '../prefabs/life-bar';

class Character extends Phaser.Group {
	constructor(game, characterSettings) {
		super(game);
		this.characterSettings = characterSettings;
		this.createCharacter();
		this.lifeBar = new LifeBar(this.game, characterSettings.icon, characterSettings.enemy);
		this.add(this.lifeBar);
		this.fitLifeBarInContainer();
		this.dead = false;
	}

	createCharacter() {
		this.idleAnim = this.createAnimation(this.characterSettings.idleAnimIndex, true);
		this.add(this.idleAnim);
		if (this.game.global.characterWidth == null){
			this.game.global.characterWidth = this.idleAnim.width;
		}
	}

	fitLifeBarInContainer() {
		if (this.game.global.lifeBarScale == null) {
			this.game.global.lifeBarScale = this.idleAnim.width / this.lifeBar.width * .8;
		}
		this.lifeBar.scale.x = this.game.global.lifeBarScale;
		this.lifeBar.scale.y = this.lifeBar.scale.x;
		this.lifeBar.x = this.idleAnim.x - this.lifeBar.width/3;
		this.lifeBar.y = this.idleAnim.y - this.idleAnim.height/2 * this.characterSettings.lifeBarYPos;
	}

	attackWithDelay(layer, delay, damage) {
		this.game.time.events.add(delay, function() {
			this.attack(layer, damage);
		}, this);
	}

	attack(layer, damage) {
		this.idleAnim.visible = false;
		this.attackAnim = this.createAnimation(this.characterSettings.attackAnimIndex, false);
		this.add(this.attackAnim);
		var waitTime = 0;
		waitTime = Math.floor(PiecSettings.pngAnimations[this.characterSettings.attackAnimIndex].spriteNumber * (1/PiecSettings.pngAnimations[this.characterSettings.attackAnimIndex].fps) * 1000) - 150;
		this.game.time.events.add(waitTime, function() {
			this.attackAnim.visible = false;
			this.idleAnim.visible = true;
		}, this);
		this.attackEffect(layer, damage);
	}

	attackEffect(layer, damage) {
		var otherCharacters;
		if (!this.characterSettings.flipped) { //character player
			otherCharacters = PiecSettings.nonPlayerCharacters;
		} else {
			otherCharacters = PiecSettings.playerCharacters;
		}

		for (var i = 0; i < otherCharacters.length; i++) {
			if (!otherCharacters[i].dead) {
				var otherCharacter = this.game.global.characters[otherCharacters[i]];
				this.renderAttackEffect(otherCharacter, layer);
				otherCharacter.decreaseLifeWithDelay(damage, 150);
			}
		}
	}

	attackAndFlyToWithDelay(otherCharacterIndex, layer, delay, damage) {
		this.game.time.events.add(delay, function() {
			this.attackAndFlyTo(otherCharacterIndex, layer, damage);
		}, this);
	}

	attackAndFlyTo(otherCharacterIndex, layer, damage) {
		var otherCharacter = this.game.global.characters[otherCharacterIndex];
		console.log(otherCharacter);

		//First we fly to that other character, then we trigger the attack effect
		this.idleAnim.visible = false;
		this.attackAnim = this.createAnimation(this.characterSettings.attackAnimIndex, false);
		this.add(this.attackAnim);
		var initialXPos = this.getXPos();
		var initialYPos = this.getYPos();
		var flyTween;
		if (!this.characterSettings.flipped) {
			flyTween = this.game.add.tween(this.attackAnim).to({
					x: otherCharacter.getXPos() - Math.abs(otherCharacter.getWidth())/2,
					y: otherCharacter.getYPos()},
				400, Phaser.Easing.Quadratic.Out, true, 0);
		} else {
			flyTween = this.game.add.tween(this.attackAnim).to({
					x: otherCharacter.getXPos() + Math.abs(otherCharacter.getWidth())/2,
					y: otherCharacter.getYPos()},
				400, Phaser.Easing.Quadratic.Out, true, 0);
		}

		this.bringCharacterToTop();

		flyTween.onComplete.add(function() {
			this.game.add.tween(this.attackAnim).to({
				x: initialXPos,
				y: initialYPos,
			}, 400, Phaser.Easing.Quadratic.In, true, 0);
			this.reorderCharacters();
			this.game.world.bringToTop(layer);
		}, this);

		this.game.time.events.add(800, function() {
			this.idleAnim.visible = true;
			this.attackAnim.destroy();
		}, this);

		if (this.characterSettings.attackEffectAnimIndex != null)
			this.renderAttackEffect(otherCharacter, layer);

		otherCharacter.decreaseLifeWithDelay(damage, 150);
	}

	renderAttackEffect(otherCharacter, layer) {

		console.log(otherCharacter);

		var attackEffect = CustomPngSequencesRenderer.playPngSequence(this.game, PiecSettings.pngAnimations[this.characterSettings.attackEffectAnimIndex], layer);

		attackEffect.anchor.set(0.5,1);

		var yFinalPos = otherCharacter.getYPos() + otherCharacter.getHeight() - otherCharacter.getHeight()/5;
		if (PiecSettings.pngAnimations[this.characterSettings.attackEffectAnimIndex].aligned == "middle") {
			yFinalPos = otherCharacter.getYPos() + otherCharacter.getHeight()/2;
		}

		if (this.characterSettings.attackEffectStyle != null &&
			this.characterSettings.attackEffectStyle == "cast") {
			attackEffect.x = this.getXPos();
			attackEffect.y = this.getYPos() + this.getHeight() - this.getHeight()/5;

			var tween = this.game.add.tween(attackEffect).to({
				x: otherCharacter.getXPos(),
				y: yFinalPos,
			}, 400, Phaser.Easing.Quadratic.InOut, true, 0);
		} else {
			attackEffect.x = otherCharacter.getXPos();
			attackEffect.y = yFinalPos;
		}
		var scaleFactor = 1;
		if (PiecSettings.pngAnimations[this.characterSettings.attackEffectAnimIndex].scale != null){
			scaleFactor = PiecSettings.pngAnimations[this.characterSettings.attackEffectAnimIndex].scale;
		}
		attackEffect.scale.x = this.game.global.characterWidth/attackEffect.width * 1.1 * scaleFactor;
		attackEffect.scale.y = attackEffect.scale.x;
		// if (!PiecSettings.pngAnimations[this.characterSettings.attackEffectAnimIndex].persistent) {
			attackEffect.animations.currentAnim.onComplete.add(function() {
				attackEffect.destroy();
			}, this);
		// }
		this.game.world.bringToTop(layer);
	}

	createAnimation(animationIndex, visible) {
		var animation = CustomPngSequencesRenderer.playPngSequence(this.game, PiecSettings.pngAnimations[animationIndex], this);
		// this.add(animation);
		animation.x = this.game.global.windowWidth * window.devicePixelRatio * this.characterSettings.xPos;
		animation.y = this.game.global.windowHeight * window.devicePixelRatio * this.characterSettings.yPos;

		var scaleFactor = 1;
		if (PiecSettings.pngAnimations[animationIndex].scale != null){
			scaleFactor = PiecSettings.pngAnimations[animationIndex].scale;
		}

		if (this.game.global.windowHeight < this.game.global.windowWidth){ //Landscape
			animation.scale.y = this.game.global.windowHeight * window.devicePixelRatio / animation.height * this.characterSettings.scaleLandscape * scaleFactor;
		} else {
			animation.scale.y = this.game.global.windowHeight * window.devicePixelRatio / animation.height * this.characterSettings.scalePortrait * scaleFactor;
		}

		animation.anchor.set(0.5);
		var flipped = 1;
		if (this.characterSettings.flipped)
			flipped = -1;
		animation.scale.x = animation.scale.y * flipped;
		return animation;
	}

	decreaseLifeWithDelay(value, delay) {
		this.game.time.events.add(delay, function() {
			this.lifeBar.decreaseLifeBarWithDelay(value, delay);
			this.createAndAnimateText(value);
			this.game.time.events.add(Math.max(delay, 500), function() {

				//character dead
				if (!this.dead && this.lifeBar.amount <= 0 && this.characterSettings.dieAnimIndex != null) {// DIE
					console.log("what");
					this.dieAnim = this.createAnimation(this.characterSettings.dieAnimIndex, true);

					if(this.idleAnim)
						this.idleAnim.visible = false;
					if(this.attackAnim)
						this.attackAnim.visible = false;
					this.lifeBar.alpha = 0;
					this.dead = true;
				}
			}, this);
		}, this);
	}

	createAndAnimateText(value)  {

		if(value < 0)
			value = 1;
		var alteredValue = value * 10 + Math.round(Math.random() * 50);
		var fontSize = this.lifeBar.height * 1.5;
		var style = {
			font: "bold " + fontSize + "px " + PiecSettings.fontFamily
		};
		var textField = new Phaser.Text(this.game, 0, 0, "-"+alteredValue, style);
		textField.x = this.idleAnim.x - textField.width/2;
		textField.y = this.idleAnim.y;
		
		var gradient = textField.context.createLinearGradient(0,0,0,textField.height);
		gradient.addColorStop(0, "#ffffff");
		gradient.addColorStop(1, "#dddddd");

		textField.fill = gradient;
		textField.stroke = "black";
		textField.setShadow(2,3,'rgb(0,0,0)', 0);
		this.add(textField);

		this.game.add.tween(textField).to({
			y: textField.y - 200
		}, 900, Phaser.Easing.Quadratic.In, true, 0);
		this.game.add.tween(textField).to({
			alpha: 0
		}, 500, Phaser.Easing.Quadratic.In, true, 400);
	}

	bringCharacterToTop() {
		this.game.global.camera.gameWorld.bringToTop(this);
		this.game.global.camera.gameWorld.bringToTop(this.lifeBar);
		// this.game.world.bringToTop(this);
		// this.game.world.bringToTop(this.lifeBar);
	}

	reorderCharacters() {
		for (var i = 0; i < this.game.global.characters.length; i++) {
			this.game.global.camera.gameWorld.bringToTop(this.game.global.characters[i]);
		this.game.global.camera.gameWorld.bringToTop(this.game.global.characters[i].lifeBar);
			// this.game.world.bringToTop(this.game.global.characters[i]);
			// this.game.world.bringToTop(this.game.global.characters[i].lifeBar);
		}
	}

	getXPos(){
		return this.idleAnim.x;
	}

	getWidth() {
		return this.idleAnim.width;
	}

	getYPos() {
		return this.idleAnim.y;
	}

	getHeight() {
		return this.idleAnim.height;
	}

}

export default Character;