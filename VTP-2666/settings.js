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


PiecSettings.collectibles = [{
        name: 'coins',
        src: 'coin.png',
        initialValue: 100,
        style: { display: true, htmlTag: 'coinBackground', backgroundSrc: 'coinsBackground.png', iconSrc: 'coinIcon.png', fontColor: "#ffffff" }, // if no background is specified, use default rectangle
    },
    {
        name: 'xp',
        src: 'xp.png',
        initialValue: 200,
        style: { display: false },
    }
];

PiecSettings.audio = {
    src: 'bgmusic.mp3',
    startTime: 0
}

PiecSettings.initialScript = "intro";

PiecSettings.script = {
    'intro': {
        video: 'video.mp4',
        from: 0,
        to: 5.23,
        loop: true,
        hud: [
            // { tag: 'health-counter', from: 0, show: true },
            // { text: "Choose your character", htmlTag:'choose-your-character',  src: 'tooltip.png', fontColor: "#ffffff", effect: 'float'},
        ],
        interactions: [
            { from: 0, src: 'btn_character', typeOfInteraction: 'tap', htmlTag: 'character-choice-1', onSuccess: 'male', idleEffect: 'pulse', onInteractEffects: 'spawnStars' },
            { from: 0, src: 'btn_character', typeOfInteraction: 'tap', htmlTag: 'character-choice-2', onSuccess: 'female' }
        ],
        autoplay: { after: 5000, script: 'male' },
    },
    'male': {
        video: 'video.mp4',
        from: 5.23,
        to: 20.93,
        hud: [
            { tag: 'health-counter', from: 5.23, show: true },
            { tag: 'coin-counter', from: 5.23, to: 20.93, show: true },
        ],
        collectibles: [
            { tag: 'coins', from: 9.75, to: 13, htmlTag: 'coins-area', amount: 2 },
            { tag: 'coins', from: 10.65, to: 14, htmlTag: 'coins-area', amount: 5 },
        ],
        interactions: [
            { from: 17.6, src: 'btn_character', typeOfInteraction: 'tap', htmlTag: 'path-choice-1', onSuccess: 'shop'},
            { from: 17.6, src: 'btn_character', typeOfInteraction: 'tap', htmlTag: 'path-choice-2', onSuccess: 'darkPath' },
        ],
        autoplay: { script: 'shop'}
    },
    'female': {
        video: 'video.mp4',
        from: 0,
        to: 3,
        interactions: [
            { from: 0, to: 3, src: 'btn_character', typeOfInteraction: 'tap', htmlTag: 'path-choice-1', onSuccess: 'intro' }
        ],
        autoplay: { after: 1000 , script: ''},
    },
    'darkPath': {
        video: 'video.mp4',
        from: 20.93,
        // from: 29,
        to: 41.63,
        hud: [
            { tag: 'coin-counter', from: 20.93, to: 41.63, show: true },
        ],
        loop: true,
        collectibles: [
            { tag: 'coins', from: 29, to: 31.93, htmlTag: 'coins-area', amount: 5, conditions: 'projectileSuccess==true' },
        ],
        interactions: [
            // { from: 30, to: 33.67, src: 'btn_character', typeOfInteraction: 'tap', htmlTag: 'path-choice-2', onSuccess: 'no-armor' },
            { from: 29.7, to: 31.93, typeOfInteraction: 'minigame', gameTag: 'projectile', htmlTag: 'projectile-area', successConsequences: 'coin+=1000&&projectileSuccess==true', failConsequences: 'coin-=1000&&projectileSuccess==false'},
            { from: 36.73, to: 41.63, src: 'cheap', typeOfInteraction: 'tap', htmlTag: 'store-choice-1', onSuccess: 'no-armor' },
            { from: 36.73, to: 41.63, src: 'pricey', typeOfInteraction: 'tap', htmlTag: 'store-choice-2', onSuccess: 'armor-low-level', consequences: 'coin-=2000' }
        ],
        autoplay: { script: 'np-armor'},
    },
    'shop': {
        video: 'video.mp4',
        from: 35.13,
        // from: 29,
        to: 41.63,
        interactions: [
            { from: 36.73, to: 41.63, src: 'cheap', typeOfInteraction: 'tap', htmlTag: 'store-choice-1', onSuccess: 'no-armor' },
            { from: 36.73, to: 41.63, src: 'pricey', typeOfInteraction: 'tap', htmlTag: 'store-choice-2', conditions: 'coin>=2000', onSuccess: 'armor-low-level', consequences: 'coin-=2000' }
        ],
        autoplay: {script: 'no-armor'},
    },
    'no-armor': {
        video: 'video.mp4',
        from: 41.63,
        to: 42.8,
        interactions: [
            // { from: 36.73, to: 41.63, src: 'btn_character', typeOfInteraction: 'tap', htmlTag: 'path-choice-2', onSuccess: '' }
        ],
        autoplay: {script: ''},
    },
    'armor-low-level': {
        video: 'video.mp4',
        from: 42.9,
        to: 45,
        interactions: [
            // { from: 42.9, to: 45, src: 'btn_character', typeOfInteraction: 'tap', htmlTag: 'path-choice-2', onSuccess: '' }
        ],
        autoplay: {script: ''}
    }
};

//============Variables and Flags used within the Video PIEC script to apply conditions and consequences=================
PiecSettings.variables = {
    'projectileSuccess' : {
        value: false,
    },

};

//===================================Collectible Component====================================

PiecSettings.collectibles = {
    'coins': {
        src: 'coin',
        htmlTag: 'coin-container',
        initialValue: 0,
        valueRange: {min: 0, max: 100000},
        eachItemCountsAs: 300,
        counter: {
            tag: 'coin-counter',    //tag has to be [ELEMENT]-counter
            htmlTag: 'coin-counter',
            iconSrc: 'coinStack',
            backgroundSrc: 'wallet', // counter's background source
                                     // if it's a progress bar, name it the same as the name of the bar
                                     // like: healthBar, because the fill will be automatically called healthBar-fill
            style: 'number', //choose among number, rectangle_progressbar, circle_progressbar 

        },
        onCollectEffects: ['flyToGoal'],
    },
    // 'coins': {
    //     src: 'coin',
    //     htmlTag: 'coin-container',
    //     initialValue: 100,
    //     valueRange: {min: 0, max: 100},
    //     eachItemCountsAs: -30, // if <0, then decrease the value
    //     counter: {
    //         tag: 'health-counter',
    //         htmlTag: 'health-counter',
    //         iconSrc: 'coinStack',
    //         backgroundSrc: 'healthBar', // counter's background source
    //                                  // if it's a progress bar, name it the same as the name of the bar
    //                                  // like: healthBar, because the fill will be automatically called healthBar-fill
    //         style: 'rectangle_progressbar', //choose among number, rectangle_progressbar, circle_progressbar 

    //     },
    //     onCollectEffects: ['flyToGoal'],
    // },
    // 'coins': {
    //     src: 'coin',
    //     htmlTag: 'coin-container',
    //     initialValue: 0,
    //     valueRange: {min: 0, max: 100},
    //     eachItemCountsAs: 30,
    //     counter: {
    //         tag: 'health-counter',
    //         htmlTag: 'health-counter',
    //         iconSrc: 'coinStack',
    //         backgroundSrc: 'circleBar', // counter's background source
    //                                  // if it's a progress bar, name it the same as the name of the bar
    //                                  // like: healthBar, because the fill will be automatically called healthBar-fill
    //         style: 'circle_progressbar', //choose among number, rectangle_progressbar, circle_progressbar 

    //     },
    //     onCollectEffects: ['flyToGoal'],
    // },

};

// PiecSettings.uiElement
// PiecSettings.HudElement = {
//     'coin-counter' : {
//         htmlTag: 'coin-counter',
//         iconSrc: 'coinStack',
//         backgroundSrc: 'wallet', // counter's background source
//                                  // if it's a progress bar, name it the same as the name of the bar
//                                  // like: healthBar, because the fill will be automatically called healthBar-fill
//         style: 'number', //choose among number, rectangle_progressbar, circle_progressbar 

//     }
// }
//====================================Projectile component mini game=========================

PiecSettings.minigames = {
    'projectile': {
        type: 'projectile',
        src: 'projectile',
        direction: 'inverse', // ('same', 'inverse', 'random')
                              //if the direction is different from the assets, choose inverse, otherwise, same
        amount: 3,
    },
};

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