<?php
declare(strict_types=1);

require_once __DIR__ . '/../includes/db.php';
require_once __DIR__ . '/../includes/helpers.php';
require_once __DIR__ . '/../includes/mailer.php';

header('Content-Type: application/json; charset=utf-8');

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    json_response(['ok' => false, 'error' => 'Méthode non autorisée.'], 405);
}

// Piège à robots : champ invisible qui doit rester vide (voir css .hp-field)
if (trim((string) ($_POST['website'] ?? '')) !== '') {
    json_response(['ok' => true]);
}

$nom        = post('nom');
$entreprise = post('entreprise');
$email      = post('email');
$telephone  = post('telephone');
$message    = post('message');

$errors = [];
if ($nom === '') {
    $errors['nom'] = 'Le nom est requis.';
}
if ($email === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $errors['email'] = 'Adresse email invalide.';
}
if ($message === '') {
    $errors['message'] = 'Le message est requis.';
}

if ($errors) {
    json_response(['ok' => false, 'errors' => $errors], 422);
}

$ip  = $_SERVER['REMOTE_ADDR'] ?? '';
$pdo = db();

$stmt = $pdo->prepare('SELECT COUNT(*) FROM contact_messages WHERE ip = ? AND created_at > NOW() - INTERVAL 1 HOUR');
$stmt->execute([$ip]);
if ((int) $stmt->fetchColumn() >= 8) {
    json_response(['ok' => false, 'error' => 'Trop de messages envoyés récemment. Merci de réessayer plus tard.'], 429);
}

$stmt = $pdo->prepare(
    'INSERT INTO contact_messages (nom, entreprise, email, telephone, message, ip) VALUES (?, ?, ?, ?, ?, ?)'
);
$stmt->execute([$nom, $entreprise ?: null, $email, $telephone ?: null, $message, $ip ?: null]);

$body = "Nouveau message reçu via le formulaire de contact du site.\n\n"
    . "Nom : {$nom}\n"
    . ($entreprise !== '' ? "Entreprise : {$entreprise}\n" : '')
    . "Email : {$email}\n"
    . ($telephone !== '' ? "Téléphone : {$telephone}\n" : '')
    . "\nMessage :\n{$message}\n";

send_notification_email('Nouveau message — site IM Business Solutions', $body);

json_response(['ok' => true]);
