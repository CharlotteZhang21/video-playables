/*
===Video Controller===
Handles video controls, including playing a video, pausing a video, changing the video source, etc.
-- Doesn't understand anything about the logic behind transitioning between videos or interactive areas. --
*/
class VideoController {

    constructor(container) {

        this.container = container;
        this.video = document.getElementById(container);
        this.source = document.createElement('source');
        this.video.appendChild(this.source);
        this.video.controls = false;

        this.initSignals();

    }

    initSignals() {
        this.onComplete = new Phaser.Signal();
        this.onLoop = new Phaser.Signal();
    }

    /*
    ==Play==
    Plays specific video.
    Params:
     + video src
     + args: object with optional arguments to configure how to play the video (optional)
        + "loop" : bool  video loops if true
        + "from" : 1     where does the video start playing from
        + "to" : 2       where does the video pause
    */
    play(src, args) {

        if (this.videoName == undefined || this.videoName != src) {

            console.log("reloading");

            this.videoName = src;
            this.source.setAttribute('src', src);
            this.video.load();
            this.video.play();
            this.video.currentTime = 0;
            this.video.endTime = 0;

            var _this = this;
            this.video.addEventListener("loadeddata", function() {
                _this.initVideoArgs(args);
            });
        } else {
            this.video.play();
            this.initVideoArgs(args);
        }
    }

    /*
    ==Update loop==
    Should be called from the endcard state.
    */
    update() {

        if (this.videoEnded()) {
            if (this.video.loop) {
                this.video.currentTime = this.video.initialTime;
                this.onLoop.dispatch();
            } else {
                this.video.pause();
                this.onComplete.dispatch();
            }
        }
        if (!this.video.paused && this.videoEnded()) {
            this.video.pause();
            this.onComplete.dispatch();
        }

    }


    /*
    Returns if video has ended.
    This includes full-length of video (if no from/to args have been defined), or specified fragment (from/to).
    */
    videoEnded() {
        return this.video.ended || this.video.endTime != 0 && this.video.currentTime >= this.video.endTime;
    }

    /*
    Processes and loads video args into class settings
    */
    initVideoArgs(args) {
        if (args !== undefined) {
            if (args.from !== undefined && args.to !== undefined) {
                this.video.initialTime = args.from;
                this.video.currentTime = args.from;
                this.video.endTime = args.to;
            }
            if (args.loop !== undefined && typeof args.loop == 'boolean') {
                this.video.loop = args.loop;
            }else{
                this.video.loop = false;
            }
        }
    }


}

export default VideoController;