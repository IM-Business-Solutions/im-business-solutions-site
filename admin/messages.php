<?php
declare(strict_types=1);

$pageTitle    = 'Messages';
$pageSubtitle = 'Consultez et gérez tous les messages reçus via le formulaire de contact.';
$activeNav    = 'messages';
require __DIR__ . '/includes/layout_top.php';

$pdo = db();

$status  = get_param('status', 'all'); // all | unread | read
$period  = get_param('period', 'all');
$q       = get_param('q', '');
$page    = max(1, (int) get_param('page', '1'));
$perPage = in_array(get_param('per_page', '10'), ['10', '25', '50'], true) ? (int) get_param('per_page', '10') : 10;

$where  = [];
$params = [];

if ($period === '7') {
    $where[] = 'created_at >= NOW() - INTERVAL 7 DAY';
} elseif ($period === '30') {
    $where[] = 'created_at >= NOW() - INTERVAL 30 DAY';
} elseif ($period === 'year') {
    $where[] = 'YEAR(created_at) = YEAR(CURDATE())';
}
if ($q !== '') {
    $where[]  = '(nom LIKE ? OR email LIKE ? OR entreprise LIKE ? OR message LIKE ?)';
    $like     = '%' . $q . '%';
    $params[] = $like;
    $params[] = $like;
    $params[] = $like;
    $params[] = $like;
}
$baseWhereSql = $where ? ('WHERE ' . implode(' AND ', $where)) : '';

$countStmt = $pdo->prepare("SELECT is_read, COUNT(*) AS c FROM contact_messages $baseWhereSql GROUP BY is_read");
$countStmt->execute($params);
$counts = ['unread' => 0, 'read' => 0];
foreach ($countStmt->fetchAll() as $row) {
    $counts[$row['is_read'] ? 'read' : 'unread'] = (int) $row['c'];
}
$totalAll = $counts['unread'] + $counts['read'];

$statusWhere  = $where;
$statusParams = $params;
if ($status === 'unread') {
    $statusWhere[] = 'is_read = 0';
} elseif ($status === 'read') {
    $statusWhere[] = 'is_read = 1';
}
$listWhereSql = $statusWhere ? ('WHERE ' . implode(' AND ', $statusWhere)) : '';

$totalFiltered = $status === 'unread' ? $counts['unread'] : ($status === 'read' ? $counts['read'] : $totalAll);
$totalPages    = max(1, (int) ceil($totalFiltered / $perPage));
$page          = min($page, $totalPages);
$offset        = ($page - 1) * $perPage;

$stmt = $pdo->prepare("SELECT * FROM contact_messages $listWhereSql ORDER BY created_at DESC LIMIT :limit OFFSET :offset");
foreach ($statusParams as $i => $val) {
    $stmt->bindValue($i + 1, $val);
}
$stmt->bindValue(':limit', $perPage, PDO::PARAM_INT);
$stmt->bindValue(':offset', $offset, PDO::PARAM_INT);
$stmt->execute();
$rows = $stmt->fetchAll();

$queryString = $_SERVER['QUERY_STRING'] ?? '';
$backUrl     = '../messages.php' . ($queryString !== '' ? '?' . $queryString : '');

$currentParams = ['status' => $status, 'period' => $period, 'q' => $q, 'per_page' => (string) $perPage];
?>
<div class="admin-toolbar">
  <form method="get" class="admin-toolbar" style="margin:0;flex:1;">
    <input type="hidden" name="page" value="1" />
    <div class="chip-select">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="2" /><path d="m2 7 10 6 10-6" /></svg>
      <select name="status" aria-label="Filtrer par statut" onchange="this.form.submit()">
        <option value="all" <?= $status === 'all' ? 'selected' : '' ?>>Tous les statuts</option>
        <option value="unread" <?= $status === 'unread' ? 'selected' : '' ?>>Non lus</option>
        <option value="read" <?= $status === 'read' ? 'selected' : '' ?>>Lus</option>
      </select>
    </div>
    <div class="chip-select">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /></svg>
      <select name="period" aria-label="Filtrer par date" onchange="this.form.submit()">
        <option value="all" <?= $period === 'all' ? 'selected' : '' ?>>Toutes les dates</option>
        <option value="7" <?= $period === '7' ? 'selected' : '' ?>>7 derniers jours</option>
        <option value="30" <?= $period === '30' ? 'selected' : '' ?>>30 derniers jours</option>
        <option value="year" <?= $period === 'year' ? 'selected' : '' ?>>Cette année</option>
      </select>
    </div>

    <div class="search-box">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" /></svg>
      <input type="search" name="q" value="<?= h($q) ?>" placeholder="Rechercher un message…" aria-label="Rechercher un message" />
    </div>
  </form>
  <a class="a-btn a-btn--outline" href="export-messages.php?<?= h(http_build_query($currentParams)) ?>">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v12" /><path d="m7 10 5 5 5-5" /><path d="M5 21h14" /></svg>
    Exporter
  </a>
</div>

<section class="panel">
  <div class="admin-tabs" role="tablist">
    <a class="admin-tabs__tab<?= $status === 'all' ? ' is-active' : '' ?>" href="<?= h(query_url('messages.php', array_merge($currentParams, ['status' => 'all']))) ?>">Tous (<?= $totalAll ?>)</a>
    <a class="admin-tabs__tab<?= $status === 'unread' ? ' is-active' : '' ?>" href="<?= h(query_url('messages.php', array_merge($currentParams, ['status' => 'unread']))) ?>">Non lus (<?= $counts['unread'] ?>)</a>
    <a class="admin-tabs__tab<?= $status === 'read' ? ' is-active' : '' ?>" href="<?= h(query_url('messages.php', array_merge($currentParams, ['status' => 'read']))) ?>">Lus (<?= $counts['read'] ?>)</a>

    <form method="post" action="actions/message-read.php" class="admin-tabs__action">
      <?= csrf_field() ?>
      <input type="hidden" name="mode" value="all" />
      <input type="hidden" name="back" value="<?= h($backUrl) ?>" />
      <button type="submit" class="a-btn a-btn--ghost-gold a-btn--sm">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.1V12a10 10 0 1 1-5.9-9.1" /><path d="m9 11 3 3L22 4" /></svg>
        Marquer tous comme lus
      </button>
    </form>
  </div>

  <div class="table-wrap">
    <table class="data-table">
      <thead>
        <tr><th>Expéditeur</th><th>Sujet</th><th>Date</th><th>Statut</th><th>Actions</th></tr>
      </thead>
      <tbody>
        <?php if (empty($rows)): ?>
        <tr class="table-empty">
          <td colspan="5">
            <div class="empty">
              <span class="empty__icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="2" /><path d="m2 7 10 6 10-6" /></svg>
              </span>
              <h3>Aucun message</h3>
              <p>Les messages envoyés via le formulaire de contact apparaîtront ici.</p>
              <a href="messages.php" class="a-btn a-btn--ghost-gold">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 0 1 15-6.7L21 8" /><path d="M21 3v5h-5" /><path d="M21 12a9 9 0 0 1-15 6.7L3 16" /><path d="M3 21v-5h5" /></svg>
                Actualiser
              </a>
            </div>
          </td>
        </tr>
        <?php else: foreach ($rows as $m):
          $excerpt = mb_substr($m['message'], 0, 70);
          if (mb_strlen($m['message']) > 70) { $excerpt .= '…'; }
        ?>
        <tr class="<?= $m['is_read'] ? '' : 'is-unread' ?>">
          <td>
            <p class="cell-title"><?php if (!$m['is_read']): ?><span class="unread-dot" aria-hidden="true"></span><?php endif; ?><?= h($m['nom']) ?></p>
            <p class="cell-sub"><?= h($m['email']) ?></p>
          </td>
          <td><?= h($excerpt) ?></td>
          <td><?= h(format_date_fr($m['created_at'])) ?></td>
          <td><span class="badge <?= $m['is_read'] ? 'badge--muted' : 'badge--new' ?>"><?= $m['is_read'] ? 'Lu' : 'Non lu' ?></span></td>
          <td>
            <div class="row-actions">
              <a class="row-icon-btn" href="message-voir.php?id=<?= (int) $m['id'] ?>" aria-label="Voir le message">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7Z" /><circle cx="12" cy="12" r="3" /></svg>
              </a>
              <form method="post" action="actions/message-read.php">
                <?= csrf_field() ?>
                <input type="hidden" name="mode" value="toggle" />
                <input type="hidden" name="id" value="<?= (int) $m['id'] ?>" />
                <input type="hidden" name="value" value="<?= $m['is_read'] ? '0' : '1' ?>" />
                <input type="hidden" name="back" value="<?= h($backUrl) ?>" />
                <button type="submit" class="row-icon-btn" aria-label="<?= $m['is_read'] ? 'Marquer comme non lu' : 'Marquer comme lu' ?>">
                  <?php if ($m['is_read']): ?>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="2" /><path d="m2 7 10 6 10-6" /></svg>
                  <?php else: ?>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.1V12a10 10 0 1 1-5.9-9.1" /><path d="m9 11 3 3L22 4" /></svg>
                  <?php endif; ?>
                </button>
              </form>
              <form method="post" action="actions/message-delete.php" class="js-confirm" data-confirm="Supprimer définitivement ce message ?">
                <?= csrf_field() ?>
                <input type="hidden" name="id" value="<?= (int) $m['id'] ?>" />
                <input type="hidden" name="back" value="<?= h($backUrl) ?>" />
                <button type="submit" class="row-icon-btn row-icon-btn--danger" aria-label="Supprimer">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18" /><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" /></svg>
                </button>
              </form>
            </div>
          </td>
        </tr>
        <?php endforeach; endif; ?>
      </tbody>
    </table>
  </div>

  <div class="pagination">
    <span><?= $totalFiltered ?> message<?= $totalFiltered > 1 ? 's' : '' ?></span>
    <div class="pagination__right">
      <form method="get" style="display:inline">
        <?php foreach (['status' => $status, 'period' => $period, 'q' => $q] as $k => $v): ?>
          <?php if ($v !== '' && $v !== 'all'): ?><input type="hidden" name="<?= h($k) ?>" value="<?= h($v) ?>" /><?php endif; ?>
        <?php endforeach; ?>
        <label>Lignes par page
          <select name="per_page" aria-label="Lignes par page" onchange="this.form.submit()">
            <?php foreach ([10, 25, 50] as $n): ?>
            <option value="<?= $n ?>" <?= $perPage === $n ? 'selected' : '' ?>><?= $n ?></option>
            <?php endforeach; ?>
          </select>
        </label>
      </form>
      <?= pager_button(
        $page > 1,
        query_url('messages.php', array_merge($currentParams, ['page' => (string) ($page - 1)])),
        'Page précédente',
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6" /></svg>'
      ) ?>
      <span class="pager" aria-current="page"><?= $page ?></span>
      <?= pager_button(
        $page < $totalPages,
        query_url('messages.php', array_merge($currentParams, ['page' => (string) ($page + 1)])),
        'Page suivante',
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6" /></svg>'
      ) ?>
    </div>
  </div>
</section>

<?php require __DIR__ . '/includes/layout_bottom.php'; ?>
