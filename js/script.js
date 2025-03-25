const juego = document.getElementById('juego');
const puntuacion = document.getElementById("score");
const startButton = document.getElementById("start-button");
const countdownDisplay = document.getElementById("countdown");

const gameOverScreen = document.createElement("div");
gameOverScreen.id = "game-over";
gameOverScreen.innerHTML = "<h2>Juego terminado</h2><p>Tu puntuación: <span id='final-score'></span></p><button id='restart-button'>Jugar de nuevo</button>";
document.body.appendChild(gameOverScreen);

const bestScoresList = document.getElementById("best-scores-list");
const lastScoresList = document.getElementById("last-scores-list");

let score = 0;
let gameActive = false;
let timeLeft = 30;
let countdownInterval;
let spawnInterval = 1000;
let maxImages = 3;

const imgtrue = "img/Imagenpruebareal.png";
const imgfalse = "img/Imagenpruebafalsal.png";

const soundSuccess = new Audio("assets/success.mp3");
const soundFail = new Audio('assets/fail.mp3');
const backgroundMusic = new Audio('assets/Background.mp3');
backgroundMusic.loop = true;
backgroundMusic.volume = 0.5;

const gameMusic = new Audio('assets/Game.mp3');
gameMusic.loop = true;
gameMusic.volume = 0.7;

window.addEventListener("load", () => {
    backgroundMusic.play();
});

function Generadordeimagenes() {
    if (!gameActive) return;

    const numImages = Math.floor(Math.random() * maxImages) + 1;
    for (let i = 0; i < numImages; i++) {
        const img = document.createElement("img");
        const esTrue = Math.random() <= 0.7;
        
        
        img.src = esTrue ? imgtrue : imgfalse;
        img.classList.add("imagen");
        
        img.dataset.esTrue = esTrue; 
        
        const maxX = juego.offsetWidth - 50;
        const maxY = juego.offsetHeight - 50;
        const randomX = Math.random() * maxX;
        const randomY = Math.random() * maxY;
        
        img.style.left = randomX + "px";
        img.style.top = randomY + "px";
        
        img.addEventListener("click", () => {
            if (gameActive) {
                if (img.dataset.esTrue === "true") {
                    score++;
                    soundSuccess.play();
                } else {
                    score--;
                    soundFail.play(); 
                }
                puntuacion.innerText = score;
            }
            img.classList.add("clicked"); 
            setTimeout(() => img.remove(), 300);
        });
        
        juego.appendChild(img);
        
        setTimeout(() => {
            if (!img.classList.contains("clicked")) {
                img.classList.add("fading");
                setTimeout(() => img.remove(), 500);
            }
        }, 5000);
    }
    setTimeout(Generadordeimagenes, spawnInterval);
}


function AjustarDificultad() {
    if (timeLeft % 10 === 0) {
        spawnInterval = Math.max(300, spawnInterval - 200);
        maxImages++;
    }
}

function CambiarImagenesBuenasAMalas() {
    setInterval(() => {
        if (!gameActive) return;
        
        const imagenes = document.querySelectorAll("#juego img");
        imagenes.forEach(img => {
            if (img.dataset.esTrue === "true") {
                img.src = imgfalse;
                img.dataset.esTrue = "false";
            }
        });
    }, 1600);
}


function saveScoreToLocalStorage(score) {
    let storedScores = localStorage.getItem("scores");
    let arrayScores = storedScores ? JSON.parse(storedScores) : [];
    arrayScores.push(score);
    localStorage.setItem("scores", JSON.stringify(arrayScores));
}

function displayScores() {
    let storedScores = localStorage.getItem("scores");
    if (!storedScores) return;
    let arrayScores = JSON.parse(storedScores);

    // Corrige el uso de template literals
    const bestScores = [...arrayScores].sort((a, b) => b - a).slice(0, 3);
    bestScoresList.innerHTML = bestScores
        .map((s, i) => `<li>${i + 1}. ${s}</li>`)
        .join('');

    const lastScores = arrayScores.slice(-5);
    lastScoresList.innerHTML = lastScores
        .map((s, i) => `<li>#${arrayScores.length - lastScores.length + i + 1}: ${s}</li>`)
        .join('');
}


startButton.addEventListener("click", () => {
    backgroundMusic.pause();
    backgroundMusic.currentTime = 0;
    gameMusic.play();

    clearInterval(countdownInterval);
    score = 0;
    puntuacion.innerText = score;
    timeLeft = 30;
    gameActive = true;
    spawnInterval = 1000;
    maxImages = 3;
    gameOverScreen.style.display = "none";

    countdownDisplay.innerText = timeLeft;

    countdownInterval = setInterval(() => {
        timeLeft--;
        countdownDisplay.innerText = timeLeft;
        AjustarDificultad();
        if (timeLeft <= 0) {
            clearInterval(countdownInterval);
            gameActive = false;
            countdownDisplay.innerText = "0";
            document.getElementById("final-score").innerText = score;
            gameOverScreen.style.display = "block";
            gameMusic.pause();
            gameMusic.currentTime = 0;
            saveScoreToLocalStorage(score);
            displayScores();
        }
    }, 1000);

    Generadordeimagenes();
    CambiarImagenesBuenasAMalas();
});

document.getElementById("restart-button").addEventListener("click", () => {
    gameOverScreen.style.display = "none";
    startButton.click();
});