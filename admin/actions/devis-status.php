<?php
declare(strict_types=1);

require_once __DIR__ . '/../../includes/helpers.php';
require_once __DIR__ . '/../../includes/db.php';
require_once __DIR__ . '/../includes/auth.php';
require_login();
require_once __DIR__ . '/../includes/csrf.php';
require_csrf();

$id     = (int) post('id');
$status = post('status');
$back   = post('back', '../demandes.php');
$back   = $back !== '' ? $back : '../demandes.php';

$allowed = ['nouveau', 'en_cours', 'traite', 'archive'];

if ($id > 0 && in_array($status, $allowed, true)) {
    $stmt = db()->prepare('UPDATE quote_requests SET status = ? WHERE id = ?');
    $stmt->execute([$status, $id]);
    flash_set('success', 'Statut mis à jour.');
} else {
    flash_set('error', 'Requête invalide.');
}

redirect($back);
