let index = 0;
/* Parte di codice della Home */
function moveSlide(direction) {
  const slides = document.querySelector('.slides');
  const totalSlides = slides.children.length;
  const slide = slides.children[0];
  const slideStyle = getComputedStyle(slide);
  const slideWidth = slide.offsetWidth + parseInt(slideStyle.marginRight || 0);

  const visibleArea = slides.parentElement.offsetWidth;
  const totalWidth = slideWidth * totalSlides;
  const maxTranslate = totalWidth - visibleArea;

  let newIndex = index + direction;
  if (newIndex < 0) newIndex = 0;

  // Calcola la traslazione in pixel
  let translate = newIndex * slideWidth;
  // Se la traslazione supera il massimo, blocca al massimo consentito
  if (translate > maxTranslate) {
    translate = maxTranslate;
    // aggiorna anche l'indice per evitare di andare oltre
    newIndex = Math.floor(maxTranslate / slideWidth);
  }

  index = newIndex;
  slides.style.transform = `translateX(-${translate}px)`;
}
/* ######################## */

/** SEZIONE DALTONICI E DISLESSICI
*   Questa sezione permette di attivare una modalità per i daltonici e per i dislessici
*   banalmente, quando si clicca sull'icona, viene aggiunta una classe al body
*   che quindi applica il realtivo stile CSS a tutti i propri figli
*   cioè a tutto il documento
*/
document.addEventListener('DOMContentLoaded', function() {
  const colorblindIcon = document.getElementById('colorblind-icon');
  const dyslexiaIcon = document.getElementById('dyslexia-icon');
  if (colorblindIcon) {
    colorblindIcon.addEventListener('click', function() {
      document.body.classList.toggle('colorblind-mode');
    });
  }
  if (dyslexiaIcon) {
    dyslexiaIcon.addEventListener('click', function() {
      console.log("Toggling dyslexic mode");
      document.body.classList.toggle('dyslexic-mode');
    });
  }
});
/* ######################################################### */

/* Manipolazione del database per ricondurci ad un JSON */
const config = {
  locateFile: file => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.6.2/${file}`
};

fetch('http://127.0.0.1:8000/composers/') //riga che fa una HTTP request alle API create
  .then(async res => {
    const json = await res.json();
    if (!res.ok) {
      // Se la risposta HTTP è un errore, lo segnaliamo in console
      console.error("Errore HTTP:", json.detail || json);
      throw new Error(json.detail || "Errore nella richiesta");
    }
    return json;
  })
  .then(json => {
    console.log("JSON ricevuto:", json); // debug
    // Ora json è un "normale" file .json
    // QUI POSSIAMO METTERE IL CODICE SUL JSON
    const slidesContainer = document.querySelector('.slides');
    if (!slidesContainer) {
        throw new Error("Elemento '.slides' non trovato nel DOM");
    }
    json.forEach(composer => {
        // Crea l'elemento
        const a = document.createElement('a');
        /* Questo link ci manda a quiz.html aggiugendo il parametro composer */
        a.href = `quiz.html?composer_id=${encodeURIComponent(composer.id)}`;
        a.className = 'slide-item';
        // Immagine con alt descrittivo
        const img = document.createElement('img');
        img.src = composer.image; // Assicurati che composer.image sia già relativo
        img.alt = composer.name ? `Foto di ${composer.name}` : "Immagine compositore";
        img.title = composer.name; // Tooltip con il nome del compositore
        a.appendChild(img);
        slidesContainer.appendChild(a);
    });
  })
  .catch(err => console.error("Errore:", err));
/* ############################################################################################## */