<?php
declare(strict_types=1);

require_once __DIR__ . '/../../includes/helpers.php';
require_once __DIR__ . '/../../includes/db.php';
require_once __DIR__ . '/../includes/auth.php';
require_login();
require_once __DIR__ . '/../includes/csrf.php';
require_csrf();

$mode = post('mode', 'toggle');
$back = post('back', '../messages.php');
$back = $back !== '' ? $back : '../messages.php';

if ($mode === 'all') {
    db()->exec('UPDATE contact_messages SET is_read = 1 WHERE is_read = 0');
    flash_set('success', 'Tous les messages ont été marqués comme lus.');
} else {
    $id    = (int) post('id');
    $value = post('value', '1') === '0' ? 0 : 1;
    if ($id > 0) {
        $stmt = db()->prepare('UPDATE contact_messages SET is_read = ? WHERE id = ?');
        $stmt->execute([$value, $id]);
        flash_set('success', $value ? 'Message marqué comme lu.' : 'Message marqué comme non lu.');
    } else {
        flash_set('error', 'Requête invalide.');
    }
}

redirect($back);
