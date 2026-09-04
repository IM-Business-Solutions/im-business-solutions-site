<?php
declare(strict_types=1);

function admin_initials(?array $admin): string
{
    if (!$admin) {
        return '';
    }
    $p = mb_substr((string) ($admin['prenom'] ?? ''), 0, 1);
    $n = mb_substr((string) ($admin['nom'] ?? ''), 0, 1);
    return mb_strtoupper($p . $n);
}

function admin_nav_icon(string $key): string
{
    $icons = [
        'dashboard'    => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 10.5 12 3l9 7.5"/><path d="M5 9.5V21h14V9.5"/></svg>',
        'demandes'     => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="8" y="2" width="8" height="4" rx="1"/><path d="M10.5 20H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2M16 4h2a2 2 0 0 1 2 2v4"/><path d="M18.4 13.6a2 2 0 0 1 3 3L16 22l-4 1 1-4z"/></svg>',
        'messages'     => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m2 7 10 6 10-6"/></svg>',
        'realisations' => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-4.5-4.5L5 21"/></svg>',
    ];
    return $icons[$key] ?? '';
}

/** Slug (stocké en base) => libellé affiché. Les slugs pilotent aussi les
 *  filtres de la page publique des réalisations (data-cat / data-filter). */
function realisation_categories(): array
{
    return [
        'communication' => 'Communication',
        'developpement' => 'Développement commercial',
        'apport'        => "Apport d'affaires",
    ];
}

function realisation_category_label(string $slug): string
{
    return realisation_categories()[$slug] ?? $slug;
}

function quote_status_label(string $status): string
{
    $labels = [
        'nouveau'  => 'Nouveau',
        'en_cours' => 'En cours',
        'traite'   => 'Traité',
        'archive'  => 'Archivé',
    ];
    return $labels[$status] ?? $status;
}

function quote_status_badge_class(string $status): string
{
    $classes = [
        'nouveau'  => 'badge--new',
        'en_cours' => 'badge--progress',
        'traite'   => 'badge--done',
        'archive'  => 'badge--muted',
    ];
    return $classes[$status] ?? 'badge--muted';
}

/** Bouton de pagination précédent/suivant : lien si actif, bouton désactivé sinon. */
function pager_button(bool $enabled, string $href, string $label, string $iconSvg): string
{
    if ($enabled) {
        return '<a class="pager" href="' . h($href) . '" aria-label="' . h($label) . '">' . $iconSvg . '</a>';
    }
    return '<button type="button" class="pager" disabled aria-label="' . h($label) . '">' . $iconSvg . '</button>';
}
