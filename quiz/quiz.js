let index = 0;

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

function setupAnswerButtons() {
  document.querySelectorAll('.answer-button').forEach(button => {
    button.addEventListener('click', () => {
      const isCorrect = button.getAttribute('data-correct') == "true";
      const explanation = button.getAttribute('explanation');
      const resultDiv = document.getElementById('result');

      if (isCorrect) {
        resultDiv.textContent = `✔️ Corretto! ${explanation}`;
        resultDiv.style.color = "lightgreen";
      } else {
        resultDiv.textContent = `❌ Risposta sbagliata. ${explanation}`;
        resultDiv.style.color = "red";
      }
    });
  });
}

const audio_img = document.getElementById('audio-img');
const audio_inside = document.getElementById('audio-inside');
const answer_button_red = document.getElementById('answer-button-red');
const answer_button_green = document.getElementById('answer-button-green');
const answer_button_blue = document.getElementById('answer-button-blue');
const answer_button_orange = document.getElementById('answer-button-orange');

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
let array = [];
let i = 0;
for (answer of answers) {
  array.push(i);
  i++;
}
function generateQuestion(i){
  setupAnswerButtons();
  images.sort(() => Math.random() - 0.5); //riordiniamo le immagini in ordine casuale
  audio_img.src = images[0]; //mettiamo un'immagine a caso tanto non serve a niente
  audio_inside.src = answers[array[i]][0];
  const arr = [1, 2, 3, 4];
  arr.sort(() => Math.random() - 0.5);
  // Imposta testo e attributi dei bottoni
  const buttons = [
    answer_button_red,
    answer_button_blue,
    answer_button_orange,
    answer_button_green
  ];
  for (let b = 0; b < 4; b++) {
    buttons[b].textContent = answers[array[i]][arr[b]][0];
    buttons[b].setAttribute("data-correct", answers[array[i]][arr[b]][1]);
    buttons[b].setAttribute("explanation", answers[array[i]][arr[b]][2]);
    // Rimuovi eventuali vecchi event listener
    buttons[b].onclick = null;
    // Aggiungi nuovo event listener
    buttons[b].onclick = () => {
      const isCorrect = buttons[b].getAttribute('data-correct') == "true";
      const explanation = buttons[b].getAttribute('explanation');
      const resultDiv = document.getElementById('result');
      if (isCorrect) {
        resultDiv.textContent = `✔️ Corretto! ${explanation}`;
        resultDiv.style.color = "lightgreen";
      } else {
        resultDiv.textContent = `❌ Risposta sbagliata. ${explanation}`;
        resultDiv.style.color = "red";
      }
      // Dopo 1.5 secondi passa alla prossima domanda (se esiste)
      /*
      setTimeout(() => {
        resultDiv.textContent = "";
        if (i + 1 < array.length) {
          generateQuestion(i + 1);
        } else {
          resultDiv.textContent = "Quiz terminato!";
        }
      }, 1500);
          */
    };
  }
}
function generateQuestions(i = 0) {
  if (i >= array.length) {
    document.getElementById('result').textContent = "Quiz terminato!";
    return;
  }
  generateQuestion(i, () => generateQuestions(i + 1));
}

function generateQuestion(i, nextQuestionCallback) {
  images.sort(() => Math.random() - 0.5);
  audio_img.src = images[0];
  audio_inside.src = answers[array[i]][0];
  const arr = [1, 2, 3, 4];
  arr.sort(() => Math.random() - 0.5);

  const buttons = [
    answer_button_red,
    answer_button_blue,
    answer_button_orange,
    answer_button_green
  ];
  for (let b = 0; b < 4; b++) {
    buttons[b].textContent = answers[array[i]][arr[b]][0];
    buttons[b].setAttribute("data-correct", answers[array[i]][arr[b]][1]);
    buttons[b].setAttribute("explanation", answers[array[i]][arr[b]][2]);
    buttons[b].onclick = null;
    buttons[b].onclick = () => {
      const isCorrect = buttons[b].getAttribute('data-correct') == "true";
      const explanation = buttons[b].getAttribute('explanation');
      const resultDiv = document.getElementById('result');
      if (isCorrect) {
        resultDiv.textContent = `✔️ Corretto! ${explanation}`;
        resultDiv.style.color = "lightgreen";
      } else {
        resultDiv.textContent = `❌ Risposta sbagliata. ${explanation}`;
        resultDiv.style.color = "red";
      }
      // Disabilita i bottoni dopo la risposta
      buttons.forEach(btn => btn.disabled = true);
      setTimeout(() => {
        resultDiv.textContent = "";
        buttons.forEach(btn => btn.disabled = false);
        nextQuestionCallback();
      }, 1500);
    };
  }
}
generateQuestions();

