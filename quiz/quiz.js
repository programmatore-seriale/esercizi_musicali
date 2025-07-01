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
}/* ######################## */

/* Codice del quiz */
/* Qui dichiariamo le costanti per manipolare gli elementi HTML */
const scoreText = document.getElementById("score");
const audio_img = document.getElementById('audio-img');
const audio_inside = document.getElementById('audio-inside');
const answer_button_red = document.getElementById('answer-button-red');
const answer_button_green = document.getElementById('answer-button-green');
const answer_button_blue = document.getElementById('answer-button-blue');
const answer_button_orange = document.getElementById('answer-button-orange');
const buttons = [answer_button_red, answer_button_blue, answer_button_orange, answer_button_green];
const next_button = document.getElementById('next-button');
const resultDiv = document.getElementById('result');
/* ########################################################### */

/* Qui mettiamo risposte ed immagini per generare i vari quiz */
images = [
  "https://images.pexels.com/photos/210877/pexels-photo-210877.jpeg",
  "https://images.pexels.com/photos/13385066/pexels-photo-13385066.jpeg",
  "https://images.pexels.com/photos/29689573/pexels-photo-29689573.jpeg",
  "https://images.pexels.com/photos/13036786/pexels-photo-13036786.jpeg",
  "https://images.pexels.com/photos/32392920/pexels-photo-32392920.jpeg"
]
answers = [
  ["/registrazioni/lacrimosa.mp3",
    ["Sinfonia n. 40",false,"Abbiamo ascoltato questo brano di Mozart, ma non è quello che stai sentendo."],
    ["Il flauto magico",false,"Abbiamo ascoltato questo brano di Mozart, ma non è quello che stai sentendo."],
    ["Messa di requiem",true,"Bravo! Infatti, quella che stai sentendo è il celebre tema de \"Lacrimosa\""],
    ["Le nozze di figaro",false,"Abbiamo ascoltato questo brano di Mozart, ma non è quello che stai sentendo."]
  ],
  ["/registrazioni/der_holle_rache.mp3",
    ["Sinfonia n. 40",false,"Abbiamo ascoltato questo brano di Mozart, ma non è quello che stai sentendo."],
    ["Il flauto magico",true,"Bravo! Infatti puoi riconoscere la celebre aria \"Der Hölle Rache kocht in meinem Herzen\""],
    ["Messa di requiem",false,"Abbiamo ascoltato questo brano di Mozart, ma non è quello che stai sentendo."],
    ["Le nozze di figaro",false,"Abbiamo ascoltato questo brano di Mozart, ma non è quello che stai sentendo."]
  ]
]
/* #################################################################### */

/* Dichiariamo una serie di variabili di ambiente e le impostiamo al valore inziale con la funzione environment*/
let array = [];
let i = 0;
let currentQuestion = 0;
let correctAnswers = 0;
function environment(){
  array = [];
  for (answer of answers) {
    array.push(i);
    i++;
  }
  i = 0;
  currentQuestion = 0;
  let correctAnswers = 0;
  buttons.forEach(btn => btn.disabled = false); // Abilita i bottoni dopo la risposta
  next_button.textContent = "Prossima domanda";
  scoreText.textContent = "Buona fortuna!";
}
/* ################################################################### */

/* La funzione generateQuestion() genera una domanda */
function generateQuestion(i) {
  buttons.forEach(btn => btn.disabled = false); // Abilita i bottoni
  images.sort(() => Math.random() - 0.5);
  audio_img.src = images[0];
  audio_inside.src = answers[array[i]][0];
  const arr = [1, 2, 3, 4];
  arr.sort(() => Math.random() - 0.5);
  for (let b = 0; b < 4; b++) {
    buttons[b].textContent = answers[array[i]][arr[b]][0];
    buttons[b].setAttribute("data-correct", answers[array[i]][arr[b]][1]);
    buttons[b].setAttribute("explanation", answers[array[i]][arr[b]][2]);
    buttons[b].onclick = null;
    buttons[b].onclick = () => {
      const isCorrect = buttons[b].getAttribute('data-correct') == "true";
      const explanation = buttons[b].getAttribute('explanation');
      if (isCorrect) {
        resultDiv.textContent = `✔️ Corretto! ${explanation}`;
        resultDiv.style.color = "lightgreen";
        correctAnswers++;
      } else {
        resultDiv.textContent = `❌ Risposta sbagliata. ${explanation}`;
        resultDiv.style.color = "red";
      }
      buttons.forEach(btn => btn.disabled = true); // Disabilita i bottoni dopo la risposta
      currentQuestion++;
      scoreText.textContent = `Risposte corrette: ${correctAnswers} su ${currentQuestion}`;
      next_button.style.display = 'block';
      if (currentQuestion == array.length){
          next_button.textContent = "Ricomincia il quiz";
      }
      /* Parte che serve a far generare una nuova domanda, la lasciamo qui, nel caso servisse
      setTimeout(() => {
        resultDiv.textContent = "";
        buttons.forEach(btn => btn.disabled = false);
        currentQuestion++;
        if (currentQuestion < array.length) {
          generateQuestion(currentQuestion);
        } else {
          resultDiv.textContent = "Quiz terminato!";
        }
      }, 1500);
      */
    };
  }
}
/* Funzione che permette di passare alla prossima domanda o di ricominciare il quiz*/
function nextRestart(){
  if (currentQuestion == array.length){
    environment();
  }
  generateQuestion(currentQuestion);
  next_button.style.display = "none";
  resultDiv.textContent = "";

}
/*#####################################################*/
// All'avvio del quiz
environment();
generateQuestion(currentQuestion);