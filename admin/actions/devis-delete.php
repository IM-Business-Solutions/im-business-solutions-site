<?php
declare(strict_types=1);

require_once __DIR__ . '/../../includes/helpers.php';
require_once __DIR__ . '/../../includes/db.php';
require_once __DIR__ . '/../includes/auth.php';
require_login();
require_once __DIR__ . '/../includes/csrf.php';
require_csrf();

$id   = (int) post('id');
$back = post('back', '../demandes.php');
$back = $back !== '' ? $back : '../demandes.php';

if ($id > 0) {
    $stmt = db()->prepare('DELETE FROM quote_requests WHERE id = ?');
    $stmt->execute([$id]);
    flash_set('success', 'Demande supprimée.');
} else {
    flash_set('error', 'Requête invalide.');
}

redirect($back);
