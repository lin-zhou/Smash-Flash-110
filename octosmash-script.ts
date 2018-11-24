import {
    Sprite,
    Application,
    Graphics,
    DisplayObject,
    Rectangle
} from "pixi.js";

import {
    alfyn1,
    alfyn2,
    cyrus1,
    cyrus2,
    hannit1,
    hannit2,
    olberic1,
    olberic2,
    ophelia1,
    ophelia2,
    primrose1,
    primrose2,
    therion1,
    therion2,
    tressa1,
    tressa2
} from "./characters-script";

import {
    startStyle,
    style,
    gameTextStyle,
    howToTitleStyle,
    howToStyle,
    selectStyle,
    nameStyle,
    nextStyle,
    activeNextStyle,
    reselectStyle,
    activeReselectStyle,
    playAgainStyle
} from "./fonts-script";


// Note: How To Download Pixi.js (in case you need to reinstall after pulling for COMP class)
// npm install pixi.js
// npm install @types/pixi.js

/* TO FIX
    - Only one player can shoot at a time
        - Not as big of a problem now that players can't hold to shoot
    - Finicky places in the corners of the stage
    - Sometimes can't jump after walking off stage***
*/

/* OTHER THINGS TO DO IF TIME ALLOWS
    - Different colored magic blast sprites either between p1 and p2 or for each character
    - Multiply lives + respawning
    - Sound effects!
    - Replay button --> runGame() method
    - Damage system + hit back further if more damaged
        - Idea
            - Damage property in Player class
            - Hit(Left/Right) functions take in player and change player.sprite.x by +/- (constant + amount of increase * damage taken)
            - Would have to increase damage property's value each time a unit was hit by a magic blast
        - Healing items/other item spawns
    - Nicer title screen
    - Characters who look farther back should appear farther back
        - Low priority
        - Idea
            - Degree of forwardness (give this a different name) property in player class
            - If statements that assign a value for degree of forwardness based on what sprite the player has
                - Can do this during character selection
                - Higher degree of forwardness = more front-appearing
            - If (p1.degreeOfForwardness < p2.degreeOfForwardness), render p1's sprite before p2's
        - Just for appearance reasons
*/

// SET UP - START MENU
const app: Application = new Application(1024 * .85, 576 * .85);
document.body.appendChild(app.view);

// NUMBERS FOR MOTION
const acc: number = 0.08;
const speed: number = 1.5;

// For some reason, we can't loop without this. Maybe try to get rid of it somehow?
class Looper {
    sprite: Sprite;
    constructor(sprite: Sprite) {
        this.sprite = sprite;
    }
}

let loops: Looper[] = [];
for (let i: number = 1; i <= 4; i++) {
    let sprite: Sprite = Sprite.fromImage("nonexistent");
    let loop: Looper = new Looper(sprite);
    loops.push(loop);
}

// MAGIC
class Magic {
    sprite: Sprite;
    x: number = 0;
    y: number = 0;
    direction: number = 1;
    constructor(sprite: Sprite) {
        this.sprite = sprite;
    }
    getPoint(unitX: number, unitY: number): void {
        this.sprite.x += unitX;
        this.sprite.y += unitY;
    }
}

let magicArr: Magic[] = [];
let magicArrTwo: Magic[] = [];

// TWO PLAYER GAME
class Player {
    sprite: Sprite;
    vel: number = 0;
    jumpCount: number = 0;
}

let p1 = new Player();
let p2 = new Player();

// START SCREEN
let startScreen: Sprite = Sprite.fromImage("./Start_Screen.png");
startScreen.scale.x = 34 / 75;
startScreen.scale.y = 34 / 75;
app.stage.addChild(startScreen);

let startMessage = new PIXI.Text("START", startStyle);
startMessage.x = 460;
startMessage.y = 375;
app.stage.addChild(startMessage);

let onHowTo = false;
let choosing = false;

// HOW TO PLAY SCREEN
window.addEventListener("click", (e: MouseEvent): void  => {
    if (!onHowTo && e.x >= 455 && e.x <= 740 && e.y >= 385 && e.y <= 465) {
        console.log("Starting...");
        onHowTo = true;

        // GET RID OF START MENU COMPONENTS
        app.stage.removeChild(startMessage);
        app.stage.removeChild(startScreen);

        const htBG: Sprite = Sprite.fromImage("./how_to_background.png");
        htBG.scale.x = 1088 / 1175;
        htBG.scale.y = 2448 / 2645;
        app.stage.addChild(htBG);

        const black: Graphics = new Graphics();
        black.beginFill(0x000000, .7);
        black.drawRect(0, 0, 1024 * .85, 576 * .85);
        app.stage.addChild(black);

        const howTo = new PIXI.Text("> HOW TO PLAY <", howToTitleStyle);
        howTo.x = 310;
        howTo.y = 25;
        app.stage.addChild(howTo);

        const WASD: Sprite = Sprite.fromImage("./WASD.png");
        WASD.scale.x = .1;
        WASD.scale.y = .1;
        WASD.x = 22;
        WASD.y = 110;
        app.stage.addChild(WASD);

        const p1Move = new PIXI.Text("Player One moves with WASD.", howToStyle);
        p1Move.x = 110;
        p1Move.y = 115;
        app.stage.addChild(p1Move);

        const arrowKeys: Sprite = Sprite.fromImage("./Arrow_Keys.png");
        arrowKeys.scale.x = .3;
        arrowKeys.scale.y = .3;
        arrowKeys.x = 450;
        arrowKeys.y = 112;
        app.stage.addChild(arrowKeys);

        const p2Move = new PIXI.Text("Player Two moves with arrow keys.", howToStyle);
        p2Move.x = 525;
        p2Move.y = 115;
        app.stage.addChild(p2Move);

        const threeKey: Sprite = Sprite.fromImage("./3_Key.png");
        threeKey.x = 37;
        threeKey.y = 200;
        app.stage.addChild(threeKey);

        const p1Attack = new PIXI.Text("Player One attacks using the 3 key.", howToStyle);
        p1Attack.x = 76;
        p1Attack.y = 205;
        app.stage.addChild(p1Attack);

        const backslash: Sprite = Sprite.fromImage("./Backslash_Key.png");
        backslash.scale.x = .19;
        backslash.scale.y = .19;
        backslash.x = 450;
        backslash.y = 197;
        app.stage.addChild(backslash);

        const p2Attack = new PIXI.Text("Player Two attacks with the backslash key.", howToStyle);
        p2Attack.x = 495;
        p2Attack.y = 205;
        app.stage.addChild(p2Attack);

        const explanation0 = new PIXI.Text("Each player can only have four attacks on screen at once.", howToStyle);
        explanation0.x = 200;
        explanation0.y = 285;
        app.stage.addChild(explanation0);

        const explanation1 = new PIXI.Text("Knock your opponent off the screen to win.", howToStyle);
        explanation1.x = 252;
        explanation1.y = 312;
        app.stage.addChild(explanation1);

        const pressToStart = new PIXI.Text("PRESS                                                   TO PLAY", howToTitleStyle);
        pressToStart.x = 134;
        pressToStart.y = 390;
        app.stage.addChild(pressToStart);

        const spacebar: Sprite = Sprite.fromImage("./Space_Bar.png");
        spacebar.scale.x = .9;
        spacebar.scale.y = .9;
        spacebar.x = 235;
        spacebar.y = 373;
        app.stage.addChild(spacebar);

        window.addEventListener("keydown", (e: KeyboardEvent): void  => {
            console.log("To selection...");
            const START: number = 32;
            if (!choosing && e.keyCode === START) {

                // These prevent certain codes from running more times than they're supposed to
                choosing = true;
                let p1choose: boolean = true;
                let p2choose: boolean = false;

                // GET RID OF HOW TO COMPONENTS
                app.stage.removeChild(spacebar);
                app.stage.removeChild(pressToStart);
                app.stage.removeChild(explanation1);
                app.stage.removeChild(explanation0);
                app.stage.removeChild(p2Attack);
                app.stage.removeChild(backslash);
                app.stage.removeChild(p1Attack);
                app.stage.removeChild(threeKey);
                app.stage.removeChild(p2Move);
                app.stage.removeChild(arrowKeys);
                app.stage.removeChild(p1Move);
                app.stage.removeChild(WASD);
                app.stage.removeChild(howTo);
                app.stage.removeChild(black);
                app.stage.removeChild(htBG);
                // Not really necessary but seems to run slightly faster after removing? Might just be my imagination.
                // Could also remove selection screen components after game starts, but there are a lot more things to remove there
                
                // SELECTION SCREEN SETUP
                let selectScreen: Sprite = Sprite.fromImage("./Character_Select.png");
                selectScreen.scale.x = 34 / 75;
                selectScreen.scale.y = 34 / 75;
                app.stage.addChild(selectScreen);
                
                let opheliaName = new PIXI.Text("OPHELIA", nameStyle);
                opheliaName.x = 65;
                opheliaName.y = 105;
                app.stage.addChild(opheliaName);
                
                let cyrusName = new PIXI.Text("CYRUS", nameStyle);
                cyrusName.x = 168;
                cyrusName.y = 105;
                app.stage.addChild(cyrusName);
                
                let tressaName = new PIXI.Text("TRESSA", nameStyle);
                tressaName.x = 263;
                tressaName.y = 105;
                app.stage.addChild(tressaName);
                
                let olbericName = new PIXI.Text("OLBERIC", nameStyle);
                olbericName.x = 354;
                olbericName.y = 105;
                app.stage.addChild(olbericName);
                
                let primroseName = new PIXI.Text("PRIMROSE", nameStyle);
                primroseName.x = 446;
                primroseName.y = 105;
                app.stage.addChild(primroseName);
                
                let alfynName = new PIXI.Text("ALFYN", nameStyle);
                alfynName.x = 555;
                alfynName.y = 105;
                app.stage.addChild(alfynName);
                
                let therionName = new PIXI.Text("THERION", nameStyle);
                therionName.x = 646;
                therionName.y = 105;
                app.stage.addChild(therionName);
                
                let hannitName = new PIXI.Text("H'ANNIT", nameStyle);
                hannitName.x = 743;
                hannitName.y = 105;
                app.stage.addChild(hannitName);

                let choose1 = new PIXI.Text("Player One: Choose Your Character", selectStyle);
                choose1.x = 270;
                choose1.y = 430;
                app.stage.addChild(choose1);
                
                // "BUTTONS"
                let nextBox: Graphics = new Graphics;
                nextBox.beginFill(0x6f6f6f, 0.6);
                nextBox.drawRect(0, 0, 120, 45);
                nextBox.x = 701;
                nextBox.y = 420;
                app.stage.addChild(nextBox);
                
                let reselectBox: Graphics = new Graphics;
                reselectBox.beginFill(0x6f6f6f, 0.6);
                reselectBox.drawRect(0, 0, 170, 45);
                reselectBox.x = 50;
                reselectBox.y = 420;
                app.stage.addChild(reselectBox);

                // "Active" texts are used when a character has been chosen; just for effect       
                let next = new PIXI.Text("NEXT", nextStyle);
                next.x = 712;
                next.y = 421;
                app.stage.addChild(next);
                
                let activeNext = new PIXI.Text("NEXT", activeNextStyle);
                activeNext.x = 712;
                activeNext.y = 421;
                
                let reselect = new PIXI.Text("RESELECT", reselectStyle);
                reselect.x = 59;
                reselect.y = 424;
                app.stage.addChild(reselect);
                
                let activeReselect = new PIXI.Text("RESELECT", activeReselectStyle);
                activeReselect.x = 59;
                activeReselect.y = 424;
                
                let canChoose = true;
                let hasChosen = false;
                
                let blockBox: Graphics = new Graphics();
                
                // PLAYER ONE SELECTION
                window.addEventListener("click", (e: MouseEvent): void  => {
                    if (p1choose && canChoose && e.x >= 55 && e.x <= 145 && e.y >= 125 && e.y <= 402) {
                        console.log("P1 Chose Ophelia");
                        p1.sprite = ophelia1;
                        p1.sprite.x = 210;
                        p1.sprite.y = 205;
                        if (p1.sprite.scale.x >= 0) {
                            p1.sprite.scale.x *= -1;
                        }

                        blockBox = new Graphics();
                        blockBox.beginFill(0xffffff, 0.5);
                        blockBox.drawRect(0, 0, 90, 277);
                        blockBox.x = 50,
                        blockBox.y = 125;
                        app.stage.addChild(blockBox);
                
                        canChoose = false;
                        hasChosen = true;
                
                        app.stage.removeChild(reselect);
                        app.stage.removeChild(next);
                        app.stage.addChild(activeNext);
                        app.stage.addChild(activeReselect);
                    }
                    if (p1choose && canChoose && e.x >= 153 && e.x <= 246 && e.y >= 125 && e.y <= 402) {
                        console.log("P1 Chose Cyrus");
                        p1.sprite = cyrus1;
                        p1.sprite.x = 225;
                        p1.sprite.y = 205;
                        if (p1.sprite.scale.x >= 0) {
                            p1.sprite.scale.x *= -1;
                        }

                        blockBox = new Graphics();
                        blockBox.beginFill(0xffffff, 0.5);
                        blockBox.drawRect(0, 0, 90, 277);
                        blockBox.x = 148,
                        blockBox.y = 125;
                        app.stage.addChild(blockBox);

                        canChoose = false;
                        hasChosen = true;

                        app.stage.removeChild(reselect);
                        app.stage.removeChild(next);
                        app.stage.addChild(activeNext);
                        app.stage.addChild(activeReselect);
                    }
                    if (p1choose && canChoose && e.x >= 252 && e.x <= 342 && e.y >= 125 && e.y <= 402) {
                        console.log("P1 Chose Tressa");
                        p1.sprite = tressa1;
                        p1.sprite.x = 210;
                        p1.sprite.y = 205;
                        if (p1.sprite.scale.x >= 0) {
                            p1.sprite.scale.x *= -1;
                        }

                        blockBox = new Graphics();
                        blockBox.beginFill(0xffffff, 0.5);
                        blockBox.drawRect(0, 0, 91, 277);
                        blockBox.x = 245,
                        blockBox.y = 125;
                        app.stage.addChild(blockBox);

                        canChoose = false;
                        hasChosen = true;

                        app.stage.removeChild(reselect);
                        app.stage.removeChild(next);
                        app.stage.addChild(activeNext);
                        app.stage.addChild(activeReselect);
                    }
                    if (p1choose && canChoose && e.x >= 349 && e.x <= 438 && e.y >= 125 && e.y <= 402) {
                        console.log("P1 Chose Olberic");
                        p1.sprite = olberic1;
                        p1.sprite.x = 225;
                        p1.sprite.y = 205;
                        if (p1.sprite.scale.x >= 0) {
                            p1.sprite.scale.x *= -1;
                        }

                        blockBox = new Graphics();
                        blockBox.beginFill(0xffffff, 0.5);
                        blockBox.drawRect(0, 0, 90, 277);
                        blockBox.x = 342,
                        blockBox.y = 125;
                        app.stage.addChild(blockBox);

                        canChoose = false;
                        hasChosen = true;

                        app.stage.removeChild(reselect);
                        app.stage.removeChild(next);
                        app.stage.addChild(activeNext);
                        app.stage.addChild(activeReselect);
                    }
                    if (p1choose && canChoose && e.x >= 446 && e.x <= 536 && e.y >= 125 && e.y <= 402) {
                        console.log("P1 Chose Primrose");
                        p1.sprite = primrose1;
                        p1.sprite.x = 210;
                        p1.sprite.y = 205;
                        if (p1.sprite.scale.x >= 0) {
                            p1.sprite.scale.x *= -1;
                        }

                        blockBox = new Graphics();
                        blockBox.beginFill(0xffffff, 0.5);
                        blockBox.drawRect(0, 0, 91, 277);
                        blockBox.x = 439,
                        blockBox.y = 125;
                        app.stage.addChild(blockBox);

                        canChoose = false;
                        hasChosen = true;

                        app.stage.removeChild(reselect);
                        app.stage.removeChild(next);
                        app.stage.addChild(activeNext);
                        app.stage.addChild(activeReselect);
                    }
                    if (p1choose && canChoose && e.x >= 544 && e.x <= 634 && e.y >= 125 && e.y <= 402) {
                        console.log("P1 Chose Alfyn");
                        p1.sprite = alfyn1;
                        p1.sprite.x = 212;
                        p1.sprite.y = 205;
                        if (p1.sprite.scale.x >= 0) {
                            p1.sprite.scale.x *= -1;
                        }

                        blockBox = new Graphics();
                        blockBox.beginFill(0xffffff, 0.5);
                        blockBox.drawRect(0, 0, 91, 277);
                        blockBox.x = 536,
                        blockBox.y = 125;
                        app.stage.addChild(blockBox);

                        canChoose = false;
                        hasChosen = true;

                        app.stage.removeChild(reselect);
                        app.stage.removeChild(next);
                        app.stage.addChild(activeNext);
                        app.stage.addChild(activeReselect);
                    }
                    if (p1choose && canChoose && e.x >= 642 && e.x <= 732 && e.y >= 125 && e.y <= 402) {
                        console.log("P1 Chose Therion");
                        p1.sprite = therion1;
                        p1.sprite.x = 217;
                        p1.sprite.y = 205;
                        if (p1.sprite.scale.x >= 0) {
                            p1.sprite.scale.x *= -1;
                        }

                        blockBox = new Graphics();
                        blockBox.beginFill(0xffffff, 0.5);
                        blockBox.drawRect(0, 0, 91, 277);
                        blockBox.x = 633,
                        blockBox.y = 125;
                        app.stage.addChild(blockBox);

                        canChoose = false;
                        hasChosen = true;

                        app.stage.removeChild(reselect);
                        app.stage.removeChild(next);
                        app.stage.addChild(activeNext);
                        app.stage.addChild(activeReselect);
                    }
                    if (p1choose && canChoose && e.x >= 738 && e.x <= 828 && e.y >= 125 && e.y <= 402) {
                        console.log("P1 Chose Hannit");
                        p1.sprite = hannit1;
                        p1.sprite.x = 215;
                        p1.sprite.y = 205;
                        if (p1.sprite.scale.x >= 0) {
                            p1.sprite.scale.x *= -1;
                        }

                        blockBox = new Graphics();
                        blockBox.beginFill(0xffffff, 0.5);
                        blockBox.drawRect(0, 0, 90, 277);
                        blockBox.x = 731,
                        blockBox.y = 125;
                        app.stage.addChild(blockBox);

                        canChoose = false;
                        hasChosen = true;

                        app.stage.removeChild(reselect);
                        app.stage.removeChild(next);
                        app.stage.addChild(activeNext);
                        app.stage.addChild(activeReselect);
                    }
                    if (p1choose && hasChosen && e.x >= 50 && e.x <= 220 && e.y >= 420 && e.y <= 465) {
                        console.log("P1 Unselected");
                        canChoose = true;
                        hasChosen = false;
                
                        app.stage.removeChild(blockBox);
                        app.stage.removeChild(activeReselect);
                        app.stage.removeChild(activeNext);
                        app.stage.addChild(reselect);
                        app.stage.addChild(next);
                    }
                    // "NEXT" --> PLAYER TWO'S SELECTION
                    if (p1choose && hasChosen && e.x >= 701 && e.x <= 827 && e.y >= 428 && e.y <= 473) {
                        console.log("P2's Turn");
                        p1choose = false;
                        p2choose = true;

                        canChoose = true;
                        hasChosen = false;

                        app.stage.removeChild(blockBox);
                        app.stage.removeChild(activeReselect);
                        app.stage.removeChild(activeNext);
                        app.stage.removeChild(choose1);
                
                        let choose2 = new PIXI.Text("Player Two: Choose Your Character", selectStyle);
                        choose2.x = 270;
                        choose2.y = 430;
                        app.stage.addChild(choose2);
                
                        let playBox: Graphics = new Graphics();
                        playBox.beginFill(0x6f6f6f, 0.6);
                        playBox.drawRect(0, 0, 120, 45);
                        playBox.x = 701;
                        playBox.y = 420;
                        app.stage.addChild(playBox);
                
                        let play = new PIXI.Text("PLAY", nextStyle);
                        play.x = 714;
                        play.y = 421;
                        app.stage.addChild(play);
                
                        app.stage.addChild(reselect);
                
                        let activePlay = new PIXI.Text("PLAY", activeNextStyle);
                        activePlay.x = 714;
                        activePlay.y = 421;

                        // PLAYER TWO SELECTION
                        window.addEventListener("click", (e: MouseEvent): void  => {
                            if (p2choose && canChoose && e.x >= 55 && e.x <= 145 && e.y >= 125 && e.y <= 402) {
                                console.log("P2 Chose Ophelia");
                                p2.sprite = ophelia2;
                                p2.sprite.x = 650;
                                p2.sprite.y = 205;

                                blockBox = new Graphics();
                                blockBox.beginFill(0xffffff, 0.5);
                                blockBox.drawRect(0, 0, 90, 277);
                                blockBox.x = 50,
                                blockBox.y = 125;
                                app.stage.addChild(blockBox);

                                canChoose = false;
                                hasChosen = true;

                                app.stage.removeChild(reselect);
                                app.stage.removeChild(play);
                                app.stage.addChild(activePlay);
                                app.stage.addChild(activeReselect);
                            }
                            if (p2choose && canChoose && e.x >= 153 && e.x <= 246 && e.y >= 125 && e.y <= 402) {
                                console.log("P2 Chose Cyrus");
                                p2.sprite = cyrus2;
                                p2.sprite.x = 637;
                                p2.sprite.y = 205;

                                blockBox = new Graphics();
                                blockBox.beginFill(0xffffff, 0.5);
                                blockBox.drawRect(0, 0, 90, 277);
                                blockBox.x = 148,
                                blockBox.y = 125;
                                app.stage.addChild(blockBox);

                                canChoose = false;
                                hasChosen = true;

                                app.stage.removeChild(reselect);
                                app.stage.removeChild(play);
                                app.stage.addChild(activePlay);
                                app.stage.addChild(activeReselect);
                            }
                            if (p2choose && canChoose && e.x >= 252 && e.x <= 342 && e.y >= 125 && e.y <= 402) {
                                console.log("P2 Chose Tressa");
                                p2.sprite = tressa2;
                                p2.sprite.x = 655;
                                p2.sprite.y = 205;

                                blockBox = new Graphics();
                                blockBox.beginFill(0xffffff, 0.5);
                                blockBox.drawRect(0, 0, 91, 277);
                                blockBox.x = 245,
                                blockBox.y = 125;
                                app.stage.addChild(blockBox);

                                canChoose = false;
                                hasChosen = true;

                                app.stage.removeChild(reselect);
                                app.stage.removeChild(play);
                                app.stage.addChild(activePlay);
                                app.stage.addChild(activeReselect);
                            }
                            if (p2choose && canChoose && e.x >= 349 && e.x <= 438 && e.y >= 125 && e.y <= 402) {
                                console.log("P2 Chose Olberic");
                                p2.sprite = olberic2;
                                p2.sprite.x = 640;
                                p2.sprite.y = 205;

                                blockBox = new Graphics();
                                blockBox.beginFill(0xffffff, 0.5);
                                blockBox.drawRect(0, 0, 90, 277);
                                blockBox.x = 342,
                                blockBox.y = 125;
                                app.stage.addChild(blockBox);

                                canChoose = false;
                                hasChosen = true;

                                app.stage.removeChild(reselect);
                                app.stage.removeChild(play);
                                app.stage.addChild(activePlay);
                                app.stage.addChild(activeReselect);
                            }
                            if (p2choose && canChoose && e.x >= 446 && e.x <= 536 && e.y >= 125 && e.y <= 402) {
                                console.log("P2 Chose Primrose");
                                p2.sprite = primrose2;
                                p2.sprite.x = 655;
                                p2.sprite.y = 205;

                                blockBox = new Graphics();
                                blockBox.beginFill(0xffffff, 0.5);
                                blockBox.drawRect(0, 0, 91, 277);
                                blockBox.x = 439,
                                blockBox.y = 125;
                                app.stage.addChild(blockBox);

                                canChoose = false;
                                hasChosen = true;

                                app.stage.removeChild(reselect);
                                app.stage.removeChild(play);
                                app.stage.addChild(activePlay);
                                app.stage.addChild(activeReselect);
                            }
                            if (p2choose && canChoose && e.x >= 544 && e.x <= 634 && e.y >= 125 && e.y <= 402) {
                                console.log("P2 Chose Alfyn");
                                p2.sprite = alfyn2;
                                p2.sprite.x = 652;
                                p2.sprite.y = 205;

                                blockBox = new Graphics();
                                blockBox.beginFill(0xffffff, 0.5);
                                blockBox.drawRect(0, 0, 91, 277);
                                blockBox.x = 536,
                                blockBox.y = 125;
                                app.stage.addChild(blockBox);

                                canChoose = false;
                                hasChosen = true;

                                app.stage.removeChild(reselect);
                                app.stage.removeChild(play);
                                app.stage.addChild(activePlay);
                                app.stage.addChild(activeReselect);
                            }
                            if (p2choose && canChoose && e.x >= 642 && e.x <= 732 && e.y >= 125 && e.y <= 402) {
                                console.log("P2 Chose Therion");
                                p2.sprite = therion2;
                                p2.sprite.x = 648;
                                p2.sprite.y = 205;

                                blockBox = new Graphics();
                                blockBox.beginFill(0xffffff, 0.5);
                                blockBox.drawRect(0, 0, 91, 277);
                                blockBox.x = 633,
                                blockBox.y = 125;
                                app.stage.addChild(blockBox);

                                canChoose = false;
                                hasChosen = true;

                                app.stage.removeChild(reselect);
                                app.stage.removeChild(play);
                                app.stage.addChild(activePlay);
                                app.stage.addChild(activeReselect);
                            }
                            if (p2choose && canChoose && e.x >= 738 && e.x <= 828 && e.y >= 125 && e.y <= 402) {
                                console.log("P2 Chose Hannit");
                                p2.sprite = hannit2;
                                p2.sprite.x = 650;
                                p2.sprite.y = 205;

                                blockBox = new Graphics();
                                blockBox.beginFill(0xffffff, 0.5);
                                blockBox.drawRect(0, 0, 90, 277);
                                blockBox.x = 731,
                                blockBox.y = 125;
                                app.stage.addChild(blockBox);

                                canChoose = false;
                                hasChosen = true;

                                app.stage.removeChild(reselect);
                                app.stage.removeChild(play);
                                app.stage.addChild(activePlay);
                                app.stage.addChild(activeReselect);
                            }
                            if (p2choose && hasChosen && e.x >= 50 && e.x <= 220 && e.y >= 420 && e.y <= 465) {
                                console.log("P2 Unselected");
                                canChoose = true;
                                hasChosen = false;
                                app.stage.removeChild(blockBox);
                                app.stage.removeChild(activeReselect);
                                app.stage.removeChild(activePlay);
                                app.stage.addChild(play);
                                app.stage.addChild(reselect);
                            }
                            // "PLAY" --> START GAME
                            if (p2choose && hasChosen && e.x >= 701 && e.x <= 827 && e.y >= 428 && e.y <= 473) {
                                console.log("Game Starting");

                                let game = new Game();
                                game.runGame();

                            }
                        },                      false);

                    }
                },                      false);
            }
        },                      false);
    }
},                      false);


// HELPER FUNCTIONS
let isOutOfBounds = (unit: Sprite): boolean => {
    return unit.x <= -100 || unit.x >= 970 || unit.y <= -100 || unit.y >= 590;
};

let isOffScreen = (sprite: Sprite): boolean => {
    return sprite.x <= -40 || sprite.x >= 1024 * .85 || sprite.y <= 0 || sprite.y >= 576 * .85;
};

let facingLeft = (unit: Sprite) => unit.scale.x >= 0;
let facingRight = (unit: Sprite) => unit.scale.x < 0;

let groundedLeftward = (unit: Sprite) => (facingLeft(unit) && (unit.y >= 205 && unit.y <= 207 && (unit.x < 718 && unit.x > 62)));
let groundedRightward = (unit: Sprite) => (facingRight(unit) && (unit.y >= 205 && unit.y <= 207 && (unit.x < 788 && unit.x > 135)));
let grounded = (unit: Sprite) => (groundedLeftward(unit) || groundedRightward(unit));

let underStageLeftWard = (unit: Sprite) => (facingLeft(unit) && (unit.y >= 208 && unit.y <= 295) && (unit.x < 718 && unit.x > 62));
let underStageRightWard = (unit: Sprite) => (facingRight(unit) && (unit.y >= 208 && unit.y <= 295) && (unit.x < 788 && unit.x > 135));
let underStage = (unit: Sprite) => (underStageLeftWard(unit) || underStageRightWard(unit));

let offSides = (unit: Sprite) => ((facingLeft(unit) && (unit.x <= 62 || unit.x >= 718)) || (facingRight(unit) && (unit.x <= 135 || unit.x >= 788)));

let resetJump = (player: Player) => player.jumpCount = 0;

let canJump = (player: Player): boolean => {
    if (grounded(player.sprite)) {
        if (player === p1) {
            resetJump(p1);
            return true;
        } else if (player === p2) {
            resetJump(p2);
            return true;
        }
    } else if (player === p1) {
        if (p1.jumpCount < 2) {
            return true;
        }
    } else if (player === p2) {
        if (p2.jumpCount < 2) {
            return true;
        }
    }
    return false;
};

// GENERAL RESET FUNCTIONS
let resetY = (unit: Sprite): void => {
    unit.y = 205;
};

let resetLowY = (unit: Sprite): void => {
    unit.y = 295;
};

let leftResetLeft = (unit: Sprite): void => {
    unit.x = 62;
};
let leftResetRight = (unit: Sprite): void => {
    unit.x = 718;
};
let rightResetLeft = (unit: Sprite): void => {
    unit.x = 135;
};
let rightResetRight = (unit: Sprite): void => {
    unit.x = 788;
};

// BATTLE FUNCTIONS
let isColliding = (a: DisplayObject, b: DisplayObject): boolean => {
    let ab: Rectangle = a.getBounds();
    let bb: Rectangle = b.getBounds();
    return ab.x + ab.width > bb.x && ab.x < bb.x + bb.width && ab.y + ab.height > bb.y && ab.y < bb.y + bb.height;
};

let hitRight = (unit: Sprite): void => {
    unit.x += 60;
};

let hitLeft = (unit: Sprite): void => {
    unit.x -= 60;
};

class Game {

    gameBG: Sprite = Sprite.fromImage("./Final_Destination_Stage.png");

    // PLAYER ONE CONTROLS
    A: number = 0;
    D: number = 0;
    S: number = 0;
    W: number = 0;
    lastKey1: number = 0;

    // PLAY TWO CONTROLS
    left: number = 0;
    right: number = 0;
    down: number = 0;
    up: number = 0;
    lastKey2: number = 0;

    // END GAME
    gameOver: boolean = false;
    winner: Player;
    winnerExists: boolean = false;
    gameText: PIXI.Text = new PIXI.Text("GAME!", gameTextStyle);

    runGame(): void {
        // BUILD IN-GAME COMPONENTS
        this.gameBG.scale.x = .85;
        this.gameBG.scale.y = .85;
        app.stage.addChild(this.gameBG);

        app.stage.addChild(p1.sprite);
        app.stage.addChild(p2.sprite);

        // PLAYER ONE MOVE CONTROLS
        window.addEventListener("keydown", (e: KeyboardEvent): void  => {
            console.log("key: " + e.keyCode);
            const LEFT: number = 65;
            const UP: number = 87;
            const RIGHT: number = 68;
            const DOWN: number = 83;
            const ATTACK: number = 51;

            if (e.keyCode === LEFT) {
                this.A = -1;
                if (p1.sprite.scale.x < 0) {
                    p1.sprite.scale.x *= -1;
                    p1.sprite.x -= 65;
                }
            } else if (e.keyCode === UP) {
                this.W = -1;
                if (!(this.lastKey1 === 87)) {
                    if (canJump(p1)) {
                        p1.vel = -4;
                        p1.jumpCount++;
                    }
                    this.lastKey1 = 87;
                }
            } else if (e.keyCode === RIGHT) {
                this.D = 1;
                if (p1.sprite.scale.x >= 0) {
                    p1.sprite.scale.x *= -1;
                    p1.sprite.x += 65;
                }
            } else if (e.keyCode === DOWN) {
                if (!grounded(p1.sprite)) {
                    this.S = 1;
                }
            } else if (e.keyCode === ATTACK) {
                if (!(this.lastKey1 === 51)) {
                    if (magicArr.length < 4) {
                        let sprite: Sprite = Sprite.fromImage("./Magic_Blast.png");
                        let magic: Magic = new Magic(sprite);
                        magic.getPoint(p1.sprite.x, p1.sprite.y + 20);
                        if (facingLeft(p1.sprite)) {
                            magic.direction = -1;
                            magic.sprite.scale.x *= 1;
                        } else {
                            magic.direction = 1;
                            magic.sprite.scale.x *= -1;
                        }
                        magicArr.push(magic);
                        app.stage.addChild(magic.sprite);
                    }
                    this.lastKey1 = 51;
                }
            }
        },                      false);

        window.addEventListener("keyup", (e: KeyboardEvent): void  => {
            console.log("key: " + e.keyCode);
            const LEFT: number = 65;
            const UP: number = 87;
            const RIGHT: number = 68;
            const DOWN: number = 83;
            const ATTACK: number = 51;
            if (e.keyCode === LEFT) {
                this.A = 0;
            } else if (e.keyCode === UP) {
                this.W = 0;
                this.lastKey1 = 0;
            } else if (e.keyCode === RIGHT) {
                this.D = 0;
            } else if (e.keyCode === DOWN) {
                this.S = 0;
            } else if (e.keyCode === ATTACK) {
                this.lastKey1 = 0;
            }
        },                      false);

        window.addEventListener("keydown", (e: KeyboardEvent): void  => {
            console.log("key: " + e.keyCode);
            const LEFT: number = 37;
            const UP: number = 38;
            const RIGHT: number = 39;
            const DOWN: number = 40;
            const ATTACK: number = 191;

            if (e.keyCode === LEFT) {
                this.left = -1;
                if (p2.sprite.scale.x < 0) {
                    p2.sprite.scale.x *= -1;
                    p2.sprite.x -= 65;
                }
            } else if (e.keyCode === UP) {
                this.up = -1;
                if (!(this.lastKey2 === 38)) {
                    if (canJump(p2)) {
                        p2.vel = -4;
                        p2.jumpCount++;
                    }
                    this.lastKey2 = 38;
                }
            } else if (e.keyCode === RIGHT) {
                this.right = 1;
                if (p2.sprite.scale.x >= 0) {
                    p2.sprite.scale.x *= -1;
                    p2.sprite.x += 65;
                }
            } else if (e.keyCode === DOWN) {
                if (!grounded(p2.sprite)) {
                    this.down = 1;
                }
            } else if (e.keyCode === ATTACK) {
                if (!(this.lastKey2 === 191)) {
                    if (magicArrTwo.length < 4) {
                        let sprite: Sprite = Sprite.fromImage("./Magic_Blast.png");
                        let magicTwo: Magic = new Magic(sprite);
                        magicTwo.getPoint(p2.sprite.x, p2.sprite.y + 20);
                        if (facingLeft(p2.sprite)) {
                            magicTwo.direction = -1;
                            magicTwo.sprite.scale.x *= 1;
                        } else {
                            magicTwo.direction = 1;
                            magicTwo.sprite.scale.x *= -1;
                        }
                        magicArrTwo.push(magicTwo);
                        app.stage.addChild(magicTwo.sprite);
                    }
                    this.lastKey2 = 191;
                }
            }
        },                      false);


        window.addEventListener("keyup", (e: KeyboardEvent): void  => {
            console.log("key: " + e.keyCode);
            const LEFT: number = 37;
            const UP: number = 38;
            const RIGHT: number = 39;
            const DOWN: number = 40;
            const ATTACK: number = 191;
            if (e.keyCode === LEFT) {
                this.left = 0;
            } else if (e.keyCode === UP) {
                this.up = 0;
                this.lastKey2 = 0;
            } else if (e.keyCode === RIGHT) {
                this.right = 0;
            } else if (e.keyCode === DOWN) {
                this.down = 0;
            } else if (e.keyCode === ATTACK) {
                this.lastKey2 = 0;
            }
        },                      false);

        // END GAME
        let handleWin = (gameMessage: PIXI.Text, message: PIXI.Text): void => {
            gameMessage.x = 305;
            gameMessage.y = 180;
            message.x = 292;
            message.y = 280;
            app.stage.addChild(gameMessage);
            app.stage.addChild(message);
        };

        // RUN GAME
        app.ticker.add((delta: number): void => {
            for (let i: number = 0; i < loops.length; i++) {
                
                // END GAME TEST
                if (isOutOfBounds(p1.sprite) || isOutOfBounds(p2.sprite)) {
                    this.gameOver = true;
                }

                if (this.gameOver) {
                    if (isOutOfBounds(p1.sprite)) {
                        this.winner = p2;
                    } else if (isOutOfBounds(p2.sprite)) {
                        this.winner = p1;
                    }
                    if (this.winner === p2 && !this.winnerExists) {
                        let message = new PIXI.Text("Player Two Wins", style);
                        handleWin(this.gameText, message);
                        this.winnerExists = true;
                    } else if (this.winner === p1 && !this.winnerExists) {
                        let message = new PIXI.Text("Player One Wins", style);
                        handleWin(this.gameText, message);
                        this.winnerExists = true;
                    }
                    /* WORK-IN-PROGRESS: Press enter key to replay without having to choose characters again.
                        - Might have to variables in globals to save p1 and p2 sprites
                        - Save starting locations
                    */
                    // let playAgain = new PIXI.Text("Press ENTER to play again", playAgainStyle);
                    // playAgain.x = 327;
                    // playAgain.y = 330;
                    // app.stage.addChild(playAgain);

                    // let orRefresh = new PIXI.Text("or refresh to choose new characters", playAgainStyle);
                    // orRefresh.x = 293;
                    // orRefresh.y = 350;
                    // app.stage.addChild(orRefresh);

                    // window.addEventListener("keydown", (e: KeyboardEvent): void  => {
                    //     console.log("Running Game...");
                    //     const REPLAY: number = 13;
                    //     if (e.keyCode === REPLAY) {
                    //         app.stage.removeChild(p1.sprite);
                    //         app.stage.removeChild(p2.sprite);
                    //         let game = new Game();
                    //         game.runGame();
                    //     }
                    // },                      false);

                }

                // PROJECTILES
                for (let i: number = 0; i < magicArr.length; i++) {
                    let magic: Magic = magicArr[i];
                    magic.sprite.x += (2 * magic.direction);
                    if (isColliding(p2.sprite, magic.sprite)) {
                        if (magic.direction >= 0) { 
                        hitRight(p2.sprite);
                        } else {
                            hitLeft(p2.sprite);
                        }
                        app.stage.removeChild(magicArr[i].sprite);
                        magicArr.splice(i, 1);
                    } else if (isOffScreen(magicArr[i].sprite)) {
                        app.stage.removeChild(magicArr[i].sprite);
                        magicArr.splice(i, 1);
                    }
                }

                for (let i: number = 0; i < magicArrTwo.length; i++) {
                    let magicTwo: Magic = magicArrTwo[i];
                    magicTwo.sprite.x += (2 * magicTwo.direction);
                    if (isColliding(p1.sprite, magicTwo.sprite)) {
                        if (magicTwo.direction >= 0) {
                        hitRight(p1.sprite);
                        } else {
                            hitLeft(p1.sprite);
                        }
                        app.stage.removeChild(magicArrTwo[i].sprite);
                        magicArrTwo.splice(i, 1);
                    } else if (isOffScreen(magicArrTwo[i].sprite)) {
                        app.stage.removeChild(magicArrTwo[i].sprite);
                        magicArrTwo.splice(i, 1);
                    }
                }

                // PLAYER ONE MOVING
                p1.sprite.x += (this.A + this.D) * speed;
                // p1.sprite.y += (S) * speed;
                if (p1.vel < 1.5) {
                    p1.vel += acc;
                } else if (grounded(p1.sprite)) {
                    p1.vel = 0;
                    resetY(p1.sprite);
                } else if (underStage(p1.sprite)) {
                    p1.vel = 0;
                    resetLowY(p1.sprite);
                } else if (underStage(p1.sprite)) {
                    p1.vel = 0;
                    resetLowY(p1.sprite);
                } else {
                    p1.vel = 1;
                }
                p1.sprite.y += p1.vel;

                // PLAYER TWO MOVING
                p2.sprite.x += (this.left + this.right) * speed;
                // p2.sprite.y += (down) * speed;
                if (p2.vel < 1.5) {
                    p2.vel += acc;
                } else if (grounded(p2.sprite)) {
                    p2.vel = 0;
                    resetY(p2.sprite);
                } else if (underStage(p2.sprite)) {
                    p2.vel = 0;
                    resetLowY(p2.sprite);
                } else if (underStage(p2.sprite)) {
                    p2.vel = 0;
                    resetLowY(p2.sprite);
                } else {
                    p2.vel = 1;
                }
                p2.sprite.y = p2.sprite.y + p2.vel;

                // PLAYER ONE RESTRAINTS
                if (grounded(p1.sprite)) {
                    resetY(p1.sprite);
                }
                if (underStage(p1.sprite)) {
                    resetLowY(p1.sprite);
                }
                if (facingLeft(p1.sprite)) {
                    if ((p1.sprite.y <= 292 && p1.sprite.y > 207) && (p1.sprite.x > 62 && p1.sprite.x <= 64)) {
                        leftResetLeft(p1.sprite);
                    }
                    if ((p1.sprite.y <= 292 && p1.sprite.y > 207) && (p1.sprite.x < 718 && p1.sprite.x >= 716)) {
                        leftResetRight(p1.sprite);
                    }
                } else {
                    if ((p1.sprite.y <= 292 && p1.sprite.y > 207) && (p1.sprite.x > 135 && p1.sprite.x <= 137)) {
                        rightResetLeft(p1.sprite);
                    }
                    if ((p1.sprite.y <= 292 && p1.sprite.y > 207) && (p1.sprite.x < 788 && p1.sprite.x >= 786)) {
                        rightResetRight(p1.sprite);
                    }
                }

                // PLAYER TWO RESTRAINTS
                if (grounded(p2.sprite)) {
                    resetY(p2.sprite);
                }
                if (underStage(p2.sprite)) {
                    resetLowY(p2.sprite);
                }
                if (facingLeft(p2.sprite)) {
                    if ((p2.sprite.y >= 207 && p2.sprite.y <= 292) && (p2.sprite.x > 62 && p2.sprite.x <= 64)) {
                        leftResetLeft(p2.sprite);
                    }
                    if ((p2.sprite.y >= 207 && p2.sprite.y <= 292) && (p2.sprite.x < 718 && p2.sprite.x >= 716)) {
                        leftResetRight(p2.sprite);
                    }
                } else {
                    if ((p2.sprite.y <= 292 && p2.sprite.y >= 207) && (p2.sprite.x > 135 && p2.sprite.x <= 137)) {
                        rightResetLeft(p2.sprite);
                    }
                    if ((p2.sprite.y <= 292 && p2.sprite.y >= 207) && (p2.sprite.x < 788 && p2.sprite.x >= 786)) {
                        rightResetRight(p2.sprite);
                    }
                }
            }
        },             false);
    }
}
