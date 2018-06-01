var PiecSettings = PiecSettings || {};

PiecSettings.version = "-";

PiecSettings.timer = true;
PiecSettings.asoi = false;

PiecSettings.fontColor = "#ffffff";
PiecSettings.fontFamily = "Contemporary"; //Make sure that this font is on the css and that there is a div that uses it. (preload-font div)

/*===final scene===*/

PiecSettings.ctaMoveDelay = 0; // delay before the cta moves
PiecSettings.ctaMoveDuration = 800; // duration of the cta moving
PiecSettings.logoMoveDelay = 0; // delay before the cta moves
PiecSettings.logoMoveDuration = 800; // duration of the cta moving

PiecSettings.ctaAnimation = 'bulge'; // choose from: bulge
PiecSettings.ctaAnimationDelay = 0; // delay for animation to start
PiecSettings.ctaAnimationDuration = 1000; // animation duration

PiecSettings.logoAnimation = 'spinIn'; // choose from: spinIn
PiecSettings.logoAnimationDelay = 0; // delay for animation to start
PiecSettings.logoAnimationDuration = 1000; // animation duration

PiecSettings.customEffects = {};

// PiecSettings.customEffects['logo'] = { // name should either match directory in setup/animations or an image in assets
//     fps: 60,
//     loop: true,
//     delay: 0,
//     htmlId: 'logo', // the id in the html where this will be placed (note also accepts an array)
//     showOn: 'win', // move this item at the begining
//     animations: [{ // move this item when user wins
//         easing: 'QuadraticOut', // see possible easings (above)
//         delay: 0,
//         duration: 2000,
//         animation: 'moveTo',
//         onComplete: 'swing'
//     }]
// };



PiecSettings.audios = {
    'audio1': {
        src: 'bgmusic.mp3',
        startTime: 0,
        endTime: 29.5,
        loop: true,
        nextAudio: 'audio2',
    },
    'audio2': {
        src: 'bgmusic2.mp3',
        startTime: 29.5,
        loop: false,
        nextAudio: '',
    },
}

PiecSettings.initialScript = "waitingForSpin1";
PiecSettings.initialAudio = "audio1";

PiecSettings.script = {
    'waitingForSpin1': {
        video: 'video.mp4',
        from: 0,
        to: 1.72,
        loop: true,
        hud: [
            // { tag: 'health-counter', from: 0, show: true },
            // { text: "Choose your character", htmlTag:'choose-your-character',  src: 'tooltip.png', fontColor: "#ffffff", effect: 'float'},
        ],
        interactions: [
           { from: 0, src: '', typeOfInteraction: 'tap', htmlTag: 'spin-button', onSuccess: 'spin1'},
        ],
        autoplay: { after: 6000, script: 'waitingForSpin1' },
    },
    'spin1': {
        video: 'video.mp4',
        from: 1.72,
        to: 8.2,
        loop: false,
        interactions: [           
        ],
        autoplay: { script: 'waitingForSpin2'}
    },
    'waitingForSpin2': {
        video: 'video.mp4',
        from: 8.48,
        to: 10.28,
        loop: true,
        hud: [
            // { tag: 'health-counter', from: 0, show: true },
            // { text: "Choose your character", htmlTag:'choose-your-character',  src: 'tooltip.png', fontColor: "#ffffff", effect: 'float'},
        ],
        interactions: [
           { from: 8.2, src: '', typeOfInteraction: 'tap', htmlTag: 'spin-button', onSuccess: 'spin2'},
        ],
        autoplay: { after: 6000, script: 'spin2' },
    },
    'spin2': {
        video: 'video.mp4',
        from: 10.28,
        to: 20.12,
        interactions: [
            // { from: 0, to: 3, src: 'btn_character', typeOfInteraction: 'tap', htmlTag: 'path-choice-1', onSuccess: 'intro' }
        ],
        autoplay: {script: 'waitingForSpin3'},
    },
    'waitingForSpin3': {
        video: 'video.mp4',
        from: 20.12,
        to: 22.2,
        loop: true,
        interactions: [
            { from: 20.12, src: '', typeOfInteraction: 'tap', htmlTag: 'spin-button', onSuccess: 'spin3'}
        ],
        autoplay: { after: 6000, script: 'spin3'},
    },
    'spin3': {
        video: 'video.mp4',
        from: 22.2,
        to: 37.1,
        interactions: [
            // { from: 0, to: 3, src: 'btn_character', typeOfInteraction: 'tap', htmlTag: 'path-choice-1', onSuccess: 'intro' }
        ],
        autoplay: { script: ''},
    },
};

//============Variables and Flags used within the Video PIEC script to apply conditions and consequences=================


//===================================Collectible Component====================================

// PiecSettings.projectile = [

// ];

//TBD !!!!! -------------------------------------------------------------------------------------------------------
PiecSettings.fxEffects = [{
    tag: 'pulse',
    fxReference: 'pulse-burst', //this references to the animation and we can send parameters from above
    amount: 20,
    duration: 50,
    particleSrc: 'star.png',
}];

PiecSettings.pngAnimations = []


//Notes for Charlotte + Sandra
//onSuccess/onFail are always playing video.
//consequences are triggered onSuccess as well, but they control parameters of the game, and not the videos.

//Library of FX (particles, like the stars in CNY) where you can change some parameters (the amount, the delay, duration, etc.) + the particle