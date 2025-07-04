<?php
/*
Debug
*/
ini_set('display_errors', 1);
error_reporting(E_ALL);
/*######################################*/
header('Content-Type: application/json');

/* Creiamo il nostro "oggetto database" a partire dal database SQLite */
// Percorso corretto, se il file è nella stessa cartella dello script:
$db = new SQLite3(__DIR__ . '/questions.db'); //la variabile __DIR__ serve appunto a scrivere l'indirizzo giusto
/* ################################################################## */

/* Otteniamo il compositore dalla URL, se è stato specificato */
$compositore = $_GET['composer'] ?? '';
/* ############################################################## */

/* Con query MYSQL riusciamo a prendere solo le domande del compositore scelto */
$stmt = $db->prepare('
    SELECT questions.* 
    FROM questions
    JOIN composers ON questions.composer_id = composers.id
    WHERE composers.name = :composer
');
$stmt->bindValue(':composer', $compositore, SQLITE3_TEXT);
$results = $stmt->execute();
/* ######################################################################## */

/*
Questo frammento di codice PHP esegue un ciclo while per estrarre tutte le righe
risultanti dalla query su un database SQLite.
Il metodo fetchArray(SQLITE3_ASSOC) recupera una riga alla volta dal risultato,
restituendo ogni riga come array
*/
$questions = [];
while ($row = $results->fetchArray(SQLITE3_ASSOC)) {
    $questions[] = $row;
}
/* ########################################################################## */

/*
Questa riga di codice PHP utilizza la funzione json_encode
per convertire l’array $domande in una stringa JSON.
L’istruzione echo serve a inviare la stringa JSON generata
al client che ha effettuato la richiesta.
*/
echo json_encode($questions);
/* ########################################################## */
?>
