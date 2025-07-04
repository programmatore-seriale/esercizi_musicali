<?php
header('Content-Type: application/json');

// Connessione al database
$db = new SQLite3(__DIR__ . '/questions.db');

// Ricevi i dati JSON dal body
$input = json_decode(file_get_contents('php://input'), true);

/* Questo if statement serve a controllare che sia stato dato un qualche input,
che l'input abbia un nome ed una categoria (per  debug) */ 
if (!$input || !isset($input['name']) || !isset($input['category_id'])) {
    echo json_encode(['success' => false, 'message' => 'Dati mancanti']);
    exit;
}

// Sanificazione dei dati
$name = $db->escapeString($input['name']);
$category_id = (int)$input['category_id'];
$image = $db->escapeString($input['image']);

// Query di inserimento
$query = "INSERT INTO composers (name, category_id, image) VALUES ('$name', $category_id, '$image')";
$result = $db->exec($query);

if ($result) {
    echo json_encode(['success' => true, 'message' => 'Compositore aggiunto correttamente']);
} else {
    echo json_encode(['success' => false, 'message' => 'Errore durante l\'inserimento']);
}
?>
