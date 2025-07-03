<?php
header('Content-Type: application/json');

// Ottieni i dati dal POST
$question = $_POST['question'];
$answer1 = $_POST['answer1'];
$answer2 = $_POST['answer2'];
$answer3 = $_POST['answer3'];
$answer4 = $_POST['answer4'];
$correct = $_POST['correct'];

// Connessione DB
$db = new SQLite3('questions.db');

// Prepara la query di inserimento (modifica le colonne secondo la tua struttura)
$stmt = $db->prepare('INSERT INTO domande (question, answer1, answer2, answer3, answer4, correct) VALUES (:question, :answer1, :answer2, :answer3, :answer4, :correct)');
$stmt->bindValue(':question', $question, SQLITE3_TEXT);
$stmt->bindValue(':answer1', $answer1, SQLITE3_TEXT);
$stmt->bindValue(':answer2', $answer2, SQLITE3_TEXT);
$stmt->bindValue(':answer3', $answer3, SQLITE3_TEXT);
$stmt->bindValue(':answer4', $answer4, SQLITE3_TEXT);
$stmt->bindValue(':correct', $correct, SQLITE3_INTEGER);

$result = $stmt->execute();

echo json_encode(['success' => true]);
?>
