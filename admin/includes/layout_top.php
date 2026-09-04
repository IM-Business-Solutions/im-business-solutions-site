<?php
declare(strict_types=1);

/**
 * En-tête commun de toutes les pages admin.
 * Variables attendues avant l'include :
 *   $pageTitle    (string, requis)
 *   $pageSubtitle (string, optionnel)
 *   $activeNav    ('dashboard' | 'demandes' | 'messages' | 'realisations')
 */

require_once __DIR__ . '/../../includes/helpers.php';
require_once __DIR__ . '/../../includes/db.php';
require_once __DIR__ . '/auth.php';
require_login();
require_once __DIR__ . '/csrf.php';
require_once __DIR__ . '/ui.php';

$admin     = current_admin();
$activeNav = $activeNav ?? '';

$navItems = [
    'dashboard'    => ['href' => 'index.php', 'label' => 'Tableau de bord'],
    'demandes'     => ['href' => 'demandes.php', 'label' => 'Demandes de devis'],
    'messages'     => ['href' => 'messages.php', 'label' => 'Messages'],
    'realisations' => ['href' => 'realisations.php', 'label' => 'Réalisations'],
];

$flash = flash_get();
?><!DOCTYPE html>
<html lang="fr">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title><?= h($pageTitle) ?> — Admin IM Business Solutions</title>
    <meta name="robots" content="noindex" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800&display=swap"
      rel="stylesheet"
    />
    <link rel="stylesheet" href="css/admin.css" />
  </head>
  <body data-csrf="<?= h(csrf_token()) ?>">
    <script>
      window.__adminInitials = <?= json_encode(admin_initials($admin), JSON_UNESCAPED_UNICODE) ?>;
      window.__adminFullname = <?= json_encode(trim(($admin['prenom'] ?? '') . ' ' . ($admin['nom'] ?? '')), JSON_UNESCAPED_UNICODE) ?>;
      window.__adminPrenom   = <?= json_encode($admin['prenom'] ?? '', JSON_UNESCAPED_UNICODE) ?>;
      window.__adminNom      = <?= json_encode($admin['nom'] ?? '', JSON_UNESCAPED_UNICODE) ?>;
      window.__adminEmail    = <?= json_encode($admin['email'] ?? '', JSON_UNESCAPED_UNICODE) ?>;
      window.__adminRole     = <?= json_encode($admin['role'] ?? 'Administrateur', JSON_UNESCAPED_UNICODE) ?>;
    </script>
    <div class="admin-backdrop" id="admin-backdrop"></div>

    <aside class="admin-sidebar">
      <div class="admin-sidebar__brand">
        <a href="index.php" aria-label="IM Business Solutions — Admin">
          <img src="../assets/logo/im-business-solutions-white.png" alt="IM Business Solutions" />
        </a>
      </div>

      <nav class="admin-nav" aria-label="Navigation admin">
        <?php foreach ($navItems as $key => $item): ?>
        <a href="<?= h($item['href']) ?>"<?= $key === $activeNav ? ' class="is-active" aria-current="page"' : '' ?>>
          <?= admin_nav_icon($key) ?>
          <?= h($item['label']) ?>
        </a>
        <?php endforeach; ?>
      </nav>

      <div class="admin-sidebar__foot">
        <button type="button" class="admin-user" data-open-modal="profile-modal">
          <span class="admin-avatar"><?= h(admin_initials($admin)) ?></span>
          <span>
            <span class="admin-user__name"><?= h(trim(($admin['prenom'] ?? '') . ' ' . ($admin['nom'] ?? ''))) ?></span><br />
            <span class="admin-user__role"><?= h($admin['role'] ?? '') ?></span>
          </span>
          <svg class="admin-user__chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9" /></svg>
        </button>
        <a href="logout.php" class="admin-logout">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>
          Se déconnecter
        </a>
      </div>
    </aside>

    <div class="admin-body">
      <header class="admin-topbar">
        <button type="button" class="icon-btn" id="nav-toggle" aria-label="Afficher / masquer le menu">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" /></svg>
        </button>
        <div class="admin-topbar__title">
          <h1><?= h($pageTitle) ?></h1>
          <?php if (!empty($pageSubtitle)): ?><p><?= h($pageSubtitle) ?></p><?php endif; ?>
        </div>
        <div class="admin-topbar__right">
          <button type="button" class="icon-btn bell" aria-label="Notifications">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.7 21a2 2 0 0 1-3.4 0" /></svg>
          </button>
          <a href="../index.html" class="admin-org" target="_blank" rel="noopener">
            <span>IM Business Solutions</span>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9" /></svg>
          </a>
        </div>
      </header>

      <main class="admin-content">
        <?php if ($flash): ?>
        <div class="alert alert--<?= h($flash['type']) ?>"><?= h($flash['message']) ?></div>
        <?php endif; ?>
