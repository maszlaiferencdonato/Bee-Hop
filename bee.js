let oszlopok = [];
const jatekTer = document.getElementById('jatekTer');
const oszlopSzelesseg = 60;
const resMeret = 180;

function valtsTemat(ujTema) {
    jatekTer.className = 'jatek-ter ' + ujTema;
}

function hozzaadOszlop() {
    const minMagassag = 50;
    const maxMagassag = 750 - 80 - resMeret - minMagassag;
    const felsoMagassag = Math.floor(Math.random() * (maxMagassag - minMagassag + 1)) + minMagassag;
    const alsoMagassag = 750 - 80 - felsoMagassag - resMeret;

    const felsoOszlop = document.createElement('div');
    felsoOszlop.className = 'oszlop';
    felsoOszlop.style.height = felsoMagassag + 'px';
    felsoOszlop.style.top = '0px';
    felsoOszlop.style.left = '600px';

    const alsoOszlop = document.createElement('div');
    alsoOszlop.className = 'oszlop';
    alsoOszlop.style.height = alsoMagassag + 'px';
    alsoOszlop.style.bottom = '80px';
    alsoOszlop.style.left = '600px';

    jatekTer.appendChild(felsoOszlop);
    jatekTer.appendChild(alsoOszlop);

    oszlopok.push({ felso: felsoOszlop, also: alsoOszlop, x: 600 });
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

setInterval(hozzaadOszlop, 2500);
setInterval(mozgatas, 20);

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
