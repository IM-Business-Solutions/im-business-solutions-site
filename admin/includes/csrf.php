<?php
declare(strict_types=1);

function csrf_token(): string
{
    if (empty($_SESSION['csrf_token'])) {
        $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
    }
    return $_SESSION['csrf_token'];
}

function csrf_field(): string
{
    return '<input type="hidden" name="csrf_token" value="' . h(csrf_token()) . '">';
}

function csrf_verify(): bool
{
    $token = $_POST['csrf_token'] ?? '';
    return is_string($token) && !empty($_SESSION['csrf_token']) && hash_equals($_SESSION['csrf_token'], $token);
}

/** À appeler en tête de chaque script d'action (POST). Coupe court si invalide. */
function require_csrf(): void
{
    if (!is_post() || !csrf_verify()) {
        http_response_code(403);
        die('Requête invalide (jeton de sécurité manquant ou expiré). Merci de recharger la page et de réessayer.');
    }
}
