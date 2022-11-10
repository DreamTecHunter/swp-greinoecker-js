let image_player = new Image();
let image_super_player = new Image();
let image_enemy = new Image();
let image_item = new Image();
let image_bonus = new Image();

image_player.src = "./img/corona/happy-emoji.png"
image_super_player.src = "./img/corona/masked-emoji.png"
image_enemy.src = "./img/corona/ill-emoji.png"
image_item.src = "./img/corona/shopping-card.png"
image_bonus.src = "./img/corona/bonus-emoji.png"

let player_color = "red";
let super_player_color = "yellow";
let enemy_color = "blue";
let item_color = "orange";
let bonus_color = "green";

let entitySpawnTime = 600;

let entity_width = 30;
let entity_height = 30;

let timer = 0
let start_time = 0
let score = 100;

document.getElementById("clock").innerText = "0s";
document.getElementById("score").innerText = score + " points";
document.getElementById("instructions").innerText;

let enemyUpperLimit = 4;
let enemyLowerLimit = 1;
let itemUpperLimit = 12;
let itemLowerLimit = 1;
let bonusUpperLimit = 8;
let bonusLowerLimit = 1;

let timePoints = -2;
let startPoints = 100;
let finishingPoints = 100;
let bonusPoints = 50;
let itemPoints = 10;
let defeatingPoints = 25;
let losingPoints = -100;



/**
 * playerStatus
 * 0: normal
 * 1: infected
 * 2: super
 * @type {number}
 */
/** Dodge Corona
 * Idee: 3 lives / injections
 *  time-limit, levels
 *  scoreboard (saved in a file)
 *  game over (u died by the consequences of corona)
 *
 */
let game = {
    canvas: document.getElementById("field"),
    start: function () {
        start_time = (new Date()).getTime()
        console.log(this.canvas);
        this.context = this.canvas.getContext("2d");
        this.clear();

        this.intervalRedraw = setInterval(redraw, 20);
        this.intervalPlayerStatus = setInterval(collisionCheck, 30);
        this.intervalNewEnemy = setInterval(newEnemy, entitySpawnTime);
        this.intervalNewItem = setInterval(newItem, entitySpawnTime);
        this.intervalNewBonus = setInterval(newBonus, entitySpawnTime);
        this.intervalScore = setInterval(info, 1000);
        this.player = new sprite(entity_width, entity_height, player_color, image_player, 10, 120);
        this.playerStatus = 0
        this.score = startPoints;
        this.enemies = [];
        this.items = []
        this.bonuses = []
        this.playerStatus = -1
        this.keyCode = -1; //when there is no key pressed
        window.addEventListener('keydown', (e) => {
            this.keyCode = e.keyCode;
        });
        window.addEventListener('keyup', (e) => {
            this.keyPressed = -1;
        });
    },
    clear: function () {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}

function start() {
    console.log("Game started");
    game.start();
    console.log(game)

}

function sprite(width, height, color, image, x, y) {
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;
    ctx = game.context;
    ctx.fillStyle = color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
    ctx.drawImage(image, this.x, this.y, this.width, this.height)
    this.redraw = function () {
        ctx = game.context;
        ctx.fillStyle = color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.drawImage(image, this.x, this.y, this.width, this.height)
    }
}

function redraw() {
    document.getElementById("score").innerText = game.score;
    if (game.context == null)
        return
    game.clear();
    if (game.player.x <= game.canvas.width - game.player.width)
        game.player.x += 1;
    switch (game.keyCode) {
        case 37: //left
            if (game.player.x >= 0)
                game.player.x -= 2.5;
            break;
        case 38: //up
            if (game.player.y >= 0)
                game.player.y -= 1.5;
            break;
        case 39: //right
            if (game.player.x <= game.canvas.width - game.player.width)
                game.player.x += 1.5;
            break;
        case 40: //down
            if (game.player.y <= game.canvas.height - game.player.height)
                game.player.y += 1.5
            break;
    }
    game.player.redraw();

    game.enemies.forEach((e) => {
        console.log(e)
        let yDelta = Math.floor(Math.random() * 11) - 5;
        e.x -= 1;
        if (0 <= e.y + yDelta && e.y + e.height + yDelta <= game.canvas.height)
            e.y += yDelta;
        e.redraw();
    })


    game.items.forEach(i => {
        let yDelta = Math.floor(Math.random() * 9) - 4;
        i.x -= 1;
        if (0 <= i.y + yDelta && i.y + i.height + yDelta <= game.canvas.height)
            i.y += yDelta;
        i.redraw()
    })

    game.bonuses.forEach((b) => {
        let yDelta = Math.floor(Math.random() * 11) - 5;
        b.x -= 1;
        if (0 <= b.y + yDelta && b.y + b.height + yDelta <= game.canvas.height)
            b.y += yDelta;
        b.redraw();
    })
}


function newEnemy() {
    if (game.context == null)
        return;
    if (Math.random() * enemyUpperLimit > enemyLowerLimit) {
        let y = Math.floor(Math.random() * game.canvas.height);
        let e = new sprite(entity_width, entity_height, enemy_color, image_enemy, game.canvas.width - game.player.width - entity_width, y);
        game.enemies.push(e);
    }
}

function newItem() {
    if (game.context == null)
        return
    if (Math.random() * itemUpperLimit < itemLowerLimit) {
        let y = Math.floor(Math.random() * game.canvas.height)
        let i = new sprite(entity_width, entity_height, item_color, image_item, game.canvas.width - game.player.width, y)
        game.items.push(i)
    }
}

function newBonus() {
    if (game.context == null)
        return
    if (Math.random() * bonusUpperLimit < bonusLowerLimit) {
        let y = Math.floor(Math.random() * game.canvas.height)
        let b = new sprite(entity_width, entity_height, bonus_color, image_bonus, game.canvas.width - game.player.width, y)
        game.bonuses.push(b)
    }
}

function collisionCheck() {
    if (game.context == null)
        return
    if (game.player.x + game.player.width >= 1024) {
        game.score += finishingPoints;
        game.context = null
    }
    i = 0;
    game.bonuses.every(function (bonus) {
        i++
        if (
            Math.abs(game.player.x - bonus.x) < (game.player.width + bonus.width) / 2
            &&
            Math.abs(game.player.y - bonus.y) < (game.player.height + bonus.height) / 2
        ) {
            game.score = game.score + bonusPoints;
            game.bonuses.splice(i - 1, 1)
            return false;
        }
        return true;
    })
    j = 0;
    game.items.every(function (item) {
        j++;
        if (
            Math.abs(game.player.x - item.x) < (game.player.width + item.width + 2) / 2
            &&
            Math.abs(game.player.y - item.y) < (game.player.height + item.height + 2) / 2
        ) {
            game.playerStatus = 2
            game.player = new sprite(game.player.width, game.player.height, super_player_color, image_super_player, game.player.x, game.player.y);
            game.score = game.score + itemPoints;
            game.items.splice(j - 1, 1)
            timer = (new Date()).getTime();
            return false;
        }
        return true;
    })
    switch (game.playerStatus) {
        case 0:
            game.enemies.forEach(function (enemy) {
                if (
                    Math.abs(game.player.x - enemy.x) < (game.player.width + enemy.width - 2) / 2
                    &&
                    Math.abs(game.player.y - enemy.y) < (game.player.height + enemy.height - 2) / 2
                ) {
                    game.playerStatus = 1
                }
            })
            break;
        case 1:
            game.player = new sprite(game.player.width, game.player.height, enemy_color, image_enemy, game.player.x, game.player.y);
            game.score -= losingPoints;
            info()
            game.context = null;
            break;
        case 2:
            amount = game.enemies.length
            game.enemies = game.enemies.filter(enemy => !(
                Math.abs(game.player.x - enemy.x) < (game.player.width + enemy.width) / 2
                &&
                Math.abs(game.player.y - enemy.y) < (game.player.height + enemy.height) / 2
            ))
            game.score = game.score + (amount - game.enemies.length) * defeatingPoints;
            if (((new Date()).getTime() - timer) > (5000)) {
                game.playerStatus = 0;
                game.player = new sprite(game.player.width, game.player.height, player_color, image_player, game.player.x, game.player.y);
            }
            break;
        default:
            game.playerStatus = 0;
            break;
    }
}

function info() {
    if (game.context != null) {
        game.score -= 2;
        document.getElementById("clock").innerText = Math.round(((new Date()).getTime() - start_time) / 1000) + "s"
        if (game.score < 0) {
        }

    }
}