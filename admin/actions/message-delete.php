<?php
declare(strict_types=1);

require_once __DIR__ . '/../../includes/helpers.php';
require_once __DIR__ . '/../../includes/db.php';
require_once __DIR__ . '/../includes/auth.php';
require_login();
require_once __DIR__ . '/../includes/csrf.php';
require_csrf();

$id   = (int) post('id');
$back = post('back', '../messages.php');
$back = $back !== '' ? $back : '../messages.php';

if ($id > 0) {
    $stmt = db()->prepare('DELETE FROM contact_messages WHERE id = ?');
    $stmt->execute([$id]);
    flash_set('success', 'Message supprimé.');
} else {
    flash_set('error', 'Requête invalide.');
}

redirect($back);
