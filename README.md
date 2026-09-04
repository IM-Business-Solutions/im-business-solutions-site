# IM Business Solutions — Site vitrine + back-office

Site en **HTML / CSS / JS** côté public, **PHP + MySQL** côté back-end
(formulaires, authentification, administration). Aucun framework, aucun
build, aucune dépendance à installer (Composer/npm) — pensé pour un
hébergement mutualisé classique (OVH, o2switch, Infomaniak, Hostinger…).

## Structure

```
index.html, a-propos.html, services.html, methode.html, contact.html   Pages statiques
realisations.php                                                       Page dynamique (lit la BDD)

includes/                    Partagé public + admin — voir .htaccess (accès direct bloqué)
  config.sample.php            Modèle de configuration → à copier en config.php
  config.php                   Vos identifiants (À CRÉER, jamais commité/partagé)
  db.php                       Connexion PDO + app_config()
  helpers.php                  h(), post(), redirect(), flash_*(), query_url()...
  mailer.php                   send_notification_email() (via mail())

api/                          Endpoints publics anonymes (JSON), sans session
  contact.php                   Traite le formulaire de contact
  devis.php                     Traite la modale « Demander un devis »

admin/                        Back-office (authentification requise)
  login.php, logout.php, setup.php   Connexion / création du 1er compte
  index.php                          Tableau de bord (vrais chiffres)
  demandes.php, demande-voir.php     Demandes de devis (filtres, statut, export CSV)
  messages.php, message-voir.php     Messages de contact (lu/non lu, export CSV)
  realisations.php                   Réalisations (CRUD + upload d'image)
  export-devis.php, export-messages.php
  actions/                           Scripts POST (CSRF requis) : statut, suppression,
                                      sauvegarde réalisation, profil, mot de passe
  includes/                          auth.php, csrf.php, ui.php, layout_top/bottom.php
  css/admin.css, js/admin.js

sql/schema.sql                Structure de la base (à importer une fois)

css/style.css, js/main.js     Site public (styles + interactions + envoi des formulaires)
assets/                       Logos, photos de fond, images des réalisations
  images/projets/               Photos des réalisations (créé automatiquement à l'upload)
```

## Mise en ligne (hébergement mutualisé)

1. **Créer une base MySQL** dans l'espace client de l'hébergeur (nom, utilisateur,
   mot de passe — notez-les).
2. **Importer `sql/schema.sql`** dans cette base (phpMyAdmin → Importer, ou
   `mysql -u ... -p nom_base < sql/schema.sql`).
3. **Copier `includes/config.sample.php` en `includes/config.php`** et renseigner :
   - vos identifiants MySQL (`db`),
   - l'adresse qui doit recevoir les devis/messages et l'adresse d'expédition
     (`mail` — idéalement une adresse du même nom de domaine),
   - l'URL du site (`app.base_url`).
4. **Uploader tout le dossier** (FTP/SFTP ou gestionnaire de fichiers) à la
   racine de l'hébergement.
5. Vérifier que `includes/.htaccess` et `sql/.htaccess` sont bien présents et
   pris en compte : ouvrez `https://votre-domaine/includes/config.php` dans un
   navigateur, vous devez obtenir une **erreur 403** (jamais le contenu du
   fichier). Si l'hébergeur n'utilise pas Apache ou ignore les `.htaccess`,
   déplacez `includes/` en dehors du dossier public si possible, ou contactez
   le support pour bloquer l'accès à ce dossier.
6. Ouvrir `https://votre-domaine/admin/` : la page **de création du premier
   compte administrateur** s'affiche automatiquement tant qu'aucun compte
   n'existe. Une fois créé, cette page (`setup.php`) se désactive d'elle-même.
7. Vérifier l'envoi d'e-mail (remplir le formulaire de contact du site). En
   cas de non-réception : vérifier les spams, puis l'adresse `from` dans
   `config.php` (voir commentaire dans le fichier).

**Aperçu local sans PHP** : les pages `.html` s'ouvrent directement dans le
navigateur, mais `realisations.php`, les formulaires et tout `/admin/`
nécessitent un serveur PHP + MySQL (ex. WampServer/Laragon sous Windows,
`php -S localhost:8000` avec une base locale, ou un environnement de dev chez
l'hébergeur).

## Déploiement automatique (CI/CD)

Une fois la mise en ligne initiale faite (étapes 1 à 3 ci-dessus), les mises à
jour suivantes peuvent être automatisées par `.github/workflows/deploy-prod.yaml` :
à chaque tag `vX.Y.Z` poussé sur `main`, GitHub Actions vérifie la syntaxe PHP
de tous les fichiers puis envoie le site par **FTPS** sur l'hébergement — sans
jamais toucher à `includes/config.php` ni à `assets/images/projets/` (exclus
du suivi Git via `.gitignore`, donc ignorés par le déploiement).

**Mise en place (une seule fois) :**

1. Créer le dépôt Git et le pousser sur GitHub (`git init`, premier commit,
   `git push` vers un repo `main`) — je peux le faire avec toi si tu veux,
   dis-le-moi.
2. Dans le repo GitHub → **Settings → Secrets and variables → Actions**,
   ajouter :
   | Secret | Valeur |
   |---|---|
   | `FTP_SERVER` | ex. `ftp.im-business-solutions.fr` |
   | `FTP_USERNAME` | identifiant FTP de l'hébergeur |
   | `FTP_PASSWORD` | mot de passe FTP |
   | `FTP_SERVER_DIR` | dossier racine web côté serveur (ex. `/www/` ou `/`) |

   (Ces identifiants ne doivent jamais être partagés en dehors des secrets
   GitHub — ni dans le code, ni en conversation.)
3. Faire la mise en ligne initiale manuellement une première fois (section
   précédente) : le workflow déploie les mises à jour, pas la création de la
   base de données ni le premier `config.php`.

**Pour publier une nouvelle version ensuite :**

```
git tag v1.0.0
git push origin v1.0.0
```

Le job `ci` vérifie le code, puis `deploy-prod` déploie automatiquement — mais
uniquement si le tag pointe bien sur un commit de `main` (sécurité reprise du
workflow d'origine).

Si l'hébergeur propose le **SFTP** plutôt que le FTP/FTPS (plus sûr, souvent
disponible chez o2switch/Infomaniak), remplacer l'étape « Déployer par FTPS »
par l'action `wlixcc/SFTP-Deploy-Action`.

## Sécurité — ce qui est en place

- Mots de passe hashés (`password_hash`/`password_verify`), jamais stockés en clair.
- Sessions PHP côté admin, régénérées à la connexion.
- **CSRF** : jeton de session vérifié sur toutes les actions admin qui modifient
  des données (`admin/includes/csrf.php`).
- **Requêtes préparées PDO** partout (aucune concaténation SQL).
- Upload d'image des réalisations : vérification du type MIME réel (pas
  seulement l'extension), taille max 5 Mo, nom de fichier régénéré.
- Formulaires publics (contact/devis) : pas de session requise, donc pas de
  CSRF classique ; protection anti-spam par **champ piège** (`website`,
  invisible, doit rester vide) + limite de 8 envois/heure par IP.
- `includes/` et `sql/` bloqués en accès direct via `.htaccess`
  (`Require all denied`).
- `admin/setup.php` se désactive automatiquement dès qu'un compte existe :
  impossible de s'en servir comme porte dérobée.

**Limites connues (v1)** : un seul compte admin prévu par le flux normal
(un second compte peut être ajouté directement en base si besoin) ; l'envoi
d'e-mail utilise `mail()` (suffisant chez la plupart des hébergeurs — en cas
de soucis de délivrabilité, remplacer `send_notification_email()` dans
`includes/mailer.php` par PHPMailer + SMTP, sans toucher au reste du code) ;
la photo de profil admin est un bouton visuel non encore branché.

## Modales (site public)

Toutes injectées par `js/main.js`, fermeture croix / overlay / `Échap`,
piège de focus + blocage du scroll.

- **Demander un devis** : ouverte par `#open-quote-modal` ou
  `[data-modal-open="quote-modal"]`. Envoie vers `api/devis.php`.
- **Domaines d'expertise** (page Services) : 3 modales générées à partir du
  tableau `EXPERTISE` en haut de `main.js` — **c'est là qu'on modifie les
  textes**.

## Réalisations

Gérées entièrement depuis `/admin/realisations.php` (créer/modifier/publier
ou mettre en brouillon/supprimer, avec upload d'image). La page publique
`realisations.php` affiche automatiquement les réalisations au statut
**« Publié »**, les plus récentes en premier. Les filtres (Communication /
Développement commercial / Apport d'affaires) restent gérés en JavaScript
côté client (`data-cat` / `data-filter`).

## Formulaires publics

`contact.html` (formulaire) et la modale « Demander un devis » envoient en
JSON vers `api/contact.php` / `api/devis.php`, qui : valident les champs,
enregistrent la demande en base, puis envoient un e-mail de notification.
La page ne recharge pas — un message de succès ou d'erreur s'affiche à la
place du formulaire.

## Aperçu local (design uniquement, sans back-end)

Pour retoucher visuellement les pages statiques sans serveur PHP :

```
npx serve .
```

Les liens vers `realisations.php` et les envois de formulaires ne
fonctionneront pas dans ce mode (nécessitent PHP + MySQL, voir plus haut).

## Palette

| Variable        | Valeur    | Usage                      |
|-----------------|-----------|----------------------------|
| `--navy`        | `#031426` | Fond bleu nuit             |
| `--navy-dark`   | `#020c17` | Fonds très foncés / menu   |
| `--gold`        | `#d9a13b` | Doré principal             |
| `--gold-light`  | `#e5b34d` | Doré clair (hover, accents)|
| `--white`       | `#f7f7f5` | Blanc cassé                |
| `--text-dark`   | `#071426` | Texte sombre               |
