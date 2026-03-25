const gameContainer = document.getElementById('game-container');
const klecksBilder = [
    "images/klecks2.png",
    "images/klecks3.png",
    "images/klecks4.png",
    "images/klecks5.png"
]
const klecksPositionen = [];
const minDistance = 100;


function createKleckse() {
    for (let i = 0; i < 30; i++) {
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
        klecks.style.left = position.x + "px";
        klecks.style.top = position.y + "px";
        klecks.style.backgroundSize = "contain";
        klecks.style.backgroundRepeat = "no-repeat";
        klecks.style.backgroundPosition = "center";

        klecksPositionen.push({x: position.x, y: position.y});

    gameContainer.appendChild(klecks);
    }
}



function getValidPosition(klecksGroesse) {      //random x,y coordinates
    const containerWidth = gameContainer.clientWidth;
    const containerHeight = gameContainer.clientHeight;


    let randomX;
    let randomY;
    let validPosition = false;

    while (!validPosition) {
        randomX = Math.floor(Math.random() * (containerWidth - klecksGroesse)); // damit es am Rand nicht rausragt
        randomY = Math.floor(Math.random() * (containerHeight - klecksGroesse));
        validPosition = true;

        for (const pos of klecksPositionen) {
            const dx = randomX - pos.x;
            const dy = randomY - pos.y;
            const distance = Math.sqrt(dx * dx + dy * dy); 

            if(minDistance > distance) {
                validPosition = false;
                break;
            }
        }
    }
    return {x: randomX, y: randomY};
}

function randomSize () {
    const min = 75;
    const max = 125;
    const size = Math.random() * (max - min) + min;
    return size;
}


createKleckse();