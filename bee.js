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


function valtsTemat(ujTema, gombElem) {
    jatekTer.className = 'jatek-ter ' + ujTema;
    
    if (gombElem) {
        document.querySelectorAll('.tema-kartya').forEach(k => k.classList.remove('aktiv'));
        gombElem.classList.add('aktiv');
    }
}

valtsTemat('tema-nappal');

const playerImg = new Image();
playerImg.src = "mehecske.png";

function jatekInditasa() {
let playerImgLoaded = false;
playerImg.onload = () => { playerImgLoaded = true; };

const bird = {
    x: 80,
    y: 200,
    width: 50,
    height: 50,
    gravity: 0.55,
    velocity: 2,
    jumpStrength: -9 
};

function restartGame() {
    oszlopok.forEach(o => {
        o.felso.remove();
        o.also.remove();
    });
    oszlopok = [];
    mehecske.y = 200;
    mehecske.sebesseg = 0;

    const startKepernyo = document.getElementById('startKepernyo');
    if (startKepernyo) startKepernyo.style.display = 'none';

    jatekFuto = true;
    clearInterval(oszlopIdozito);
    oszlopIdozito = setInterval(hozzaadOszlop, 2500);
    requestAnimationFrame(jatekCiklus);
}

window.addEventListener("keydown", function(event) {
    if (event.code === "Space") {
        event.preventDefault();
        if (jatekFuto) {
            ugras();
        }
    }
});

window.addEventListener("click", function(event) {
    if (event.target.closest('button')) return;
    if (jatekFuto) {
        ugras();
    }
});


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

function ellenorizUtkozes(o) {
    
    if (mehecske.y + mehecske.magassag >= 670 || mehecske.y <= 0) {
        return true;
    }

    
    if (mehecske.x + mehecske.szelesseg > o.x && mehecske.x < o.x + oszlopSzelesseg) {
        if (mehecske.y < o.felsoMagassag || mehecske.y + mehecske.magassag > o.alsoTop) {
            return true;
        }
    }

    return false;
function mozgatas() {
    for (let i = 0; i < oszlopok.length; i++) {
        let o = oszlopok[i];
        o.x -= 3.5;
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

oszlopInterval = setInterval(hozzaadOszlop, 1600);
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

    mehecske.sebesseg += mehecske.gravitacio;
    mehecske.y += mehecske.sebesseg;

    
    if (mehecske.y <= 0) {
        mehecske.y = 0;
        mehecskeElem.style.top = '0px';
        gameOver();
        return;
    }

    
    if (mehecske.y + mehecske.magassag >= 670) {
        mehecske.y = 670 - mehecske.magassag;
        mehecskeElem.style.top = mehecske.y + 'px';
        gameOver();
        return;
    }

    mehecskeElem.style.left = mehecske.x + 'px';
    mehecskeElem.style.top = mehecske.y + 'px';
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

function gameOver() {
    jatekFuto = false;
    clearInterval(oszlopIdozito);

    
    const startKepernyo = document.getElementById('startKepernyo');
    if (startKepernyo) {
        startKepernyo.style.display = 'flex';
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (playerImgLoaded) {
        ctx.drawImage(playerImg, bird.x, bird.y, bird.width, bird.height);
    }
   
}

function loop() {
    update();
    draw();
    requestAnimationFrame(loop);
}

loop();
