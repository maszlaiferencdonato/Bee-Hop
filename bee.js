let oszlopok = [];
const jatekTer = document.getElementById('jatekTer');
const mehecskeElem = document.getElementById('mehecske');
const pontszamElem = document.getElementById('pontszam');
const vegsoPontszamElem = document.getElementById('vegsoPontszam');
const startKepernyo = document.getElementById('startKepernyo');
const gameOverKepernyo = document.getElementById('gameOverKepernyo');

const ALAP_SZELÉSSEG = 600;
const ALAP_MAGASSAG = 750;

const oszlopSzelesseg = 60;
const resMeret = 180;
const talajMagassag = 80;

let oszlopIdozito = null;
let jatekCiklusId = null;
let jatekFuto = false;
let pontszam = 0;

function getSkala() {
    return jatekTer.clientWidth / ALAP_SZELÉSSEG;
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

    frissitMehecskePozicio();
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

    if (gameOverKepernyo) gameOverKepernyo.style.display = 'none';
    if (startKepernyo) startKepernyo.style.display = 'flex';
}

function hozzaadOszlop() {
    if (!jatekFuto) return;

    const minMagassag = 50;
    const maxMagassag = ALAP_MAGASSAG - talajMagassag - resMeret - minMagassag;
    const felsoMagassag = Math.floor(Math.random() * (maxMagassag - minMagassag + 1)) + minMagassag;
    const alsoMagassag = ALAP_MAGASSAG - talajMagassag - felsoMagassag - resMeret;

    const felsoOszlop = document.createElement('div');
    felsoOszlop.className = 'oszlop';

    const alsoOszlop = document.createElement('div');
    alsoOszlop.className = 'oszlop';

    jatekTer.appendChild(felsoOszlop);
    jatekTer.appendChild(alsoOszlop);

    const ujOszlop = {
        felso: felsoOszlop,
        also: alsoOszlop,
        x: ALAP_SZELÉSSEG,
        felsoMagassag: felsoMagassag,
        alsoMagassag: alsoMagassag,
        atlepve: false
    };

    frissitOszlopPozicio(ujOszlop);
    oszlopok.push(ujOszlop);
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

window.addEventListener("pointerdown", function (event) {
    if (event.target.closest('button')) return;
    ugras();
});

function ellenorizUtkozes(o) {
    const hitX = (mehecske.x + mehecske.szelesseg > o.x) && (mehecske.x < o.x + oszlopSzelesseg);

    if (hitX) {
        const hitFelso = mehecske.y < o.felsoMagassag;
        const hitAlso = (mehecske.y + mehecske.magassag) > (ALAP_MAGASSAG - talajMagassag - o.alsoMagassag);
        if (hitFelso || hitAlso) {
            return true;
        }
    }
    return false;
}

function frissitMehecskePozicio() {
    const skala = getSkala();
    mehecskeElem.style.left = (mehecske.x * skala) + 'px';
    mehecskeElem.style.top = (mehecske.y * skala) + 'px';
    mehecskeElem.style.width = (mehecske.szelesseg * skala) + 'px';
    mehecskeElem.style.height = (mehecske.magassag * skala) + 'px';
}

function frissitOszlopPozicio(o) {
    const skala = getSkala();
    const oszlopPxSzelesseg = oszlopSzelesseg * skala;

    o.felso.style.width = oszlopPxSzelesseg + 'px';
    o.felso.style.height = (o.felsoMagassag * skala) + 'px';
    o.felso.style.top = '0px';
    o.felso.style.left = (o.x * skala) + 'px';

    o.also.style.width = oszlopPxSzelesseg + 'px';
    o.also.style.height = (o.alsoMagassag * skala) + 'px';
    o.also.style.bottom = (talajMagassag * skala) + 'px';
    o.also.style.left = (o.x * skala) + 'px';
}

function jatekCiklus() {
    if (!jatekFuto) return;

    mehecske.sebesseg += mehecske.gravitacio;
    mehecske.y += mehecske.sebesseg;

    if (mehecske.y <= 0 || mehecske.y + mehecske.magassag >= ALAP_MAGASSAG - talajMagassag) {
        gameOver();
        return;
    }

    frissitMehecskePozicio();

    for (let i = 0; i < oszlopok.length; i++) {
        let o = oszlopok[i];
        o.x -= 3.5;
        
        frissitOszlopPozicio(o);

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

    if (vegsoPontszamElem) {
        vegsoPontszamElem.textContent = pontszam;
    }

    if (gameOverKepernyo) {
        gameOverKepernyo.style.display = 'flex';
    }
}

window.addEventListener('resize', () => {
    if (jatekFuto) {
        frissitMehecskePozicio();
        oszlopok.forEach(o => frissitOszlopPozicio(o));
    }
});