<?php
declare(strict_types=1);

require_once __DIR__ . '/../../includes/helpers.php';
require_once __DIR__ . '/../../includes/db.php';
require_once __DIR__ . '/../includes/auth.php';
require_login();
require_once __DIR__ . '/../includes/csrf.php';
require_csrf();
require_once __DIR__ . '/../includes/ui.php';

$back = post('back', '../realisations.php');
$back = $back !== '' ? $back : '../realisations.php';

$id          = (int) post('id');
$titre       = post('titre');
$categorie   = post('categorie');
$client      = post('client');
$annee       = post('annee');
$description = post('description');
$statut      = post('statut') === 'brouillon' ? 'brouillon' : 'publie';

$allowedCategories = array_keys(realisation_categories());

$errors = [];
if ($titre === '') {
    $errors[] = 'Le titre du projet est requis.';
}
if (!in_array($categorie, $allowedCategories, true)) {
    $errors[] = 'La catégorie est invalide.';
}
if ($description === '') {
    $errors[] = 'La description du projet est requise.';
}
if ($annee !== '' && !preg_match('/^\d{4}$/', $annee)) {
    $errors[] = "L'année doit être au format AAAA.";
}

$uploadDir = realpath(__DIR__ . '/../../assets/images/projets');
if ($uploadDir === false) {
    // Le dossier n'existe pas encore : on le crée.
    @mkdir(__DIR__ . '/../../assets/images/projets', 0755, true);
    $uploadDir = realpath(__DIR__ . '/../../assets/images/projets');
}

$newImageRelPath = null;

if ($uploadDir !== false && !empty($_FILES['image']['name']) && $_FILES['image']['error'] !== UPLOAD_ERR_NO_FILE) {
    $file = $_FILES['image'];

    if ($file['error'] !== UPLOAD_ERR_OK) {
        $errors[] = "Échec de l'envoi de l'image. Merci de réessayer.";
    } elseif ($file['size'] > 5 * 1024 * 1024) {
        $errors[] = "L'image dépasse la taille maximale de 5 Mo.";
    } else {
        $finfo = new finfo(FILEINFO_MIME_TYPE);
        $mime  = $finfo->file($file['tmp_name']);
        $extensions = [
            'image/jpeg' => 'jpg',
            'image/png'  => 'png',
            'image/webp' => 'webp',
        ];
        if (!isset($extensions[$mime])) {
            $errors[] = 'Formats acceptés : JPG, PNG, WebP.';
        } else {
            $slug = preg_replace('/[^a-z0-9]+/', '-', mb_strtolower($titre));
            $slug = trim($slug, '-') ?: 'projet';
            $filename = $slug . '-' . substr(bin2hex(random_bytes(4)), 0, 8) . '.' . $extensions[$mime];
            $destination = $uploadDir . DIRECTORY_SEPARATOR . $filename;

            if (move_uploaded_file($file['tmp_name'], $destination)) {
                $newImageRelPath = 'assets/images/projets/' . $filename;
            } else {
                $errors[] = "Impossible d'enregistrer l'image sur le serveur.";
            }
        }
    }
}

if ($errors) {
    // On supprime le fichier éventuellement déjà déplacé pour éviter les orphelins
    if ($newImageRelPath !== null) {
        @unlink(__DIR__ . '/../../' . $newImageRelPath);
    }
    flash_set('error', implode(' ', $errors));
    redirect($back);
}

$pdo = db();

if ($id > 0) {
    $stmt = $pdo->prepare('SELECT image_path FROM realisations WHERE id = ?');
    $stmt->execute([$id]);
    $existing = $stmt->fetch();

    if (!$existing) {
        flash_set('error', 'Réalisation introuvable.');
        redirect($back);
    }

    $imagePath = $newImageRelPath ?? $existing['image_path'];

    $stmt = $pdo->prepare(
        'UPDATE realisations SET titre = ?, categorie = ?, client = ?, annee = ?, description = ?, image_path = ?, status = ? WHERE id = ?'
    );
    $stmt->execute([
        $titre,
        $categorie,
        $client ?: null,
        $annee ?: null,
        $description,
        $imagePath,
        $statut,
        $id,
    ]);

    // Si une nouvelle image remplace l'ancienne, on supprime l'ancien fichier
    if ($newImageRelPath !== null && !empty($existing['image_path']) && $existing['image_path'] !== $newImageRelPath) {
        @unlink(__DIR__ . '/../../' . $existing['image_path']);
    }

    flash_set('success', 'Réalisation mise à jour.');
} else {
    $stmt = $pdo->prepare(
        'INSERT INTO realisations (titre, categorie, client, annee, description, image_path, status) VALUES (?, ?, ?, ?, ?, ?, ?)'
    );
    $stmt->execute([
        $titre,
        $categorie,
        $client ?: null,
        $annee ?: null,
        $description,
        $newImageRelPath,
        $statut,
    ]);

    flash_set('success', 'Réalisation ajoutée.');
}

redirect($back);
