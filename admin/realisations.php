<?php
declare(strict_types=1);

$pageTitle    = 'Réalisations';
$pageSubtitle = 'Gérez vos projets et mettez en valeur vos réalisations sur le site.';
$activeNav    = 'realisations';
require __DIR__ . '/includes/layout_top.php';

$pdo = db();

$tab = get_param('tab', 'all'); // all | online | draft
$q   = get_param('q', '');

$where  = [];
$params = [];

if ($tab === 'online') {
    $where[] = "status = 'publie'";
} elseif ($tab === 'draft') {
    $where[] = "status = 'brouillon'";
}
if ($q !== '') {
    $where[]  = '(titre LIKE ? OR client LIKE ? OR description LIKE ?)';
    $like     = '%' . $q . '%';
    $params[] = $like;
    $params[] = $like;
    $params[] = $like;
}
$whereSql = $where ? ('WHERE ' . implode(' AND ', $where)) : '';

$countAll    = (int) $pdo->query('SELECT COUNT(*) FROM realisations')->fetchColumn();
$countOnline = (int) $pdo->query("SELECT COUNT(*) FROM realisations WHERE status = 'publie'")->fetchColumn();
$countDraft  = (int) $pdo->query("SELECT COUNT(*) FROM realisations WHERE status = 'brouillon'")->fetchColumn();

$stmt = $pdo->prepare("SELECT * FROM realisations $whereSql ORDER BY created_at DESC");
$stmt->execute($params);
$rows = $stmt->fetchAll();

$latest = $pdo->query('SELECT * FROM realisations ORDER BY created_at DESC LIMIT 5')->fetchAll();

$queryString = $_SERVER['QUERY_STRING'] ?? '';
$backUrl     = '../realisations.php' . ($queryString !== '' ? '?' . $queryString : '');

$categories = realisation_categories();
?>
<section class="panel">
  <div class="admin-tabs" role="tablist">
    <a class="admin-tabs__tab<?= $tab === 'all' ? ' is-active' : '' ?>" href="<?= h(query_url('realisations.php', ['tab' => 'all', 'q' => $q])) ?>">Toutes les réalisations (<?= $countAll ?>)</a>
    <a class="admin-tabs__tab<?= $tab === 'online' ? ' is-active' : '' ?>" href="<?= h(query_url('realisations.php', ['tab' => 'online', 'q' => $q])) ?>">En ligne (<?= $countOnline ?>)</a>
    <a class="admin-tabs__tab<?= $tab === 'draft' ? ' is-active' : '' ?>" href="<?= h(query_url('realisations.php', ['tab' => 'draft', 'q' => $q])) ?>">Brouillons (<?= $countDraft ?>)</a>

    <div class="admin-tabs__end">
      <form method="get" class="search-box">
        <input type="hidden" name="tab" value="<?= h($tab) ?>" />
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" /></svg>
        <input type="search" name="q" value="<?= h($q) ?>" placeholder="Rechercher une réalisation…" aria-label="Rechercher une réalisation" />
      </form>
      <button type="button" class="a-btn a-btn--primary" data-open-realisation>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
        Ajouter une réalisation
      </button>
    </div>
  </div>

  <?php if (empty($rows)): ?>
  <div class="panel__body">
    <div class="empty">
      <span class="empty__icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="9" cy="9" r="2" /><path d="m21 15-4.5-4.5L5 21" /></svg>
      </span>
      <?php if ($q !== '' || $tab !== 'all'): ?>
      <h3>Aucun résultat</h3>
      <p>Aucune réalisation ne correspond à ces filtres.</p>
      <?php else: ?>
      <h3>Aucune réalisation</h3>
      <p>Vous n'avez encore ajouté aucune réalisation. Ajoutez votre premier projet pour le mettre en valeur sur le site.</p>
      <button type="button" class="a-btn a-btn--ghost-gold" data-open-realisation>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
        Ajouter une réalisation
      </button>
      <?php endif; ?>
    </div>
  </div>
  <?php else: ?>
  <div class="table-wrap">
    <table class="data-table">
      <thead>
        <tr><th>Projet</th><th>Catégorie</th><th>Client</th><th>Statut</th><th>Date</th><th>Actions</th></tr>
      </thead>
      <tbody>
        <?php foreach ($rows as $r): ?>
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
          <td><?= h($r['client'] ?: '—') ?></td>
          <td>
            <form method="post" action="actions/realisation-status.php" class="row-status-form">
              <?= csrf_field() ?>
              <input type="hidden" name="id" value="<?= (int) $r['id'] ?>" />
              <input type="hidden" name="back" value="<?= h($backUrl) ?>" />
              <select name="status" class="row-status-select" aria-label="Changer le statut">
                <option value="publie" <?= $r['status'] === 'publie' ? 'selected' : '' ?>>En ligne</option>
                <option value="brouillon" <?= $r['status'] === 'brouillon' ? 'selected' : '' ?>>Brouillon</option>
              </select>
            </form>
          </td>
          <td><?= h(format_date_fr($r['created_at'])) ?></td>
          <td>
            <div class="row-actions">
              <button
                type="button"
                class="row-icon-btn"
                aria-label="Modifier"
                data-edit-realisation
                data-id="<?= (int) $r['id'] ?>"
                data-titre="<?= h($r['titre']) ?>"
                data-categorie="<?= h($r['categorie']) ?>"
                data-client="<?= h($r['client'] ?? '') ?>"
                data-annee="<?= h($r['annee'] ?? '') ?>"
                data-description="<?= h($r['description']) ?>"
                data-status="<?= h($r['status']) ?>"
                data-image="<?= h($r['image_path'] ?? '') ?>"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9" /><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" /></svg>
              </button>
              <form method="post" action="actions/realisation-delete.php" class="js-confirm" data-confirm="Supprimer définitivement cette réalisation ?">
                <?= csrf_field() ?>
                <input type="hidden" name="id" value="<?= (int) $r['id'] ?>" />
                <input type="hidden" name="back" value="<?= h($backUrl) ?>" />
                <button type="submit" class="row-icon-btn row-icon-btn--danger" aria-label="Supprimer">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18" /><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" /></svg>
                </button>
              </form>
            </div>
          </td>
        </tr>
        <?php endforeach; ?>
      </tbody>
    </table>
  </div>
  <?php endif; ?>
</section>

<section class="panel">
  <div class="panel__head">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="9" cy="9" r="2" /><path d="m21 15-4.5-4.5L5 21" /></svg>
    <h2>Derniers projets</h2>
  </div>
  <?php if (empty($latest)): ?>
  <div class="panel__body">
    <div class="empty">
      <span class="empty__icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="9" cy="9" r="2" /><path d="m21 15-4.5-4.5L5 21" /></svg>
      </span>
      <h3>Aucun projet à afficher</h3>
      <p>Les réalisations que vous ajoutez apparaîtront ici.</p>
    </div>
  </div>
  <?php else: ?>
  <div class="table-wrap">
    <table class="data-table">
      <thead>
        <tr><th>Projet</th><th>Catégorie</th><th>Statut</th><th>Date</th></tr>
      </thead>
      <tbody>
        <?php foreach ($latest as $r): ?>
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

<!-- ============ MODALE : AJOUTER / MODIFIER UNE RÉALISATION ============ -->
<div class="admin-modal" id="realisation-modal" role="dialog" aria-modal="true" aria-labelledby="realisation-modal-title" aria-hidden="true">
  <div class="admin-modal__overlay" data-close></div>
  <div class="admin-modal__dialog">
    <div class="admin-modal__head">
      <h2 id="realisation-modal-title">Ajouter une réalisation</h2>
      <button type="button" class="admin-modal__close" data-close aria-label="Fermer">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="6" y1="6" x2="18" y2="18" /><line x1="6" y1="18" x2="18" y2="6" /></svg>
      </button>
    </div>

    <form id="realisation-form" action="actions/realisation-save.php" method="post" enctype="multipart/form-data" novalidate>
      <?= csrf_field() ?>
      <input type="hidden" name="id" id="r-id" value="" />
      <input type="hidden" name="back" value="<?= h($backUrl) ?>" />

      <div class="admin-modal__body">
        <p class="form-section">Informations générales</p>
        <div class="form-grid">
          <div class="form-field">
            <label for="r-title">Titre du projet <span class="req">*</span></label>
            <input id="r-title" name="titre" type="text" placeholder="Ex. : Refonte du site web" required />
          </div>
          <div class="form-field">
            <label for="r-cat">Catégorie <span class="req">*</span></label>
            <select id="r-cat" name="categorie" required>
              <option value="" disabled selected>Sélectionnez une catégorie</option>
              <?php foreach ($categories as $slug => $label): ?>
              <option value="<?= h($slug) ?>"><?= h($label) ?></option>
              <?php endforeach; ?>
            </select>
          </div>
          <div class="form-field">
            <label for="r-client">Client (optionnel)</label>
            <input id="r-client" name="client" type="text" placeholder="Ex. : Nom de l'entreprise ou du client" />
          </div>
          <div class="form-field form-field--date">
            <label for="r-year">Année de réalisation</label>
            <input id="r-year" name="annee" type="text" inputmode="numeric" placeholder="Ex. : 2026" />
          </div>
          <div class="form-field form-field--full">
            <label for="r-desc">Description du projet <span class="req">*</span></label>
            <textarea id="r-desc" name="description" maxlength="1000" placeholder="Décrivez le contexte, les objectifs, les solutions apportées et les résultats obtenus…" required></textarea>
            <span class="form-field__count">0 / 1000</span>
          </div>
        </div>

        <p class="form-section">Image du projet</p>
        <div id="r-current-image" class="dropzone-note" hidden>
          Image actuelle : <span id="r-current-image-name"></span> — laissez le champ vide pour la conserver.
        </div>
        <label class="dropzone" for="r-image">
          <input id="r-image" name="image" type="file" accept="image/jpeg,image/png,image/webp" hidden />
          <span class="dropzone__icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="9" cy="9" r="2" /><path d="m21 15-4.5-4.5L5 21" /></svg>
          </span>
          <strong>Ajouter une image</strong>
          <span>Glissez-déposez un fichier ici ou cliquez pour parcourir</span>
          <small>Formats acceptés : JPG, PNG, WebP — Taille max. 5 Mo</small>
        </label>
        <p class="dropzone-note" id="r-image-selected" hidden></p>

        <p class="form-section">Statut</p>
        <div class="form-field form-field--full">
          <div class="status-pick">
            <span class="status-dot" aria-hidden="true"></span>
            <select name="statut" id="r-status" aria-label="Statut de la réalisation">
              <option value="publie" selected>Publié</option>
              <option value="brouillon">Brouillon</option>
            </select>
          </div>
          <span class="form-field__hint">Les réalisations publiées seront visibles sur le site.</span>
        </div>
      </div>

      <div class="admin-modal__foot">
        <button type="button" class="a-btn a-btn--outline" data-close>Annuler</button>
        <button type="submit" class="a-btn a-btn--primary">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" /><path d="M17 21v-8H7v8M7 3v5h8" /></svg>
          Enregistrer la réalisation
        </button>
      </div>
    </form>
  </div>
</div>

<?php require __DIR__ . '/includes/layout_bottom.php'; ?>
