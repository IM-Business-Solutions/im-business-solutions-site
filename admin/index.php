<?php
declare(strict_types=1);

$pageTitle    = 'Tableau de bord';
$pageSubtitle = null;
$activeNav    = 'dashboard';
require __DIR__ . '/includes/layout_top.php';

$pdo = db();

$devisTotal      = (int) $pdo->query('SELECT COUNT(*) FROM quote_requests')->fetchColumn();
$devisNouveau    = (int) $pdo->query("SELECT COUNT(*) FROM quote_requests WHERE status = 'nouveau'")->fetchColumn();
$messagesTotal   = (int) $pdo->query('SELECT COUNT(*) FROM contact_messages')->fetchColumn();
$messagesNonLus  = (int) $pdo->query('SELECT COUNT(*) FROM contact_messages WHERE is_read = 0')->fetchColumn();
$realisTotal     = (int) $pdo->query('SELECT COUNT(*) FROM realisations')->fetchColumn();
$realisEnLigne   = (int) $pdo->query("SELECT COUNT(*) FROM realisations WHERE status = 'publie'")->fetchColumn();

$latestDevis    = $pdo->query('SELECT * FROM quote_requests ORDER BY created_at DESC LIMIT 5')->fetchAll();
$latestMessages = $pdo->query('SELECT * FROM contact_messages ORDER BY created_at DESC LIMIT 5')->fetchAll();
$latestRealis   = $pdo->query('SELECT * FROM realisations ORDER BY created_at DESC LIMIT 5')->fetchAll();
?>
<!-- Statistiques -->
<div class="stat-grid">
  <div class="stat-card">
    <span class="stat-card__icon">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="8" y="2" width="8" height="4" rx="1" /><path d="M10.5 20H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2M16 4h2a2 2 0 0 1 2 2v4" /><path d="M18.4 13.6a2 2 0 0 1 3 3L16 22l-4 1 1-4z" /></svg>
    </span>
    <div>
      <p class="stat-card__label">Demandes de devis</p>
      <p class="stat-card__value"><?= $devisTotal ?></p>
      <p class="stat-card__sub"><?= $devisTotal === 0 ? 'Aucune demande' : $devisNouveau . ' nouvelle(s)' ?></p>
    </div>
  </div>
  <div class="stat-card">
    <span class="stat-card__icon">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="2" /><path d="m2 7 10 6 10-6" /></svg>
    </span>
    <div>
      <p class="stat-card__label">Messages</p>
      <p class="stat-card__value"><?= $messagesTotal ?></p>
      <p class="stat-card__sub"><?= $messagesTotal === 0 ? 'Aucun message' : $messagesNonLus . ' non lu(s)' ?></p>
    </div>
  </div>
  <div class="stat-card">
    <span class="stat-card__icon">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="9" cy="9" r="2" /><path d="m21 15-4.5-4.5L5 21" /></svg>
    </span>
    <div>
      <p class="stat-card__label">Réalisations</p>
      <p class="stat-card__value"><?= $realisTotal ?></p>
      <p class="stat-card__sub"><?= $realisTotal === 0 ? 'Aucune réalisation' : $realisEnLigne . ' en ligne' ?></p>
    </div>
  </div>
</div>

<!-- Deux colonnes -->
<div class="panel-cols">
  <section class="panel">
    <div class="panel__head">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6" /><path d="M16 13H8M16 17H8" /></svg>
      <h2>Dernières demandes de devis</h2>
      <a href="demandes.php" class="a-btn a-btn--outline a-btn--sm panel__head-action">Voir toutes</a>
    </div>
    <div class="table-wrap">
      <table class="data-table">
        <thead>
          <tr><th>Client</th><th>Service demandé</th><th>Date</th><th>Statut</th></tr>
        </thead>
        <tbody>
          <?php if (empty($latestDevis)): ?>
          <tr class="table-empty">
            <td colspan="4">
              <div class="empty">
                <span class="empty__icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" /></svg>
                </span>
                <h3>Aucune demande de devis</h3>
                <p>Les demandes de devis reçues via le site apparaîtront ici.</p>
              </div>
            </td>
          </tr>
          <?php else: foreach ($latestDevis as $d): ?>
          <tr>
            <td>
              <p class="cell-title"><?= h($d['nom']) ?></p>
              <?php if (!empty($d['entreprise'])): ?><p class="cell-sub"><?= h($d['entreprise']) ?></p><?php endif; ?>
            </td>
            <td><?= h($d['service'] ?: '—') ?></td>
            <td><?= h(format_date_fr($d['created_at'])) ?></td>
            <td><span class="badge <?= h(quote_status_badge_class($d['status'])) ?>"><?= h(quote_status_label($d['status'])) ?></span></td>
          </tr>
          <?php endforeach; endif; ?>
        </tbody>
      </table>
    </div>
  </section>

  <section class="panel">
    <div class="panel__head">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="2" /><path d="m2 7 10 6 10-6" /></svg>
      <h2>Derniers messages</h2>
      <a href="messages.php" class="a-btn a-btn--outline a-btn--sm panel__head-action">Voir tous</a>
    </div>
    <div class="table-wrap">
      <table class="data-table">
        <thead>
          <tr><th>Expéditeur</th><th>Sujet</th><th>Date</th><th>Statut</th></tr>
        </thead>
        <tbody>
          <?php if (empty($latestMessages)): ?>
          <tr class="table-empty">
            <td colspan="4">
              <div class="empty">
                <span class="empty__icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="2" /><path d="m2 7 10 6 10-6" /></svg>
                </span>
                <h3>Aucun message</h3>
                <p>Les messages envoyés via le formulaire de contact apparaîtront ici.</p>
              </div>
            </td>
          </tr>
          <?php else: foreach ($latestMessages as $m):
            $excerpt = mb_substr($m['message'], 0, 48);
            if (mb_strlen($m['message']) > 48) { $excerpt .= '…'; }
          ?>
          <tr class="<?= $m['is_read'] ? '' : 'is-unread' ?>">
            <td>
              <p class="cell-title"><?php if (!$m['is_read']): ?><span class="unread-dot" aria-hidden="true"></span><?php endif; ?><?= h($m['nom']) ?></p>
            </td>
            <td><?= h($excerpt) ?></td>
            <td><?= h(format_date_fr($m['created_at'])) ?></td>
            <td><span class="badge <?= $m['is_read'] ? 'badge--muted' : 'badge--new' ?>"><?= $m['is_read'] ? 'Lu' : 'Non lu' ?></span></td>
          </tr>
          <?php endforeach; endif; ?>
        </tbody>
      </table>
    </div>
  </section>
</div>

<!-- Dernières réalisations -->
<section class="panel">
  <div class="panel__head">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="9" cy="9" r="2" /><path d="m21 15-4.5-4.5L5 21" /></svg>
    <h2>Dernières réalisations</h2>
    <a href="realisations.php" class="a-btn a-btn--primary a-btn--sm panel__head-action">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
      Ajouter une réalisation
    </a>
  </div>
  <?php if (empty($latestRealis)): ?>
  <div class="panel__body">
    <div class="empty">
      <span class="empty__icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="9" cy="9" r="2" /><path d="m21 15-4.5-4.5L5 21" /></svg>
      </span>
      <h3>Aucune réalisation</h3>
      <p>Vous n'avez pas encore publié de projets. Ajoutez votre première réalisation.</p>
    </div>
  </div>
  <?php else: ?>
  <div class="table-wrap">
    <table class="data-table">
      <thead>
        <tr><th>Projet</th><th>Catégorie</th><th>Statut</th><th>Date</th></tr>
      </thead>
      <tbody>
        <?php foreach ($latestRealis as $r): ?>
        <tr>
          <td>
            <div class="cell-with-thumb">
              <span class="table-thumb">
                <?php if (!empty($r['image_path'])): ?>
                  <img src="../<?= h($r['image_path']) ?>" alt="" />
                <?php else: ?>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.6" /><path d="m21 15-5-5L5 21" /></svg>
                <?php endif; ?>
              </span>
              <span class="cell-title"><?= h($r['titre']) ?></span>
            </div>
          </td>
          <td><?= h(realisation_category_label($r['categorie'])) ?></td>
          <td><span class="badge <?= $r['status'] === 'publie' ? 'badge--online' : 'badge--draft' ?>"><?= $r['status'] === 'publie' ? 'En ligne' : 'Brouillon' ?></span></td>
          <td><?= h(format_date_fr($r['created_at'])) ?></td>
        </tr>
        <?php endforeach; ?>
      </tbody>
    </table>
  </div>
  <?php endif; ?>
</section>

<?php require __DIR__ . '/includes/layout_bottom.php'; ?>
