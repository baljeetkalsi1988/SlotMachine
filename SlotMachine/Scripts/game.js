/// <reference path="typings/stats/stats.d.ts" />
/// <reference path="typings/easeljs/easeljs.d.ts" />
/// <reference path="typings/tweenjs/tweenjs.d.ts" />
/// <reference path="typings/soundjs/soundjs.d.ts" />
/// <reference path="typings/preloadjs/preloadjs.d.ts" />
/// <reference path="../config/constants.ts" />
/// <reference path="../objects/label.ts" />
/// <reference path="../objects/button.ts" />
// Game Framework Variables
var canvas = document.getElementById("canvas");
var stage;
var stats;
var assets;
var power = true;
// Images Manifest
var manifest = [
    { id: "background", src: "assets/images/slotMachine.png" },
    { id: "clicked", src: "assets/audio/clicked.wav" },
    { id: "BananaSymbol", src: "assets/images/bananaSymbol.png" },
    { id: "BarSymbol", src: "assets/images/barSymbol.png" },
    { id: "BellSymbol", src: "assets/images/bellSymbol.png" },
    { id: "CherrySymbol", src: "assets/images/cherrySymbol.png" },
    { id: "GrapesSymbol", src: "assets/images/grapesSymbol.png" },
    { id: "OrangeSymbol", src: "assets/images/orangeSymbol.png" },
    { id: "SevenSymbol", src: "assets/images/sevenSymbol.png" },
    { id: "blankSymbol", src: "assets/images/blankSymbol.png" },
    { id: "power", src: "assets/images/power.png" },
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
var background;
// Reel1 Bitmap variable
var reel1;
var reel2;
var reel3;
var textureAtlas;
// Button variable
var spinButton;
var resetButton;
var betOneButton;
var betTenButton;
var betMaxButton;
var powerbutton;
//Label Variable
var jackPotLabel;
var creditsLabel;
var betLabel;
var resultLabel;
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
var winRatio = 0; // win ratio
var playerMoney = 1000;
var winnings = 0;
var jackpot = 4000;
var turn = 0;
var playerBet = 0;
var winNumber = 0;
var lossNumber = 0;
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
/* Utility function to show Playe stats and Jackpot Label and Credit Label  Values*/
function showPlayerStats() {
    winRatio = winNumber / turn;
    console.log("Jackpot: " + jackpot);
    console.log("Player Money: " + playerMoney);
    console.log("Turn: " + turn);
    console.log("Wins: " + winNumber);
    console.log("Losses: " + lossNumber);
    console.log("Win Ratio: " + (winRatio * 100).toFixed(2) + "%");
    stage.removeChild(jackPotLabel);
    stage.removeChild(creditsLabel);
    // Jackpot Label values added
    jackPotLabel = new objects.Label("" + jackpot, 161, 100, true); //145+16, 96+4
    stage.addChild(jackPotLabel);
    // Credit Label values added
    creditsLabel = new objects.Label("" + playerMoney, 57, 307, true);
    stage.addChild(creditsLabel);
}
/* Utility function to reset all fruit tallies */
function resetFruitTally() {
    grapes = 0;
    bananas = 0;
    oranges = 0;
    cherries = 0;
    bars = 0;
    bells = 0;
    sevens = 0;
    blanks = 0;
}
//Reset All Values function
function resetAll() {
    playerMoney = 1000;
    winnings = 0;
    jackpot = 4000;
    turn = 0;
    playerBet = 0;
    winNumber = 0;
    lossNumber = 0;
    winRatio = 0;
}
/* Jackpot Function compare two random values */
function checkJackPot() {
    var jackPotTry = Math.floor(Math.random() * 51 + 1);
    var jackPotWin = Math.floor(Math.random() * 51 + 1);
    if (jackPotTry == jackPotWin) {
        alert("You Won the $" + jackpot + " Jackpot!!");
        playerMoney += jackpot;
        jackpot = 1000;
    }
}
/* Utility function to show a win message and Dispay result*/
function showWinMessage() {
    playerMoney += winnings;
    console.log("You Won: $" + winnings);
    stage.removeChild(resultLabel);
    resultLabel = new objects.Label("" + winnings, 263, 307, true);
    stage.addChild(resultLabel);
    resetFruitTally();
    checkJackPot();
}
/* Utility function to show a loss message and Show player money and result */
function showLossMessage() {
    playerMoney -= playerBet;
    console.log("You Lost!");
    stage.removeChild(resultLabel);
    resultLabel = new objects.Label("0", 263, 307, true);
    stage.addChild(resultLabel);
    resetFruitTally();
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
            case checkRange(outCome[spin], 1, 27):
                betLine[spin] = "blank";
                blanks++;
                break;
            case checkRange(outCome[spin], 28, 37):
                betLine[spin] = "Grapes";
                grapes++;
                break;
            case checkRange(outCome[spin], 38, 46):
                betLine[spin] = "Banana";
                bananas++;
                break;
            case checkRange(outCome[spin], 47, 54):
                betLine[spin] = "Orange";
                oranges++;
                break;
            case checkRange(outCome[spin], 55, 59):
                betLine[spin] = "Cherry";
                cherries++;
                break;
            case checkRange(outCome[spin], 60, 62):
                betLine[spin] = "Bar";
                bars++;
                break;
            case checkRange(outCome[spin], 63, 64):
                betLine[spin] = "Bell";
                bells++;
                break;
            case checkRange(outCome[spin], 65, 65):
                betLine[spin] = "Seven";
                sevens++;
                break;
        }
    }
    return betLine;
}
// Caluculate player winning and losing amount
function determineWinnings() {
    if (blanks == 0) {
        if (grapes == 3) {
            winnings = playerBet * 10;
        }
        else if (bananas == 3) {
            winnings = playerBet * 20;
        }
        else if (oranges == 3) {
            winnings = playerBet * 30;
        }
        else if (cherries == 3) {
            winnings = playerBet * 40;
        }
        else if (bars == 3) {
            winnings = playerBet * 50;
        }
        else if (bells == 3) {
            winnings = playerBet * 75;
        }
        else if (sevens == 3) {
            winnings = playerBet * 100;
        }
        else if (grapes == 2) {
            winnings = playerBet * 2;
        }
        else if (bananas == 2) {
            winnings = playerBet * 2;
        }
        else if (oranges == 2) {
            winnings = playerBet * 3;
        }
        else if (cherries == 2) {
            winnings = playerBet * 4;
        }
        else if (bars == 2) {
            winnings = playerBet * 5;
        }
        else if (bells == 2) {
            winnings = playerBet * 10;
        }
        else if (sevens == 2) {
            winnings = playerBet * 20;
        }
        else if (sevens == 1) {
            winnings = playerBet * 5;
        }
        else {
            winnings = playerBet * 1;
        }
        winNumber++;
        showWinMessage();
    }
    else {
        lossNumber++;
        showLossMessage();
    }
}
//Adding Images to Reel
function addimages() {
    //Adding images to reel1
    stage.removeChild(reel1);
    reel1 = new createjs.Bitmap(assets.getResult(spinResult[0] + "Symbol"));
    reel1.regX = reel1.getBounds().width * 0.5;
    reel1.regY = reel1.getBounds().height * 0.5;
    reel1.x = 85; // 53+32
    reel1.y = 205;
    stage.addChild(reel1);
    //Adding images to reel2
    stage.removeChild(reel2);
    reel2 = new createjs.Bitmap(assets.getResult(spinResult[1] + "Symbol"));
    reel2.regX = reel2.getBounds().width * 0.5;
    reel2.regY = reel2.getBounds().height * 0.5;
    reel2.x = 161;
    reel2.y = 205;
    stage.addChild(reel2);
    //Adding images to reel3
    stage.removeChild(reel3);
    reel3 = new createjs.Bitmap(assets.getResult(spinResult[2] + "Symbol"));
    reel3.regX = reel3.getBounds().width * 0.5;
    reel3.regY = reel3.getBounds().height * 0.5;
    reel3.x = 236;
    reel3.y = 205;
    stage.addChild(reel3);
}
//Labels and images reset Function
function lab_img_reset() {
    stage.removeChild(reel1);
    stage.removeChild(reel2);
    stage.removeChild(reel3);
    stage.removeChild(jackPotLabel);
    stage.removeChild(creditsLabel);
    stage.removeChild(betLabel);
    stage.removeChild(resultLabel);
    jackPotLabel = new objects.Label("" + jackpot, 161, 100, true);
    stage.addChild(jackPotLabel);
    creditsLabel = new objects.Label("" + playerMoney, 57, 307, true);
    stage.addChild(creditsLabel);
    betLabel = new objects.Label("" + playerBet, 161, 307, true);
    stage.addChild(betLabel);
    resultLabel = new objects.Label("" + winnings, 263, 307, true);
    stage.addChild(resultLabel);
}
// Callback function that allows me to respond to button click events
function spinButtonClicked(event) {
    createjs.Sound.play("clicked");
    if (playerMoney == 0) {
        if (confirm("You ran out of Money! \n Do you want to play again?")) {
            resetAll();
            showPlayerStats();
            lab_img_reset();
        }
    }
    else if (playerBet > playerMoney) {
        alert("You don't have enough Money to place that bet.");
    }
    else if (playerBet < 0) {
        alert("All bets must be a positive $ amount.");
    }
    else if (playerBet == 0) {
        alert("Please Enter Bet amount");
    }
    else if (playerBet <= playerMoney) {
        spinResult = Reels();
        fruits = spinResult[0] + " - " + spinResult[1] + " - " + spinResult[2];
        console.log(fruits);
        addimages();
        determineWinnings();
        turn++;
        showPlayerStats();
    }
    else {
        alert("Please enter a valid bet amount");
    }
}
// Reset Button Click event
function resetButtonClicked(event) {
    createjs.Sound.play("clicked");
    resetFruitTally();
    resetAll();
    lab_img_reset();
}
// betoneButton Click event
function betOneButtonClicked(event) {
    createjs.Sound.play("clicked");
    console.log("Betone");
    playerBet = 1;
    stage.removeChild(betLabel);
    betLabel = new objects.Label("" + playerBet, 161, 307, true);
    stage.addChild(betLabel);
}
// betenButton Click event
function betTenButtonClicked(event) {
    createjs.Sound.play("clicked");
    playerBet = 10;
    stage.removeChild(betLabel);
    betLabel = new objects.Label("" + playerBet, 161, 307, true);
    stage.addChild(betLabel);
}
// betmaxButton Click event
function betMaxButtonClicked(event) {
    createjs.Sound.play("clicked");
    playerBet = 100;
    stage.removeChild(betLabel);
    betLabel = new objects.Label("" + playerBet, 161, 307, true);
    stage.addChild(betLabel);
}
// Power click event
function powerButtonClicked(event) {
    createjs.Sound.play("clicked");
    resetFruitTally();
    resetAll();
    lab_img_reset();
    if (power == true) {
        powerbutton.alpha = 0.5;
        spinButton.mouseEnabled = false;
        resetButton.mouseEnabled = false;
        betOneButton.mouseEnabled = false;
        betMaxButton.mouseEnabled = false;
        betTenButton.mouseEnabled = false;
        power = false;
    }
    else {
        powerbutton.alpha = 1.0;
        spinButton.mouseEnabled = true;
        resetButton.mouseEnabled = true;
        betOneButton.mouseEnabled = true;
        betMaxButton.mouseEnabled = true;
        betTenButton.mouseEnabled = true;
        power = true;
    }
}
// Our Main Game Function
function main() {
    // add in slot machine graphic
    background = new createjs.Bitmap(assets.getResult("background"));
    stage.addChild(background);
    //Adding Power image
    stage.removeChild(powerbutton);
    powerbutton = new createjs.Bitmap(assets.getResult("power"));
    powerbutton.regX = powerbutton.getBounds().width * 0.5;
    powerbutton.regY = powerbutton.getBounds().height * 0.5;
    powerbutton.x = 70;
    powerbutton.y = 85;
    powerbutton.on("click", powerButtonClicked, this);
    stage.addChild(powerbutton);
    //Adding intial values to Background
    stage.removeChild(jackPotLabel);
    stage.removeChild(creditsLabel);
    stage.removeChild(betLabel);
    stage.removeChild(resultLabel);
    jackPotLabel = new objects.Label("" + jackpot, 161, 100, true);
    stage.addChild(jackPotLabel);
    creditsLabel = new objects.Label("" + playerMoney, 57, 307, true);
    stage.addChild(creditsLabel);
    betLabel = new objects.Label("" + playerBet, 161, 307, true);
    stage.addChild(betLabel);
    resultLabel = new objects.Label("" + winnings, 263, 307, true);
    stage.addChild(resultLabel);
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
//# sourceMappingURL=game.js.map