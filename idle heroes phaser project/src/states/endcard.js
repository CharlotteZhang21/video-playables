import Logo from '../prefabs/logo';
import DarkOverlay from '../prefabs/dark-overlay';
import CtaButton from '../prefabs/cta-button';
import Victory from '../prefabs/victory';
import Character from '../prefabs/character';
import Background from '../prefabs/background';
import BattleButton from '../prefabs/battle-button';
import BattleController from '../prefabs/battle-controller';
import Camera from '../prefabs/camera';
import * as CustomPngSequencesRenderer from '../utils/custom-png-sequences-renderer.js';

 class Endcard extends Phaser.State {

     constructor() {
         super();
     }

     create() {

        this.game.scale.scaleMode = Phaser.ScaleManager.USER_SCALE;
        this.game.scale.setUserScale((1 / window.devicePixelRatio), (1 / window.devicePixelRatio), 0, 0);

        this.game.global.windowHeight = document.body.clientHeight;
        this.game.global.windowWidth = document.body.clientWidth;

        this.camera = new Camera(this.game);
        this.camera.setZoom(1.2);
        this.game.global.camera = this.camera;

        // this.background = new Background(this.game);
        // this.game.add.existing(this.background);
        // this.camera.gameWorld.add(this.background);

        this.game.onInteract.add(this.onInteract, this);
        this.game.onInteractionComplete.add(this.onInteractionComplete, this);

        this.game.global.characters = [];
        this.characters = [];
        for (var i = 0; i < PiecSettings.characterSettings.length; i++) {
            var character = new Character(this.game, PiecSettings.characterSettings[i]);
            this.characters.push(character);
            this.game.global.characters.push(character);
            this.camera.gameWorld.add(character);
        }
        // this.camera.gameWorld.bringToTop(this.characters[0]);
        // this.characters[0];

        this.pngSequencesLayer = this.game.add.group();

        this.battleController = new BattleController(this.game, this.pngSequencesLayer);
        this.battleController.runBattle();

        this.darkOverlay = new DarkOverlay(this.game);
        this.game.add.existing(this.darkOverlay);

        this.victory = new Victory(this.game);
        this.game.add.existing(this.victory);

        // this.lose = new Lose(this.game);
        // this.game.add.existing(this.lose);

        this.logo = new Logo(this.game);
        this.game.add.existing(this.logo);

        this.cta = new CtaButton(this.game);
        this.game.add.existing(this.cta);

        this.battleButton = new BattleButton(this.game);
        this.game.add.existing(this.battleButton);


        if (PiecSettings.closeButtonTimer == null || PiecSettings.closeButtonTimer == false) {
            document.getElementById("vungle-close").className = "show visible";
        }

        this.game.global.readyToInteract = false;

        this.camera.zoomTo(1, 3000, Phaser.Easing.Quadratic.Out);
        

        /*==================video===========*/

        this.currentVideoScript = PiecSettings.script.disney1;


        this.video = document.getElementById('videoBg');
        this.source = document.createElement('source');
        this.setNextVideo(this.currentVideoScript);
        this.video.appendChild(this.source);
        this.video.play();
        this.video.controls = false;

        // this.video.exitFullscreen();
        /*==================video===========*/

        /*==================audio===========*/
        this.audio = new Audio(PiecSettings.assetsDir + PiecSettings.audio.name + "." + PiecSettings.audio.type);
        this.audio.muted = false;


        this.playAudio();

     }

     resize() {        
         // resize code here
         location.reload();
     }

     render() {
        // render code here
     }
     

     /*==================video===========*/
     setNextVideo(videoObj){
        console.log(videoObj);
        var video_name;
        if(videoObj != null && this.video.name == videoObj.video )
            return;

        if(videoObj != null){
            video_name = PiecSettings.assetsDir + videoObj.video;   
            this.video.name = videoObj.video;
            this.setVideoDuration(videoObj.from, videoObj.to);        
        }   
        else
            video_name = '';

        this.source.setAttribute('src', video_name);
       
    }

    setVideoDuration(startTime, endTime){
         this.video.currentTime = startTime;
         var _this = this;
         this.video.addEventListener("timeupdate", function(){
            if(this.currentTime >= endTime) {
                // pause the playback
                _this.showInteractionScreen();
            }
         });
    }
    /*==================video===========*/

    /*==================audio===========*/
    playAudio(){
        if(!this.audio.muted) {
            this.audio.autoplay = true;
            this.audio.play();
            if (typeof this.audio.loop == 'boolean')
            {
                this.audio.loop = true;
            }
            else
            {
                this.audio.addEventListener('ended', function() {
                    this.currentTime = 0;
                    this.play();
                }, false);
            }     
        }
    }

    stopAudio(){
        if(this.audio!== undefined){
            this.audio.autoplay = false;
            this.audio.pause();
            this.audio.currentTime = 0;
        }
    }
    /*==================audio===========*/

     onInteract() {
        /*==================video===========*/
        var nextVideoTag = this.currentVideoScript.interactions[0].onSuccess;
        this.setNextVideo(PiecSettings.script[nextVideoTag]);

        this.video.load();

        // this.setVideoDuration(PiecSettings.script[1], 100);

        this.game.time.events.add(0, function(){
            console.log("play");
            this.video.play();
        }, this);


        /*==================video===========*/



        PiecSettings.alwaysWin = true;
        this.game.time.events.remove(this.timer);
        
        if (PiecSettings.closeButtonTimer != null && PiecSettings.closeButtonTimer == true) {
            document.getElementById("vungle-close").className = "show visible";
        }


        console.log("interaction! " + this.game.global.readyToInteract);
        if (!this.game.global.isComplete) {
            if (this.game.global.readyToInteract && this.game.global.interaction < PiecSettings.battleScript.length) {

                this.game.global.interaction ++;
                this.battleController.runBattle();
                this.game.global.readyToInteract = false;
                this.battleButton.hide();
                this.darkOverlay.hideDuringBattle();

                if (this.game.global.interaction == PiecSettings.battleScript.length - 1) {
                    this.game.global.isComplete = true;
                }
            }
        }
     }

     enemyAttack(){

        if (!this.game.global.isComplete) {

                this.battleController.runEnemyAttack();
                this.game.global.readyToInteract = false;
                this.battleButton.hide();
                this.darkOverlay.hideDuringBattle();

                 this.game.global.isComplete = true;
         }
        
     }

     onInteractionComplete() {
        if(this.game.global.restarted){

            this.lose = false;
            this.game.global.restarted = false;
        }

        this.showInteractionScreen();

        
     }

     showInteractionScreen(){
         
        console.log("show");
        var delay = 1000;

        var noInteractionDelay = 3000;

        if (PiecSettings.battleScript[this.game.global.interaction].length == 0) {
            delay = 0;
        }

        this.game.time.events.add(delay, function() {
            this.game.global.readyToInteract = true;

            if (this.game.global.interaction < PiecSettings.battleScript.length - 1 && !this.lose){
                
                // show the attack button and the dark overlay and the character's portrait
                var interaction = PiecSettings.battleScript[this.game.global.interaction + 1][0];


                // see if the current interaction is from the enemy or characters

                if(!this.isEnemy(interaction.from)){
                    // only shows when it's the characters' turn
                    this.battleButton.showWithCharacter(interaction.from, PiecSettings.autoPlay.activateAfter);
                    this.darkOverlay.showDuringBattle();
                    /*===========video=========*/
                     this.video.pause();
                    /*===========video=========*/
                
                }else{
                    if (this.game.global.readyToInteract) {
                        this.game.onInteract.dispatch();
                    }
                }
                
               
                this.game.world.bringToTop(this.battleButton);

                if (PiecSettings.autoPlay != null) {
                    if (PiecSettings.autoPlay.activateAfter != null) {
                        if(PiecSettings.alwaysWin){
                        //autoplay the rest of animation and win
                            this.timer = this.game.time.events.add(PiecSettings.autoPlay.activateAfter, function() {
                                console.log("RESET THE TIMER");
                                if (this.game.global.readyToInteract) {
                                    this.game.onInteract.dispatch();
                                }
                            }, this);
                        }else{
                            // if(!interac)
                            this.timer = this.game.time.events.add(PiecSettings.autoPlay.activateAfter, function() {
                                if (PiecSettings.closeButtonTimer != null && PiecSettings.closeButtonTimer == true) {
                                    document.getElementById("vungle-close").className = "visible";
                                }

                                this.lose = true;
                                if (this.game.global.readyToInteract) {
                                    this.enemyAttack();
                                }
                            }, this);
                        }
                        
                    } else {
                        this.game.onSpin.dispatch();
                    }
                }

            } else {
                this.victory.showWinMessage(this.lose);
                this.video.pause();
                this.setNextVideo(null);//cancel the video
                this.stopAudio();
                this.game.time.events.add(1000, function() {
                    this.darkOverlay.show();
                    this.game.world.bringToTop(this.darkOverlay);
                    this.game.world.bringToTop(this.logo);
                    this.logo.animate();
                    this.game.world.bringToTop(this.cta);
                    this.cta.animate();
                }, this);
            }
        }, this);
     }




     isEnemy(currentCharacter) {
        var enemy = true;
        for(var i = 0; i < PiecSettings.playerCharacters.length; i ++){
            //see if the current interaction is from the character
            if(currentCharacter == PiecSettings.playerCharacters[i]){
                enemy = false;
            }
        }
        return enemy;
     }

 }

 export default Endcard;
