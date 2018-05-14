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
    name: 'bgmusic',
    type: 'mp3',
    startTime: 0
}

PiecSettings.script = {
    'intro': {
        video: 'video1.mp4',
        from: 13,
        to: 15,
        tips: [
            { text: "Choose your character", htmlTag:'choose-your-character',  src: 'tooltip.png', fontColor: "#ffffff", effect: 'float'},
        ],
        interactions: [
            { from: 0, to: 5, typeOfInteraction: 'tap', htmlTag: 'interaction-area-1', onSuccess: 'disney2', idleEffect:'pulse', onInteractEffect:'spawnStars'},
            { from: 5, typeOfInteraction: 'tap', htmlTag: 'interaction-area-2', onSuccess: 'disney3' }
        ],
        autoplay: {after: 2000, play: 'disney3'},
    },
    'disney2': {
        video: 'video2.mp4',
        from: 8,
        to: 10,
        interactions: [
            { when: 'during', typeOfInteraction: 'minigame2', htmlTag: 'collectible-area-1', consequences: 'coins++'},
            { when: 'onStop', typeOfInteraction: 'swipe', htmlTag: 'interaction-area-1', onSuccess: 'disney2', conditions: 'coins>=100' },
            { when: 'onStop', typeOfInteraction: 'swipe', htmlTag: 'interaction-area-2', onSuccess: 'disney3', conditions: 'coins>=200' },
            { when: 'onStop', typeOfInteraction: 'swipe', htmlTag: 'interaction-area-3', onSuccess: 'disney4', conditions: 'coins<100' },
        ]
    },
    'disney3': {
        video: 'video2.mp4',
        from: 20,
        to: 22,
        interactions: [
            { when: 'onStop', typeOfInteraction: 'minigame1', htmlTag: 'interaction-area-1', onSuccess: 'disney5', onFail: 'disney6', consequences: 'coins+=100' },
        ]
    },
};


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

//Library of FX (particles, like the stars in CNY) where you can change some parameters (the amount, the delay, duration, etc.) + the particle