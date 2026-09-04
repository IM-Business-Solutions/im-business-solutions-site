<?php
declare(strict_types=1);

require_once __DIR__ . '/../includes/helpers.php';
require_once __DIR__ . '/../includes/db.php';
require_once __DIR__ . '/includes/auth.php';
require_login();
require_once __DIR__ . '/includes/ui.php';

$status  = get_param('status', 'all');
$service = get_param('service', 'all');
$period  = get_param('period', 'all');
$q       = get_param('q', '');

$where  = [];
$params = [];

$validStatuses = ['nouveau', 'en_cours', 'traite', 'archive'];
if (in_array($status, $validStatuses, true)) {
    $where[]  = 'status = ?';
    $params[] = $status;
}
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
$whereSql = $where ? ('WHERE ' . implode(' AND ', $where)) : '';

$stmt = db()->prepare("SELECT * FROM quote_requests $whereSql ORDER BY created_at DESC");
$stmt->execute($params);
$rows = $stmt->fetchAll();

header('Content-Type: text/csv; charset=utf-8');
header('Content-Disposition: attachment; filename="demandes-de-devis-' . date('Y-m-d') . '.csv"');

$out = fopen('php://output', 'w');
// BOM UTF-8 pour qu'Excel affiche correctement les accents
fwrite($out, "\xEF\xBB\xBF");
fputcsv($out, ['Nom', 'Entreprise', 'Email', 'Téléphone', 'Service', 'Budget', 'Message', 'Statut', 'Date'], ';');

foreach ($rows as $r) {
    fputcsv($out, [
        $r['nom'],
        $r['entreprise'],
        $r['email'],
        $r['telephone'],
        $r['service'],
        $r['budget'],
        $r['message'],
        quote_status_label($r['status']),
        $r['created_at'],
    ], ';');
}

fclose($out);
exit;
