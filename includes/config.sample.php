<?php
/**
 * Copiez ce fichier en "config.php" (même dossier) et renseignez vos
 * identifiants. Ce fichier (config.sample.php) peut rester tel quel, il
 * ne sert que de modèle.
 *
 * IMPORTANT : ne partagez jamais config.php (identifiants de la base de
 * données) et ne le rendez pas accessible publiquement. Le fichier
 * includes/.htaccess bloque déjà l'accès direct à ce dossier sur les
 * hébergeurs Apache — vérifiez qu'il est bien pris en compte après la mise
 * en ligne (ouvrez https://votre-domaine.fr/includes/config.php : vous
 * devez obtenir une erreur 403, jamais le contenu du fichier).
 */

return [
    'db' => [
        'host'    => 'localhost',
        'name'    => 'nom_de_la_base',
        'user'    => 'utilisateur_mysql',
        'pass'    => 'mot_de_passe_mysql',
        'charset' => 'utf8mb4',
    ],

    'mail' => [
        // Adresse qui reçoit les notifications (devis + messages de contact)
        'to' => 'contact@im-business-solutions.fr',
        // Adresse d'expédition : idéalement une adresse du MÊME domaine que
        // l'hébergement (sinon certains hébergeurs bloquent l'envoi ou les
        // messages finissent en spam).
        'from'      => 'no-reply@im-business-solutions.fr',
        'from_name' => 'IM Business Solutions — Site web',
    ],

    'app' => [
        // URL du site, sans "/" final
        'base_url' => 'https://im-business-solutions.fr',
    ],
];
