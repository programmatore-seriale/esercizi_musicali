/*  Iniziamo col definire le coppie di carte,
    infatti, questo è un memory un po' particolare, in quanto non dobbiamo trovare le due carte uguali,
    ma la coppia di carte di uguale significato*/
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

let cards = [...pairs]; // Mettiamo le coppie di pairs un array di carte
cards.sort(() => 0.5 - Math.random()); //usiamo la funzione di sort() con argomento casuale per mischiare le carte

/*  Creiamo le costanti atte a manipolare gli oggetti HTML visibili a schermo*/
const grid = document.querySelector(".grid-container");
const scoreDisplay = document.querySelector(".score");
const winningMessage = document.querySelector("#winning-message");
const scoreDisplayWinningMessage = document.querySelector("#final-score");

let flippedCards = []; //Creiamo un array vuoto per le carte girate
let score = 0; //Creiamo una variabile per tenere traccia del punteggio
let matches = 0; //Creiamo una variabile per tenere traccia delle coppie trovate

/*  Funzione per creare la griglia di gioco */
function createBoard() {
    grid.innerHTML = ""; //svuotiamo la griglia per ricrearla
    score = 0; //azzera il punteggio
    matches = 0; //azzera il numero di coppie trovate
    scoreDisplay.textContent = 0; //settiamo il punteggio iniziale a 0
    /*  Questa arrow function cicla ogni elemento dell'array cards, indicato nelle sue dimensioni {image, pairId}
        Per ogni carta verrà creato un elemento <div>, ad essi viene assegnata la classe "card"*/
    winningMessage.style.display = "none"; //Nascondiamo il messaggio di vittoria all'inizio del gioco
    cards.forEach(({ image, pairId }) => {
        console.log("Immagine caricata:", image); //Per debug, mostra l'immagine caricata
        const card = document.createElement("div"); //creiamo il div per la carta
        card.classList.add("card"); // aggiungiamo il div alla classe "card", in maniera tale che gli venga applicato tutto il CSS
        card.dataset.pairId = pairId; // aggiungiamo un attributo data per identificare la coppia di carte

        /*  Definiamo il contenuto HTML per la carta
            Definiamo il "front" ed il "back"*/
        card.innerHTML = `
            <div class="front"><img src="${image}" class="front-image" /></div>
            <div class="back"></div>
        `;

        card.addEventListener("click", () => flipCard(card)); //Quando la carta viene cliccata, chiamiamo la funzione flipCard passando la carta come argomento
        grid.appendChild(card); //Aggiungiamo la carta alla griglia
    });
}

/*  Definiamo adesso la funzione per girare le carte 
    Siccome la funzione si attiva ogni volta che una carta viene cliccata,
    per non avere output non desiderati dovremo controllare che non sia già stata girata
    o che le carte girate non siano già due
*/
function flipCard(card) {
    if (card.classList.contains("flipped") || flippedCards.length === 2) return; // Se la carta è già girata o se ci sono già due carte girate, non fare nulla

    card.classList.add("flipped"); //Se la carta non è già girata, la giriamo aggiungendo la classe "flipped", in questa maniera viene mostrato il suo fronte
    flippedCards.push(card); // Aggiungiamo la carta girata all'array flippedCards

    /*  In questo if statemente, ci occupiamo del caso in cui c'era già una carta girata
        e girandone una seconda arriviamo a scoprirne due,
        in questo caso, è il momento di controllare se ci sia corrispondenza tra le due carte girate
    */
    if (flippedCards.length === 2) { //le carte girate sono due
        setTimeout(checkForMatch, 1000); //controlliamo se le due carte girate corrispondono, dopo un timeout di 1 secondo, per rendere il gioco più interessante
    }
}

/*  In questa funzione controlliamo se le due carte girate corrispondono
*/
function checkForMatch() {
    const [first, second] = flippedCards; // Destrutturiamo l'array flippedCards per ottenere le due carte girate

    if (first.dataset.pairId === second.dataset.pairId) { //Controlliamo se le due carte hanno lo stesso pairId
        score+= 100; //Aumentiamo il punteggio
        scoreDisplay.textContent = score; //Mostriamo il punteggio attuale
        matches++; //Aumentiamo il numero di coppie trovate
        if( matches === cards.length / 2) { //Controlliamo se sono state trovate tutte le coppie
            console.log(`${score}`); //Messaggio di vittoria nella console
            winningMessage.style.display = "block"; //Mostriamo il messaggio di vittoria
            scoreDisplayWinningMessage.textContent = score; //Modifichiamo il punteggio nel messaggio di vittorias
        }
        flippedCards = []; //Resettiamo l'array flippedCards, le carte rimangono girate, sì, ma non sono quelle "attive"
    } else {
        if(score > 0) {// Controlliamo che il punteggio non sia già a 0
            score -= 10; //Se le carte non corrispondono, diminuiamo il punteggio
            scoreDisplay.textContent = score; //Mostriamo il punteggio attuale
        }
        /*  Se non c'è stata corrispondenza tra le due carte,
            le giriamo di nuovo, questa cosa può essere tranquillamente fatta togliendo la classe "flipped"
        */
        first.classList.remove("flipped"); 
        second.classList.remove("flipped");
        flippedCards = [];
    }
}

/*  Funzione per riavviare il gioco
    Mischia le carte e ricrea la griglia di gioco
*/
function restart() {

    cards.sort(() => 0.5 - Math.random());
    createBoard();
}

window.onload = createBoard; // Quando la pagina viene caricata, creiamo la griglia di gioco
