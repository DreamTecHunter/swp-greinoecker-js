let game = {
    canvas: document.getElementById("field"),
    start () {
        console.log(this.canvas);
        this.context = this.canvas.getContext("2d");
        this.clear();
        this.interval = setInterval(redraw, 20);
        this.intervalNewEnemy = setInterval(newEnemy, 600);
        this.intervalNewBonusstein = setInterval(newBonusstein, 3000);
        this.player = new sprite(30, 30, "red", 10, 120);
        this.score = 0;
        this.enemies = [];
        this.bonussteine = [];
        this.keyCode = -1; //when there is no key pressed
        window.addEventListener('keydown', (e) =>
        {
            this.keyCode = e.keyCode;
        });

        window.addEventListener('keyup', (e) =>
        {
            this.keyPressed = -1;
        });
    },
    clear() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}

function start() {
    console.log("Game started");
    game.start();

}


function sprite(width, height, color, x, y) {
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;
    ctx = game.context;
    ctx.fillStyle = color;
    ctx.fillRect(this.x, this.y, this.width, this.height);

    this.redraw = function()
    {
        ctx = game.context;
        ctx.fillStyle = color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}

function redraw() {
    game.clear();
    game.player.x += 1;
    switch (game.keyCode) {
        case 37: //left
            game.player.x -= 2;
            break;
        case 38: //up
            game.player.y -= 1;
            break;
        case 39: //right
            game.player.x += 1;
            break;
        case 40: //down
            game.player.y += 1;
            break;
    }

    game.player.redraw();

    game.bonussteine.forEach((e) => {
        console.log(e)
        let yDelta = Math.floor(Math.random()*3)-1;
        e.x -= 1;
        e.y += yDelta;
        e.redraw();
    })
    game.enemies.forEach((e) => {
        console.log(e)
        let yDelta = Math.floor(Math.random() * 11) - 5;
        e.x -= 1;
        e.y += yDelta;
        e.redraw();
    })
}

function calculate_collision() {
    //TODO : calculate collision
    // if entity is out of screen, remove it from the array
    // if entity is in collision with player, remove it from the array
    // if player is in collision with enemy, game over
    if((Math.abs(game.player.x) == Math.abs(game.enemies.x))
        // checks if player and enemy are in the same x position
        &&
        (Math.abs(game.player.y) == Math.abs(game.enemies.y)))
        // checks if player and enemy are in the same y position
    { // if so, game over
        console.log("Game Over");
        game.clear();
    }
    // if player is in collision with bonusstein, score++
    if((Math.abs(game.player.x) == Math.abs(game.bonussteine.x))
        // checks if player and bonusstein are in the same x position
        &&
        (Math.abs(game.player.y) == Math.abs(game.bonussteine.y)))
        // checks if player and bonusstein are in the same y position
        // if so, score+=10
    {
        game.bonussteine.remove();
        console.log("Hit a score up gem");
        console.log("Score: you received 10 points");
        game.score += 10;
    }
}

function newEnemy()
{
    let y = Math.floor(Math.random()*1024);
    let e = new sprite(30, 30, "blue", 1000, y);
    game.enemies.push(e);

}
function newBonusstein(){
    let y = Math.floor(Math.random()*1024);
    let bs = new sprite(30, 30, "purple", 1000, y);
    game.bonussteine.push(bs)
}
function draw_image() {
    let img = new Image();
    img.src = 'img/face-monkey.png';
    ctx.drawImage(img, 10, 10);
}
