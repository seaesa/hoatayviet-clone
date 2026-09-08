/* Hoa Tay Viet — inline line-art icon set (stroke-based, one visual language). */

const ICONS = {
  brand: `<svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M6 27h28l-3 6H9l-3-6Z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/>
    <path d="M20 27V8" stroke="currentColor" stroke-width="1.6"/>
    <path d="M20 10c5 1 8 4 9 8h-9v-8Z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/>
    <path d="M20 13c-3.5 1-6 3.5-7 6h7v-6Z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/>
  </svg>`,

  cruise: `<svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M5 28h30l-4 7H9l-4-7Z" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/>
    <path d="M9 28V17h22v11" stroke="currentColor" stroke-width="1.4"/>
    <path d="M13 17v-5h14v5" stroke="currentColor" stroke-width="1.4"/>
    <path d="M27 12V7h3v5" stroke="currentColor" stroke-width="1.4"/>
    <path d="M9 22h22M9 25h22" stroke="currentColor" stroke-width="1.1"/>
  </svg>`,

  modern: `<svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M4 27c5 6 10 8 16 8s11-2 16-8l-4-3H8l-4 3Z" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/>
    <path d="M12 24V14l16 3v7" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/>
    <path d="M20 14V9" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/>
  </svg>`,

  cargo: `<svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M4 27h32l-4 7H8l-4-7Z" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/>
    <path d="M9 27V19h9v8M22 27v-6h6v6" stroke="currentColor" stroke-width="1.4"/>
    <path d="M14 19V9l11 6" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>
    <path d="M9 23h22" stroke="currentColor" stroke-width="1.1"/>
  </svg>`,

  sail: `<svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M6 29h28l-3 6H9l-3-6Z" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/>
    <path d="M20 29V6" stroke="currentColor" stroke-width="1.4"/>
    <path d="M20 8c4.5 1.5 7 6 7.5 12H20V8Z" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/>
    <path d="M20 12c-3.5 1.4-6 5-7 9h7v-9Z" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/>
  </svg>`,

  rowboat: `<svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M5 24c4 5 9 7 15 7s11-2 15-7" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>
    <path d="M8 24V17h24v7" stroke="currentColor" stroke-width="1.4"/>
    <path d="M3 15l10 3M37 15l-10 3" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/>
  </svg>`,

  furniture: `<svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M6 15h28v4H6z" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/>
    <path d="M9 19c-2 5-2 9 0 13M31 19c2 5 2 9 0 13" stroke="currentColor" stroke-width="1.4"/>
    <path d="M13 15V9h14v6" stroke="currentColor" stroke-width="1.2"/>
  </svg>`,

  other: `<svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="20" cy="20" r="13" stroke="currentColor" stroke-width="1.4"/>
    <path d="M20 20 27 15M20 20v9M20 20l-6-4" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/>
  </svg>`,

  pin: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 21s7-6.4 7-12a7 7 0 1 0-14 0c0 5.6 7 12 7 12Z" stroke="currentColor" stroke-width="1.5"/>
    <circle cx="12" cy="9" r="2.4" stroke="currentColor" stroke-width="1.5"/>
  </svg>`,

  phone: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M6 3h3l2 5-2.5 2A11 11 0 0 0 14 15.5l2-2.5 5 2v3a2 2 0 0 1-2 2C10.5 20 4 13.5 4 5a2 2 0 0 1 2-2Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>
  </svg>`,

  mail: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="3" y="5" width="18" height="14" rx="1.5" stroke="currentColor" stroke-width="1.5"/>
    <path d="M4 6.5 12 13l8-6.5" stroke="currentColor" stroke-width="1.5"/>
  </svg>`,

  search: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="10.5" cy="10.5" r="6.5" stroke="currentColor" stroke-width="1.6"/>
    <path d="m19.5 19.5-4.2-4.2" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>
  </svg>`,

  phoneRing: `<svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M6 3h3l2 5-2.5 2A11 11 0 0 0 14 15.5l2-2.5 5 2v3a2 2 0 0 1-2 2C10.5 20 4 13.5 4 5a2 2 0 0 1 2-2Z"/>
  </svg>`,
};

/* A single ship-lines / naval-architecture drawing for hero backgrounds. */
const BLUEPRINT_SVG = `
<svg class="blueprint-grid" viewBox="0 0 600 500" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
  <path class="blueprint-path" d="M40 340 C 140 300, 460 300, 560 340 L 520 380 C 420 400, 180 400, 80 380 Z"
    stroke="var(--harbor)" stroke-width="1.1" opacity="0.55"/>
  <path class="blueprint-path" d="M300 340 V 90" stroke="var(--harbor)" stroke-width="1" opacity="0.4"/>
  <path class="blueprint-path" d="M300 100 C 340 140, 360 220, 362 300" stroke="var(--harbor)" stroke-width="1" opacity="0.4"/>
  <path class="blueprint-path" d="M300 150 C 265 180, 250 240, 246 300" stroke="var(--harbor)" stroke-width="1" opacity="0.4"/>
  <path class="blueprint-path" d="M180 340 V 200 M 420 340 V 200" stroke="var(--harbor)" stroke-width="0.8" opacity="0.3"/>
  <path class="blueprint-path" d="M120 340 Q 300 250 480 340" stroke="var(--harbor)" stroke-width="0.8" opacity="0.3" stroke-dasharray="4 5"/>
  <g opacity="0.35">
    <circle cx="300" cy="90" r="2" fill="var(--harbor)"/>
    <circle cx="300" cy="150" r="2" fill="var(--harbor)"/>
  </g>
</svg>`;

function icon(name, cls) {
  return `<span class="${cls || ""}">${ICONS[name] || ""}</span>`;
}
