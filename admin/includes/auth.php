<?php
declare(strict_types=1);

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

function current_admin(): ?array
{
    return $_SESSION['admin'] ?? null;
}

/** À appeler en tout début de chaque page admin protégée. */
function require_login(): void
{
    if (!current_admin()) {
        $_SESSION['redirect_after_login'] = $_SERVER['REQUEST_URI'] ?? 'index.php';
        header('Location: login.php');
        exit;
    }
}

function login_admin(array $admin): void
{
    session_regenerate_id(true);
    $_SESSION['admin'] = [
        'id'     => (int) $admin['id'],
        'prenom' => $admin['prenom'],
        'nom'    => $admin['nom'],
        'email'  => $admin['email'],
        'role'   => $admin['role'],
    ];
}

/** Met à jour la session après modification du profil (sans re-login). */
function refresh_admin_session(array $admin): void
{
    $_SESSION['admin'] = [
        'id'     => (int) $admin['id'],
        'prenom' => $admin['prenom'],
        'nom'    => $admin['nom'],
        'email'  => $admin['email'],
        'role'   => $admin['role'],
    ];
}

function logout_admin(): void
{
    $_SESSION = [];
    if (ini_get('session.use_cookies')) {
        $params = session_get_cookie_params();
        setcookie(
            session_name(),
            '',
            time() - 42000,
            $params['path'],
            $params['domain'],
            $params['secure'],
            $params['httponly']
        );
    }
    session_destroy();
}
