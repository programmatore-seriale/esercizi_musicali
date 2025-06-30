let index = 0;

function moveSlide(direction) {
  const slides = document.querySelector('.slides');
  const totalSlides = slides.children.length;
  index = (index + direction + totalSlides) % totalSlides;
  slides.style.transform = `translateX(-${index * 100}%)`;
}
