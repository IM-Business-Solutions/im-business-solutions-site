<?php
declare(strict_types=1);

$pageTitle    = 'Demandes de devis';
$pageSubtitle = 'Consultez et gérez toutes les demandes de devis reçues via le site.';
$activeNav    = 'demandes';
require __DIR__ . '/includes/layout_top.php';

$pdo = db();

$status  = get_param('status', 'all');
$service = get_param('service', 'all');
$period  = get_param('period', 'all');
$q       = get_param('q', '');
$page    = max(1, (int) get_param('page', '1'));
$perPage = in_array(get_param('per_page', '10'), ['10', '25', '50'], true) ? (int) get_param('per_page', '10') : 10;

$where  = [];
$params = [];

if ($service !== '' && $service !== 'all') {
    $where[]  = 'service = ?';
    $params[] = $service;
}
if ($period === '7') {
    $where[] = 'created_at >= NOW() - INTERVAL 7 DAY';
} elseif ($period === '30') {
    $where[] = 'created_at >= NOW() - INTERVAL 30 DAY';
} elseif ($period === 'year') {
    $where[] = 'YEAR(created_at) = YEAR(CURDATE())';
}
if ($q !== '') {
    $where[]  = '(nom LIKE ? OR email LIKE ? OR entreprise LIKE ?)';
    $like     = '%' . $q . '%';
    $params[] = $like;
    $params[] = $like;
    $params[] = $like;
}
$baseWhereSql = $where ? ('WHERE ' . implode(' AND ', $where)) : '';

$countStmt = $pdo->prepare("SELECT status, COUNT(*) AS c FROM quote_requests $baseWhereSql GROUP BY status");
$countStmt->execute($params);
$counts = ['nouveau' => 0, 'en_cours' => 0, 'traite' => 0, 'archive' => 0];
foreach ($countStmt->fetchAll() as $row) {
    $counts[$row['status']] = (int) $row['c'];
}
$totalAll = array_sum($counts);

$statusWhere  = $where;
$statusParams = $params;
$validStatuses = ['nouveau', 'en_cours', 'traite', 'archive'];
if (in_array($status, $validStatuses, true)) {
    $statusWhere[]  = 'status = ?';
    $statusParams[] = $status;
}
$listWhereSql = $statusWhere ? ('WHERE ' . implode(' AND ', $statusWhere)) : '';

$totalFiltered = in_array($status, $validStatuses, true) ? $counts[$status] : $totalAll;
$totalPages    = max(1, (int) ceil($totalFiltered / $perPage));
$page          = min($page, $totalPages);
$offset        = ($page - 1) * $perPage;

$stmt = $pdo->prepare("SELECT * FROM quote_requests $listWhereSql ORDER BY created_at DESC LIMIT :limit OFFSET :offset");
foreach ($statusParams as $i => $val) {
    $stmt->bindValue($i + 1, $val);
}
$stmt->bindValue(':limit', $perPage, PDO::PARAM_INT);
$stmt->bindValue(':offset', $offset, PDO::PARAM_INT);
$stmt->execute();
$rows = $stmt->fetchAll();

$queryString = $_SERVER['QUERY_STRING'] ?? '';
$backUrl     = '../demandes.php' . ($queryString !== '' ? '?' . $queryString : '');

$currentParams = ['status' => $status, 'service' => $service, 'period' => $period, 'q' => $q, 'per_page' => (string) $perPage];

$services = ['Communication', 'Développement commercial', "Apport d'affaires", 'Supports de présentation'];
?>
<div class="admin-toolbar">
  <form method="get" class="admin-toolbar" style="margin:0;flex:1;">
    <input type="hidden" name="page" value="1" />
    <div class="chip-select">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 6h16M7 12h10M10 18h4" /></svg>
      <select name="status" aria-label="Filtrer par statut" onchange="this.form.submit()">
        <option value="all" <?= $status === 'all' ? 'selected' : '' ?>>Tous les statuts</option>
        <?php foreach ($validStatuses as $s): ?>
        <option value="<?= h($s) ?>" <?= $status === $s ? 'selected' : '' ?>><?= h(quote_status_label($s)) ?></option>
        <?php endforeach; ?>
      </select>
    </div>
    <div class="chip-select">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></svg>
      <select name="service" aria-label="Filtrer par service" onchange="this.form.submit()">
        <option value="all" <?= $service === 'all' ? 'selected' : '' ?>>Tous les services</option>
        <?php foreach ($services as $s): ?>
        <option value="<?= h($s) ?>" <?= $service === $s ? 'selected' : '' ?>><?= h($s) ?></option>
        <?php endforeach; ?>
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
      <input type="search" name="q" value="<?= h($q) ?>" placeholder="Rechercher une demande…" aria-label="Rechercher une demande" />
    </div>
  </form>
  <a class="a-btn a-btn--outline" href="export-devis.php?<?= h(http_build_query($currentParams)) ?>">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v12" /><path d="m7 10 5 5 5-5" /><path d="M5 21h14" /></svg>
    Exporter
  </a>
</div>

<section class="panel">
  <div class="admin-tabs" role="tablist">
    <a class="admin-tabs__tab<?= $status === 'all' ? ' is-active' : '' ?>" href="<?= h(query_url('demandes.php', array_merge($currentParams, ['status' => 'all']))) ?>">Tous (<?= $totalAll ?>)</a>
    <?php foreach ($validStatuses as $s): ?>
    <a class="admin-tabs__tab<?= $status === $s ? ' is-active' : '' ?>" href="<?= h(query_url('demandes.php', array_merge($currentParams, ['status' => $s]))) ?>"><?= h(quote_status_label($s)) ?> (<?= $counts[$s] ?>)</a>
    <?php endforeach; ?>
    <a href="<?= h(query_url('demandes.php', $currentParams)) ?>" class="a-btn a-btn--primary a-btn--sm admin-tabs__action">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 0 1 15-6.7L21 8" /><path d="M21 3v5h-5" /><path d="M21 12a9 9 0 0 1-15 6.7L3 16" /><path d="M3 21v-5h5" /></svg>
      Actualiser
    </a>
  </div>

  <div class="table-wrap">
    <table class="data-table">
      <thead>
        <tr><th>Client</th><th>Service demandé</th><th>Budget estimé</th><th>Date</th><th>Statut</th><th>Actions</th></tr>
      </thead>
      <tbody>
        <?php if (empty($rows)): ?>
        <tr class="table-empty">
          <td colspan="6">
            <div class="empty">
              <span class="empty__icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="8" y="2" width="8" height="4" rx="1" /><path d="M10.5 20H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2M16 4h2a2 2 0 0 1 2 2v4" /><path d="M18.4 13.6a2 2 0 0 1 3 3L16 22l-4 1 1-4z" /></svg>
              </span>
              <h3>Aucune demande de devis</h3>
              <p>Les demandes de devis reçues via le site apparaîtront ici.</p>
              <a href="demandes.php" class="a-btn a-btn--ghost-gold">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 0 1 15-6.7L21 8" /><path d="M21 3v5h-5" /><path d="M21 12a9 9 0 0 1-15 6.7L3 16" /><path d="M3 21v-5h5" /></svg>
                Actualiser
              </a>
            </div>
          </td>
        </tr>
        <?php else: foreach ($rows as $r): ?>
        <tr>
          <td>
            <p class="cell-title"><?= h($r['nom']) ?></p>
            <?php if (!empty($r['entreprise'])): ?><p class="cell-sub"><?= h($r['entreprise']) ?></p><?php endif; ?>
          </td>
          <td><?= h($r['service'] ?: '—') ?></td>
          <td><?= h($r['budget'] ?: '—') ?></td>
          <td><?= h(format_date_fr($r['created_at'])) ?></td>
          <td>
            <form method="post" action="actions/devis-status.php" class="row-status-form">
              <?= csrf_field() ?>
              <input type="hidden" name="id" value="<?= (int) $r['id'] ?>" />
              <input type="hidden" name="back" value="<?= h($backUrl) ?>" />
              <select name="status" class="row-status-select" aria-label="Changer le statut">
                <?php foreach ($validStatuses as $s): ?>
                <option value="<?= h($s) ?>" <?= $r['status'] === $s ? 'selected' : '' ?>><?= h(quote_status_label($s)) ?></option>
                <?php endforeach; ?>
              </select>
            </form>
          </td>
          <td>
            <div class="row-actions">
              <a class="row-icon-btn" href="demande-voir.php?id=<?= (int) $r['id'] ?>" aria-label="Voir la demande">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7Z" /><circle cx="12" cy="12" r="3" /></svg>
              </a>
              <form method="post" action="actions/devis-delete.php" class="js-confirm" data-confirm="Supprimer définitivement cette demande ?">
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
        <?php endforeach; endif; ?>
      </tbody>
    </table>
  </div>

  <div class="pagination">
    <span><?= $totalFiltered ?> demande<?= $totalFiltered > 1 ? 's' : '' ?> de devis</span>
    <div class="pagination__right">
      <form method="get" style="display:inline">
        <?php foreach (['status' => $status, 'service' => $service, 'period' => $period, 'q' => $q] as $k => $v): ?>
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
        query_url('demandes.php', array_merge($currentParams, ['page' => (string) ($page - 1)])),
        'Page précédente',
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6" /></svg>'
      ) ?>
      <span class="pager" aria-current="page"><?= $page ?></span>
      <?= pager_button(
        $page < $totalPages,
        query_url('demandes.php', array_merge($currentParams, ['page' => (string) ($page + 1)])),
        'Page suivante',
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6" /></svg>'
      ) ?>
    </div>
  </div>
</section>

<?php require __DIR__ . '/includes/layout_bottom.php'; ?>
