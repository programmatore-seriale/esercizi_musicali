document.addEventListener("DOMContentLoaded", function() {
  /* Costanti per manipolare gli elementi HTML */
  const addComposerForm = document.getElementById("add-composer-form");
  const composerNameTextbox = document.getElementById("composer-name");
  const composerImageTextbox = document.getElementById("composer-image");
  //const submitComposerButton = document.getElementById("submit-composer-button"); Paura a cancellarlo ma non serve a niente
  const addQuestionForm = document.getElementById("add-question-form");
  /*Per adesso lasciamo stare anche il testo della domanda,
  da integrare poi negli esercizi di base
  const questionTextTextbox = document.getElementById("question-text");
  */
  const questionImageTextbox = document.getElementById("question-image");
  const questionAudioTextbox = document.getElementById("question-audio");
  const questionComposerTextbox = document.getElementById("question-composer");
  const rightAnswerTextbox = document.getElementById("right-answer");
  /*Per adesso le risposte sbagliate le togliamo,
  perché il programma prende le risposte sbagliate dalle altre risposte corrette...
  const wrongAnswer1Textbox = document.getElementById("wrong-answer-1");
  const wrongAnswer2Textbox = document.getElementById("wrong-answer-2");
  const wrongAnswer3Textbox = document.getElementById("wrong-answer-3");
  */
  /* ######################################## */

  /* Funzione che aggiunge in tabella il compositore inserito */
  /* ######################################################## */
  /* Costante che serve a fare i vari fetch */
  const config = {
    locateFile: file => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.6.2/${file}`
  };
  /* ####################################### */

  let userComposers = []; // Array per memorizzare i compositori aggiunti dagli utenti, così da manipolarli in futuri fetch
  /* otteniamo, quando la pagina viene ricaricata, tutti i compositori aggiunti da utenti */
  fetch('http://127.0.0.1:8000/quiz/v0.1/composers/by_category/2') //riga che fa una HTTP request alle API create, richiedendo tutti i compositori di categoria 2 (user)
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
      userComposers = json; // Salviamo i compositori in un array
      console.log("JSON ricevuto:", json); // debug
      // Ora json è un "normale" file .json
      // QUI POSSIAMO METTERE IL CODICE SUL JSON
      const users_composers_list = document.getElementById('users-composers-list');
      if (!users_composers_list) {
          throw new Error("Elemento 'users composers list' non trovato nel DOM");
      }
      json.forEach(composer => {
          // Crea l'elemento
          const li = document.createElement('li');
          li.textContent = composer.name;
          /* Questo link ci manda a quiz.html aggiugendo il parametro composer */
          users_composers_list.appendChild(li);
      });
    })
    .catch(err => console.error("Errore:", err));
  /* ############################################################################################## */

  /* Diamo vita al form che permette di inserire un nuovo compositore */
  addComposerForm.addEventListener("submit", function(event) {
    event.preventDefault(); //impedisce che il browser ricarichi la pagina
    const category_id = 2; //la categoria che identifica i compositori aggiunti dagli utenti sarà sempre la 2
    const name = composerNameTextbox.value; //nome del compositore inserito dall'utente
    const image = composerImageTextbox.value;
    fetch("http://127.0.0.1:8000/quiz/v0.1/composers/", { //HTTP request con method: POST così da creare un nuovo compositore
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ name, category_id, image })
    })
    .then(async res => {
      const json = await res.json();
      if (!res.ok) {
        // Se la risposta HTTP è un errore, lo segnaliamo in console
        console.error("Errore HTTP:", json.detail || json);
        throw new Error(json.detail || "Errore nella richiesta");
      }
      return json;
    })
    .then(data => {
      if (data.id) {
        document.getElementById("add-composer-form").reset(); // Resetta il form dopo l'inserimento, così nessuno può spammare aggiunte di compositori identici
        location.reload(); // Ricarica la pagina per aggiornare la lista dei compositori
      }
    })
    .catch(error => {
      console.error("Errore:", error);
    });
  });
  /* ################################################################# */

  /* Diamo vita al form che permette di inserire una nuova domanda */
  addQuestionForm.addEventListener("submit", function(event) {
    event.preventDefault(); //impedisce che il browser ricarichi la pagina
    /*Per adesso lasciamo stare anche il testo della domanda,
      da integrare poi negli esercizi di base
    const text = questionTextTextbox.value;
    */
    const image = questionImageTextbox.value;
    const audio = questionAudioTextbox.value;
    const composerName = questionComposerTextbox.value; //nome compositore inserito dall'utente NON VA BENE!!!!! va riportato a composer_id
    // Trova il composer_id corrispondente al nome
    const composerObj = userComposers.find(c => c.name === composerName);
    if (!composerObj) { //RICORDIAMOCI DI USARE IL MESSAGGIO DI ERRORE DELLA HTTP REQUEST
      alert("Compositore non trovato! Inserisci un nome valido.");
      return;
    }
    const composer_id = composerObj.id;
    const rightAnswer = rightAnswerTextbox.value;
    /* Per adesso le risposte sbagliate le togliamo,
    perché il programma prende le risposte sbagliate dalle altre risposte corrette...
    const wrongAnswer1 = wrongAnswer1Textbox.value;
    const wrongAnswer2 = wrongAnswer2Textbox.value;
    const wrongAnswer3 = wrongAnswer3Textbox.value;
    */
    console.log([image, audio, composerName, composer_id, rightAnswer]);
    fetch("http://127.0.0.1:8000/quiz/v0.1/questions/", { //HTTP request con method: POST così da creare una nuova domanda
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      /*
      composer_id=question.composer_id,
          audio=question.audio,
          image=question.image,
          correct=question.correct,
          explanation=question.explanation
      */
      body: JSON.stringify({
        // queste righe deono seguire quanto definito in schemas.py
        composer_id: composer_id,          
        audio: audio,
        image: image,
        correct: rightAnswer,      
        explanation: ""
      })
    })
    .then(async res => {
    const json = await res.json();
    if (!res.ok) {
      // Se la risposta HTTP è un errore, lo segnaliamo in console
      console.error("Errore HTTP:", json.detail || json);
      throw new Error(json.detail || "Errore nella richiesta");
    }
    return json;
  })
  .then(data => {
    if (data.id) {
      document.getElementById("add-question-form").reset();
      console.log("Domanda aggiunta con successo:", data);
    }
    })
    .catch(error => {
      console.error("Errore:", error);
    });
  });
  /* ################################################################# */
});