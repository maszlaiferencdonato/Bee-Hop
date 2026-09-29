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

function valtsTemat(ujTema, gombElem) {
    jatekTer.className = 'jatek-ter ' + ujTema;
    
    if (gombElem) {
        document.querySelectorAll('.tema-kartya').forEach(k => k.classList.remove('aktiv'));
        gombElem.classList.add('aktiv');
    }
}

function ugras() {
    if (!jatekFuto) return;
    mehecske.sebesseg = mehecske.ugrasEro;
}

function jatekInditasa() {
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

    
    const startKepernyo = document.getElementById('startKepernyo');
    if (startKepernyo) {
        startKepernyo.style.display = 'flex';
    }
}