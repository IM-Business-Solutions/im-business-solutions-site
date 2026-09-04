/* =========================================================
   IM BUSINESS SOLUTIONS — Scripts d'interface
   ========================================================= */
(function () {
  "use strict";

  /* ---------- Modale « Demander un devis » (markup injecté) ---------- */
  var MODAL_HTML =
    '<div class="modal" id="quote-modal" role="dialog" aria-modal="true" aria-labelledby="quote-modal-title" aria-hidden="true">' +
      '<div class="modal__overlay" data-close></div>' +
      '<div class="modal__dialog">' +
        '<button type="button" class="modal__close" data-close aria-label="Fermer">' +
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="6" y1="6" x2="18" y2="18"/><line x1="6" y1="18" x2="18" y2="6"/></svg>' +
        '</button>' +

        '<div class="modal__aside">' +
          '<span class="icon-circle" aria-hidden="true">' +
            '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7z"/><path d="M15 3v4h4"/><path d="M9 12h6M9 16h5"/></svg>' +
          '</span>' +
          '<h2 class="modal__title" id="quote-modal-title"><span>Demander</span><span class="accent">un devis</span></h2>' +
          '<span class="bar" aria-hidden="true"></span>' +
          '<p>Décrivez votre projet en quelques informations et je vous proposerai une solution adaptée à vos besoins ainsi qu’un devis personnalisé.</p>' +
          '<div class="modal__features">' +
            '<div class="modal__feature">' +
              '<span class="icon-circle icon-circle--solid" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.6"/></svg></span>' +
              '<div><h4>Sur-mesure</h4><p>Une solution adaptée à vos objectifs et à votre secteur.</p></div>' +
            '</div>' +
            '<div class="modal__feature">' +
              '<span class="icon-circle icon-circle--solid" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg></span>' +
              '<div><h4>Réactivité</h4><p>Une réponse rapide et un accompagnement à chaque étape.</p></div>' +
            '</div>' +
            '<div class="modal__feature">' +
              '<span class="icon-circle icon-circle--solid" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg></span>' +
              '<div><h4>Confidentialité</h4><p>Vos informations sont traitées avec la plus grande confidentialité.</p></div>' +
            '</div>' +
          '</div>' +
        '</div>' +

        '<div class="modal__main">' +
          '<form id="quote-form" action="api/devis.php" method="post" novalidate>' +
            '<div class="hp-field" aria-hidden="true">' +
              '<label for="quote-website">Ne pas remplir ce champ</label>' +
              '<input type="text" id="quote-website" name="website" tabindex="-1" autocomplete="off">' +
            '</div>' +
            '<p class="form-label">Vos informations</p>' +
            '<div class="form-row">' +
              '<div class="form-field form-field--icon">' +
                '<svg class="form-field__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 4-6 8-6s8 2 8 6"/></svg>' +
                '<input class="form-control" type="text" name="nom" placeholder="Nom / Prénom *" required>' +
              '</div>' +
              '<div class="form-field form-field--icon">' +
                '<svg class="form-field__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="7" width="18" height="13" rx="2"/><path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2"/></svg>' +
                '<input class="form-control" type="text" name="entreprise" placeholder="Entreprise">' +
              '</div>' +
            '</div>' +
            '<div class="form-field form-field--icon">' +
              '<svg class="form-field__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m2 7 10 6 10-6"/></svg>' +
              '<input class="form-control" type="email" name="email" placeholder="Email *" required>' +
            '</div>' +
            '<div class="form-field form-field--icon">' +
              '<svg class="form-field__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>' +
              '<input class="form-control" type="tel" name="telephone" placeholder="Téléphone">' +
            '</div>' +

            '<p class="form-label">Votre projet</p>' +
            '<div class="form-field form-field--icon">' +
              '<svg class="form-field__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>' +
              '<select class="form-control" name="service" required>' +
                '<option value="" disabled selected>Type de service souhaité *</option>' +
                '<option>Communication</option>' +
                '<option>Développement commercial</option>' +
                "<option>Apport d'affaires</option>" +
                '<option>Supports de présentation</option>' +
                '<option>Autre / je ne sais pas encore</option>' +
              '</select>' +
            '</div>' +
            '<div class="form-field form-field--icon">' +
              '<svg class="form-field__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19 7V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2"/><path d="M21 12h-5a2 2 0 0 0 0 4h5v-4z"/></svg>' +
              '<select class="form-control" name="budget">' +
                '<option value="" disabled selected>Budget indicatif</option>' +
                '<option>Moins de 1 000 €</option>' +
                '<option>1 000 – 3 000 €</option>' +
                '<option>3 000 – 8 000 €</option>' +
                '<option>Plus de 8 000 €</option>' +
                '<option>À définir ensemble</option>' +
              '</select>' +
            '</div>' +
            '<div class="form-field form-field--icon">' +
              '<svg class="form-field__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>' +
              '<textarea class="form-control" name="message" placeholder="Décrivez votre projet, vos besoins et vos objectifs *" required></textarea>' +
            '</div>' +

            '<label class="form-check">' +
              '<input type="checkbox" name="consent" required>' +
              '<span>J’accepte que mes informations soient utilisées afin de me recontacter dans le cadre de ma demande.</span>' +
            '</label>' +

            '<button type="submit" class="btn btn--gold btn--block">Envoyer ma demande' +
              '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>' +
            '</button>' +

            '<p class="form-note"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>Vos données sont confidentielles et ne seront jamais partagées.</p>' +
          '</form>' +
        '</div>' +
      '</div>' +
    '</div>';

  /* ---------- Contenu des modales « domaines d'expertise » (modifiable ici) ---------- */
  var ICO = {
    megaphone: '<path d="m3 11 15-5v13L3 15z"/><path d="M11.6 17.4a3 3 0 0 1-5.7-1.6"/><path d="M18 8a3 3 0 0 1 0 6"/>',
    chart: '<path d="M5 21V13M12 21V8M19 21V4"/><polyline points="3 10 9 6 13 9 21 3"/><polyline points="16 3 21 3 21 8"/>',
    handshake: '<path d="m11 17 2 2a1 1 0 1 0 3-3"/><path d="m14 14 2.5 2.5a1 1 0 1 0 3-3l-3.9-3.9a3 3 0 0 0-4.2 0l-.9.9a1 1 0 0 1-3-3l2.8-2.8a5.8 5.8 0 0 1 7-.9l.5.3a2 2 0 0 0 1.4.2L21 4"/><path d="m21 3 1 11h-2"/><path d="M3 3 2 14l6.5 6.5a1 1 0 1 0 3-3"/><path d="M3 4h8"/>',
    pen: '<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/>',
    file: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><path d="M9 13h6M9 17h6"/>',
    phone: '<rect x="6" y="2" width="12" height="20" rx="2"/><path d="M11 18h2"/>',
    slides: '<path d="M2 3h20"/><path d="M21 3v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V3"/><path d="m8 21 4-4 4 4"/>',
    monitor: '<rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/>',
    message: '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>',
    clipboard: '<rect x="8" y="2" width="8" height="4" rx="1"/><path d="M9 4H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-3"/><path d="m9 14 2 2 4-4"/>',
    target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.6"/>',
    userSearch: '<circle cx="10" cy="8" r="4"/><path d="M3.5 20a7 7 0 0 1 11-5.5"/><circle cx="17.5" cy="17.5" r="3"/><path d="m21 21-1.4-1.4"/>',
    briefcase: '<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2"/>',
    users: '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0"/><path d="M16 5.5a3.5 3.5 0 0 1 0 7"/><path d="M21.5 20a6.5 6.5 0 0 0-4-6"/>',
    trending: '<polyline points="3 17 9 11 13 15 21 7"/><polyline points="15 7 21 7 21 13"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/>',
    network: '<circle cx="6" cy="6" r="2.5"/><circle cx="18" cy="6" r="2.5"/><circle cx="12" cy="18" r="2.5"/><path d="M8 7.2 10.8 16M16 7.2 13.2 16M8.3 6h7.4"/>',
    link: '<path d="M9 17H7A5 5 0 0 1 7 7h2"/><path d="M15 7h2a5 5 0 0 1 0 10h-2"/><line x1="8" y1="12" x2="16" y2="12"/>',
    msgStar: '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/><path d="m12 6.5 1.1 2.2 2.4.3-1.8 1.7.5 2.4-2.2-1.2-2.2 1.2.5-2.4-1.8-1.7 2.4-.3z"/>',
    bars: '<path d="M5 21V10M12 21V4M19 21v-7"/>'
  };

  var EXPERTISE = [
    {
      id: "communication",
      icon: ICO.megaphone,
      title: "Communication",
      intro:
        "Nous concevons des supports et des contenus qui valorisent votre image, renforcent votre visibilité et suscitent l'adhésion.",
      cards: [
        { icon: ICO.pen, title: "Identité visuelle", items: ["Logo et déclinaisons", "Charte graphique", "Couleurs & typographies", "Slogan / accroche", "Univers visuel"] },
        { icon: ICO.file, title: "Supports imprimés", items: ["Flyer, affiche, dépliant", "Carte de visite", "Brochure, plaquette", "Papier à en-tête", "Documents professionnels"] },
        { icon: ICO.phone, title: "Réseaux sociaux", items: ["Publications & stories", "Templates & carrousels", "Bannières & couvertures", "Visuels publicitaires", "Identité graphique réseaux"] },
        { icon: ICO.slides, title: "Supports de présentation", items: ["Présentations commerciales", "Pitch deck", "Présentation d'entreprise", "Dossier de partenariat", "Proposition commerciale"] },
        { icon: ICO.monitor, title: "Communication digitale", items: ["Bannières web", "Emailing & newsletters", "Visuels publicitaires", "Visuels pour site internet", "Templates d'e-mails"] },
        { icon: ICO.message, title: "Contenu & message", items: ["Accroches & slogans", "Textes de présentation", "Mise en valeur des offres", "Messages publicitaires", "Contenus sur-mesure"] }
      ]
    },
    {
      id: "developpement",
      icon: ICO.chart,
      title: "Développement commercial",
      intro:
        "Nous vous aidons à structurer et à dynamiser votre activité commerciale pour générer plus d'opportunités, convertir vos prospects et atteindre vos objectifs de croissance.",
      cards: [
        { icon: ICO.clipboard, title: "Audit & diagnostic", items: ["Analyse de votre offre et positionnement", "Étude de votre marché et concurrence", "Analyse de votre cycle de vente", "Identification des forces et axes d'amélioration", "Rapport d'audit et recommandations"] },
        { icon: ICO.target, title: "Stratégie commerciale", items: ["Définition de votre stratégie commerciale", "Segmentation et ciblage de vos clients", "Positionnement et valeur ajoutée", "Objectifs commerciaux clairs et mesurables", "Plan d'action commercial sur-mesure"] },
        { icon: ICO.userSearch, title: "Prospection & génération d'opportunités", items: ["Liste de prospects qualifiés", "Stratégie de prospection multicanale", "Création de séquences de prospection", "Prise de contact et qualification", "Prospection et prise de rendez-vous"] },
        { icon: ICO.briefcase, title: "Outils commerciaux", items: ["Rédaction d'argumentaires et pitchs", "Création de brochures et fiches offres", "Modèles de propositions commerciales", "Supports d'aide à la vente", "Templates d'e-mails et scripts"] },
        { icon: ICO.users, title: "Fidélisation & suivi client", items: ["Mise en place d'un processus de suivi", "Programme de fidélisation client", "Stratégie de relation client (CRM)", "Relances et animations commerciales", "Stratégie de développement du portefeuille client"] },
        { icon: ICO.trending, title: "Optimisation des ventes", items: ["Optimisation de votre tunnel de vente", "Amélioration des taux de conversion", "Analyse des performances commerciales", "Tableaux de bord et indicateurs clés", "Recommandations d'amélioration des performances"] }
      ]
    },
    {
      id: "apport",
      icon: ICO.handshake,
      title: "Apport d'affaires",
      intro:
        "Nous vous aidons à développer votre réseau et à identifier des opportunités qualifiées pour accélérer la croissance de votre activité.",
      cards: [
        { icon: ICO.search, title: "Recherche d'opportunités", items: ["Identification de prospects et partenaires", "Recherche ciblée selon vos critères", "Qualification des opportunités", "Analyse du potentiel et de la pertinence", "Veille sectorielle et détection d'opportunités"] },
        { icon: ICO.users, title: "Mise en relation qualifiée", items: ["Mise en relation avec des prospects", "Présentation de votre offre et de votre valeur", "Organisation de rendez-vous qualifiés", "Transmission d'informations pertinentes", "Suivi jusqu'à la prise de contact"] },
        { icon: ICO.network, title: "Développement de réseau", items: ["Développement et activation de réseaux", "Participation à des événements ciblés", "Identification de partenaires stratégiques", "Création de synergies et de collaborations", "Renforcement de votre visibilité"] },
        { icon: ICO.link, title: "Partenariats stratégiques", items: ["Identification de partenaires potentiels", "Évaluation de la complémentarité", "Construction d'offres communes", "Accompagnement à la mise en place", "Suivi et animation du partenariat"] },
        { icon: ICO.msgStar, title: "Recommandations & prescription", items: ["Recommandation de votre entreprise", "Présentation auprès de contacts qualifiés", "Valorisation de votre expertise et savoir-faire", "Messages clés et argumentaires adaptés", "Suivi des recommandations effectuées"] },
        { icon: ICO.bars, title: "Suivi & reporting", items: ["Suivi des opportunités en cours", "Reporting régulier et transparent", "Analyse des résultats et retours", "Optimisation continue des actions", "Ajustement de la stratégie"] }
      ]
    }
  ];

  function svgWrap(inner) {
    return (
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
      inner +
      "</svg>"
    );
  }

  function buildExpertiseModal(dom) {
    var cards = dom.cards
      .map(function (c) {
        var items = c.items
          .map(function (i) {
            return "<li>" + i + "</li>";
          })
          .join("");
        return (
          '<li class="xcard">' +
          '<span class="xcard__icon" aria-hidden="true">' + svgWrap(c.icon) + "</span>" +
          "<h3>" + c.title + "</h3>" +
          '<ul class="xcard__list">' + items + "</ul>" +
          "</li>"
        );
      })
      .join("");

    return (
      '<div class="modal modal--wide" id="expertise-' + dom.id + '" role="dialog" aria-modal="true" aria-labelledby="xm-' + dom.id + '-title" aria-hidden="true">' +
        '<div class="modal__overlay" data-close></div>' +
        '<div class="modal__dialog">' +
          '<button type="button" class="modal__close" data-close aria-label="Fermer"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="6" y1="6" x2="18" y2="18"/><line x1="6" y1="18" x2="18" y2="6"/></svg></button>' +
          '<div class="xmodal__head">' +
            '<span class="icon-circle icon-circle--xl" aria-hidden="true">' + svgWrap(dom.icon) + "</span>" +
            "<div>" +
              '<p class="xmodal__eyebrow">Notre expertise</p>' +
              '<h2 class="xmodal__title" id="xm-' + dom.id + '-title">' + dom.title + "</h2>" +
              '<p class="xmodal__intro">' + dom.intro + "</p>" +
            "</div>" +
          "</div>" +
          '<ul class="xmodal__grid">' + cards + "</ul>" +
          '<div class="xmodal__foot">' +
            '<span class="xmodal__foot-icon" aria-hidden="true">' + svgWrap(ICO.message) + "</span>" +
            "<p><strong>Vous avez un besoin qui n’apparaît pas dans cette liste ?</strong>Parlons-en. Je conçois également des solutions sur-mesure adaptées à votre projet.</p>" +
            '<a href="#" class="btn btn--gold" data-modal-open="quote-modal">Demander un devis <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg></a>' +
          "</div>" +
        "</div>" +
      "</div>"
    );
  }

  document.addEventListener("DOMContentLoaded", function () {
    /* ---------- Année du footer ---------- */
    var yearEl = document.getElementById("year");
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    /* ---------- Menu mobile ---------- */
    var toggle = document.getElementById("nav-toggle");
    var nav = document.getElementById("primary-nav");

    function closeMenu() {
      nav.classList.remove("is-open");
      toggle.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
    }

    if (toggle && nav) {
      toggle.addEventListener("click", function () {
        var willOpen = !nav.classList.contains("is-open");
        nav.classList.toggle("is-open", willOpen);
        toggle.classList.toggle("is-open", willOpen);
        toggle.setAttribute("aria-expanded", willOpen ? "true" : "false");
      });

      nav.querySelectorAll("a").forEach(function (link) {
        link.addEventListener("click", closeMenu);
      });

      document.addEventListener("keydown", function (e) {
        if (e.key === "Escape") closeMenu();
      });

      document.addEventListener("click", function (e) {
        if (
          nav.classList.contains("is-open") &&
          !nav.contains(e.target) &&
          !toggle.contains(e.target)
        ) {
          closeMenu();
        }
      });

      window.addEventListener("resize", function () {
        if (window.innerWidth > 960) closeMenu();
      });
    }

    /* ---------- Header au scroll ---------- */
    var header = document.getElementById("site-header");
    if (header) {
      var onScroll = function () {
        header.classList.toggle("is-scrolled", window.scrollY > 40);
      };
      onScroll();
      window.addEventListener("scroll", onScroll, { passive: true });
    }

    /* ---------- Modales (devis + domaines d'expertise) ---------- */
    document.body.insertAdjacentHTML("beforeend", MODAL_HTML);
    EXPERTISE.forEach(function (dom) {
      document.body.insertAdjacentHTML("beforeend", buildExpertiseModal(dom));
    });

    var quoteForm = document.getElementById("quote-form");
    var openModalEl = null;
    var lastFocused = null;

    function focusablesIn(el) {
      return el.querySelectorAll(
        'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled])'
      );
    }

    function openModalById(id) {
      var m = document.getElementById(id);
      if (!m) return;
      if (openModalEl && openModalEl !== m) {
        openModalEl.classList.remove("is-open");
        openModalEl.setAttribute("aria-hidden", "true");
      } else if (!openModalEl) {
        lastFocused = document.activeElement;
      }
      if (quoteForm && quoteForm.resetState) quoteForm.resetState();
      m.classList.add("is-open");
      m.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
      var dlg = m.querySelector(".modal__dialog");
      if (dlg) dlg.scrollTop = 0;
      openModalEl = m;
      var f = focusablesIn(m);
      if (f.length) f[0].focus();
    }

    function closeModal() {
      if (!openModalEl) return;
      openModalEl.classList.remove("is-open");
      openModalEl.setAttribute("aria-hidden", "true");
      openModalEl = null;
      document.body.style.overflow = "";
      if (lastFocused && lastFocused.focus) lastFocused.focus();
    }

    document.addEventListener("click", function (e) {
      var opener = e.target.closest("[data-modal-open], #open-quote-modal");
      if (opener) {
        e.preventDefault();
        openModalById(opener.getAttribute("data-modal-open") || "quote-modal");
        return;
      }
      if (openModalEl && e.target.closest("[data-close]")) closeModal();
    });

    document.addEventListener("keydown", function (e) {
      if (!openModalEl) return;
      if (e.key === "Escape") {
        closeModal();
      } else if (e.key === "Tab") {
        var f = focusablesIn(openModalEl);
        if (!f.length) return;
        var first = f[0];
        var last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    });

    /* ---------- Envoi des formulaires (contact + devis) vers le back-end PHP ---------- */
    function handleSubmit(form, message) {
      if (!form) return;

      var errorBox = document.createElement("p");
      errorBox.className = "form-error";
      errorBox.setAttribute("role", "alert");
      errorBox.hidden = true;
      form.insertBefore(errorBox, form.firstChild);

      var success = document.createElement("div");
      success.className = "form-success";
      success.setAttribute("role", "status");
      success.textContent = message;
      success.hidden = true;
      form.after(success);

      form.addEventListener("submit", function (e) {
        e.preventDefault();
        if (typeof form.reportValidity === "function" && !form.reportValidity()) {
          return;
        }

        errorBox.hidden = true;
        var submitBtn = form.querySelector('button[type="submit"]');
        if (submitBtn) submitBtn.disabled = true;

        fetch(form.getAttribute("action"), {
          method: "POST",
          body: new FormData(form),
          headers: { Accept: "application/json" },
        })
          .then(function (res) {
            return res
              .json()
              .catch(function () {
                return {};
              })
              .then(function (data) {
                return { ok: res.ok, data: data };
              });
          })
          .then(function (result) {
            if (result.ok && result.data && result.data.ok) {
              form.hidden = true;
              success.hidden = false;
            } else {
              var errors = result.data && result.data.errors;
              var firstError = errors ? errors[Object.keys(errors)[0]] : null;
              errorBox.textContent =
                (result.data && result.data.error) ||
                firstError ||
                "Une erreur est survenue. Merci de réessayer.";
              errorBox.hidden = false;
            }
          })
          .catch(function () {
            errorBox.textContent = "Connexion impossible. Vérifiez votre réseau et réessayez.";
            errorBox.hidden = false;
          })
          .finally(function () {
            if (submitBtn) submitBtn.disabled = false;
          });
      });

      form.resetState = function () {
        form.reset();
        form.hidden = false;
        success.hidden = true;
        errorBox.hidden = true;
      };
    }

    handleSubmit(
      quoteForm,
      "Merci ! Votre demande de devis a bien été enregistrée. Je vous recontacte très rapidement."
    );
    handleSubmit(
      document.getElementById("contact-form"),
      "Merci ! Votre message a bien été envoyé. Je vous réponds dans les meilleurs délais."
    );

    /* ---------- Filtres des réalisations ---------- */
    var filterTabs = document.querySelectorAll(".filter-tab");
    var projectCards = document.querySelectorAll(".project-card");
    if (filterTabs.length && projectCards.length) {
      filterTabs.forEach(function (tab) {
        tab.addEventListener("click", function () {
          filterTabs.forEach(function (t) {
            t.classList.toggle("is-active", t === tab);
          });
          var f = tab.getAttribute("data-filter");
          projectCards.forEach(function (card) {
            card.hidden = f !== "all" && card.getAttribute("data-cat") !== f;
          });
        });
      });
    }

    var filtersToggle = document.getElementById("filters-toggle");
    if (filtersToggle) {
      filtersToggle.addEventListener("click", function () {
        var box = filtersToggle.closest(".filters");
        if (box) box.classList.toggle("is-expanded");
      });
    }
  });
})();
