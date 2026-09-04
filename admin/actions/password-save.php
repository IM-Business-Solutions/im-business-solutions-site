<?php
declare(strict_types=1);

require_once __DIR__ . '/../../includes/helpers.php';
require_once __DIR__ . '/../../includes/db.php';
require_once __DIR__ . '/../includes/auth.php';
require_login();
require_once __DIR__ . '/../includes/csrf.php';
require_csrf();

$referer = $_SERVER['HTTP_REFERER'] ?? '';
$back    = (strpos($referer, '/admin/') !== false) ? $referer : 'index.php';

$admin   = current_admin();
$current = (string) ($_POST['current_password'] ?? '');
$new     = (string) ($_POST['new_password'] ?? '');
$confirm = (string) ($_POST['new_password_confirm'] ?? '');

$stmt = db()->prepare('SELECT * FROM admins WHERE id = ?');
$stmt->execute([$admin['id']]);
$row = $stmt->fetch();

$errors = [];
if (!$row || !password_verify($current, $row['password_hash'])) {
    $errors[] = 'Mot de passe actuel incorrect.';
}
if (strlen($new) < 8) {
    $errors[] = 'Le nouveau mot de passe doit contenir au moins 8 caractères.';
}
if ($new !== $confirm) {
    $errors[] = 'Les deux mots de passe ne correspondent pas.';
}

if ($errors) {
    flash_set('error', implode(' ', $errors));
    redirect($back);
}

$stmt = db()->prepare('UPDATE admins SET password_hash = ? WHERE id = ?');
$stmt->execute([password_hash($new, PASSWORD_DEFAULT), $admin['id']]);

flash_set('success', 'Mot de passe mis à jour.');
redirect($back);
