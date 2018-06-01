import * as ContainerUtil from '../utils/container-util';

import CollectibleCounter from '../prefabs/collectible-counter';

/*
===Collectible Random===
Controls a collectible. (e.g. "coins")
*/
class Collectible extends Phaser.Group {

    /*
    Params:
     + game
     + config : settings file chunk for a specific collectible 
     (e.g. 'coins' : {
            src: 'coin',
            htmlTag: 'coin-container',
            initialValue: 0,
            maxValue: 100,
            eachItemCountsAs: 300,
            counter : {
                htmlTag: 'counter',
                iconSrc:'coins',
            }
            onCollectEffects: ['flyToGoal'],
                                                                        })
    */
    constructor(game, config) {
        super(game);
        this.initSignals();

        this.config = config;
        this.amount = this.config.initialValue;

        config.counter.initialValue = this.amount;

        config.counter.maxValue = this.config.valueRange.max;
        config.counter.minValue = this.config.valueRange.min;

        if (config.counter !== undefined) {
            this.collectibleCounter = new CollectibleCounter(this.game, config.counter);
            this.collectibleCounter.hide();
        }

        this.game.time.events.add(10, function() {
            this.onHudCreate.dispatch(config.counter.tag, this.collectibleCounter);
        }, this);

    }

    initSignals() {
        this.onHudCreate = new Phaser.Signal();
        this.onHudChange = new Phaser.Signal();
    }

    spawnCollectibles(args) {

        var amount = args.amount;
        var lifetime = args.lifetime;
        var spawnArea = args.spawnArea;

        for (var i = 0; i < amount; i++) {
            var collectibleItem = new Phaser.Sprite(this.game, 0, 0, this.config.src);
            this.game.add.existing(collectibleItem);

            ContainerUtil.fitInContainer(collectibleItem, this.config.htmlTag);

            collectibleItem.x = ContainerUtil.getRandomXWithinContainer(spawnArea);
            collectibleItem.y = ContainerUtil.getRandomYWithinContainer(spawnArea);
            collectibleItem.alpha = 1;

            this.collectibleItemAppear(collectibleItem, Math.random() * 200, lifetime, spawnArea);

            collectibleItem.inputEnabled = true;
            collectibleItem.input.useHandCursor = true;
            collectibleItem.events.onInputDown.add(function(collectibleItem) {
                this.collectItem(collectibleItem);
            }, this);

        }

    }

    collectibleItemAppear(collectibleItem, delay, lifetime, spawnArea) {

        var xCoord = collectibleItem.x;
        var yCoord = collectibleItem.y;
        var scale = collectibleItem.scale.x;

        collectibleItem.x = ContainerUtil.getXCenterWithinContainer(spawnArea);
        collectibleItem.y = ContainerUtil.getYCenterWithinContainer(spawnArea);
        collectibleItem.scale.x = 0.001;
        collectibleItem.scale.y = 0.001;

        this.game.add.tween(collectibleItem).to({
            x: xCoord,
            y: [ContainerUtil.getYCenterWithinContainer(spawnArea) * .3, yCoord],
        }, 500, Phaser.Easing.Quadratic.InOut, true, delay).onComplete.add(function() {
            this.game.time.events.add(lifetime, function() {
                if (collectibleItem.inputEnabled) {
                    this.collectibleItemDisappear(collectibleItem);
                }
            }, this);
        }, this);

        this.game.add.tween(collectibleItem.scale).to({
            x: scale,
            y: scale,
        }, 200, Phaser.Easing.Quadratic.InOut, true, delay + 100);
    }

    collectItem(collectibleItem) {
        collectibleItem.inputEnabled = false;
        this.amount += this.config.eachItemCountsAs;

        if(this.config.eachItemCountsAs > 0 && this.amount > this.config.valueRange.max)
            this.amount = this.config.valueRange.max;
        else if(this.config.eachItemCountsAs < 0 && this.amount < this.config.valueRange.min)
            this.amount = this.config.valueRange.min;

        if (this.collectibleCounter != null) {

            this.onHudChange.dispatch(this.config.counter.tag, this.amount);

            // this.collectibleCounter.changeCounterTo(this.amount, 50); // use this in the hud controller
            this.onCollectEffect(collectibleItem, this.config.onCollectEffects);
        }

       
    }

    collectibleItemDisappear(collectibleItem) {
        collectibleItem.alpha = 0;
        collectibleItem.destroy();
    }


    /*
    ==On Collect Effect==
    Processes any special effects to play after collection of an item.
     + collectibleItem : item that has been collected
     + effects : array of strings that specifies the visual effects to play on collection of item
    */
    onCollectEffect(collectibleItem, effects) {
        for (var i = 0; i < effects.length; i++) {
            switch (effects[i]) {
                case "flyToGoal":
                    this.flyToGoal(collectibleItem);
                    break;
            }
        }
    }


    /*
    ===Collect Effect animation library===
    This will potentially be moved to a separate Animations Library (util).
    */
    flyToGoal(collectibleItem) {
        var xGoal = this.collectibleCounter.x;
        var yGoal = this.collectibleCounter.y;

        this.game.add.tween(collectibleItem).to({
            x: xGoal,
            y: yGoal,
        }, 600, Phaser.Easing.Back.InOut, true, 0);

        this.game.add.tween(collectibleItem.scale).to({
            x: 0.01,
            y: 0.01,
        }, 200, Phaser.Easing.Quadratic.InOut, true, 400);

    }

}

export default Collectible;