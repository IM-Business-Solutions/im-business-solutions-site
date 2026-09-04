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

$admin  = current_admin();
$prenom = post('prenom');
$nom    = post('nom');
$email  = post('email');

$errors = [];
if ($prenom === '' || $nom === '') {
    $errors[] = 'Le prénom et le nom sont requis.';
}
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $errors[] = 'Adresse email invalide.';
}

if (!$errors) {
    $stmt = db()->prepare('SELECT id FROM admins WHERE email = ? AND id != ?');
    $stmt->execute([$email, $admin['id']]);
    if ($stmt->fetch()) {
        $errors[] = 'Cette adresse email est déjà utilisée.';
    }
}

if ($errors) {
    flash_set('error', implode(' ', $errors));
    redirect($back);
}

$stmt = db()->prepare('UPDATE admins SET prenom = ?, nom = ?, email = ? WHERE id = ?');
$stmt->execute([$prenom, $nom, $email, $admin['id']]);

$stmt = db()->prepare('SELECT * FROM admins WHERE id = ?');
$stmt->execute([$admin['id']]);
$updated = $stmt->fetch();
if ($updated) {
    refresh_admin_session($updated);
}

flash_set('success', 'Profil mis à jour.');
redirect($back);
