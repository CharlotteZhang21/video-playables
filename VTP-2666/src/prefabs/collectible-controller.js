import Collectible from '../prefabs/collectible';
/*
===Collectible Controller===
Controls current state of all collectibles, instantiates them at the beginning, 
checks for any required updates.
*/
class CollectibleController {

	constructor(game) {

		this.game = game;
		this.initSignals();

		if (PiecSettings.collectibles !== undefined)
			this.createCollectibles();


		this.setupController();

	}

	initSignals() {
		this.onHudCreate = new Phaser.Signal();

		this.onHudChange = new Phaser.Signal();
	}

	setupController() {

		for (var key in PiecSettings.collectibles) {
			
			if(this.collectibles[key] !== undefined)
				this.collectibles[key].onHudChange.add(function(tag, value) {
					this.onHudChange.dispatch(tag, value);
				}, this);	
		
		}
		
		
	}

	createCollectibles() {
		this.collectibles = [];

		for (var key in PiecSettings.collectibles) {

			var collectible = new Collectible(this.game, PiecSettings.collectibles[key]);
			collectible.onHudCreate.add(function(tag, object) {
				this.onHudCreate.dispatch(tag, object);
			}, this);
			// console.log(collectible.onHudCreate);

			this.collectibles[key] = collectible;
		}
	}

	getCollectible(tag) {
		return this.collectibles[tag];
	}

}

export default CollectibleController;