import CtaButton from '../prefabs/cta-button';
import ChoiceButton from '../prefabs/choicebutton';
import * as CustomPngSequencesRenderer from '../utils/custom-png-sequences-renderer.js';

class Endcard extends Phaser.State {

    constructor() {
        super();
    }

    create() {

        this.game.scale.scaleMode = Phaser.ScaleManager.USER_SCALE;
        this.game.scale.setUserScale((1 / window.devicePixelRatio), (1 / window.devicePixelRatio), 0, 0);

        this.game.global.windowWidth = document.body.clientWidth;
        this.game.global.windowHeight = document.body.clientHeight;



        this.cta = new CtaButton(this.game);
        this.game.add.existing(this.cta);


        if (PiecSettings.timer !== undefined) {
            this.game.time.events.add(4000, function() {
                document.getElementById("vungle-close").className = "visible";
            }, this);
        }

        this.game.onInteract.add(this.onInteract, this);


        /*==================video===========*/

        this.game.global.currentVideoScript = PiecSettings.script.intro;


        this.video = document.getElementById('videoBg');
        this.source = document.createElement('source');
        this.video.currentTime = 0;
        this.video.endTime = 0;
        this.setNextVideo(this.game.global.currentVideoScript);
        this.video.appendChild(this.source);
        this.video.play();
        this.video.controls = false;

        // this.video.exitFullscreen();
        /*==================video===========*/

        /*==================audio===========*/

        this.audio = new Audio(PiecSettings.assetsDir + PiecSettings.audio.name + "." + PiecSettings.audio.type);
        this.audio.muted = false;


        this.playAudio();

        /*==================audio===========*/



        /*==================option Btn======*/
        this.button1 = new ChoiceButton(this.game, 'btn_innocent', this.game.global.currentVideoScript.interactions[0].onSuccess, this.game.global.currentVideoScript.interactions[0].htmlTag);
        this.button2 = new ChoiceButton(this.game, 'btn_naughty', this.game.global.currentVideoScript.interactions[1].onSuccess, this.game.global.currentVideoScript.interactions[1].htmlTag);
        this.button1.alpha = 0;
        this.button2.alpha = 0;
    }

    resize() {
    }

    render() {
    }


     /*==================video===========*/
     setNextVideo(videoObj){
        console.log(videoObj);
        var video_name;

        if(videoObj != null){
            video_name = PiecSettings.assetsDir + videoObj.video;   
            this.video.name = videoObj.video;
            this.source.setAttribute('src', video_name);
            this.video.load();

            this.setVideoDuration(videoObj.from, videoObj.to);        
        }   
        else {
           this.source.setAttribute('src', '');
           this.video.load();
        }

        this.video.play();
       
    }



    setVideoDuration(startTime = 0, pauseTime){
         this.video.currentTime = startTime;
         this.video.pauseTime = pauseTime;

         if(pauseTime != undefined) {
            var _this = this;
             this.video.addEventListener("play", function(){
                this.addEventListener("timeupdate", function(e){
                    if(this.currentTime >= this.pauseTime) {
                        // pause the playback
                        this.pause();
                         _this.showInteractionScreen();
                    }
                 });
             });
         }else{
            var _this = this;
            this.video.addEventListener("play", function(){
                this.addEventListener('ended', function(){
                    this.pause();
                    _this.showInteractionScreen();
                })
            });
         }
         
         
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

    showInteractionScreen() {
        console.log('show');
        this.button1.alpha = 1;
        this.button2.alpha = 2;
    }

    onInteract() {
        this.video.play();
        this.setNextVideo(this.game.global.currentVideoScript);
        
        // this.video.play();

        this.button1.alpha = 0;
        this.button2.alpha = 0;

    }

}

export default Endcard;