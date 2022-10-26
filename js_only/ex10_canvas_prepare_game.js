let image_player = new Image(), image_super_player = new Image(), image_item = new Image(), image_enemy = new Image(),
    image_bonus = new Image();
image_player.src = "img/corona/happy-emoji.png"
image_super_player.src = "img/corona/masked-emoji.png"
image_item.src = "img/corona/shopping-card.png"
image_enemy.src = "img/corona/ill-emoji.png"
image_bonus.src = "img/corona/bonus-emoji.png"

let timer = 0;
let start_time = 0;

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
        //console.log(this.canvas);
        this.context = this.canvas.getContext("2d");
        this.clear();
        this.interval = setInterval(redraw, 20);
        this.intervalPlayerStatus = setInterval(collisionCheck, 30)
        this.intervalNewEnemy = setInterval(newEnemy, 60 * 10);
        this.intervalNewItem = setInterval(newItem, 60 * 10)
        this.intervalNewBonus = setInterval(newBonus, 60 * 10)
        this.intervalScore = setInterval(info, 1000)
        this.player = new sprite(30, 30, "red", image_player, 10, 120);
        /**
         * playerStatus
         * 0: normal
         * 1: infected
         * 2: super
         * @type {number}
         */
        this.playerStatus = 0
        this.score = 100
        this.enemies = [];
        this.items = []
        this.bonuses = []
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
    if (game.player.x <= 1024 - game.player.width)
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
            if (game.player.x <= 1024 - game.player.width)
                game.player.x += 1.5;
            break;
        case 40: //down
            if (game.player.y <= 1024 - game.player.height)
                game.player.y += 1.5
            break;
    }

    game.player.redraw();


    game.enemies.forEach((e) => {
        //console.log(e)
        let yDelta = Math.floor(Math.random() * 11) - 5;
        e.x -= 1;
        if (0 <= e.y + yDelta && e.y + e.height + yDelta <= 1024)
            e.y += yDelta;
        e.redraw();
    })

    game.items.forEach(i => {
        let yDelta = Math.floor(Math.random() * 9) - 4;
        i.x -= 1;
        if (0 <= i.y + yDelta && i.y + i.height + yDelta <= 1024)
            i.y += yDelta;
        i.redraw()
    })

    game.bonuses.forEach((b) => {
        //console.log(e)
        let yDelta = Math.floor(Math.random() * 11) - 5;
        b.x -= 1;
        if (0 <= b.y + yDelta && b.y + b.height + yDelta <= 1024)
            b.y += yDelta;
        b.redraw();
    })
}

function newEnemy() {
    if (game.context == null)
        return
    if (Math.random() * 4 > 1) {
        let y = Math.floor(Math.random() * 1024);
        let e = new sprite(30, 30, "blue", image_enemy, 1024 - game.player.width - 30, y);
        game.enemies.push(e);
    }
}

function newItem() {
    if (game.context == null)
        return
    if (Math.random() * 12 < 1) {
        let y = Math.floor(Math.random() * 1024)
        let i = new sprite(30, 30, "yellow", image_item, 1024 - game.player.width, y)
        game.items.push(i)
    }
}

function newBonus() {
    if (game.context == null)
        return
    if (Math.random() * 8 < 1) {
        let y = Math.floor(Math.random() * 1024)
        let b = new sprite(30, 30, "pink", image_bonus, 1000 - game.player.width, y)
        game.bonuses.push(b)
    }
}

function collisionCheck() {
    if (game.context == null)
        return
    if (game.player.x + game.player.width >= 1024) {
        game.score += 100
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
            game.score = game.score + 50
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
            game.player = new sprite(game.player.width, game.player.height, "red", image_super_player, game.player.x, game.player.y);
            game.score = game.score + 10
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
            game.player = new sprite(game.player.width, game.player.height, "red", image_enemy, game.player.x, game.player.y);
            game.score -= 100
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
            game.score = game.score + (amount - game.enemies.length) * 25;
            if (((new Date()).getTime() - timer) > (5000)) {
                game.playerStatus = 0;
                game.player = new sprite(game.player.width, game.player.height, "red", image_player, game.player.x, game.player.y);
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
            game.score = 0;
        }

    }
}