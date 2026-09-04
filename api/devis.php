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
$service    = post('service');
$budget     = post('budget');
$message    = post('message');
$consent    = post('consent');

$errors = [];
if ($nom === '') {
    $errors['nom'] = 'Le nom est requis.';
}
if ($email === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $errors['email'] = 'Adresse email invalide.';
}
if ($service === '') {
    $errors['service'] = 'Le type de service est requis.';
}
if ($message === '') {
    $errors['message'] = 'La description du projet est requise.';
}
if ($consent === '') {
    $errors['consent'] = 'Merci d’accepter d’être recontacté(e).';
}

if ($errors) {
    json_response(['ok' => false, 'errors' => $errors], 422);
}

$ip  = $_SERVER['REMOTE_ADDR'] ?? '';
$pdo = db();

$stmt = $pdo->prepare('SELECT COUNT(*) FROM quote_requests WHERE ip = ? AND created_at > NOW() - INTERVAL 1 HOUR');
$stmt->execute([$ip]);
if ((int) $stmt->fetchColumn() >= 8) {
    json_response(['ok' => false, 'error' => 'Trop de demandes envoyées récemment. Merci de réessayer plus tard.'], 429);
}

$stmt = $pdo->prepare(
    'INSERT INTO quote_requests (nom, entreprise, email, telephone, service, budget, message, ip) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
);
$stmt->execute([$nom, $entreprise ?: null, $email, $telephone ?: null, $service, $budget ?: null, $message, $ip ?: null]);

$body = "Nouvelle demande de devis reçue via le site.\n\n"
    . "Nom : {$nom}\n"
    . ($entreprise !== '' ? "Entreprise : {$entreprise}\n" : '')
    . "Email : {$email}\n"
    . ($telephone !== '' ? "Téléphone : {$telephone}\n" : '')
    . "Service souhaité : {$service}\n"
    . ($budget !== '' ? "Budget indicatif : {$budget}\n" : '')
    . "\nDescription du projet :\n{$message}\n";

send_notification_email('Nouvelle demande de devis — site IM Business Solutions', $body);

json_response(['ok' => true]);
