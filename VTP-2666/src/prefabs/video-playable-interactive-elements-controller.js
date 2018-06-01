import InteractiveElement from '../prefabs/interactive-element';
import ProjectileGame from '../prefabs/projectile-game';


class VideoPlayableInteractiveElementsController {

    constructor(game, videoPlayableStateController) {
        this.game = game;
        this.videoPlayableStateController = videoPlayableStateController;
        this.currentInteractions = null;
        this.interactiveElements = [];

        this.interacted = false;

        this.coinsSpawned = false;

        this.initSignals();
    }

    initSignals() {
        this.onInteract = new Phaser.Signal();
    }

    update(currentTime, variablesController, interactions) {

        if (!this.variablesController) {
            this.variablesController = variablesController;
        }

        if (this.currentInteractions != interactions) {
            this.currentInteractions = interactions;
            this.clearCurrentInteractiveElements();
            this.createInteractiveElements(interactions);
        }
        //Check if we need to enable any interactive elements!
        for (var i = 0; i < interactions.length; i++) {
            var interaction = interactions[i];
            if (this.checkIfInteractionShouldBeEnabled(interaction, currentTime) &&
                variablesController.evaluateConditions(interactions[i].conditions)) {
                this.interactiveElements[i].enable();
            } else {
                this.interactiveElements[i].disable();
            }
        }
    }

    clearCurrentInteractiveElements() {
        var length = this.interactiveElements.length;
        for (var i = 0; i < length; i++) {
            this.interactiveElements[i].destroy();
        }
        this.interactiveElements = [];
    }

    //Maybe should make it into Util
    calculateDuration(from, to){
        var toToFrom = (to - from);

        var duration = parseInt(toToFrom) * 1000 + (toToFrom - parseInt(toToFrom)) * 30;

        return duration;
    }

    createInteractiveElements(interactions) {

        for (var i = 0; i < interactions.length; i++) {
            var interaction = interactions[i];

            var duration;
            if(interaction.to !== undefined)
                duration = this.calculateDuration(interaction.from, interaction.to); // listen to the interaction time, if the time runs out, continue autoplay or onFail
            else 
                duration = null;

            if (interaction.typeOfInteraction == "tap") {
                //TODO - we need to include extra args such as type of interaction, idleEffect, onInteractEffect, etc.
                var interactiveElement = new InteractiveElement(this.game, { 'src': interaction.src, 'container': interaction.htmlTag});
                interactiveElement.onSuccess = interaction.onSuccess; 
                interactiveElement.consequences = interaction.consequences; 

                this.game.add.existing(interactiveElement);
                this.interactiveElements[i] = interactiveElement;

                interactiveElement.hide();
                interactiveElement.disable();


            //TODO - define the onFail event, e.g. the time has run out
                if(interactiveElement!== undefined){
                    
                    interactiveElement.onInteract.add(function(obj) {
                        this.interacted = true;
                        // this.videoPlayableStateController.transitionToState(obj.onSuccess);
                        this.variablesController.applyConsequences(obj.consequences);
                        this.onInteract.dispatch(obj.onSuccess);
                    }, this);


                }

            } else if (interaction.typeOfInteraction == "minigame") {
                var gameScript = PiecSettings.minigames[interaction.gameTag];

                switch (interaction.gameTag){
                    case 'projectile':
                        var minigame = new ProjectileGame(this.game, { 'src': gameScript.src, 'amount': gameScript.amount, 'direction': gameScript.direction, 'interactionDuration': duration, 'container': interaction.htmlTag });
                
                        //apply the consequences and onSuccess event
                        
                        minigame.successConsequences = interaction.successConsequences;

                        minigame.successScript = interaction.onSuccess;

                        minigame.failConsequences = interaction.failConsequences;

                        minigame.failScript = interaction.onFail;


                        this.game.add.existing(minigame);
                        this.interactiveElements[i] = minigame;
                        minigame.hide();
                        minigame.disable();

                        minigame.onSuccess.add(function(obj) {
                            //apply consequences
                            if (obj.successConsequences!== undefined) 
                                this.variablesController.applyConsequences(obj.successConsequences);
                            if (obj.successScript !== undefined) 
                                this.onInteract.dispatch(obj.successScript);
                                // this.videoPlayableStateController.transitionToState(obj.successScript);
                            minigame.disable();
                        }, this);

                        minigame.onFail.add(function(obj) {
                            //apply consequences
                            console.log('onFail');
                            minigame.disable();

                            if(obj.failConsequences !== undefined)
                                this.variablesController.applyConsequences(obj.failConsequences);

                            if(obj.failScript !== undefined)

                                this.onInteract.dispatch(obj.failScript);
                            
                                // this.variablesController.transitionToState(obj.failScript);
                            // this.onInteract.dispatch();
                        },this);
                    break;
                    default:
                        console.log('gameTag undefined');
                }

               

            }


        }
    }

    checkIfInteractionShouldBeEnabled(interaction, currentTime) {
        if (interaction.to !== undefined && currentTime > interaction.to) {
            return false;
        }
        if (interaction.from !== undefined && currentTime >= interaction.from) {
            return true;
        }
        return false;
    }

}

export default VideoPlayableInteractiveElementsController;