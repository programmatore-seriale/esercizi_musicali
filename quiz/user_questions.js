document.addEventListener("DOMContentLoaded", function() {
  /* Costanti per manipolare gli elementi HTML */
  const addComposerForm = document.getElementById("add-composer-form");
  const composerNameTextbox = document.getElementById("composer-name");
  const composerImageTextbox = document.getElementById("composer-image");
  const users_composers_list = document.getElementById("users-composers-list");

  const addQuestionForm = document.getElementById("add-question-form");
  const questionImageTextbox = document.getElementById("question-image");
  const questionAudioTextbox = document.getElementById("question-audio");
  const questionComposerTextbox = document.getElementById("question-composer");
  const rightAnswerTextbox = document.getElementById("right-answer");
  /* ################################################################################ */

/** SEZIONE DALTONICI E DISLESSICI
*   Questa sezione permette di attivare una modalità per i daltonici e per i dislessici
*   banalmente, quando si clicca sull'icona, viene aggiunta una classe al body
*   che quindi applica il realtivo stile CSS a tutti i propri figli
*   cioè a tutto il documento
*/
const colorblindIcon = document.getElementById('colorblind-icon');
const dyslexiaIcon = document.getElementById('dyslexia-icon');
if (colorblindIcon) {
  colorblindIcon.addEventListener('click', function() {
    document.body.classList.toggle('colorblind-mode');
  });
}
if (dyslexiaIcon) {
  dyslexiaIcon.addEventListener('click', function() {
    console.log("Toggling dyslexic mode");
    document.body.classList.toggle('dyslexic-mode');
  });
}
/* ######################################################### */

  let userComposers = []; // Array per memorizzare i compositori aggiunti dagli utenti

  /* Carica la lista dei compositori di categoria 2 e popola la lista HTML */
  fetch('http://127.0.0.1:8000/composers/by_category/2')
    .then(async res => {
      const json = await res.json();
      if (!res.ok) {
        console.error("Errore HTTP:", json.detail || json);
        throw new Error(json.detail || "Errore nella richiesta");
      }
      return json;
    })
    .then(json => {
      userComposers = json;
      users_composers_list.innerHTML = ""; // Pulisce la lista prima di riempirla
      json.forEach(composer => {
        const li = document.createElement('li');
        // Nome del compositore come testo
        li.textContent = composer.name;

        // Bottone elimina accanto al nome, con alternativa testuale
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = "Elimina";
        deleteBtn.className = "delete-composer-btn";
        deleteBtn.setAttribute("aria-label", `Elimina il compositore ${composer.name}`);
        deleteBtn.addEventListener("click", function() {
          if (confirm(`Sei sicuro di voler eliminare "${composer.name}"?`)) {
            fetch(`http://127.0.0.1:8000/composers/${composer.id}`, {
              method: "DELETE"
            })
            .then(async res => {
              const data = await res.json();
              if (!res.ok) {
                alert(data.detail || "Errore nell'eliminazione");
                throw new Error(data.detail || "Errore nell'eliminazione");
              }
              li.remove(); // Rimuove l'elemento dalla lista senza ricaricare la pagina
            })
            .catch(err => {
              alert("Errore nell'eliminazione del compositore");
              console.error(err);
            });
          }
        });

        li.appendChild(deleteBtn);
        users_composers_list.appendChild(li);
      });
    })
    .catch(err => console.error("Errore:", err));
  /* ############################################################################################## */

  /* Gestione del form per aggiungere un nuovo compositore */
  addComposerForm.addEventListener("submit", function(event) {
    event.preventDefault(); // Impedisce il reload della pagina
    const category_id = 2; // La categoria che identifica i compositori aggiunti dagli utenti sarà sempre la 2
    const name = composerNameTextbox.value; // Nome del compositore inserito dall'utente
    const image = composerImageTextbox.value;
    fetch("http://127.0.0.1:8000/composers/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ name, category_id, image })
    })
    .then(async res => {
      const json = await res.json();
      if (!res.ok) {
        alert(json.detail || "Errore nell'aggiunta del compositore");
        throw new Error(json.detail || "Errore nella richiesta");
      }
      return json;
    })
    .then(data => {
      document.getElementById("add-composer-form").reset();
      // Aggiorna la lista senza ricaricare la pagina
      return fetch('http://127.0.0.1:8000/composers/by_category/2')
        .then(res => res.json())
        .then(json => {
          userComposers = json;
          users_composers_list.innerHTML = "";
          json.forEach(composer => {
            const li = document.createElement('li');
            li.textContent = composer.name;

            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = "Elimina";
            deleteBtn.className = "delete-composer-btn";
            deleteBtn.setAttribute("aria-label", `Elimina il compositore ${composer.name}`); //aria-label="Elimina il compositore Mario Rossi" (ad esempio): serve a descrivere chiaramente lo scopo del pulsante agli utenti di screen reader, anche se l’elemento ha solo un’icona visiva (come un’icona a forma di cestino 🗑️).
            deleteBtn.addEventListener("click", function() {
              if (confirm(`Sei sicuro di voler eliminare "${composer.name}"?`)) {
                fetch(`http://127.0.0.1:8000/composers/${composer.id}`, {
                  method: "DELETE"
                })
                .then(async res => {
                  const data = await res.json();
                  if (!res.ok) {
                    alert(data.detail || "Errore nell'eliminazione");
                    throw new Error(data.detail || "Errore nell'eliminazione");
                  }
                  li.remove();
                })
                .catch(err => {
                  alert("Errore nell'eliminazione del compositore");
                  console.error(err);
                });
              }
            });

            li.appendChild(deleteBtn);
            users_composers_list.appendChild(li);
          });
        });
    })
    .catch(error => {
      console.error("Errore:", error);
    });
  });
  /* ################################################################# */

  /* Gestione del form per inserire una nuova domanda */
  addQuestionForm.addEventListener("submit", function(event) {
    event.preventDefault(); // Impedisce che il browser ricarichi la pagina
    /*Per adesso lasciamo stare anche il testo della domanda,
      da integrare poi negli esercizi di base
    const text = questionTextTextbox.value;
    */
    const image = questionImageTextbox.value;
    const audio = questionAudioTextbox.value;
    const composerName = questionComposerTextbox.value; // Nome compositore inserito dall'utente
    // Trova il composer_id corrispondente al nome
    const composerObj = userComposers.find(c => c.name === composerName);
    if (!composerObj) {
      alert("Compositore non trovato! Inserisci un nome valido.");
      return;
    }
    const composer_id = composerObj.id;
    const rightAnswer = rightAnswerTextbox.value;

    fetch("http://127.0.0.1:8000/questions/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        composer_id: composer_id,
        audio: audio,
        image: image,
        correct: rightAnswer,
        explanation: "" // aggiungi se richiesto dallo schema
      })
    })
    .then(async res => {
      const json = await res.json();
      if (!res.ok) {
        alert(json.detail || "Errore nell'aggiunta della domanda");
        throw new Error(json.detail || "Errore nella richiesta");
      }
      return json;
    })
    .then(data => {
      document.getElementById("add-question-form").reset();
      alert("Domanda aggiunta con successo!");
    })
    .catch(error => {
      console.error("Errore:", error);
    });
  });
});