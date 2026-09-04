<?php
declare(strict_types=1);

/**
 * Création du tout premier compte administrateur.
 * Cette page se désactive automatiquement dès qu'un compte existe : elle
 * ne peut donc pas servir de porte dérobée une fois l'administration en
 * place.
 */

require_once __DIR__ . '/../includes/helpers.php';
require_once __DIR__ . '/../includes/db.php';
require_once __DIR__ . '/includes/auth.php';
require_once __DIR__ . '/includes/csrf.php';

$adminCount = (int) db()->query('SELECT COUNT(*) FROM admins')->fetchColumn();
if ($adminCount > 0) {
    redirect('login.php');
}

$error  = '';
$values = ['prenom' => '', 'nom' => '', 'email' => ''];

if (is_post()) {
    $values['prenom'] = post('prenom');
    $values['nom']    = post('nom');
    $values['email']  = post('email');
    $password         = (string) ($_POST['password'] ?? '');
    $passwordConfirm  = (string) ($_POST['password_confirm'] ?? '');

    if (!csrf_verify()) {
        $error = 'Session expirée, merci de recharger la page et de réessayer.';
    } elseif ($values['prenom'] === '' || $values['nom'] === '') {
        $error = 'Le prénom et le nom sont requis.';
    } elseif (!filter_var($values['email'], FILTER_VALIDATE_EMAIL)) {
        $error = 'Adresse email invalide.';
    } elseif (strlen($password) < 8) {
        $error = 'Le mot de passe doit contenir au moins 8 caractères.';
    } elseif ($password !== $passwordConfirm) {
        $error = 'Les deux mots de passe ne correspondent pas.';
    } else {
        $stmt = db()->prepare(
            'INSERT INTO admins (prenom, nom, email, password_hash, role) VALUES (?, ?, ?, ?, ?)'
        );
        $stmt->execute([
            $values['prenom'],
            $values['nom'],
            $values['email'],
            password_hash($password, PASSWORD_DEFAULT),
            'Administrateur',
        ]);

        $admin = [
            'id'     => (int) db()->lastInsertId(),
            'prenom' => $values['prenom'],
            'nom'    => $values['nom'],
            'email'  => $values['email'],
            'role'   => 'Administrateur',
        ];
        login_admin($admin);
        redirect('index.php');
    }
}
?><!DOCTYPE html>
<html lang="fr">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Créer le compte administrateur — IM Business Solutions</title>
    <meta name="robots" content="noindex" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800&display=swap"
      rel="stylesheet"
    />
    <link rel="stylesheet" href="css/admin.css" />
  </head>
  <body class="auth-page">
    <div class="auth-card auth-card--wide">
      <img
        class="auth-card__logo"
        src="../assets/logo/im-business-solutions-white.png"
        alt="IM Business Solutions"
      />
      <h1>Créer le compte administrateur</h1>
      <p>Cette étape ne s'affiche qu'une seule fois, pour créer le premier accès à l'administration.</p>

      <?php if ($error !== ''): ?>
      <div class="alert alert--error"><?= h($error) ?></div>
      <?php endif; ?>

      <form method="post">
        <?= csrf_field() ?>
        <div class="form-grid">
          <div class="form-field">
            <label for="prenom">Prénom</label>
            <input id="prenom" name="prenom" type="text" required autofocus value="<?= h($values['prenom']) ?>" />
          </div>
          <div class="form-field">
            <label for="nom">Nom</label>
            <input id="nom" name="nom" type="text" required value="<?= h($values['nom']) ?>" />
          </div>
          <div class="form-field form-field--full">
            <label for="email">Email</label>
            <input id="email" name="email" type="email" required value="<?= h($values['email']) ?>" />
          </div>
          <div class="form-field">
            <label for="password">Mot de passe</label>
            <input id="password" name="password" type="password" minlength="8" required />
          </div>
          <div class="form-field">
            <label for="password_confirm">Confirmer le mot de passe</label>
            <input id="password_confirm" name="password_confirm" type="password" minlength="8" required />
          </div>
        </div>
        <button type="submit" class="a-btn a-btn--primary a-btn--block">Créer le compte</button>
      </form>
    </div>
  </body>
</html>
