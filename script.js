const gameContainer = document.getElementById('game-container');
const klecksBilder = [
    "images/klecks2.png",
    "images/klecks3.png",
    "images/klecks4.png",
    "images/klecks5.png",
    "images/klecks6.PNG",
    "images/klecks7.png",
    "images/klecks8.png",
    "images/klecks9.PNG",
    "images/klecks10.png"
]
const klecksPositionen = [];
const minDistance = 25;
// const maxRespawns = 0;
let clickCount = 0;

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

function showTauntPopup() {
    tauntPopup.classList.remove("left", "right");
    const side = Math.random() < 0.5 ? "left" : "right";        //randomly choose left or right
    tauntPopup.classList.add(side, "show");

    setTimeout(() => {
        tauntPopup.classList.remove("show");                    //hide after 2.5s
    }, 2500);                       
}

function startTauntLoop() {
    const delay = Math.random() * 10000 + 10000; //between 10s and 20s

    setTimeout(() => {
        showTauntPopup();
        startTauntLoop();
    }, delay);
}

createKleckse(getInitialKlecksCount());

startTauntLoop();

