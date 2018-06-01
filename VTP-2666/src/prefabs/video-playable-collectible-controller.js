import CollectibleController from '../prefabs/collectible-controller';

class VideoPlayableCollectibleController {

    constructor(game) {
        this.game = game;
        this.initSignals();

        this.collectibleController = new CollectibleController(this.game);
        this.collectibleList = [];
        this.collectibleListFired = [];

        this.setupController();
    }

    initSignals() {
        this.onHudCreate = new Phaser.Signal();

        this.onHudChange = new Phaser.Signal();
    }

    setupController() {
        this.collectibleController.onHudCreate.add(function(tag, object) {
            this.onHudCreate.dispatch(tag, object);
        }, this);

        this.collectibleController.onHudChange.add(function(tag, value) {
            this.onHudChange.dispatch(tag, value);
        }, this);

    }

    update(currentTime, variablesController, collectibleList) {

        if (collectibleList !== undefined) {

            if (this.collectibleList != collectibleList) {
                this.collectibleList = collectibleList;
                this.collectibleListFired = [];
            }

            for (var i = 0; i < collectibleList.length; i++) {
                var tag = collectibleList[i].tag;

                if (!this.collectibleListFired[i] &&
                    variablesController.evaluateConditions(collectibleList[i].conditions) &&
                    this.checkIfCollectibleShouldBeFired(collectibleList[i], currentTime)) {

                    this.collectibleListFired[i] = true;
                    var amount = collectibleList[i].amount;
                    var lifetime = (collectibleList[i].to - collectibleList[i].from) * 1000;
                    var spawnArea = collectibleList[i].htmlTag;

                    this.collectibleController.getCollectible(tag).spawnCollectibles({
                        "amount": amount,
                        "lifetime" : lifetime,
                        "spawnArea" : spawnArea,
                    });

                }
            }
        }
    }

    checkIfCollectibleShouldBeFired(collectibleElement, currentTime) {
        if (collectibleElement.from !== undefined && currentTime >= collectibleElement.from) {
            return true;
        }
        return false;
    }

}

export default VideoPlayableCollectibleController;