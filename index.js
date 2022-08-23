//HTMLのmyCanvasをJSではcanvasと定義する
const canvas = document.getElementById("myCanvas");

//2Dで描画するための変数をctxとする
const ctx = canvas.getContext("2d");

let state = 0;
//ボールの初期値

var ballRadius = canvas.width / 100;
var x = canvas.width / 2;
var y = canvas.height - 30;
var dx = canvas.width / 240;
var dy = canvas.width / 240;

//パドルの初期値

let paddleHeight = canvas.height / 48;
let paddleWidth = canvas.width / 6.4;
let paddleX = (canvas.width - paddleWidth) / 2;
let rightPressed = false;
let leftPressed = false;
//ブロックの初期値
let blockRowCount = 5;
let blockColumnCount = 3;
let blockWidth = canvas.width / 6.4;
let blockHeight = canvas.height / 15;
let blockPadding = (canvas.width + canvas.height) / 80;
let blockOffsetTop = canvas.height / 10;
let blockOffsetLeft = canvas.width / 16;
//スコアとライフの初期値
let score = 0;
let lives = 3;

var blocks = [];
for (var c = 0; c < blockColumnCount; c++) {
    blocks[c] = [];
    for (var r = 0; r < blockRowCount; r++) {
        blocks[c][r] = { x: 0, y: 0, status: 1 };
    }
}

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
//document.addEventListener("mousemove", mouseMoveHandler, false);

//矢印キーで操作
function keyDownHandler(e) {
    if (e.key == "Right" || e.key == "ArrowRight") {
        rightPressed = true;
    }
    else if (e.key == "Left" || e.key == "ArrowLeft") {
        leftPressed = true;
    }
}
function keyUpHandler(e) {
    if (e.key == "Right" || e.key == "ArrowRight") {
        rightPressed = false;
    }
    else if (e.key == "Left" || e.key == "ArrowLeft") {
        leftPressed = false;
    }
}
/*
//マウスでパドルを操作
function mouseMoveHandler(e) {
    var relativeX = e.clientX - canvas.offsetLeft;
    if (relativeX > 0 && relativeX < canvas.width) {
        paddleX = relativeX - paddleWidth / 2;
    }
}
*/
//衝突判定
function collisionDetection() {
    for (var c = 0; c < blockColumnCount; c++) {
        for (var r = 0; r < blockRowCount; r++) {
            var b = blocks[c][r];
            if (b.status == 1) {
                if (x + ballRadius > b.x && x - ballRadius < b.x + blockWidth && y + ballRadius > b.y && y - ballRadius < b.y + blockHeight) {
                    dy = -dy;
                    b.status = 0;
                    score++;
                    if (score == blockRowCount * blockColumnCount) {
                        alert("YOU WIN, CONGRATS!");
                        document.location.reload();
                    }
                }
            }
        }
    }
}
//ボールを描画
function drawBall() {
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
}//パドルを描画
function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
}
//ブロックを描画
function drawblocks() {
    for (var c = 0; c < blockColumnCount; c++) {
        for (var r = 0; r < blockRowCount; r++) {
            if (blocks[c][r].status == 1) {
                var blockX = (r * (blockWidth + blockPadding)) + blockOffsetLeft;
                var blockY = (c * (blockHeight + blockPadding)) + blockOffsetTop;
                blocks[c][r].x = blockX;
                blocks[c][r].y = blockY;
                ctx.beginPath();
                ctx.rect(blockX, blockY, blockWidth, blockHeight);
                ctx.fillStyle = "#0095DD";
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}
//スコアを表示する
function drawScore() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#111111";
    ctx.fillText("Score: " + score, 8, 20);
}
//ライフを表示する
function drawLives() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#111111";
    ctx.fillText("Lives: " + lives, canvas.width - 65, 20);
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawblocks();
    drawBall();
    drawPaddle();
    drawScore();
    drawLives();
    collisionDetection();

    if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
        dx = -dx;
    }
    if (y + dy < ballRadius) {
        dy = -dy;
    }
    else if (y + dy > canvas.height - ballRadius * 2.5) {
        if (x > paddleX && x < paddleX + paddleWidth) {
            dy = -dy;
        }
        else {
            lives--;
            if (!lives) {
                alert("GAME OVER");
                document.location.reload();
            }
            else {
                x = canvas.width / 2;
                y = canvas.height - 30;
                dx = canvas.width / 240;;
                dy = canvas.width / 240;;
                paddleX = (canvas.width - paddleWidth) / 2;
            }
        }
    }

    if (rightPressed && paddleX < canvas.width - paddleWidth) {
        paddleX += canvas.width / 46;
    }
    else if (leftPressed && paddleX > 0) {
        paddleX -= canvas.width / 46;
    }

    x += dx;
    y += dy;
    requestAnimationFrame(draw);
}
//タイトル
function title() {
    ctx.font = "96px Courier";
    ctx.fillStyle = "#111111";
    ctx.fillText("ブロック崩し", (canvas.width / 2) - (96 * 3), canvas.height / 2);
}
function message() {
    ctx.font = "32px Courier";
    ctx.fillStyle = "#111111";
    ctx.fillText("Press S Key", (canvas.width / 2) - (16 * 10), canvas.height / 4 * 3);
}

function start() {
    title();
    message();
    document.addEventListener('keydown', event => {
        if (event.key === "s") {
            draw();
        }
    });
}

start();

