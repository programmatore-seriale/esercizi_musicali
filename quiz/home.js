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

/* Manipolazione del database per ricondurci ad un JSON */
const config = {
  locateFile: file => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.6.2/${file}`
};

initSqlJs(config).then(SQL => {
  fetch("/quiz/questions.db")  // Assicurati che quiz.db sia servito correttamente dal server
    .then(res => res.arrayBuffer())
    .then(buffer => {
        const db = new SQL.Database(new Uint8Array(buffer));
        const results = db.exec("SELECT * FROM compositori");
        if (!results.length) throw new Error("Nessun risultato nella tabella 'compositori'");
        const columns = results[0].columns;
        const values = results[0].values;
        const json = values.map(row => Object.fromEntries(row.map((val, i) => [columns[i], val])));

        // Ora json è un "normale" file .json
        // QUI POSSIAMO METTERE IL CODICE SUL JSON
        const slidesContainer = document.querySelector('.slides');
        if (!slidesContainer) {
            throw new Error("Elemento '.slides' non trovato nel DOM");
        }
        json.forEach(composer => {
            // Crea l'elemento
            const a = document.createElement('a');
            a.href = `pagine/${composer.name.toLowerCase()}.html`;
            a.className = 'slide-item';
            const img = document.createElement('img');
            img.src = composer.image;
            img.alt = composer.name;
            a.appendChild(img);
            slidesContainer.appendChild(a);
        });
    })
    .catch(err => console.error("Errore:", err));
});
/* ############################################################################################## */