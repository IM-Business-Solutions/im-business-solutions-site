<?php
declare(strict_types=1);

$pageTitle    = 'Demande de devis';
$pageSubtitle = 'Détail de la demande.';
$activeNav    = 'demandes';
require __DIR__ . '/includes/layout_top.php';

$id   = (int) get_param('id');
$stmt = db()->prepare('SELECT * FROM quote_requests WHERE id = ?');
$stmt->execute([$id]);
$devis = $stmt->fetch();

if (!$devis) {
    flash_set('error', 'Demande introuvable.');
    redirect('demandes.php');
}

$validStatuses = ['nouveau', 'en_cours', 'traite', 'archive'];
?>
<a href="demandes.php" class="a-btn a-btn--outline a-btn--sm" style="margin-bottom:18px;">
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" /></svg>
  Retour aux demandes
</a>

<div class="panel-cols">
  <section class="panel" style="grid-column: 1 / -1;">
    <div class="panel__head">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6" /><path d="M16 13H8M16 17H8" /></svg>
      <h2><?= h($devis['nom']) ?></h2>
      <span class="badge <?= h(quote_status_badge_class($devis['status'])) ?>" style="margin-left:auto;"><?= h(quote_status_label($devis['status'])) ?></span>
    </div>
    <div class="panel__body">
      <div class="form-grid">
        <div class="form-field">
          <label>Nom</label>
          <input type="text" value="<?= h($devis['nom']) ?>" disabled />
        </div>
        <div class="form-field">
          <label>Entreprise</label>
          <input type="text" value="<?= h($devis['entreprise'] ?: '—') ?>" disabled />
        </div>
        <div class="form-field">
          <label>Email</label>
          <input type="text" value="<?= h($devis['email']) ?>" disabled />
        </div>
        <div class="form-field">
          <label>Téléphone</label>
          <input type="text" value="<?= h($devis['telephone'] ?: '—') ?>" disabled />
        </div>
        <div class="form-field">
          <label>Service souhaité</label>
          <input type="text" value="<?= h($devis['service'] ?: '—') ?>" disabled />
        </div>
        <div class="form-field">
          <label>Budget indicatif</label>
          <input type="text" value="<?= h($devis['budget'] ?: '—') ?>" disabled />
        </div>
        <div class="form-field form-field--full">
          <label>Description du projet</label>
          <textarea disabled style="min-height:140px;"><?= h($devis['message']) ?></textarea>
        </div>
      </div>

      <p class="form-field__hint" style="margin-top:6px;">Reçue le <?= h(format_date_fr($devis['created_at'])) ?></p>

      <div class="admin-modal__foot" style="border-top:1px solid var(--border);margin-top:22px;padding-top:18px;padding-left:0;padding-right:0;">
        <form method="post" action="actions/devis-delete.php" class="js-confirm" data-confirm="Supprimer définitivement cette demande ?">
          <?= csrf_field() ?>
          <input type="hidden" name="id" value="<?= (int) $devis['id'] ?>" />
          <input type="hidden" name="back" value="demandes.php" />
          <button type="submit" class="a-btn a-btn--outline">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18" /><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" /></svg>
            Supprimer
          </button>
        </form>

        <form method="post" action="actions/devis-status.php" style="display:flex;gap:10px;align-items:center;">
          <?= csrf_field() ?>
          <input type="hidden" name="id" value="<?= (int) $devis['id'] ?>" />
          <input type="hidden" name="back" value="demande-voir.php?id=<?= (int) $devis['id'] ?>" />
          <select name="status" class="row-status-select">
            <?php foreach ($validStatuses as $s): ?>
            <option value="<?= h($s) ?>" <?= $devis['status'] === $s ? 'selected' : '' ?>><?= h(quote_status_label($s)) ?></option>
            <?php endforeach; ?>
          </select>
          <button type="submit" class="a-btn a-btn--primary">Mettre à jour le statut</button>
        </form>
      </div>
    </div>
  </section>
</div>

<?php require __DIR__ . '/includes/layout_bottom.php'; ?>
