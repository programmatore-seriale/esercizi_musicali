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
document.querySelectorAll('.answer-button').forEach(button => {
  button.addEventListener('click', () => {
    const isCorrect = button.getAttribute('data-correct') === "true";
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
