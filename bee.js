function valtsTemat(ujTema) {
    const jatekTer = document.getElementById('jatekTer');
    jatekTer.className = 'jatek-ter ' + ujTema;
}

valtsTemat('tema-nappal');

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const playerImg = new Image();
playerImg.src = "mehecske.png";
let playerImgLoaded = false;
playerImg.onload = () => { playerImgLoaded = true; };

const bird = {
    x: 80,
    y: 200,
    width: 50,
    height: 50,
    gravity: 0.3,
    velocity: 0,
    jumpStrength: -7 
};

function jump() {
    bird.velocity = bird.jumpStrength;
}

window.addEventListener("keydown", function(event) {
    if (event.code === "Space") {
        event.preventDefault(); 
        jump();
    }
});

window.addEventListener("click", function() {
    jump();
});

function update() {
    bird.velocity += bird.gravity;
    bird.y += bird.velocity;

    if (bird.y < 0) {
        bird.y = 0;
        bird.velocity = 0;
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (playerImgLoaded) {
        ctx.drawImage(playerImg, bird.x, bird.y, bird.width, bird.height);
    } else {
        ctx.fillStyle = "#ffeb3b";
        ctx.fillRect(bird.x, bird.y, bird.width, bird.height);
    }
}

function loop() {
    update();
    draw();
    requestAnimationFrame(loop);
}

loop();