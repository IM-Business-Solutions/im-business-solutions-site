<?php
declare(strict_types=1);

require_once __DIR__ . '/../includes/helpers.php';
require_once __DIR__ . '/../includes/db.php';
require_once __DIR__ . '/includes/auth.php';
require_login();

$status = get_param('status', 'all');
$period = get_param('period', 'all');
$q      = get_param('q', '');

$where  = [];
$params = [];

if ($status === 'unread') {
    $where[] = 'is_read = 0';
} elseif ($status === 'read') {
    $where[] = 'is_read = 1';
}
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
$whereSql = $where ? ('WHERE ' . implode(' AND ', $where)) : '';

$stmt = db()->prepare("SELECT * FROM contact_messages $whereSql ORDER BY created_at DESC");
$stmt->execute($params);
$rows = $stmt->fetchAll();

header('Content-Type: text/csv; charset=utf-8');
header('Content-Disposition: attachment; filename="messages-' . date('Y-m-d') . '.csv"');

$out = fopen('php://output', 'w');
fwrite($out, "\xEF\xBB\xBF");
fputcsv($out, ['Nom', 'Entreprise', 'Email', 'Téléphone', 'Message', 'Statut', 'Date'], ';');

foreach ($rows as $r) {
    fputcsv($out, [
        $r['nom'],
        $r['entreprise'],
        $r['email'],
        $r['telephone'],
        $r['message'],
        $r['is_read'] ? 'Lu' : 'Non lu',
        $r['created_at'],
    ], ';');
}

fclose($out);
exit;
