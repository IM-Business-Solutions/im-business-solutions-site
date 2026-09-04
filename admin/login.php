<?php
declare(strict_types=1);

require_once __DIR__ . '/../includes/helpers.php';
require_once __DIR__ . '/../includes/db.php';
require_once __DIR__ . '/includes/auth.php';
require_once __DIR__ . '/includes/csrf.php';

if (current_admin()) {
    redirect('index.php');
}

$adminCount = (int) db()->query('SELECT COUNT(*) FROM admins')->fetchColumn();
if ($adminCount === 0) {
    redirect('setup.php');
}

$error = '';
$emailValue = '';

if (is_post()) {
    $emailValue = post('email');

    if (!csrf_verify()) {
        $error = 'Session expirée, merci de recharger la page et de réessayer.';
    } else {
        $password = (string) ($_POST['password'] ?? '');

        $stmt = db()->prepare('SELECT * FROM admins WHERE email = ? LIMIT 1');
        $stmt->execute([$emailValue]);
        $admin = $stmt->fetch();

        if ($admin && password_verify($password, $admin['password_hash'])) {
            login_admin($admin);
            $redirectTo = $_SESSION['redirect_after_login'] ?? 'index.php';
            unset($_SESSION['redirect_after_login']);
            redirect($redirectTo !== '' ? $redirectTo : 'index.php');
        }

        $error = 'Email ou mot de passe incorrect.';
    }
}
?><!DOCTYPE html>
<html lang="fr">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Connexion — Admin IM Business Solutions</title>
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
    <div class="auth-card">
      <img
        class="auth-card__logo"
        src="../assets/logo/im-business-solutions-white.png"
        alt="IM Business Solutions"
      />
      <h1>Connexion</h1>
      <p>Accédez à l'administration du site.</p>

      <?php if ($error !== ''): ?>
      <div class="alert alert--error"><?= h($error) ?></div>
      <?php endif; ?>

      <form method="post">
        <?= csrf_field() ?>
        <div class="form-field">
          <label for="email">Email</label>
          <input id="email" name="email" type="email" required autofocus value="<?= h($emailValue) ?>" />
        </div>
        <div class="form-field">
          <label for="password">Mot de passe</label>
          <input id="password" name="password" type="password" required />
        </div>
        <button type="submit" class="a-btn a-btn--primary a-btn--block">Se connecter</button>
      </form>
    </div>
  </body>
</html>
