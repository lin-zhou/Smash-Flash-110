import {
    Sprite,
    Container,
    Application,
    Rectangle,
    Graphics,
    DisplayObject,
    Text
} from "pixi.js";

const app: Application = new Application(1024 * .85, 576 * .85);
document.body.appendChild(app.view);

class Enemy {
    sprite: Sprite;
    direction: number = 1;
    constructor(sprite: Sprite) {
        this.sprite = sprite;
    }
}

class Unit {
    sprite: Sprite;
}

let background: Sprite = Sprite.fromImage("./Final_Destination_Stage.png");
background.scale.x = .85;
background.scale.y = .85;
app.stage.addChild(background);

let cyrus: Sprite = Sprite.fromImage("./Cyrus_Sprite.png");
cyrus.scale.x = .55;
cyrus.scale.y = .55;
cyrus.x = 145;
cyrus.y = 205;
app.stage.addChild(cyrus);
const speed: number = 1.5;

let hannit: Sprite = Sprite.fromImage("./Hannit_Sprite.png");
hannit.scale.x = .5;
hannit.scale.y = .5;
hannit.x = 640;
hannit.y = 210;
app.stage.addChild(hannit);

let enemies: Enemy[] = [];
for (let i: number = 1; i <= 4; i++) {
    let sprite: Sprite = Sprite.fromImage("./blob.png");
    sprite.x = 450 / 4 * i - 20;
    sprite.y = 256;
    let enemy: Enemy = new Enemy(sprite);
    enemies.push(enemy);
    app.stage.addChild(enemy.sprite);
}

// CYRUS MOVE CONTROLS

let A: number = 0;
let D: number = 0;
let S: number = 0;
let W: number = 0;

window.addEventListener("keydown", (e: KeyboardEvent): void  => {
    console.log("key: " + e.keyCode);
    const LEFT: number = 65;
    const UP: number = 87;
    const RIGHT: number = 68;
    const DOWN: number = 83;
    if (e.keyCode === LEFT) {
        A = -1;
    } else if (e.keyCode === UP) {
        W = -1;
    } else if (e.keyCode === RIGHT) {
        D = 1;
    } else if (e.keyCode === DOWN) {
        S = 1;
    }
},                      false);

window.addEventListener("keyup", (e: KeyboardEvent): void  => {
    console.log("key: " + e.keyCode);
    const LEFT: number = 65;
    const UP: number = 87;
    const RIGHT: number = 68;
    const DOWN: number = 83;
    if (e.keyCode === LEFT) {
        A = 0;
    } else if (e.keyCode === UP) {
        W = 0;
    } else if (e.keyCode === RIGHT) {
        D = 0;
    } else if (e.keyCode === DOWN) {
        S = 0;
    }
},                      false);

// HANNIT MOVE CONTROLS

let left: number = 0;
let right: number = 0;
let down: number = 0;
let up: number = 0;

window.addEventListener("keydown", (e: KeyboardEvent): void  => {
    console.log("key: " + e.keyCode);
    const LEFT: number = 37;
    const UP: number = 38;
    const RIGHT: number = 39;
    const DOWN: number = 40;
    if (e.keyCode === LEFT) {
        left = -1;
    } else if (e.keyCode === UP) {
        up = -1;
    } else if (e.keyCode === RIGHT) {
        right = 1;
    } else if (e.keyCode === DOWN) {
        down = 1;
    }
},                      false);


window.addEventListener("keyup", (e: KeyboardEvent): void  => {
    console.log("key: " + e.keyCode);
    const LEFT: number = 37;
    const UP: number = 38;
    const RIGHT: number = 39;
    const DOWN: number = 40;
    if (e.keyCode === LEFT) {
        left = 0;
    } else if (e.keyCode === UP) {
        up = 0;
    } else if (e.keyCode === RIGHT) {
        right = 0;
    } else if (e.keyCode === DOWN) {
        down = 0;
    }
},                      false);

let isColliding = (a: DisplayObject, b: DisplayObject): boolean => {
    let ab: Rectangle = a.getBounds();
    let bb: Rectangle = b.getBounds();
    return ab.x + ab.width > bb.x && ab.x < bb.x + bb.width && ab.y + ab.height > bb.y && ab.y < bb.y + bb.height;
};

// CYRUS RESET FUNCTIONS

let resetCyrusY = (): void => {
    cyrus.y = 205;
};
let resetCyrusLowY = (): void => {
    cyrus.y = 295;
};
let resetCyrusLeft = (): void => {
    cyrus.x = 62;
};
let resetCyrusRight = (): void => {
    cyrus.x = 718;
};
// HANNIT RESET FUNCTIONS

let resetHannitY = (): void => {
    hannit.y = 210;
};
let resetHannitLowY = (): void => {
    hannit.y = 295;
};
let resetHannitLeft = (): void => {
    hannit.x = 62;
};
let resetHannitRight = (): void => {
    hannit.x = 718;
};


let hasWon: boolean = false;

let message: Text = new Text("You won!!");
let messageBox: Graphics = new Graphics();

app.ticker.add((delta: number): void => {
    for (let i: number = 0; i < enemies.length; i++) {
        cyrus.x += (A + D) * speed;
        cyrus.y += (W + S) * speed;

        hannit.x += (left + right) * speed;
        hannit.y += (up + down) * speed;

        if (cyrus.x >= 718 || cyrus.x <= 62) {
            cyrus.y += .5;
        }
        if (cyrus.y <= 205 && (cyrus.x < 718 && cyrus.x > 62)) {
            cyrus.y += .5;
        }
        if (cyrus.y > 207 && (cyrus.x < 718 && cyrus.x > 62)) {
            cyrus.y += .5;
        }
        if (cyrus.y >= 205 && cyrus.y <= 207 && (cyrus.x < 718 && cyrus.x > 62)) {
            resetCyrusY();
        }
        if ((cyrus.y >= 293 && cyrus.y <= 295) && (cyrus.x < 718 && cyrus.x > 62)) {
            resetCyrusLowY();
        }
        if ((cyrus.y <= 292 && cyrus.y > 207) && (cyrus.x > 62 && cyrus.x <= 64)) {
            resetCyrusLeft();
        }
        if ((cyrus.y <= 292 && cyrus.y > 207) && (cyrus.x < 718 && cyrus.x >= 716)) {
            resetCyrusRight();
        }

        if (hannit.x >= 718 || hannit.x <= 62) {
            hannit.y += .5;
        }
        if (hannit.y <= 210 && (hannit.x < 718 && hannit.x > 62)) {
            hannit.y += .5;
        }
        if (hannit.y > 212 && (hannit.x < 718 && hannit.x > 62)) {
            hannit.y += .5;
        }
        if (hannit.y >= 210 && hannit.y <= 212 && (hannit.x < 718 && hannit.x > 62)) {
            resetHannitY();
        }
        if ((hannit.y >= 293 && hannit.y <= 295) && (hannit.x < 718 && hannit.x > 62)) {
            resetHannitLowY();
        }
        if ((hannit.y <= 292 && hannit.y >= 207) && (hannit.x > 62 && hannit.x <= 64)) {
            resetHannitLeft();
        }
        if ((hannit.y <= 292 && hannit.y >= 207) && (hannit.x < 718 && hannit.x >= 716)) {
            resetHannitRight();
        }
    }
}
);