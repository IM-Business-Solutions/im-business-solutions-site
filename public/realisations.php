<?php
declare(strict_types=1);

require_once __DIR__ . '/includes/db.php';
require_once __DIR__ . '/includes/helpers.php';

$realisations = db()
    ->query("SELECT titre, categorie, description, image_path FROM realisations WHERE status = 'publie' ORDER BY created_at DESC")
    ->fetchAll();
?>
<!DOCTYPE html>
<html lang="fr">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Réalisations — IM Business Solutions</title>
    <meta
      name="description"
      content="Une sélection de projets réalisés auprès d'entreprises et d'entrepreneurs accompagnés dans leur développement."
    />

    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800;900&display=swap"
      rel="stylesheet"
    />

    <link rel="stylesheet" href="css/style.css" />
  </head>

  <body>
    <!-- ================= HEADER ================= -->
    <header class="site-header" id="site-header">
      <div class="container site-header__inner">
        <a href="index.html" class="logo" aria-label="IM Business Solutions — Accueil">
          <img
            src="assets/logo/im-business-solutions-white.png"
            alt="IM Business Solutions"
            width="150"
            height="118"
          />
        </a>

        <button
          class="nav-toggle"
          id="nav-toggle"
          aria-label="Ouvrir le menu"
          aria-expanded="false"
          aria-controls="primary-nav"
        >
          <span></span><span></span><span></span>
        </button>

        <nav class="primary-nav" id="primary-nav" aria-label="Navigation principale">
          <ul class="primary-nav__list">
            <li><a href="index.html">Accueil</a></li>
            <li><a href="a-propos.html">À propos</a></li>
            <li><a href="services.html">Services</a></li>
            <li><a href="methode.html">Méthode</a></li>
            <li><a href="realisations.php" class="is-active">Réalisations</a></li>
            <li><a href="contact.html">Contact</a></li>
          </ul>
          <a href="#" class="btn btn--gold nav-cta" id="open-quote-modal">
            Demander un devis
            <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </a>
        </nav>
      </div>
    </header>

    <main>
      <!-- ================= HERO ================= -->
      <section class="page-hero">
        <div class="hero__bg page-hero__bg page-hero__bg--realisations" aria-hidden="true"></div>

        <div class="container page-hero__inner">
          <div class="page-hero__content">
            <p class="page-hero__eyebrow">Nos réalisations</p>
            <h1 class="page-hero__title">
              <span>Des projets concrets,</span>
              <span>Des <span class="accent">résultats durables.</span></span>
            </h1>

            <span class="bar" aria-hidden="true"></span>

            <p class="page-hero__text">
              Découvrez une sélection de projets réalisés auprès d'entreprises et
              d'entrepreneurs accompagnés dans leur
              <strong>développement</strong>.
            </p>
          </div>
        </div>
      </section>

      <!-- ============ SÉPARATION COURBE ============ -->
      <div class="curve-sep" aria-hidden="true">
        <svg viewBox="0 0 1440 70" preserveAspectRatio="none">
          <path
            class="curve-sep__fill"
            d="M0,22 C260,6 440,44 720,36 C1000,28 1200,52 1440,30 L1440,70 L0,70 Z"
          />
          <path
            class="curve-sep__line"
            d="M0,22 C260,6 440,44 720,36 C1000,28 1200,52 1440,30"
            vector-effect="non-scaling-stroke"
          />
        </svg>
      </div>

      <!-- ================= PROJETS ================= -->
      <section class="works">
        <div class="container">
          <div class="filters" role="tablist" aria-label="Filtrer les projets">
            <button type="button" class="filter-tab is-active" data-filter="all">Tous les projets</button>
            <button type="button" class="filter-tab" data-filter="communication">Communication</button>
            <button type="button" class="filter-tab" data-filter="developpement">Développement commercial</button>
            <button type="button" class="filter-tab" data-filter="apport">Apport d'affaires</button>

            <button type="button" class="filters__toggle" id="filters-toggle">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <line x1="4" y1="6" x2="20" y2="6" />
                <line x1="4" y1="12" x2="20" y2="12" />
                <line x1="4" y1="18" x2="20" y2="18" />
                <circle cx="9" cy="6" r="2" fill="currentColor" />
                <circle cx="15" cy="12" r="2" fill="currentColor" />
                <circle cx="7" cy="18" r="2" fill="currentColor" />
              </svg>
              Filtrer
            </button>
          </div>

          <?php if (empty($realisations)): ?>
          <p class="projects-empty">De nouvelles réalisations arrivent bientôt.</p>
          <?php else: ?>
          <ul class="projects-grid" id="projects-grid">
            <?php foreach ($realisations as $r): ?>
            <li class="project-card" data-cat="<?= h($r['categorie']) ?>">
              <?php if (!empty($r['image_path'])): ?>
              <img class="project-card__img" src="<?= h($r['image_path']) ?>" alt="<?= h($r['titre']) ?>" />
              <?php else: ?>
              <span class="project-card__placeholder" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.6" /><path d="m21 15-5-5L5 21" /></svg>
              </span>
              <?php endif; ?>
            </li>
            <?php endforeach; ?>
          </ul>
          <?php endif; ?>
        </div>
      </section>

      <!-- ================= CTA ================= -->
      <section class="cta-card cta-card--light">
        <div class="container">
          <div class="cta-card__inner">
            <span class="icon-circle icon-circle--lg icon-circle--solid" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
                <path d="M7.5 20A9 9 0 1 0 4 16.5L2.5 21.5Z" />
                <path d="M8 10h.01M12 10h.01M16 10h.01" />
              </svg>
            </span>

            <div class="cta-card__text">
              <h2>Un projet en tête&nbsp;?</h2>
              <p>
                Parlons-en&nbsp;! Ensemble, donnons vie à vos idées et atteignons
                vos objectifs.
              </p>
            </div>

            <span class="cta-card__sep" aria-hidden="true"></span>

            <a href="contact.html" class="btn btn--ghost">
              Prendre contact
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </a>
          </div>
        </div>
      </section>
    </main>

    <!-- ================= FOOTER ================= -->
    <footer class="site-footer">
      <div class="container site-footer__inner">
        <a href="index.html" class="footer-logo" aria-label="IM Business Solutions">
          <img
            src="assets/logo/im-business-solutions-white.png"
            alt="IM Business Solutions"
            width="150"
            height="118"
          />
        </a>
        <span class="footer-sep" aria-hidden="true"></span>
        <ul class="footer-contact">
          <li>
            <span class="icon-circle icon-circle--sm" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.94.36 1.86.7 2.73a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.34-1.27a2 2 0 0 1 2.11-.45c.87.34 1.79.57 2.73.7A2 2 0 0 1 22 16.92z" />
              </svg>
            </span>
            <a href="tel:+33782988352">07 82 98 83 52</a>
          </li>
          <li>
            <span class="icon-circle icon-circle--sm" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">
                <rect x="2" y="4" width="20" height="16" rx="2" />
                <path d="m2 7 10 6 10-6" />
              </svg>
            </span>
            <a href="mailto:contact@im-business-solutions.fr">contact@im-business-solutions.fr</a>
          </li>
          <li>
            <span class="icon-circle icon-circle--sm" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10" />
                <path d="M2 12h20" />
                <path d="M12 2a15 15 0 0 1 0 20 15 15 0 0 1 0-20" />
              </svg>
            </span>
            <a href="https://im-business-solutions.fr" target="_blank" rel="noopener">im-business-solutions.fr</a>
          </li>
        </ul>
      </div>
      <div class="container">
        <p class="site-footer__legal">
          &copy; <span id="year"></span> IM Business Solutions — Tous droits réservés.
        </p>
      </div>
    </footer>

    <script src="js/main.js" defer></script>
  </body>
</html>
