<?php
/*Debug*/
ini_set('display_errors', 1);
error_reporting(E_ALL);
/*######################################*/
header('Content-Type: application/json');

// Connessione al database
$db = new SQLite3(__DIR__ . '/questions.db');

/* Leggi i dati
$image = $db->escapeString($_POST['image'] ?? '');
$audio = $db->escapeString($_POST['audio'] ?? '');
$name = $db->escapeString($_POST['question_composer'] ?? '');
$correct = $db->escapeString($_POST['right_answer'] ?? '');
*/
// Ricevi i dati JSON dal body
$input = json_decode(file_get_contents('php://input'), true);


/* Questo if statement serve a controllare che sia stato dato un qualche input,
lo usiamo per salvarci dal fatto che non mettiamo required a testo/immagine/audio,
,a almeno uno di essi ci deve essere  
if (!isset($input['correct'])) {
    echo json_encode(['success' => false, 'message' => 'Dati mancanti']);
    exit;
} */

// Sanificazione dei dati
$name = $db->escapeString($input['name']); //input nome compositore, da trasformare
/*Con una query MYSQL "trasformiamo il nome del compositore nel suo id*/
$result = $db->query("SELECT id FROM composers WHERE name = '$name'");
$row = $result->fetchArray(SQLITE3_ASSOC);
if ($row) {
    $composer_id = $row['id'];
} else {
    echo json_encode(['success' => false, 'message' => 'Compositore non trovato']);
    exit;
}
/*#########################################*/
$audio = $db->escapeString($input['audio']);
$audio = "https://docs.google.com/uc?export=download&id=" . $audio;
$image = $db->escapeString($input['image']);
$correct = $db->escapeString($input['correct']);
/*Per adesso lasciamo stare anche il testo della domanda,
da integrare poi negli esercizi di base
$text = $db->escapeString($input['text']);
*/

// Query di inserimento
$query = "INSERT INTO questions (composer_id, audio, image, correct) VALUES ($composer_id,'$audio', '$image', '$correct')";
$result = $db->exec($query);

if ($result) {
    echo json_encode(['success' => true, 'message' => 'Compositore aggiunto correttamente']);
} else {
    echo json_encode(['success' => false, 'message' => 'Errore durante l\'inserimento']);
}
?>