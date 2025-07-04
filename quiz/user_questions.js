/* Costanti per manipolare gli elementi HTML */
const addComposerForm = document.getElementById("add-composer-form");
const composerNameTextbox = document.getElementById("composer-name");
const composerImageTextbox = document.getElementById("composer-image");
const submitComposerButton = document.getElementById("submit-composer-button");
/* ######################################## */

/* Funzione che aggiunge in tabella il compositore inserito */
/* ######################################################## */
/* Costante che serve a fare i vari fetch */
const config = {
  locateFile: file => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.6.2/${file}`
};
/* ####################################### */

/* otteniamo, quando la pagina viene ricaricata, tutti i compositori aggiunti da utenti */
fetch('get_user_composers.php') //riga che "invoca" get_composers.php
  .then(res => res.json())
  .then(json => {
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
  console.log(category_id);
  const name = composerNameTextbox.value;
  console.log(name);
  const image = composerImageTextbox.value;
  console.log(image);
  fetch("add_composer.php", {
    method: "POST",
    // grazie ad headers e a body possiamo inviare ad add_composer.php un JSON leggibile
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ name, category_id, image })
  })
  .then(response => response.json())
  .then(data => {
    if (data.success) {
      document.getElementById("composerForm").reset();
    }
  })
  .catch(error => {
    console.error("Errore:", error);
  });
});
/* ################################################################# */