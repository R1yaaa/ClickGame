const gameContainer = document.getElementById('game-container');
const klecksBilder = [
    "assets/images/klecks2.png",
    "assets/images/klecks6.PNG",
    "assets/images/klecks7.png",
    "assets/images/klecks8.png",
    "assets/images/klecks10.png",
    "assets/images/klecks11.png",
    "assets/images/klecks12.png",
    "assets/images/klecks13.png",
    "assets/images/klecks14.png",
    "assets/images/klecks15.png",
    "assets/images/klecks16.png",
    "assets/images/klecks17.png",
    "assets/images/klecks18.png"
]
const klecksPositionen = [];
const minDistance = 25;
// const maxRespawns = 0;
let clickCount = 0;
spawnedKlecksCount = 0;
let gameStarted = false;

gameContainer.addEventListener('touchstart', (e) => {
    if (e.target.classList.contains('klecks')) {
        e.preventDefault();
    }
}, { passive: false });



function createKleckse(anzahl) {
    for (let i = 0; i < anzahl; i++) {
        const randomIndex = Math.floor(Math.random() * klecksBilder.length);
        const randomBild = klecksBilder[randomIndex];

        const klecksSize = randomSize();

        const klecks = document.createElement("div");
        klecks.classList.add("klecks");
        klecks.style.backgroundImage = `url("${randomBild}")`;
        klecks.style.width = klecksSize + "px";
        klecks.style.height = klecksSize + "px";
        klecks.style.position = "absolute";
        const position = getValidPosition(klecksSize);

        if (!position) {
            continue;
        }

        klecks.style.left = position.x + "px";
        klecks.style.top = position.y + "px";
        klecks.style.backgroundSize = "contain";
        klecks.style.backgroundRepeat = "no-repeat";
        klecks.style.backgroundPosition = "center";
        // klecks.dataset.respawnsLeft = maxRespawns;

        const posObj = { x: position.x, y: position.y, size: klecksSize };
        klecksPositionen.push(posObj);

    gameContainer.appendChild(klecks);
    spawnedKlecksCount++;

    if (gameStarted && !gameFinished && spawnedKlecksCount % 10 === 0) {
        showTauntPopup();
    }

    klecks.addEventListener("pointerdown", (e) => {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        
        if (klecks.dataset.removing === "true") return;
        klecks.dataset.removing = "true";
        // let respawnsLeft = Number(klecks.dataset.respawnsLeft);
        clickCount++;
        const index = klecksPositionen.indexOf(posObj);

        if (index !== -1) {
            klecksPositionen.splice(index, 1);
        }
        klecks.remove();

        if (!messageStillCovered()) {
            showFinalPopup();
        }

        if (clickCount % 3 === 0) {
            createKleckse(1);
        }
        }, { passive: false });
    }
}


function getValidPosition(klecksGroesse) {
    const containerWidth = gameContainer.clientWidth;
    const containerHeight = gameContainer.clientHeight;

    let randomX;
    let randomY;
    let validPosition = false;

    while (!validPosition) {
        const offset = klecksGroesse * 0.25; //ränder voller

        const minX = -offset;
        const minY = -offset;
        const maxX = containerWidth - klecksGroesse + offset;
        const maxY = containerHeight - klecksGroesse + offset;

        randomX = Math.floor(Math.random() * (maxX - minX + 1)) + minX;
        randomY = Math.floor(Math.random() * (maxY - minY + 1)) + minY;

        validPosition = true;

        for (const pos of klecksPositionen) {
            const dx = randomX - pos.x;
            const dy = randomY - pos.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (minDistance > distance) {
                validPosition = false;
                break;
            }
        }
    }

    return { x: randomX, y: randomY };
}

function randomSize () {
    const screenWidth = window.innerWidth;
    let min;
    let max;

    if (screenWidth < 768) { //phone
        min = 110;
        max = 130;
    }
    else if (screenWidth < 1200) { //ipad/laptop
        min = 140;
        max = 200;
    }
    else if (screenWidth < 1700) { //Desktop/laptop
        min = 200;
        max = 240;
    }
    else {
        min = 260;
        max = 320;
    }

    const size = Math.random() * (max - min) + min;
    return size;
}

document.addEventListener( //prevent zooming
  "dblclick",
  function (event) {
    event.preventDefault();
  },
  { passive: false }
);

function getInitialKlecksCount() {
    const containerWidth = gameContainer.clientWidth;
    const containerHeight = gameContainer.clientHeight;
    const area = containerWidth * containerHeight;

    if (area < 500000) {
        return 20;
    } else if (area < 900000) {
        return 180;
    }
    else if (area < 1100000) {
        return 210;
    } else if (area < 1400000) {
        return 340;
    } else {
        return 400;
    }
}

const tauntPopup = document.getElementById("taunt-popup");
const tauntText = tauntPopup.querySelector(".taunt-text");
let tauntActive = true;
let finalPopupShown = false;
let gameFinished = false;
let tauntTimeout = null;

function showTauntPopup(text = "Ätsch!") {
    if (gameFinished) return;
    if (!tauntActive) return;

    if (!messageStillCovered()) {
        showFinalPopup();
        return;
    }

    tauntPopup.classList.remove("left", "right");

    const side = Math.random() < 0.5 ? "left" : "right";    //randomly choose left or right
    tauntPopup.classList.add(side, "show");

    tauntText.textContent = text;
    if (text === "Ätsch!") {
        playTauntSound();
    }

    clearTimeout(tauntTimeout);

    tauntTimeout = setTimeout(() => {
        if (!gameFinished) {
            tauntPopup.classList.remove("show");
        }
    }, 2500);                                               //disappear after 2,5s
}

/*
function startTauntLoop() {
    if (gameFinished) return;

    const delay = Math.random() * 10000 + 10000;        //between 10s and 20s

    setTimeout(() => {
        if (gameFinished) return;

        if (!messageStillCovered()) {
            showFinalPopup();
            return;
        }

        if (tauntActive) {
            showTauntPopup();
            startTauntLoop();
        }
    }, delay);
} 
*/

const audio1 = document.getElementById('audio-1');
const audio2 = document.getElementById('audio-2');

function playTauntSound() {
    const random = Math.random();
    const audio = random < 0.5 ? audio1 : audio2;
    audio.currentTime = 0;
    audio.play();
}


function rectsOverlap(rect1, rect2) {   //true if no overlapping
    return !(
        rect1.right < rect2.left ||
        rect1.left > rect2.right ||
        rect1.bottom < rect2.top ||
        rect1.top > rect2.bottom
    );
}

function messageStillCovered() {
    const message = document.querySelector(".hidden-message");
    const kleckse = document.querySelectorAll(".klecks");

    if (!message) return false;

    const rect = message.getBoundingClientRect();

    const checkRect = {                             //ignore 30% of the border
        left: rect.left + rect.width * 0.3,
        right: rect.right - rect.width * 0.3,
        top: rect.top + rect.height * 0.3,
        bottom: rect.bottom - rect.height * 0.3
    };

    for (const klecks of kleckse) {
        const klecksRect = klecks.getBoundingClientRect();

        if (rectsOverlap(checkRect, klecksRect)) {
            return true;
        }
    }

    return false;
}

function showFinalPopup() {
    if (finalPopupShown) return;

    finalPopupShown = true;
    gameFinished = true;
    tauntActive = false;

    clearTimeout(tauntTimeout);

    tauntPopup.classList.remove("left", "right");
    tauntPopup.classList.add("left", "show");

    tauntPopup.style.left = "20%";
    tauntPopup.style.right = "auto";

    // tauntPopup.style.animation = "none";

    tauntText.textContent = "Menno!";
}








createKleckse(getInitialKlecksCount());
gameStarted = true;


