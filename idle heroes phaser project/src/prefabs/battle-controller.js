class BattleController extends Phaser.Group {
	constructor(game, pngSequencesLayer) {
		super(game);
		this.pngSequencesLayer = pngSequencesLayer;
		this.game.global.interaction = 0;
	}

	runBattle() {
		var totalDelay = 0;
		var interaction;
		console.log("BATTLE RUNNING!!!");
		for (var i = 0; i < PiecSettings.battleScript[this.game.global.interaction].length; i++) {
			interaction = PiecSettings.battleScript[this.game.global.interaction][i];

			if (interaction.delay != null) {
				totalDelay += interaction.delay;
			}

			//if it's the characters plays the interaction after 
			if (interaction.a == "attack") {
				this.game.global.characters[interaction.from].attackWithDelay(this.pngSequencesLayer, totalDelay, interaction.damage);
			} else if (interaction.a == "attackAndFly") {
				this.game.global.characters[interaction.from].attackAndFlyToWithDelay(interaction.to, this.pngSequencesLayer, totalDelay, interaction.damage);
			}

			if (interaction.effect != null && interaction.effect == "shake") {
				this.game.time.events.add(totalDelay + 300, function() {
					this.game.camera.shake(0.005, 500);
				}, this);
			} else if (interaction.effect != null && interaction.effect == "shake-big") {
				this.game.time.events.add(totalDelay + 300, function() {
					this.game.camera.shake(0.005, 900);
				}, this);
			}
		}
		console.log(totalDelay);
		this.game.time.events.add(totalDelay, function() {
			this.game.onInteractionComplete.dispatch();
		}, this);
	}

	runEnemyAttack() {
		var totalDelay = 0;
		var interaction = PiecSettings.enemyAttackScript[0][0];

		if (interaction.delay != null) {
			totalDelay += interaction.delay;
		}



		//if it's the characters plays the interaction after 
		if (interaction.a == "attack") {
			this.game.global.characters[interaction.from].attackWithDelay(this.pngSequencesLayer, totalDelay, interaction.damage);
		} else if (interaction.a == "attackAndFly") {
			this.game.global.characters[interaction.from].attackAndFlyToWithDelay(interaction.to, this.pngSequencesLayer, totalDelay, interaction.damage);
		}

		if (interaction.effect != null && interaction.effect == "shake") {
			this.game.time.events.add(totalDelay + 300, function() {
				this.game.camera.shake(0.005, 500);
			}, this);
		} else if (interaction.effect != null && interaction.effect == "shake-big") {
			this.game.time.events.add(totalDelay + 300, function() {
				this.game.camera.shake(0.005, 900);
			}, this);
		}
		
		console.log(totalDelay);
		this.game.time.events.add(totalDelay, function() {
			this.game.onInteractionComplete.dispatch();
		}, this);
	}
}

export default BattleController;