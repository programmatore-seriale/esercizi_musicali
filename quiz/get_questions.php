<?php
header('Content-Type: application/json');

// Percorso corretto, se il file è nella stessa cartella dello script:
$db = new SQLite3(__DIR__ . '/questions.db');

$results = $db->query('SELECT * FROM domande');

$domande = [];
while ($row = $results->fetchArray(SQLITE3_ASSOC)) {
    $domande[] = $row;
}

echo json_encode($domande);
?>