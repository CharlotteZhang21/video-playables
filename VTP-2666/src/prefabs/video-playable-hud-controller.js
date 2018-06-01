class VideoPlayableHudController {

    //control show or not
    constructor(game) {
        this.game = game;

        this.hudObjects = [];

    }

    setupController() {

        this.variablesController.onInitVariables.add(function(tag, object) {
            this.addHudObject(tag, object);
        }, this);

        this.variablesController.onConsequencesChange.add(function(tag, value) {
            this.changeHudObjectValue(tag, value);
        }, this);

    }

    addHudObject(tag, object) {

        this.hudObjects[tag] = object;
        console.log(this.hudObjects);
    }


    changeHudObjectValue(tag, value){
        this.hudObjects[tag].changeCounterTo(value, 50);
        // var consequences = tag.split("-")[0] + '=' + value;
            // this.variablesController.applyConsequences(consequences);

    }

    update(currentTime, variablesController, hudList) {
        if (!this.variablesController) {
            this.variablesController = variablesController;

            this.setupController();


        }
        if (hudList !== undefined && hudList != null) {
            for (var i = 0; i < hudList.length; i++) {
                var key = hudList[i].tag;
                if (this.hudObjects[key] != null) {
                    if (variablesController.evaluateConditions(hudList[i].conditions) &&
                        this.checkIfHudShouldBeEnabled(hudList[i], currentTime)) {
                        this.hudObjects[key].show();
                    } else {
                        this.hudObjects[key].hide();
                    }
                }
            }
        }
    }

    checkIfHudShouldBeEnabled(hudElement, currentTime) {

        if (hudElement.to !== undefined && currentTime > hudElement.to) {
            return false;
        }
        if (hudElement.from !== undefined && currentTime >= hudElement.from) {
            return true;
        }
        return false;
    }

}

export default VideoPlayableHudController;