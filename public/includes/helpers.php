<?php
declare(strict_types=1);

/** Échappement HTML court. */
function h(?string $value): string
{
    return htmlspecialchars($value ?? '', ENT_QUOTES, 'UTF-8');
}

function is_post(): bool
{
    return ($_SERVER['REQUEST_METHOD'] ?? '') === 'POST';
}

function post(string $key, string $default = ''): string
{
    return isset($_POST[$key]) ? trim((string) $_POST[$key]) : $default;
}

function get_param(string $key, string $default = ''): string
{
    return isset($_GET[$key]) ? trim((string) $_GET[$key]) : $default;
}

function redirect(string $path): void
{
    header('Location: ' . $path);
    exit;
}

function json_response(array $data, int $status = 200): void
{
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($data, JSON_UNESCAPED_UNICODE);
    exit;
}

/** Formate une date MySQL (YYYY-MM-DD HH:MM:SS) en "3 sept. 2026". */
function format_date_fr(?string $datetime): string
{
    if (!$datetime) {
        return '';
    }
    $ts = strtotime($datetime);
    if ($ts === false) {
        return '';
    }
    $mois = ['janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin', 'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.'];
    return date('j', $ts) . ' ' . $mois[(int) date('n', $ts) - 1] . ' ' . date('Y', $ts);
}

/** Construit une URL avec query string, en omettant les valeurs vides. */
function query_url(string $base, array $params): string
{
    $clean = [];
    foreach ($params as $key => $value) {
        if ($value !== '' && $value !== null) {
            $clean[$key] = $value;
        }
    }
    return $base . (empty($clean) ? '' : '?' . http_build_query($clean));
}

/* ---------- Messages flash (bannière après redirection) ---------- */

function flash_set(string $type, string $message): void
{
    $_SESSION['flash'] = ['type' => $type, 'message' => $message];
}

function flash_get(): ?array
{
    if (empty($_SESSION['flash'])) {
        return null;
    }
    $flash = $_SESSION['flash'];
    unset($_SESSION['flash']);
    return $flash;
}
