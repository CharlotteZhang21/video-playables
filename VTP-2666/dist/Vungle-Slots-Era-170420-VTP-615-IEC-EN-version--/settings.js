var PiecSettings = PiecSettings || {};

PiecSettings.version = "-";

PiecSettings.timer = true;
PiecSettings.asoi = false;

PiecSettings.fontColor = "#ffffff";
PiecSettings.fontFamily = "Contemporary"; //Make sure that this font is on the css and that there is a div that uses it. (preload-font div)

PiecSettings.collectibles = [
	{
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
        // loop: true,
        tips: [
            { text: "Choose your character", htmlTag:'choose-your-character',  src: 'tooltip.png', fontColor: "#ffffff", effect: 'float'},
        ],
        interactions: [
            { from: 0, src: 'btn_character', typeOfInteraction: 'tap', htmlTag: 'character-choice-1', onSuccess: 'male', idleEffect:'pulse', onInteractEffect:'spawnStars'},
            { from: 0, src: 'btn_character', typeOfInteraction: 'tap', htmlTag: 'character-choice-2', onSuccess: 'female' }
        ],
        autoplay: {after: 2000, play: 'male'},
    },
    'male': {
        video: 'video.mp4',
        from: 5.23,
        to: 20.93,
        interactions: [
            { from: 17.6, src: 'btn_character', typeOfInteraction: 'tap', htmlTag: 'path-choice-1', onSuccess: 'intro', idleEffect:'pulse', onInteractEffect:'spawnStars'},
            { from: 17.6, src: 'btn_character', typeOfInteraction: 'tap', htmlTag: 'path-choice-2', onSuccess: 'darkPath' }
            // { when: 'during', typeOfInteraction: 'minigame2', htmlTag: 'collectible-area-1', consequences: 'coins++'},
            // { when: 'onStop', typeOfInteraction: 'swipe', htmlTag: 'interaction-area-1', onSuccess: 'disney2', conditions: 'coins>=100' },
            // { when: 'onStop', typeOfInteraction: 'swipe', htmlTag: 'interaction-area-2', onSuccess: 'disney3', conditions: 'coins>=200' },
            // { when: 'onStop', typeOfInteraction: 'swipe', htmlTag: 'interaction-area-3', onSuccess: 'disney4', conditions: 'coins<100' },
        ]
    },
    'female': {
        video: 'video.mp4',
        from: 0,
        to: 10,
        interactions: [
            { from: 1, to: 3, src: 'btn_character', typeOfInteraction: 'tap', htmlTag: 'path-choice-1', onSuccess: 'intro' }
            // { when: 'onStop', typeOfInteraction: 'minigame1', htmlTag: 'interaction-area-1', onSuccess: 'disney5', onFail: 'disney6', consequences: 'coins+=100' },
        ]
    },
    'brightPath': {
        video: 'video.mp4',
        from: 0,
        to: 10,
        interactions: [
            { from: 1, to: 3, src: 'btn_character', typeOfInteraction: 'tap', htmlTag: 'path-choice-1', onSuccess: 'intro' }
            // { when: 'onStop', typeOfInteraction: 'minigame1', htmlTag: 'interaction-area-1', onSuccess: 'disney5', onFail: 'disney6', consequences: 'coins+=100' },
        ]
    },
    'darkPath': {
        video: 'video.mp4',
        from: 20.93,
        to: 41.63,
        interactions: [
            { from: 30, to: 33.67, src: 'btn_character', typeOfInteraction: 'tap', htmlTag: 'path-choice-2', onSuccess: 'no-armor'},
            { from: 36.73, to: 41.63, src: 'cheap', typeOfInteraction: 'tap', htmlTag: 'store-choice-1', onSuccess: 'no-armor' },
            { from: 36.73, to: 41.63, src: 'pricey', typeOfInteraction: 'tap', htmlTag: 'store-choice-2', onSuccess: 'armor-low-level' }
            // { when: 'onStop', typeOfInteraction: 'minigame1', htmlTag: 'interaction-area-1', onSuccess: 'disney5', onFail: 'disney6', consequences: 'coins+=100' },
        ]
    },
    'no-armor': {
        video: 'video.mp4',
        from: 41.63,
        to: 42.8,
        interactions: [
            { from: 36.73, to: 41.63, src: 'btn_character', typeOfInteraction: 'tap', htmlTag: 'path-choice-2', onSuccess: 'darkPath' }
            // { when: 'onStop', typeOfInteraction: 'minigame1', htmlTag: 'interaction-area-1', onSuccess: 'disney5', onFail: 'disney6', consequences: 'coins+=100' },
        ]
    },
    'armor-low-level': {
        video: 'video.mp4',
        from: 42.9,
        to: 45,
        interactions: [
            { from: 42.9, to: 45, src: 'btn_character', typeOfInteraction: 'tap', htmlTag: 'path-choice-2', onSuccess: 'darkPath' }
            // { when: 'onStop', typeOfInteraction: 'minigame1', htmlTag: 'interaction-area-1', onSuccess: 'disney5', onFail: 'disney6', consequences: 'coins+=100' },
        ]
    }
};


//===================================Collectible Component====================================


//TBD!!! ------------------------------------------------------------------------------------------------------------
PiecSettings.minigames = [
{
    tag: 'minigame1',
    type: 'projectile',
    threshold: 0.3,
    direction: 'left'
},
{
	tag: 'minigame2',
	type: 'collectible',
	object: 'coins',
	//From the mini game we control when are the onSucces/onFail/Consequences events being triggered
	//We trigger consequences every time the user collects a collectible object
}];

//TBD !!!!! -------------------------------------------------------------------------------------------------------
PiecSettings.fxEffects = [
	{
		tag: 'pulse',
		fxReference: 'pulse-burst', //this references to the animation and we can send parameters from above
		amount: 20,
		duration: 50,
		particleSrc: 'star.png',
	}
];

PiecSettings.pngAnimations = []


//Notes for Charlotte + Sandra
//onSuccess/onFail are always playing video.
//consequences are triggered onSuccess as well, but they control parameters of the game, and not the videos.

//Library of FX (particles, like the stars in CNY) where you can change some parameters (the amount, the delay, duration, etc.) + the particlePiecSettings.version = '-';
