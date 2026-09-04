<?php
declare(strict_types=1);

require_once __DIR__ . '/../../includes/helpers.php';
require_once __DIR__ . '/../../includes/db.php';
require_once __DIR__ . '/../includes/auth.php';
require_login();
require_once __DIR__ . '/../includes/csrf.php';
require_csrf();

$id   = (int) post('id');
$back = post('back', '../realisations.php');
$back = $back !== '' ? $back : '../realisations.php';

if ($id > 0) {
    $pdo  = db();
    $stmt = $pdo->prepare('SELECT image_path FROM realisations WHERE id = ?');
    $stmt->execute([$id]);
    $existing = $stmt->fetch();

    $pdo->prepare('DELETE FROM realisations WHERE id = ?')->execute([$id]);

    if ($existing && !empty($existing['image_path'])) {
        @unlink(__DIR__ . '/../../' . $existing['image_path']);
    }

    flash_set('success', 'Réalisation supprimée.');
} else {
    flash_set('error', 'Requête invalide.');
}

redirect($back);
