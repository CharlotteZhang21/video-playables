var PiecSettings = PiecSettings || {};

PiecSettings.version = "-";

PiecSettings.autoPlay = {
    activateAfter: 3000,
}
PiecSettings.hitToStore = 4; // no hitToStore function, set it as 0;

PiecSettings.closeButtonTimer = true;







///////// SET VIDEO LIST ///////////
PiecSettings.videos = {
    intro: {name: 'video1', startTime: 40, startTime: 43},
    path: {name: 'video2', startTime: 0, endTime: 45}
}

PiecSettings.audio = {
    name: 'bgmusic',
    type: 'mp3',
    startTime: 0
}



//////// DEFAULT SETTINGS FOR SLOT GAMES ////////

PiecSettings.winlinePalette = [0xfdf9c6, 0xf3d868, 0xc98e43, 0xff8247, 0xfaed60, 0xeba22c]; //Colours used by the winlines
PiecSettings.fontColor = "#ffffff"; //Remove empty if you want to use the default golden gradient
PiecSettings.fontFamily = "Contemporary"; //Make sure that this font is on the css and that there is a div that uses it. (preload-font div)

PiecSettings.tooltip = { // Tooltip overlays the grid-background
    // text: "SPIN TO\nWIN!",
    // fontColor: "#ffffff", //Remove if you want to use the default golden gradient
    // src: 'tooltip.png',
    src: 'dark_overlay.png',
    // // container: "grid-background", 
    firstHandPosition: [1,1],
    secondHandPosition: [2,1]
};

/////// SET THE AUTOPLAY AND ALWAYS END UP VICTORY //////

PiecSettings.alwaysWin = false;

/////// FINAL OVERLAY SCREEN SETTINGS ///////

PiecSettings.finalOverlay = {
    color: 0x000000,
    alpha: 0.6,
    delay: 3000,
};

PiecSettings.characterSettings = [
    { //KNIGHT BACK
        idleAnimIndex:2, //index of animation in pngAnimations array
        attackAnimIndex:3,
        attackEffectAnimIndex:5,

        dieAnimIndex: 14,

        enemy: false,

        lifeBarYPos: .7, // The bigger this value, the higher
        icon: 'blue-icon', // Will appear next to the life bar

        scaleLandscape: .38, //scale as factor of height for landscape
        scalePortrait: .24, //scale as factor of height for portrait
        xPos: .25, //anchor is on 0.5,0.5. xPos as a percentile of total screen width
        yPos: .28, //yPos as percentile of total screen height
    },
    { //DARK KNIGHT BACK
        idleAnimIndex:9, //index of animation in pngAnimations array
        attackAnimIndex:10,
        dieAnimIndex:12,

        enemy: true,

        lifeBarYPos: .9, // The bigger this value, the higher
        icon: 'purple-icon', // Will appear next to the life bar

        scaleLandscape: .33, //scale as factor of height for landscape
        scalePortrait: .22, //scale as factor of height for portrait
        xPos: .7, //anchor is on 0.5,0.5. xPos as a percentile of total screen width
        yPos: .28, //yPos as percentile of total screen height

        flipped: true,
    },
    { //GIRL
        idleAnimIndex:0, //index of animation in pngAnimations array
        attackAnimIndex:1,
        attackEffectAnimIndex:4,

        dieAnimIndex: 13,

        enemy: false,

        lifeBarYPos: .6, // The bigger this value, the higher
        icon: 'blue-icon', // Will appear next to the life bar

        scaleLandscape: .48, //scale as factor of height for landscape
        scalePortrait: .3, //scale as factor of height for portrait
        xPos: .15, //anchor is on 0.5,0.5. xPos as a percentile of total screen width
        yPos: .42, //yPos as percentile of total screen height
    },
    { //ZOMBIE BACK
        idleAnimIndex:6, //index of animation in pngAnimations array
        attackAnimIndex:7,
        attackEffectAnimIndex:8,
        attackEffectStyle: "cast", // "cast" the attack effect renders on the character casting it, and then it's shooted at the enemies
                                    // "default", the attack renders on the enemy spot.
        dieAnimIndex:11,

        enemy: true,

        lifeBarYPos: .75, // The bigger this value, the higher
        icon: 'death-icon', // Will appear next to the life bar

        scaleLandscape: .38, //scale as factor of height for landscape
        scalePortrait: .23, //scale as factor of height for portrait
        xPos: .85, //anchor is on 0.5,0.5. xPos as a percentile of total screen width
        yPos: .38, //yPos as percentile of total screen height

        flipped: true,
    },
    { //ZOMBIE FRONT
        idleAnimIndex:6, //index of animation in pngAnimations array
        attackAnimIndex:7,
        attackEffectAnimIndex:8,
        attackEffectStyle: "cast", // "cast" the attack effect renders on the character casting it, and then it's shooted at the enemies
                                    // "default" or leaving it empty, the attack renders on the enemy spot.
        dieAnimIndex:11,

        enemy: true,

        lifeBarYPos: .75, // The bigger this value, the higher
        icon: 'death-icon', // Will appear next to the life bar

        scaleLandscape: .38, //scale as factor of height for landscape
        scalePortrait: .23, //scale as factor of height for portrait
        xPos: .85, //anchor is on 0.5,0.5. xPos as a percentile of total screen width
        yPos: .52, //yPos as percentile of total screen height

        flipped: true,
    },
    { //KNIGHT FRONT
        idleAnimIndex:2, //index of animation in pngAnimations array
        attackAnimIndex:3,
        attackEffectAnimIndex:5,

        dieAnimIndex: 14,

        enemy: false,

        lifeBarYPos: .7, // The bigger this value, the higher
        icon: 'blue-icon', // Will appear next to the life bar

        scaleLandscape: .38, //scale as factor of height for landscape
        scalePortrait: .24, //scale as factor of height for portrait
        xPos: .25, //anchor is on 0.5,0.5. xPos as a percentile of total screen width
        yPos: .68, //yPos as percentile of total screen height
    },
    { //DARK KNIGHT FRONT
        idleAnimIndex:9, //index of animation in pngAnimations array
        attackAnimIndex:10,
        dieAnimIndex:12,
        // attackEffectAnimIndex:9,

        enemy: true,

        lifeBarYPos: .9, // The bigger this value, the higher
        icon: 'purple-icon', // Will appear next to the life bar

        scaleLandscape: .33, //scale as factor of height for landscape
        scalePortrait: .22, //scale as factor of height for portrait
        xPos: .7, //anchor is on 0.5,0.5. xPos as a percentile of total screen width
        yPos: .7, //yPos as percentile of total screen height

        flipped: true,
    },
];

PiecSettings.playerCharacters = [0,2,5];
PiecSettings.nonPlayerCharacters = [1,3,4,6];

PiecSettings.battleScript = [
    [ //new interaction
        {a: "attack", from: 3, delay:300, damage: 9}, //damange is in % of total health
        {a: "attack", from: 4, delay:1000, damage: 10},
        {a: "attackAndFly", from: 6, to: 0, delay: 1000, damage: 20, effect:"shake"},
        {a: "attackAndFly", from: 1, to: 0, delay: 1000, damage: 20, effect:"shake"},
    ],                                           //"a" is an action, "from" specifies the id of the attacker, "to" is optional, and specifies who is attacked
        //delay specifies the delay from the previous action. 0 to play both together
        //"a" can be "attack" "attackAndFly", "interaction" 
    [ //new interaction. After the above block, the player needs to tap the screen to continue
        {a: "attackAndFly", from: 0, to: 6, delay:500, damage: 50 , effect:"shake"}
    ],
    [
        {a: "attackAndFly", from: 5, to: 6, delay:500, damage: 50, effect:"shake"}
    ],
    [
        {a: "attackAndFly", from: 2, to: 1, delay:500, damage: 50}
    ],
    [
        {a: "attackAndFly", from: 1, to: 0, delay:400, damage: 20},
        {a: "attack", from: 3, to: 0, delay: 800, damage: 7},
        {a: "attack", from: 4, to: 5, delay: 800, damage: 7}
    ],
    [
        {a: "attack", from: 2, delay:500, damage: 100, effect:"shake-big"}
    ]
];

//if no reaction then run this script
PiecSettings.enemyAttackScript = [
    [
        {a: "attack", from: 3, delay: 500, damage: 100, effect:"shake-big"}
    ]

]

PiecSettings.pngAnimations = [
    {//0
        src: 'girl_stand.png',
        spriteWidth: 1300/7,
        spriteHeight: 454/2,
        spriteNumber: 10,
        loops: 0,
        delay: 0,
        fps: 13,
        isReversed: false,
    },
    {//1
        src: 'girl_attack.png',
        spriteWidth: 1300/4,
        spriteHeight: 747/3,
        spriteNumber: 9,
        loops: 1,
        delay: 0,
        fps: 14,
        isReversed: false,
    },
    {//2
        src: 'knight_stand.png',
        spriteWidth: 700/5,
        spriteHeight: 438/2,
        spriteNumber: 8,
        loops: 0,
        delay: 0,
        fps: 10,
        isReversed: false,
    },
    {//3
        src: 'knight_attack.png',
        spriteWidth: 800/2,
        spriteHeight: 703/3,
        spriteNumber: 5,
        loops: 1,
        delay: 0,
        fps: 13,
        isReversed: false,
        persistent: true,
    },
    {//4
        src: 'explosion_attack.png',
        spriteWidth: 300,
        spriteHeight: 479,
        spriteNumber: 6,
        loops: 1,
        delay: 300,
        fps: 13,
        isReversed: false,
    },
    {//5
        src: 'sword_anim.png',
        spriteWidth: 800/5,
        spriteHeight: 794/2,
        spriteNumber: 10,
        loops: 1,
        delay: 150,
        fps: 13,
        isReversed: false,
    },
    {//6
        src: 'zombie_stand.png',
        spriteWidth: 700/5,
        spriteHeight: 488/2,
        spriteNumber: 10,
        loops: 0,
        delay: 0,
        fps: 11,
        isReversed: false,
    },
    {//7
        src: 'zombie_attack.png',
        spriteWidth: 660/3,
        spriteHeight: 712/3,
        spriteNumber: 8,
        loops: 1,
        delay: 0,
        fps: 12,
        isReversed: false,
    },
    {//8
        src: 'freeze_anim.png',
        spriteWidth: 250,
        spriteHeight: 260,
        spriteNumber: 9,
        loops: 1,
        delay: 0,
        fps: 8,
        isReversed: false,
        persistent: true,
        aligned: "middle", //aligned to bottom of character
    },
    {//9
        src: 'dark_stand.png',
        spriteWidth: 600/2,
        spriteHeight: 641/3,
        spriteNumber: 5,
        loops: 0,
        delay: 0,
        fps: 8,
        isReversed: false,
    },
    {//10
        src: 'dark_attack.png',
        spriteWidth: 750/3,
        spriteHeight: 767/4,
        spriteNumber: 11,
        loops: 1,
        delay: 0,
        fps: 22,
        isReversed: false,
        persistent: true,
    },
    {//11
        src: 'zombie_dead.png',
        spriteWidth: 920/4,
        spriteHeight: 416/2,
        spriteNumber: 7,
        loops: 1,
        delay: 0,
        fps: 12,
        isReversed: false,
        persistent: true,
        scale: 1.2,
    },
    {//12
        src: 'dark_dead.png',
        spriteWidth: 920/4,
        spriteHeight: 489/3,
        spriteNumber: 11,
        loops: 1,
        delay: 0,
        fps: 12,
        isReversed: false,
        persistent: true,
    },
    {//13
        src: 'girl_dead.png',
        spriteWidth: 1000/5,
        spriteHeight: 436/2,
        spriteNumber: 10,
        loops: 1,
        delay: 0,
        fps: 13,
        isReversed: false,
        persistent: true,
    },
    {//14
        src: 'knight_dead.png',
        spriteWidth: 1000/5,
        spriteHeight: 324/2,
        spriteNumber: 10,
        loops: 1,
        delay: 0,
        fps: 13,
        isReversed: false,
        persistent: true,
    }
];