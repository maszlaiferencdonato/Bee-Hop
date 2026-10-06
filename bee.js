let oszlopok = [];
const jatekTer = document.getElementById('jatekTer');
const mehecskeElem = document.getElementById('mehecske');
const pontszamElem = document.getElementById('pontszam');
const vegsoPontszamElem = document.getElementById('vegsoPontszam');
const startKepernyo = document.getElementById('startKepernyo');
const gameOverKepernyo = document.getElementById('gameOverKepernyo');

const rekordPontszamElem = document.getElementById('rekordPontszam');
const startRekordPontszamElem = document.getElementById('startRekordPontszam');

const oszlopSzelesseg = 60;
const resMeret = 180;
const talajMagassag = 80;
const canvasMagassag = 750;

let oszlopIdozito = null;
let jatekCiklusId = null;
let jatekFuto = false;
let pontszam = 0;

let rekordPontszam = localStorage.getItem('beeHopRekord') ? parseInt(localStorage.getItem('beeHopRekord')) : 0;

frissitRekordKijelzest();

function frissitRekordKijelzest() {
    if (rekordPontszamElem) rekordPontszamElem.textContent = rekordPontszam;
    if (startRekordPontszamElem) startRekordPontszamElem.textContent = rekordPontszam;
}

const mehecske = {
    x: 80,
    y: 200,
    szelesseg: 50,
    magassag: 50,
    gravitacio: 0.4,
    sebesseg: 3,
    ugrasEro: -9
};

function valtsTemat(ujTema, gombElem) {
    jatekTer.className = 'jatek-ter ' + ujTema;

    if (gombElem) {
        document.querySelectorAll('.tema-kartya').forEach(k => k.classList.remove('aktiv'));
        gombElem.classList.add('aktiv');
    }
}

function jatekInditasa() {
    oszlopok.forEach(o => {
        if (o.felso) o.felso.remove();
        if (o.also) o.also.remove();
    });
    oszlopok = [];

    pontszam = 0;
    if (pontszamElem) {
        pontszamElem.textContent = pontszam;
        pontszamElem.style.display = 'block';
    }

    mehecske.y = 200;
    mehecske.sebesseg = 0;
    mehecskeElem.style.left = mehecske.x + 'px';
    mehecskeElem.style.top = mehecske.y + 'px';
    mehecskeElem.style.display = 'block';

    if (startKepernyo) startKepernyo.style.display = 'none';
    if (gameOverKepernyo) gameOverKepernyo.style.display = 'none';

    jatekFuto = true;

    clearInterval(oszlopIdozito);
    if (jatekCiklusId) cancelAnimationFrame(jatekCiklusId);

    oszlopIdozito = setInterval(hozzaadOszlop, 1400);
    jatekCiklus();
}

function menubeVissza() {
    jatekFuto = false;
    clearInterval(oszlopIdozito);
    if (jatekCiklusId) cancelAnimationFrame(jatekCiklusId);

    oszlopok.forEach(o => {
        if (o.felso) o.felso.remove();
        if (o.also) o.also.remove();
    });
    oszlopok = [];

    mehecskeElem.style.display = 'none';
    if (pontszamElem) pontszamElem.style.display = 'none';

    frissitRekordKijelzest();

    if (gameOverKepernyo) gameOverKepernyo.style.display = 'none';
    if (startKepernyo) startKepernyo.style.display = 'flex';
}

function hozzaadOszlop() {
    if (!jatekFuto) return;

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
        alsoMagassag: alsoMagassag,
        atlepve: false
    });
}

function ugras() {
    if (jatekFuto) {
        mehecske.sebesseg = mehecske.ugrasEro;
    }
}

window.addEventListener("keydown", function (event) {
    if (event.code === "Space") {
        event.preventDefault();
        ugras();
    }
});

window.addEventListener("click", function (event) {
    if (event.target.closest('button')) return;
    ugras();
});

function ellenorizUtkozes(o) {
    const hitX = (mehecske.x + mehecske.szelesseg > o.x) && (mehecske.x < o.x + oszlopSzelesseg);

    if (hitX) {
        const hitFelso = mehecske.y < o.felsoMagassag;
        const hitAlso = (mehecske.y + mehecske.magassag) > (canvasMagassag - talajMagassag - o.alsoMagassag);
        if (hitFelso || hitAlso) {
            return true;
        }
    }
    return false;
}

function jatekCiklus() {
    if (!jatekFuto) return;

    mehecske.sebesseg += mehecske.gravitacio;
    mehecske.y += mehecske.sebesseg;

    if (mehecske.y <= 0 || mehecske.y + mehecske.magassag >= canvasMagassag - talajMagassag) {
        gameOver();
        return;
    }

    mehecskeElem.style.top = mehecske.y + 'px';

    for (let i = 0; i < oszlopok.length; i++) {
        let o = oszlopok[i];
        o.x -= 3.5;
        o.felso.style.left = o.x + 'px';
        o.also.style.left = o.x + 'px';

        if (ellenorizUtkozes(o)) {
            gameOver();
            return;
        }

        if (!o.atlepve && o.x + oszlopSzelesseg < mehecske.x) {
            o.atlepve = true;
            pontszam++;
            if (pontszamElem) pontszamElem.textContent = pontszam;
        }

        if (o.x < -oszlopSzelesseg) {
            o.felso.remove();
            o.also.remove();
            oszlopok.splice(i, 1);
            i--;
        }
    }

    jatekCiklusId = requestAnimationFrame(jatekCiklus);
}

function gameOver() {
    jatekFuto = false;
    clearInterval(oszlopIdozito);
    if (jatekCiklusId) cancelAnimationFrame(jatekCiklusId);

    mehecskeElem.style.display = 'none';

    if (pontszamElem) {
        pontszamElem.style.display = 'none';
    }

    if (pontszam > rekordPontszam) {
        rekordPontszam = pontszam;
        localStorage.setItem('beeHopRekord', rekordPontszam);
    }

    if (vegsoPontszamElem) {
        vegsoPontszamElem.textContent = pontszam;
    }

    frissitRekordKijelzest();

    if (gameOverKepernyo) {
        gameOverKepernyo.style.display = 'flex';
    }
}