
/*
===Audio Controller===
Handles audio controls, including muting, playing audios, etc.
*/
class AudioController {

    constructor() {
        this.audios = [];
    }

    /*
    ==Play==
    Plays a specific audio.
    Params: 
     + keyName    can be later used to reference a specific audio
     + audio src
     + args: object with optional arguments to configure how to play the audio (optional)
     	+ "loop" : bool   audio loops if true
    */
    play(keyName, src, args) {
        this.audios[keyName] = new Audio(src);
        this.initAudioArgs(keyName, args);
        this.audios[keyName].play();
    }

    /*
    Pauses a specific audio by keyname
    */
    pause(keyName) {
        this.audios[keyName].pause();
    }

    /*
    Mutes a specific audio by keyname
    */
    mute(keyName) {
        this.audios[keyName].muted = true;
    }

    /*
    Mutes and pauses all audios that have been playing or are playing on the IEC
    */
    muteAll() {
        for (var key in this.audios) {
            if (this.audios.hasOwnProperty(key)) {
            	this.audios[key].pause();
                this.audios[key].muted = true;
            }
        }
    }

    unmuteAll() {
        for (var key in this.audios) {
            if (this.audios.hasOwnProperty(key)) {
                this.audios[key].muted = false;
            }
        }
    }

    /*
    Processes and loads video args into class settings
    */
    initAudioArgs(keyName, args) {
        this.audios[keyName].muted = false;
        this.audios[keyName].autoplay = true;
        if (args !== undefined) {
            if (args.loop !== undefined && typeof args.loop == 'boolean') {
                this.audios[keyName].loop = args.loop;
                // if(this.audios[keyName].loop) {
                //     if (this.audios[keyName].ended) {
                //             this.audios[keyName].currentTime = 0;
                            
                //     }
                // }
            }
        }
    }

}

export default AudioController;