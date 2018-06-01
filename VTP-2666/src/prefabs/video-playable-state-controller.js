import VideoPlayableInteractiveElementsController from '../prefabs/video-playable-interactive-elements-controller';
import VideoPlayableCollectibleController from '../prefabs/video-playable-collectible-controller';
import AudioController from '../prefabs/audio-controller';
import VideoController from '../prefabs/video-controller';
import VideoPlayableHudController from '../prefabs/video-playable-hud-controller';
import VideoPlayableVariablesController from '../prefabs/video-playable-variables-controller';

/*
===State Controller===
Controls current state of the video playable, checks for any required transitions to other states and modifies video accordinly
by usage of Video Controller.
Does so by processing and reading scripts that have been previously defined on the settings.js file
*/
class VideoPlayableStateController {

    constructor(game, container, initialState, scripts, variables) {
        this.game = game;
        this.initialState = initialState;
        this.scripts = scripts;
        this.firstInteraction = false;

        this.videoController = new VideoController(container);
        this.audioController = new AudioController();
        this.interactiveElementsController = new VideoPlayableInteractiveElementsController(this.game, this);
        this.videoPlayableCollectibleController = new VideoPlayableCollectibleController(this.game);
        this.videoPlayableHudController = new VideoPlayableHudController(this.game);
        this.videoPlayableVariablesController = new VideoPlayableVariablesController(variables);

        this.currentState = this.initialState;
        this.videoEnd = false;

        this.initSignals();
        this.setupController();
    }

    initSignals() {
        this.onStateChange = new Phaser.Signal();
    }

    setupController() {
        this.videoController.onLoop.add(function() {}, this);
        this.videoController.onComplete.add(function() {
            this.videoEnd = true;
        }, this);

        this.interactiveElementsController.onInteract.add(function(nextStateName) {
            if (!this.firstInteraction) {
                this.firstInteraction = true;
                this.playAudio();
            }

            this.cancelAutoPlayTimer();
            // this.videoController.setForceEnd(true);
            this.transitionToState(nextStateName);

        }, this);

        this.videoPlayableCollectibleController.onHudCreate.add(function(tag, object) {
            // tag is "coin-counter"
            //if collectible create a hud, then add the hud amount as an variable, add the hud to hud controller
            this.videoPlayableVariablesController.initVariables(tag, object);

        }, this);

        this.videoPlayableCollectibleController.onHudChange.add(function(tag, value) {
            //change tag to coin
            var variableName = tag.replace('-counter', '');
            this.videoPlayableVariablesController.setVariable(variableName, value);
        }, this);
    }

    update() {
        if(this.videoEnd) {
            //if there's no more script, then dispatch the game complete
            this.videoEnd = false;
            if(this.currentState){
                this.transitionToState(this.currentState.autoplay.script);
            }
            else if(!this.game.global.gameComplete ){
                this.game.global.gameComplete = true;
                this.game.onGameComplete.dispatch();
            }
        }
        this.videoController.update();

        if(this.currentState){
            this.interactiveElementsController.update(this.videoController.video.currentTime, this.videoPlayableVariablesController, this.currentState.interactions, this.currentState.autoplay);
            this.videoPlayableHudController.update(this.videoController.video.currentTime, this.videoPlayableVariablesController, this.currentState.hud);
            this.videoPlayableCollectibleController.update(this.videoController.video.currentTime, this.videoPlayableVariablesController, this.currentState.collectibles);
        }else if(!this.game.global.gameComplete){
            this.game.global.gameComplete = true;
            this.game.onGameComplete.dispatch();
        }
    }

    transitionToState(stateKeyName = "") {

        if (stateKeyName != ""){

            this.currentState = this.scripts[stateKeyName];
       
            console.log(this.currentState)     
    
            var videoPath = PiecSettings.assetsDir + this.currentState.video;
            this.videoController.play(videoPath, { "from": this.currentState.from, "to": this.currentState.to, "loop": this.currentState.loop });
            
            if(this.currentState.autoplay !== undefined && this.currentState.autoplay.after !== undefined && this.currentState.loop)
                this.setAutoPlayTimer(this.currentState.autoplay);
        
        }else{

            this.currentState = null;
            // this.videoController.play('');
        
        }
        
    }

    playAudio() {
        this.game.time.events.add(500, function() {
            var audioPath = PiecSettings.assetsDir + PiecSettings.audio.src;
            this.audioController.play(PiecSettings.audio.src, audioPath);
        }, this);
    }

    setAutoPlayTimer(autoplay){
        console.log('setTimer');
        this.autoplayTimer = this.game.time.events.add(autoplay.after, function(){
            console.log('dispatch timer');
            this.transitionToState(autoplay.script);
        }, this);
    }

    cancelAutoPlayTimer() {
        console.log('remove');
        if(this.autoplayTimer !== undefined)
            this.game.time.events.remove(this.autoplayTimer);
    }

}

export default VideoPlayableStateController;