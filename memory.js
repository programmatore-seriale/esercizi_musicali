
const pairs = [
    { image: "immagini/semicroma.png", pairId: "semicroma" },
    { image: "immagini/semicroma_scritta.png", pairId: "semicroma" },
    { image: "immagini/croma.png", pairId: "croma" },
    { image: "immagini/croma_scritta.png", pairId: "croma" },
    { image: "immagini/minima.png", pairId: "minima" },
    { image: "immagini/minima_scritta.png", pairId: "minima" },
    { image: "immagini/semiminima.png", pairId: "semiminima" },
    { image: "immagini/semiminima_scritta.png", pairId: "semiminima" },
    { image: "immagini/semibreve.png", pairId: "semibreve" },
    { image: "immagini/semibreve_scritta.png", pairId: "semibreve" },
    { image: "immagini/breve.png", pairId: "breve" },
    { image: "immagini/breve_scritta.png", pairId: "breve" }
];

let cards = [...pairs];
cards.sort(() => 0.5 - Math.random());

const grid = document.querySelector(".grid-container");
const scoreDisplay = document.querySelector(".score");
let flippedCards = [];
let matchedPairs = 0;

function createBoard() {
    grid.innerHTML = "";
    matchedPairs = 0;
    scoreDisplay.textContent = 0;

    cards.forEach(({ image, pairId }) => {
        console.log("Immagine caricata:", image);
        const card = document.createElement("div");
        card.classList.add("card");
        card.dataset.pairId = pairId;

        card.innerHTML = `
            <div class="front"><img src="${image}" class="front-image" /></div>
            <div class="back"></div>
        `;

        card.addEventListener("click", () => flipCard(card));
        grid.appendChild(card);
    });
}

function flipCard(card) {
    if (card.classList.contains("flipped") || flippedCards.length === 2) return;

    card.classList.add("flipped");
    flippedCards.push(card);

    if (flippedCards.length === 2) {
        setTimeout(checkForMatch, 1000);
    }
}

function checkForMatch() {
    const [first, second] = flippedCards;

    if (first.dataset.pairId === second.dataset.pairId) {
        matchedPairs++;
        scoreDisplay.textContent = matchedPairs;
        flippedCards = [];
    } else {
        first.classList.remove("flipped");
        second.classList.remove("flipped");
        flippedCards = [];
    }
}

function restart() {
    cards.sort(() => 0.5 - Math.random());
    createBoard();
}

window.onload = createBoard;
