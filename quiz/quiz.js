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
  "Messa di requiem","Bravo! Infatti, quella che stai sentendo è il celebre tema de \"Lacrimosa\""],
  ["/registrazioni/der_holle_rache.mp3",
  "Il flauto magico","Bravo! Infatti puoi riconoscere la celebre aria \"Der Hölle Rache kocht in meinem Herzen\""],
  ["/registrazioni/non_piu_andrai.mp3",
  "Le nozze di Figaro","Bravo! Le nozze di figaro contengono una delle arie d'opera più famose: \"Non più andrai farfallone amoroso\""],
  ["/registrazioni/sinfonia_40.mp3",
  "Sinfonia n.40", "Bravo! Del resto l'incipit di questo brano è semplicemente celeberrimo"]
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
  correctAnswers = 0;
  buttons.forEach(btn => btn.disabled = false); // Abilita i bottoni dopo la risposta
  next_button.textContent = "Prossima domanda";
  scoreText.textContent = "Buona fortuna!";
  array = array.sort(() => Math.random() - 0.5);
}
/* ################################################################### */

/* La funzione generateQuestion() genera una domanda */
function generateQuestion(i) {
  buttons.forEach(btn => btn.disabled = false);
  

  // Imposta immagine e audio
  images.sort(() => Math.random() - 0.5);
  audio_img.src = images[0];
  audio_inside.src = answers[array[i]][0];

  // Prendi la risposta giusta
  const correctAnswer = {
    text: answers[array[i]][1],
    correct: true,
    explanation: answers[array[i]][2]
  };

  // Prendi le risposte sbagliate (da altre domande)
  let wrongAnswers = [];
  for (let j = 0; j < answers.length; j++) {
    if (j !== array[i]) {
      wrongAnswers.push({
        text: answers[j][1],
        correct: false,
        explanation: answers[j][2]
      });
    }
  }
  // Mischia e prendi le prime 3 sbagliate
  wrongAnswers = wrongAnswers.sort(() => Math.random() - 0.5).slice(0, 3);

  // Unisci e mescola tutte le risposte
  let options = [correctAnswer, ...wrongAnswers].sort(() => Math.random() - 0.5);

  // Assegna le risposte ai bottoni
  for (let b = 0; b < 4; b++) {
    buttons[b].textContent = options[b].text;
    buttons[b].setAttribute("data-correct", options[b].correct);
    buttons[b].setAttribute("explanation", options[b].explanation);
    buttons[b].onclick = null;
    buttons[b].onclick = function() {
      const isCorrect = buttons[b].getAttribute('data-correct') == "true";
      const explanation = buttons[b].getAttribute('explanation');
      if (isCorrect) {
        resultDiv.textContent = `✔️ Corretto! ${explanation}`;
        resultDiv.style.color = "lightgreen";
        correctAnswers++;
        buttons.forEach(btn => {
          btn.classList.add('wrong-answer');
          btn.disabled = true;
        });
        this.classList.remove('wrong-answer');
        this.classList.add('right-answer');
      } else {
        resultDiv.textContent = `❌ Risposta sbagliata. ${explanation}`;
        resultDiv.style.color = "red";
      }
      buttons.forEach(btn => btn.disabled = true);
      currentQuestion++;
      scoreText.textContent = `Risposte corrette: ${correctAnswers} su ${currentQuestion}`;
      next_button.style.display = 'block';
      if (currentQuestion == array.length){
          next_button.textContent = "Ricomincia il quiz";
      }
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
  buttons.forEach(btn => btn.classList.remove('right-answer'));
  buttons.forEach(btn => btn.classList.remove('wrong-answer'));
}
/*#####################################################*/
// All'avvio del quiz
environment();
generateQuestion(currentQuestion);