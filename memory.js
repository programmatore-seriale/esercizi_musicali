const gridContainer = document.querySelector('.grid-container');
const scoreElement = document.querySelector('.score');
let firstCard = null;
let secondCard = null;
let lockBoard = false;
let score = 0;

const imageCards = [
    { image: "../immagini/semicroma.png", name: "Semicroma" },
    { image: "../immagini/croma.png", name: "Croma" },
    { image: "../immagini/semiminima.png", name: "Semiminima" },
    { image: "../immagini/minima.png", name: "Minima" },
    { image: "../immagini/semibreve.png", name: "Semibreve" }
];

const cards = [...imageCards, ...imageCards]; // duplico le coppie

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function createCard({ image, name }) {
    const card = document.createElement('div');
    card.classList.add('card');
    card.dataset.name = name;

    const front = document.createElement('div');
    front.classList.add('front');
    const img = document.createElement('img');
    img.classList.add('front-image');
    img.src = image;
    img.alt = name;
    front.appendChild(img);

    const back = document.createElement('div');
    back.classList.add('back');

    card.appendChild(front);
    card.appendChild(back);
    card.addEventListener('click', handleCardClick);

    return card;
}

function handleCardClick(e) {
    const clickedCard = e.currentTarget;

    if (lockBoard || clickedCard === firstCard || clickedCard.classList.contains('matched')) return;

    clickedCard.classList.add('flipped');

    if (!firstCard) {
        firstCard = clickedCard;
        return;
    }

    secondCard = clickedCard;
    lockBoard = true;

    if (firstCard.dataset.name === secondCard.dataset.name) {
        firstCard.classList.add('matched');
        secondCard.classList.add('matched');
        score++;
        updateScore();
        resetSelection();
    } else {
        setTimeout(() => {
            firstCard.classList.remove('flipped');
            secondCard.classList.remove('flipped');
            resetSelection();
        }, 1000);
    }
}

function updateScore() {
    scoreElement.textContent = score;
}

function resetSelection() {
    [firstCard, secondCard] = [null, null];
    lockBoard = false;
}

function restart() {
    gridContainer.innerHTML = '';
    score = 0;
    updateScore();
    shuffle(cards);
    cards.forEach(cardData => {
        const card = createCard(cardData);
        gridContainer.appendChild(card);
    });
}

restart();
