/* =========================================================
   IM BUSINESS SOLUTIONS — Admin
   ========================================================= */
(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", function () {
    var body  = document.body;
    var csrf  = body.getAttribute("data-csrf") || "";
    var csrfField = '<input type="hidden" name="csrf_token" value="' + csrf.replace(/"/g, "&quot;") + '">';

    /* ---------- Sidebar ---------- */
    var navToggle = document.getElementById("nav-toggle");
    var backdrop  = document.getElementById("admin-backdrop");

    if (navToggle) {
      navToggle.addEventListener("click", function () {
        body.classList.toggle("is-nav-open");
      });
    }
    if (backdrop) {
      backdrop.addEventListener("click", function () {
        body.classList.remove("is-nav-open");
      });
    }
    document.querySelectorAll(".admin-nav a").forEach(function (link) {
      link.addEventListener("click", function () {
        if (window.innerWidth <= 1000) body.classList.remove("is-nav-open");
      });
    });

    /* ---------- Modale « Mon profil » ---------- */
    var PROFILE_MODAL_HTML =
      '<div class="admin-modal" id="profile-modal" role="dialog" aria-modal="true" aria-labelledby="profile-modal-title" aria-hidden="true">' +
        '<div class="admin-modal__overlay" data-close></div>' +
        '<div class="admin-modal__dialog">' +
          '<div class="admin-modal__head">' +
            '<h2 id="profile-modal-title">Mon profil</h2>' +
            '<button type="button" class="admin-modal__close" data-close aria-label="Fermer"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="6" y1="6" x2="18" y2="18"/><line x1="6" y1="18" x2="18" y2="6"/></svg></button>' +
          '</div>' +
          '<form id="profile-form" action="actions/profile-save.php" method="post" novalidate>' +
            csrfField +
            '<div class="admin-modal__body">' +
              '<div class="profile-top">' +
                '<span class="profile-avatar">' +
                  '<span class="profile-avatar__img" id="profile-initials">' + (window.__adminInitials || "") + '</span>' +
                  '<span class="profile-avatar__cam" role="button" tabindex="0" aria-label="Changer la photo (bientôt disponible)"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg></span>' +
                '</span>' +
                '<div class="profile-identity">' +
                  '<h3 id="profile-fullname">' + (window.__adminFullname || "") + '</h3>' +
                  '<span class="profile-badge">' + (window.__adminRole || "Administrateur") + '</span>' +
                  '<span class="profile-email" id="profile-email-display"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m2 7 10 6 10-6"/></svg>' + (window.__adminEmail || "") + '</span>' +
                '</div>' +
              '</div>' +

              '<p class="form-section">Informations personnelles</p>' +
              '<div class="form-grid">' +
                '<div class="form-field"><label for="p-first">Prénom</label><input id="p-first" name="prenom" type="text" required value="' + (window.__adminPrenom || "") + '"></div>' +
                '<div class="form-field"><label for="p-last">Nom</label><input id="p-last" name="nom" type="text" required value="' + (window.__adminNom || "") + '"></div>' +
                '<div class="form-field form-field--full"><label for="p-email">Email</label><input id="p-email" name="email" type="email" required value="' + (window.__adminEmail || "") + '"></div>' +
                '<div class="form-field form-field--full"><label for="p-role">Rôle</label><input id="p-role" type="text" value="' + (window.__adminRole || "Administrateur") + '" disabled></div>' +
              '</div>' +

              '<p class="form-section">Sécurité</p>' +
              '<div class="security-row">' +
                '<span class="security-row__icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg></span>' +
                '<div class="security-row__text"><strong>Mot de passe</strong><span>Changez votre mot de passe pour sécuriser votre compte.</span></div>' +
                '<button type="button" class="a-btn a-btn--ghost-gold" data-open-modal="password-modal">Changer le mot de passe</button>' +
              '</div>' +
            '</div>' +
            '<div class="admin-modal__foot">' +
              '<button type="button" class="a-btn a-btn--outline" data-close>Annuler</button>' +
              '<button type="submit" class="a-btn a-btn--primary"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><path d="M17 21v-8H7v8M7 3v5h8"/></svg>Enregistrer les modifications</button>' +
            '</div>' +
          '</form>' +
        '</div>' +
      '</div>';

    var PASSWORD_MODAL_HTML =
      '<div class="admin-modal" id="password-modal" role="dialog" aria-modal="true" aria-labelledby="password-modal-title" aria-hidden="true">' +
        '<div class="admin-modal__overlay" data-close></div>' +
        '<div class="admin-modal__dialog">' +
          '<div class="admin-modal__head">' +
            '<h2 id="password-modal-title">Changer le mot de passe</h2>' +
            '<button type="button" class="admin-modal__close" data-close aria-label="Fermer"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="6" y1="6" x2="18" y2="18"/><line x1="6" y1="18" x2="18" y2="6"/></svg></button>' +
          '</div>' +
          '<form id="password-form" action="actions/password-save.php" method="post" novalidate>' +
            csrfField +
            '<div class="admin-modal__body">' +
              '<div class="form-field"><label for="pw-current">Mot de passe actuel</label><input id="pw-current" name="current_password" type="password" required autocomplete="current-password"></div>' +
              '<div class="form-field"><label for="pw-new">Nouveau mot de passe</label><input id="pw-new" name="new_password" type="password" minlength="8" required autocomplete="new-password"></div>' +
              '<div class="form-field"><label for="pw-confirm">Confirmer le nouveau mot de passe</label><input id="pw-confirm" name="new_password_confirm" type="password" minlength="8" required autocomplete="new-password"></div>' +
              '<p class="form-field__hint">8 caractères minimum.</p>' +
            '</div>' +
            '<div class="admin-modal__foot">' +
              '<button type="button" class="a-btn a-btn--outline" data-close>Annuler</button>' +
              '<button type="submit" class="a-btn a-btn--primary">Mettre à jour le mot de passe</button>' +
            '</div>' +
          '</form>' +
        '</div>' +
      '</div>';

    body.insertAdjacentHTML("beforeend", PROFILE_MODAL_HTML);
    body.insertAdjacentHTML("beforeend", PASSWORD_MODAL_HTML);

    /* ---------- Modales : ouverture / fermeture génériques ---------- */
    var openModalEl  = null;
    var lastFocused  = null;

    function focusablesIn(el) {
      return el.querySelectorAll(
        'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex="0"]'
      );
    }

    function openModalById(id) {
      var m = document.getElementById(id);
      if (!m) return;
      if (!openModalEl) lastFocused = document.activeElement;
      if (openModalEl && openModalEl !== m) {
        openModalEl.classList.remove("is-open");
        openModalEl.setAttribute("aria-hidden", "true");
      }
      m.classList.add("is-open");
      m.setAttribute("aria-hidden", "false");
      body.style.overflow = "hidden";
      openModalEl = m;
      var first = m.querySelector(
        ".admin-modal__body input:not([disabled]), .admin-modal__body select, .admin-modal__body textarea, .admin-modal__body button"
      );
      if (first) first.focus();
    }

    function closeModal() {
      if (!openModalEl) return;
      openModalEl.classList.remove("is-open");
      openModalEl.setAttribute("aria-hidden", "true");
      openModalEl = null;
      body.style.overflow = "";
      if (lastFocused && lastFocused.focus) lastFocused.focus();
    }

    /* ---------- Réalisations : création / édition dans la même modale ---------- */
    function resetRealisationForm() {
      var form = document.getElementById("realisation-form");
      if (!form) return;
      form.reset();
      var idField = document.getElementById("r-id");
      if (idField) idField.value = "";
      var title = document.getElementById("realisation-modal-title");
      if (title) title.textContent = "Ajouter une réalisation";
      var currentImage = document.getElementById("r-current-image");
      if (currentImage) currentImage.hidden = true;
      var selected = document.getElementById("r-image-selected");
      if (selected) { selected.hidden = true; selected.textContent = ""; }
      var counter = form.querySelector(".form-field__count");
      if (counter) counter.textContent = "0 / 1000";
    }

    function fillRealisationForm(data) {
      var form = document.getElementById("realisation-form");
      if (!form) return;
      form.reset();

      document.getElementById("r-id").value = data.id || "";
      document.getElementById("r-title").value = data.titre || "";
      document.getElementById("r-cat").value = data.categorie || "";
      document.getElementById("r-client").value = data.client || "";
      document.getElementById("r-year").value = data.annee || "";
      document.getElementById("r-desc").value = data.description || "";
      document.getElementById("r-status").value = data.status || "publie";

      var counter = form.querySelector(".form-field__count");
      if (counter) counter.textContent = (data.description || "").length + " / 1000";

      var title = document.getElementById("realisation-modal-title");
      if (title) title.textContent = "Modifier la réalisation";

      var currentImage = document.getElementById("r-current-image");
      var currentImageName = document.getElementById("r-current-image-name");
      if (currentImage && currentImageName) {
        if (data.image) {
          currentImageName.textContent = data.image.split("/").pop();
          currentImage.hidden = false;
        } else {
          currentImage.hidden = true;
        }
      }

      var selected = document.getElementById("r-image-selected");
      if (selected) { selected.hidden = true; selected.textContent = ""; }
    }

    document.querySelectorAll("[data-edit-realisation]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        fillRealisationForm({
          id: btn.getAttribute("data-id"),
          titre: btn.getAttribute("data-titre"),
          categorie: btn.getAttribute("data-categorie"),
          client: btn.getAttribute("data-client"),
          annee: btn.getAttribute("data-annee"),
          description: btn.getAttribute("data-description"),
          status: btn.getAttribute("data-status"),
          image: btn.getAttribute("data-image"),
        });
        openModalById("realisation-modal");
      });
    });

    /* ---------- Déclencheurs génériques de modale ---------- */
    document.addEventListener("click", function (e) {
      var opener = e.target.closest("[data-modal-open], [data-open-realisation], #open-quote-modal");
      if (opener) {
        e.preventDefault();
        if (opener.hasAttribute("data-open-realisation")) {
          resetRealisationForm();
          openModalById("realisation-modal");
        } else {
          openModalById(opener.getAttribute("data-modal-open") || "realisation-modal");
        }
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

    /* ---------- Validation avant envoi (les formulaires portent novalidate
       pour garder un rendu homogène ; on redonne la main au navigateur). ---------- */
    document.querySelectorAll("form[novalidate]").forEach(function (form) {
      form.addEventListener("submit", function (e) {
        if (!form.checkValidity()) {
          e.preventDefault();
          form.reportValidity();
        }
      });
    });

    /* ---------- Confirmation avant suppression ---------- */
    document.querySelectorAll(".js-confirm").forEach(function (form) {
      form.addEventListener("submit", function (e) {
        var msg = form.getAttribute("data-confirm") || "Confirmer cette action ?";
        if (!window.confirm(msg)) e.preventDefault();
      });
    });

    /* ---------- Changement de statut en ligne (tableaux) ---------- */
    document.querySelectorAll(".row-status-form select").forEach(function (select) {
      select.addEventListener("change", function () {
        select.form.submit();
      });
    });

    /* ---------- Compteur de caractères ---------- */
    document.querySelectorAll("textarea[maxlength]").forEach(function (ta) {
      var out = ta.parentElement.querySelector(".form-field__count");
      if (!out) return;
      var max = ta.getAttribute("maxlength");
      var update = function () {
        out.textContent = ta.value.length + " / " + max;
      };
      ta.addEventListener("input", update);
    });

    /* ---------- Dropzone image ---------- */
    document.querySelectorAll(".dropzone").forEach(function (zone) {
      var input = zone.querySelector('input[type="file"]');
      if (input) {
        input.addEventListener("change", function () {
          var out = document.getElementById("r-image-selected");
          if (!out) return;
          if (input.files && input.files[0]) {
            out.textContent = "Fichier sélectionné : " + input.files[0].name;
            out.hidden = false;
          } else {
            out.hidden = true;
          }
        });
      }
      ["dragenter", "dragover"].forEach(function (ev) {
        zone.addEventListener(ev, function (e) {
          e.preventDefault();
          zone.classList.add("is-drag");
        });
      });
      ["dragleave", "drop"].forEach(function (ev) {
        zone.addEventListener(ev, function (e) {
          e.preventDefault();
          zone.classList.remove("is-drag");
          if (ev === "drop" && input && e.dataTransfer && e.dataTransfer.files.length) {
            input.files = e.dataTransfer.files;
            input.dispatchEvent(new Event("change"));
          }
        });
      });
    });
  });
})();
