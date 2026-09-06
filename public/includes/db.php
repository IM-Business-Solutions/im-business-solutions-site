<?php
declare(strict_types=1);

/**
 * Connexion PDO (singleton) + accès à la configuration.
 * Nécessite includes/config.php (voir config.sample.php).
 */

function app_config(): array
{
    static $config = null;

    if ($config === null) {
        $file = __DIR__ . '/config.php';
        if (!is_file($file)) {
            http_response_code(500);
            die(
                'Configuration manquante : copiez includes/config.sample.php vers ' .
                'includes/config.php et renseignez vos identifiants (voir README.md).'
            );
        }
        $config = require $file;
    }

    return $config;
}

function db(): PDO
{
    static $pdo = null;

    if ($pdo === null) {
        $cfg = app_config()['db'];
        $dsn = sprintf(
            'mysql:host=%s;dbname=%s;charset=%s',
            $cfg['host'],
            $cfg['name'],
            $cfg['charset'] ?? 'utf8mb4'
        );

        try {
            $pdo = new PDO($dsn, $cfg['user'], $cfg['pass'], [
                PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES   => false,
            ]);
        } catch (PDOException $e) {
            http_response_code(500);
            die('Connexion à la base de données impossible. Vérifiez includes/config.php.');
        }
    }

    return $pdo;
}
