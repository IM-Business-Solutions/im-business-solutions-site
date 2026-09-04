<?php
declare(strict_types=1);

$pageTitle    = 'Message';
$pageSubtitle = 'Détail du message.';
$activeNav    = 'messages';
require __DIR__ . '/includes/layout_top.php';

$id   = (int) get_param('id');
$stmt = db()->prepare('SELECT * FROM contact_messages WHERE id = ?');
$stmt->execute([$id]);
$message = $stmt->fetch();

if (!$message) {
    flash_set('error', 'Message introuvable.');
    redirect('messages.php');
}

// Marque automatiquement comme lu à l'ouverture
if (!$message['is_read']) {
    db()->prepare('UPDATE contact_messages SET is_read = 1 WHERE id = ?')->execute([$id]);
    $message['is_read'] = 1;
}
?>
<a href="messages.php" class="a-btn a-btn--outline a-btn--sm" style="margin-bottom:18px;">
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" /></svg>
  Retour aux messages
</a>

<section class="panel">
  <div class="panel__head">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="2" /><path d="m2 7 10 6 10-6" /></svg>
    <h2><?= h($message['nom']) ?></h2>
    <span class="badge badge--muted" style="margin-left:auto;">Reçu le <?= h(format_date_fr($message['created_at'])) ?></span>
  </div>
  <div class="panel__body">
    <div class="form-grid">
      <div class="form-field">
        <label>Nom</label>
        <input type="text" value="<?= h($message['nom']) ?>" disabled />
      </div>
      <div class="form-field">
        <label>Entreprise</label>
        <input type="text" value="<?= h($message['entreprise'] ?: '—') ?>" disabled />
      </div>
      <div class="form-field">
        <label>Email</label>
        <input type="text" value="<?= h($message['email']) ?>" disabled />
      </div>
      <div class="form-field">
        <label>Téléphone</label>
        <input type="text" value="<?= h($message['telephone'] ?: '—') ?>" disabled />
      </div>
      <div class="form-field form-field--full">
        <label>Message</label>
        <textarea disabled style="min-height:160px;"><?= h($message['message']) ?></textarea>
      </div>
    </div>

    <div class="admin-modal__foot" style="border-top:1px solid var(--border);margin-top:22px;padding-top:18px;padding-left:0;padding-right:0;">
      <form method="post" action="actions/message-delete.php" class="js-confirm" data-confirm="Supprimer définitivement ce message ?">
        <?= csrf_field() ?>
        <input type="hidden" name="id" value="<?= (int) $message['id'] ?>" />
        <input type="hidden" name="back" value="messages.php" />
        <button type="submit" class="a-btn a-btn--outline">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18" /><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" /></svg>
          Supprimer
        </button>
      </form>
      <a class="a-btn a-btn--primary" href="mailto:<?= h($message['email']) ?>">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.94.36 1.86.7 2.73a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.34-1.27a2 2 0 0 1 2.11-.45c.87.34 1.79.57 2.73.7A2 2 0 0 1 22 16.92z" />
        </svg>
        Répondre par email
      </a>
    </div>
  </div>
</section>

<?php require __DIR__ . '/includes/layout_bottom.php'; ?>
