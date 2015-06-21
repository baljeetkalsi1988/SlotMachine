﻿/// <reference path="typings/stats/stats.d.ts" />
/// <reference path="typings/easeljs/easeljs.d.ts" />
/// <reference path="typings/tweenjs/tweenjs.d.ts" />
/// <reference path="typings/soundjs/soundjs.d.ts" />
/// <reference path="typings/preloadjs/preloadjs.d.ts" />

/// <reference path="../config/constants.ts" />
/// <reference path="../objects/label.ts" />
/// <reference path="../objects/button.ts" />




// Game Framework Variables
///hello

var canvas = document.getElementById("canvas");
var stage: createjs.Stage;
var stats: Stats;

var assets: createjs.LoadQueue;
var manifest = [
    { id: "background", src: "assets/images/slotMachine.png" },
    { id: "image1", src: "assets/images/image1.png" },
    { id: "clicked", src: "assets/audio/clicked.wav" },


];

var atlas = {
    "images": ["assets/images/atlas.png"],
    "frames": [

        [2, 2, 64, 64],
        [2, 68, 64, 64],
        [2, 134, 64, 64],
        [200, 2, 49, 49],
        [200, 53, 49, 49],
        [200, 104, 49, 49],
        [68, 2, 64, 64],
        [134, 2, 64, 64],
        [68, 68, 64, 64],
        [134, 68, 64, 64],
        [134, 134, 49, 49],
        [68, 134, 64, 64],
        [185, 155, 49, 49]
    ],
    "animations": {

        "bananaSymbol": [0],
        "barSymbol": [1],
        "bellSymbol": [2],
        "betMaxButton": [3],
        "betOneButton": [4],
        "betTenButton": [5],
        "blankSymbol": [6],
        "cherrySymbol": [7],
        "grapesSymbol": [8],
        "orangeSymbol": [9],
        "resetButton": [10],
        "sevenSymbol": [11],
        "spinButton": [12]
    }
};


// Game Variables
var background: createjs.Bitmap;
var image1: createjs.Bitmap;
var textureAtlas: createjs.SpriteSheet;
var spinButton: objects.Button;
var resetButton: objects.Button;
var betOneButton: objects.Button;
var betTenButton: objects.Button;
var betMaxButton: objects.Button;


/* Tally Variables */
var grapes = 0;
var bananas = 0;
var oranges = 0;
var cherries = 0;
var bars = 0;
var bells = 0;
var sevens = 0;
var blanks = 0;

var spinResult;
var fruits = "";

// Preloader Function
function preload() {
    assets = new createjs.LoadQueue();
    assets.installPlugin(createjs.Sound);
    // event listener triggers when assets are completely loaded
    assets.on("complete", init, this); 
    assets.loadManifest(manifest);

    // Load Texture Atlas
    textureAtlas = new createjs.SpriteSheet(atlas);

    //Setup statistics object
    setupStats();
}

// Callback function that initializes game objects
function init() {
    stage = new createjs.Stage(canvas); // reference to the stage
    stage.enableMouseOver(20);
    createjs.Ticker.setFPS(60); // framerate 60 fps for the game
    // event listener triggers 60 times every second
    createjs.Ticker.on("tick", gameLoop); 

    // calling main game function
    main();
}

// function to setup stat counting
function setupStats() {
    stats = new Stats();
    stats.setMode(0); // set to fps

    // align bottom-right
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.left = '330px';
    stats.domElement.style.top = '10px';

    document.body.appendChild(stats.domElement);
}


// Callback function that creates our Main Game Loop - refreshed 60 fps
function gameLoop() {
    stats.begin(); // Begin measuring

    stage.update();

    stats.end(); // end measuring
}

/* Utility function to check if a value falls within a range of bounds */
function checkRange(value, lowerBounds, upperBounds) {
    if (value >= lowerBounds && value <= upperBounds) {
        return value;
    }
    else {
        return !value;
    }
}

/* When this function is called it determines the betLine results.
e.g. Bar - Orange - Banana */
function Reels() {
    var betLine = [" ", " ", " "];
    var outCome = [0, 0, 0];

    for (var spin = 0; spin < 3; spin++) {
        outCome[spin] = Math.floor((Math.random() * 65) + 1);
        switch (outCome[spin]) {
            case checkRange(outCome[spin], 1, 27):  // 41.5% probability
                betLine[spin] = "blank";
                blanks++;
                break;
            case checkRange(outCome[spin], 28, 37): // 15.4% probability
                betLine[spin] = "Grapes";
                grapes++;
                break;
            case checkRange(outCome[spin], 38, 46): // 13.8% probability
                betLine[spin] = "Banana";
                bananas++;
                break;
            case checkRange(outCome[spin], 47, 54): // 12.3% probability
                betLine[spin] = "Orange";
                oranges++;
                break;
            case checkRange(outCome[spin], 55, 59): //  7.7% probability
                betLine[spin] = "Cherry";
                cherries++;
                break;
            case checkRange(outCome[spin], 60, 62): //  4.6% probability
                betLine[spin] = "Bar";
                bars++;
                break;
            case checkRange(outCome[spin], 63, 64): //  3.1% probability
                betLine[spin] = "Bell";
                bells++;
                break;
            case checkRange(outCome[spin], 65, 65): //  1.5% probability
                betLine[spin] = "Seven";
                sevens++;
                break;
        }
    }
    return betLine;
}




// Callback function that allows me to respond to button click events
function spinButtonClicked(event: createjs.MouseEvent) {
    createjs.Sound.play("clicked");

    spinResult = Reels();
    fruits = spinResult[0] + " - " + spinResult[1] + " - " + spinResult[2];

    console.log(fruits);
}

function resetButtonClicked(event: createjs.MouseEvent) {
    createjs.Sound.play("clicked");
    console.log("reset");
}
function betOneButtonClicked(event: createjs.MouseEvent) {
    createjs.Sound.play("clicked");
    console.log("Betone");
}

function betTenButtonClicked(event: createjs.MouseEvent) {
    createjs.Sound.play("clicked");
    console.log("Betten");
}
function betMaxButtonClicked(event: createjs.MouseEvent) {
    createjs.Sound.play("clicked");
    console.log("Bet max");
}




// Our Main Game Function
function main() {
    // add in slot machine graphic
    background = new createjs.Bitmap(assets.getResult("background"));
    stage.addChild(background);


    image1 = new createjs.Bitmap(assets.getResult("image1"));
    
    image1.regX = image1.getBounds().width ;
    image1.regY = image1.getBounds().height;
    image1.x = 53;
    image1.y = 173;
    stage.addChild(image1);





    // add spinButton sprite
    spinButton = new objects.Button("spinButton", 255, 334, false);
    stage.addChild(spinButton);
    spinButton.on("click", spinButtonClicked, this);
    
       // add resetButton sprite
    resetButton = new objects.Button("resetButton", 16, 334, false);
    stage.addChild(resetButton);
    resetButton.on("click", resetButtonClicked, this);

    // add betoneButton sprite
    betOneButton = new objects.Button("betOneButton", 75, 334, false);
    stage.addChild(betOneButton);
    betOneButton.on("click", betOneButtonClicked, this);

    // add betTenButton sprite
    betTenButton = new objects.Button("betTenButton", 135, 334, false);
    stage.addChild(betTenButton);
    betTenButton.on("click", betTenButtonClicked, this);

    // add betMaxButton sprite
    betMaxButton = new objects.Button("betMaxButton", 196, 334, false);
    stage.addChild(betMaxButton);
    betMaxButton.on("click", betMaxButtonClicked, this);



}