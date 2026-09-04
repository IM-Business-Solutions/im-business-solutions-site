<?php
declare(strict_types=1);

/**
 * Envoi d'e-mail minimaliste basé sur mail() (disponible nativement chez la
 * quasi-totalité des hébergeurs mutualisés, sans dépendance à installer).
 *
 * Si la délivrabilité pose problème (messages en spam / non reçus), la
 * cause la plus fréquente est l'adresse "from" : utilisez de préférence une
 * adresse du même domaine que l'hébergement (voir includes/config.php).
 * Pour une délivrabilité plus robuste, on peut plus tard remplacer cette
 * fonction par PHPMailer + SMTP sans changer le reste du code (le seul point
 * d'appel est send_notification_email()).
 */
function send_notification_email(string $subject, string $bodyText): bool
{
    $cfg = app_config()['mail'] ?? [];
    $to = $cfg['to'] ?? '';
    if ($to === '') {
        return false;
    }

    $fromEmail = $cfg['from'] ?? 'no-reply@localhost';
    $fromName  = $cfg['from_name'] ?? 'Site web';

    $headers   = [];
    $headers[] = 'MIME-Version: 1.0';
    $headers[] = 'Content-Type: text/plain; charset=UTF-8';
    $headers[] = 'From: ' . mb_encode_mimeheader($fromName) . ' <' . $fromEmail . '>';

    return @mail($to, mb_encode_mimeheader($subject), $bodyText, implode("\r\n", $headers));
}
