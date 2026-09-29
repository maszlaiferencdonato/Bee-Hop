let oszlopok = [];
const jatekTer = document.getElementById('jatekTer');
const mehecskeElem = document.getElementById('mehecske');

const oszlopSzelesseg = 60;
const resMeret = 180;
let jatekFuto = false;
let oszlopIdozito = null;

const mehecske = {
    x: 80,
    y: 200,
    szelesseg: 50,
    magassag: 50,
    gravitacio: 0.35,
    sebesseg: 0,
    ugrasEro: -7.5
};

function valtsTemat(ujTema) {
    jatekTer.className = 'jatek-ter ' + ujTema;
}

function ugras() {
    if (!jatekFuto) return;
    mehecske.sebesseg = mehecske.ugrasEro;
}

function jatekInditasa() {
    if (jatekFuto) return;

    oszlopok.forEach(o => {
        o.felso.remove();
        o.also.remove();
    });
    oszlopok = [];
    mehecske.y = 200;
    mehecske.sebesseg = 0;

    const startKepernyo = document.getElementById('startKepernyo');
    if (startKepernyo) {
        startKepernyo.style.display = 'none';
    }

    jatekFuto = true;
    oszlopIdozito = setInterval(hozzaadOszlop, 2500);
    requestAnimationFrame(jatekCiklus);
}

function mutatPontszamok() {
    alert("Legmagasabb pontszám: " + (localStorage.getItem("beeHopHighScore") || 0));
}

window.addEventListener("keydown", function(event) {
    if (event.code === "Space") {
        event.preventDefault();
        const startKepernyo = document.getElementById('startKepernyo');
        if (!jatekFuto && startKepernyo && startKepernyo.style.display !== 'none') {
            jatekInditasa();
        } else {
            ugras();
        }
    }
});

window.addEventListener("click", function(event) {
    if (event.target.tagName === 'BUTTON') return;

    const startKepernyo = document.getElementById('startKepernyo');
    if (!jatekFuto && startKepernyo && startKepernyo.style.display !== 'none') {
        jatekInditasa();
    } else {
        ugras();
    }
});

function hozzaadOszlop() {
    if (!jatekFuto) return;

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

    oszlopok.push({ 
        felso: felsoOszlop, 
        also: alsoOszlop, 
        x: 600,
        felsoMagassag: felsoMagassag,
        alsoTop: felsoMagassag + resMeret
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
}

function jatekCiklus() {
    if (!jatekFuto) return;

    mehecske.sebesseg += mehecske.gravitacio;
    mehecske.y += mehecske.sebesseg;
    mehecskeElem.style.left = mehecske.x + 'px';
    mehecskeElem.style.top = mehecske.y + 'px';

    for (let i = 0; i < oszlopok.length; i++) {
        let o = oszlopok[i];
        o.x -= 2;
        o.felso.style.left = o.x + 'px';
        o.also.style.left = o.x + 'px';

        if (ellenorizUtkozes(o)) {
            gameOver();
            return;
        }

        if (o.x < -oszlopSzelesseg) {
            o.felso.remove();
            o.also.remove();
            oszlopok.splice(i, 1);
            i--;
        }
    }

    requestAnimationFrame(jatekCiklus);
}

function gameOver() {
    jatekFuto = false;
    clearInterval(oszlopIdozito);
}