function valtsTemat(ujTema) {
    const jatekTer = document.getElementById('jatekTer');
    
   
    jatekTer.className = 'jatek-ter ' + ujTema;
}

   
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

       

const playerImg = new Image();

let playerImgLoaded = false;
playerImg.onload = () => { playerImgLoaded = true; };

const bird = {
    x: 80,
    y: 200,
    width: 50,
    height: 50,
    gravity: 0.3,
    velocity: 0
};

function update() {
    
    bird.velocity += bird.gravity;
    bird.y += bird.velocity;
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