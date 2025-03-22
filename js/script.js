const juego = document.getElementById('juego');
const puntuacion = document.getElementById("score");
let score = 0;

const imgtrue = "img/Imagenpruebareal.png";
const imgfalse = "img/Imagenpruebafalsa.png";

function Generadordeimagenes() {
    let img = document.createElement("img");
    let esTrue = Math.random() <= 0.5;

    img.src = esTrue ? imgtrue : imgfalse;
    img.classList.add("imagen");

    img.style.left = Math.random() * (window.innerWidth - 50) + "px";
    img.style.top = Math.random() * (window.innerHeight - 100) + "px";


    img.addEventListener("click", () => {
        if (esTrue) {
            score++;
            puntuacion.innerText = score;
        } else {
            score--;
            puntuacion.innerText = score;
        }
        
        puntuacion.innerText = score; 
        img.remove(); 
        Generadordeimagenes(); 
    });

    juego.appendChild(img);

}

for (let i = 0; i < 3; i++) {
    generarImagen();
}

window.onload = function () {
    setTimeout(() => {
        document.getElementById("pantalla-carga").classList.add("hidden");
    }, 3000);
};