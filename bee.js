let oszlopok = [];
const jatekTer = document.getElementById('jatekTer');
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const oszlopSzelesseg = 60; 
const resMeret = 180;        
const talajMagassag = 80;   
const canvasMagassag = 750;

let oszlopInterval;
let mozgatasInterval;


function valtsTemat(ujTema) {
    jatekTer.className = 'jatek-ter ' + ujTema;
}

valtsTemat('tema-nappal');

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

function restartGame() {
    oszlopok.forEach(o => {
        o.felso.remove();
        o.also.remove();
    });
    oszlopok = [];

    bird.y = 200;
    bird.velocity = 0;
}

function hozzaadOszlop() {
    const minMagassag = 50;
    const maxMagassag = canvasMagassag - talajMagassag - resMeret - minMagassag;
    const felsoMagassag = Math.floor(Math.random() * (maxMagassag - minMagassag + 1)) + minMagassag;
    const alsoMagassag = canvasMagassag - talajMagassag - felsoMagassag - resMeret;

    const felsoOszlop = document.createElement('div');
    felsoOszlop.className = 'oszlop';
    felsoOszlop.style.height = felsoMagassag + 'px';
    felsoOszlop.style.top = '0px';
    felsoOszlop.style.left = '600px';

    const alsoOszlop = document.createElement('div');
    alsoOszlop.className = 'oszlop';
    alsoOszlop.style.height = alsoMagassag + 'px';
    alsoOszlop.style.bottom = talajMagassag + 'px';
    alsoOszlop.style.left = '600px';

    jatekTer.appendChild(felsoOszlop);
    jatekTer.appendChild(alsoOszlop);

    oszlopok.push({ 
        felso: felsoOszlop, 
        also: alsoOszlop, 
        x: 600,
        felsoMagassag: felsoMagassag,
        alsoMagassag: alsoMagassag
    });
}

function mozgatas() {
    for (let i = 0; i < oszlopok.length; i++) {
        let o = oszlopok[i];
        o.x -= 2;
        o.felso.style.left = o.x + 'px';
        o.also.style.left = o.x + 'px';

        if (o.x < -oszlopSzelesseg) {
            o.felso.remove();
            o.also.remove();
            oszlopok.splice(i, 1);
            i--;
        }
    }
}

oszlopInterval = setInterval(hozzaadOszlop, 2500);
mozgatasInterval = setInterval(mozgatas, 20);

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

function checkCollisions() {
    if (bird.y <= 0) {
        restartGame();
        return;
    }

    if (bird.y + bird.height >= canvasMagassag - talajMagassag) {
        restartGame();
        return;
    }

    for (let i = 0; i < oszlopok.length; i++) {
        let o = oszlopok[i];

        let hitX = (bird.x + bird.width > o.x) && (bird.x < o.x + oszlopSzelesseg);

        if (hitX) {
            let hitFelso = bird.y < o.felsoMagassag;

            let hitAlso = (bird.y + bird.height) > (canvasMagassag - talajMagassag - o.alsoMagassag);

            if (hitFelso || hitAlso) {
                restartGame();
                return;
            }
        }
    }
}

function update() {
    bird.velocity += bird.gravity;
    bird.y += bird.velocity;

    checkCollisions();
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
