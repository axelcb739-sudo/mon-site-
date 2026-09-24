const COLORS = {
  pokemon: ['#ffcb05', '#e3350d'],
  onepiece: ['#d62828', '#1d3557'],
  yugioh: ['#7b2cbf', '#240046'],
  magic: ['#f77f00', '#3a0ca3'],
  lorcana: ['#4cc9f0', '#3f37c9'],
  dragonball: ['#ff9f1c', '#e71d36'],
  accessoires: ['#8d99ae', '#2b2d42'],
};

const LABELS = {
  all: 'Nouveautés', pokemon: 'Pokémon', onepiece: 'One Piece', yugioh: 'Yu-Gi-Oh!',
  magic: 'Magic', lorcana: 'Lorcana', dragonball: 'Dragon Ball', japon: 'Import Japon',
  accessoires: 'Accessoires', promo: 'Promos', precommande: 'Précommandes',
};

// tags : promo, pre (précommande), jp (import japonais)
// img (optionnel) : lien ou chemin de la photo, ex. img: 'https://…/display.jpg'
const PRODUCTS = [
  { id: 1, cat: 'pokemon', name: 'Display 36 boosters – Écarlate et Violet', type: 'Display', price: 179.9, old: 199.9, stock: 8, tags: ['promo'] },
  { id: 2, cat: 'pokemon', name: 'Coffret Dresseur d\'Élite (ETB)', type: 'ETB', price: 54.9, stock: 14, tags: [] },
  { id: 3, cat: 'pokemon', name: 'Display 30 boosters japonais', type: 'Display JP', price: 69.9, stock: 3, tags: ['jp'] },
  { id: 4, cat: 'pokemon', name: 'Tripack boosters + carte promo', type: 'Tripack', price: 17.9, stock: 25, tags: [] },
  { id: 5, cat: 'pokemon', name: 'Coffret Collection Premium', type: 'Coffret', price: 44.9, stock: 0, tags: [] },
  { id: 6, cat: 'pokemon', name: 'Display prochaine extension', type: 'Display', price: 189.9, stock: 30, tags: ['pre'] },
  { id: 7, cat: 'onepiece', name: 'Display 24 boosters OP (FR)', type: 'Display', price: 119.9, stock: 6, tags: [] },
  { id: 8, cat: 'onepiece', name: 'Starter Deck One Piece Card Game', type: 'Deck', price: 14.9, stock: 18, tags: [] },
  { id: 9, cat: 'onepiece', name: 'Display 24 boosters OP (JP)', type: 'Display JP', price: 89.9, old: 99.9, stock: 4, tags: ['jp', 'promo'] },
  { id: 10, cat: 'yugioh', name: 'Display 24 boosters Yu-Gi-Oh!', type: 'Display', price: 79.9, stock: 10, tags: [] },
  { id: 11, cat: 'yugioh', name: 'Structure Deck Yu-Gi-Oh!', type: 'Deck', price: 12.9, stock: 22, tags: [] },
  { id: 12, cat: 'magic', name: 'Play Booster Display Magic (FR)', type: 'Display', price: 149.9, stock: 7, tags: [] },
  { id: 13, cat: 'magic', name: 'Bundle Magic: The Gathering', type: 'Bundle', price: 49.9, stock: 0, tags: [] },
  { id: 14, cat: 'magic', name: 'Commander Deck Magic', type: 'Deck', price: 44.9, stock: 9, tags: ['pre'] },
  { id: 15, cat: 'lorcana', name: 'Display 24 boosters Lorcana', type: 'Display', price: 139.9, stock: 5, tags: [] },
  { id: 16, cat: 'lorcana', name: 'Coffret Trésor Lorcana', type: 'Coffret', price: 54.9, old: 59.9, stock: 11, tags: ['promo'] },
  { id: 17, cat: 'dragonball', name: 'Display Dragon Ball Fusion World', type: 'Display', price: 94.9, stock: 8, tags: [] },
  { id: 18, cat: 'dragonball', name: 'Starter Deck Dragon Ball', type: 'Deck', price: 11.9, stock: 16, tags: [] },
  { id: 19, cat: 'accessoires', name: 'Pochettes de protection x100', type: 'Sleeves', price: 7.9, stock: 60, tags: [] },
  { id: 20, cat: 'accessoires', name: 'Classeur 9 cases – 360 cartes', type: 'Classeur', price: 29.9, stock: 12, tags: [] },
  { id: 21, cat: 'accessoires', name: 'Protège-display acrylique', type: 'Protection', price: 24.9, old: 29.9, stock: 3, tags: ['promo'] },
  { id: 22, cat: 'accessoires', name: 'Toploaders rigides x25', type: 'Toploader', price: 5.9, stock: 45, tags: [] },
];

const FREE_SHIPPING = 200;
const $ = (s) => document.querySelector(s);
const fmt = (n) => n.toFixed(2).replace('.', ',') + ' €';

let filter = 'all';
let query = '';
let sort = 'default';
let cart = {};
try { cart = JSON.parse(localStorage.getItem('cart') || '{}'); } catch { cart = {}; }

function matches(p) {
  if (filter === 'promo' && !p.tags.includes('promo')) return false;
  if (filter === 'precommande' && !p.tags.includes('pre')) return false;
  if (filter === 'japon' && !p.tags.includes('jp')) return false;
  if (!['all', 'promo', 'precommande', 'japon'].includes(filter) && p.cat !== filter) return false;
  if (query) {
    const hay = `${p.name} ${p.type} ${LABELS[p.cat]}`.toLowerCase();
    if (!hay.includes(query.toLowerCase())) return false;
  }
  return true;
}

/* Illustrations originales des produits (remplacées par une vraie photo si images/produit-<id>.jpg existe) */
const SHAPES = {
  Display: 'display', 'Display JP': 'display', ETB: 'etb', Tripack: 'tripack', Coffret: 'coffret',
  Deck: 'deck', Bundle: 'bundle', Sleeves: 'sleeves', Classeur: 'classeur', Protection: 'protection', Toploader: 'toploader',
};

function star(cx, cy, r, fill = '#fff', op = 0.9) {
  const k = r * 0.28;
  return `<path d="M${cx} ${cy - r} Q${cx + k} ${cy - k} ${cx + r} ${cy} Q${cx + k} ${cy + k} ${cx} ${cy + r} Q${cx - k} ${cy + k} ${cx - r} ${cy} Q${cx - k} ${cy - k} ${cx} ${cy - r}Z" fill="${fill}" opacity="${op}"/>`;
}

function pack(x, y, w, h, g, rot = 0) {
  const zz = (yy, dir) => {
    let d = '';
    for (let i = 0; i <= 10; i++) d += `${i ? 'L' : 'M'}${x + (w / 10) * i} ${yy + (i % 2 ? dir * 4 : 0)} `;
    return d;
  };
  return `<g transform="rotate(${rot} ${x + w / 2} ${y + h / 2})">
    <path d="${zz(y, 1)} L${x + w} ${y + h} ${zz(y + h, -1).replace('M', 'L').split(' ').reverse().join(' ')} Z" fill="url(#${g})" stroke="rgba(0,0,0,.25)"/>
    <rect x="${x}" y="${y + 6}" width="${w}" height="8" fill="rgba(0,0,0,.18)"/>
    <rect x="${x}" y="${y + h - 14}" width="${w}" height="8" fill="rgba(0,0,0,.18)"/>
    ${star(x + w / 2, y + h / 2, w * 0.28)}
    <rect x="${x + w * 0.15}" y="${y + h * 0.72}" width="${w * 0.7}" height="5" rx="2" fill="#fff" opacity=".8"/>
  </g>`;
}

function productArt(p) {
  const [c1, c2] = COLORS[p.cat];
  const g = `g${p.id}`, gs = `s${p.id}`;
  const label = (x, y, size = 11) =>
    `<text x="${x}" y="${y}" text-anchor="middle" font-family="Poppins,sans-serif" font-weight="800" font-size="${size}" fill="#fff" letter-spacing="1">${p.type.toUpperCase()}</text>`;
  let body = '';
  switch (SHAPES[p.type]) {
    case 'display':
      body = `
        <path d="M40 70 L60 50 L170 50 L150 70Z" fill="rgba(0,0,0,.35)"/>
        ${[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => `<rect x="${50 + i * 11}" y="${46 - (i % 2) * 3}" width="10" height="26" rx="2" fill="${i % 2 ? c1 : '#fff'}" transform="skewX(-40) translate(${48} 0)" opacity=".95"/>`).join('')}
        <path d="M150 70 L170 50 L170 150 L150 170Z" fill="url(#${g})" filter="brightness(.7)" opacity=".85"/>
        <rect x="40" y="70" width="110" height="100" fill="url(#${g})" stroke="rgba(0,0,0,.2)"/>
        ${star(95, 108, 22)}${label(95, 155)}
        ${p.type.includes('JP') ? '<circle cx="136" cy="82" r="8" fill="#fff"/><circle cx="136" cy="82" r="4" fill="#d62828"/>' : ''}`;
      break;
    case 'etb':
      body = `
        <rect x="58" y="40" width="94" height="135" rx="4" fill="url(#${g})" stroke="rgba(0,0,0,.2)"/>
        <rect x="58" y="40" width="94" height="30" rx="4" fill="rgba(0,0,0,.2)"/>
        <rect x="152" y="46" width="12" height="129" fill="${c2}" opacity=".7"/>
        ${star(105, 108, 26)}${label(105, 160, 14)}`;
      break;
    case 'tripack':
      body = pack(32, 55, 55, 100, g, -12) + pack(72, 45, 55, 100, g, 0) + pack(112, 55, 55, 100, g, 12);
      break;
    case 'coffret':
      body = `
        <rect x="22" y="55" width="156" height="110" rx="6" fill="url(#${g})" stroke="rgba(0,0,0,.2)"/>
        <rect x="32" y="65" width="80" height="90" rx="4" fill="rgba(255,255,255,.25)" stroke="#fff"/>
        <rect x="52" y="74" width="40" height="56" rx="3" fill="#fff"/><rect x="56" y="78" width="32" height="24" fill="${c1}"/>
        ${pack(120, 68, 22, 50, g)}${pack(146, 68, 22, 50, g)}
        ${label(145, 148, 10)}`;
      break;
    case 'deck':
      body = `
        <rect x="70" y="40" width="60" height="14" rx="3" fill="#f3f3f3" stroke="#ccc"/>
        <rect x="64" y="52" width="72" height="115" rx="5" fill="url(#${g})" stroke="rgba(0,0,0,.2)"/>
        <path d="M64 52 L136 52 L128 76 L72 76Z" fill="rgba(0,0,0,.2)"/>
        ${star(100, 110, 18)}${label(100, 152, 12)}`;
      break;
    case 'bundle':
      body = `
        <rect x="35" y="60" width="130" height="105" rx="5" fill="url(#${g})" stroke="rgba(0,0,0,.2)"/>
        <rect x="128" y="60" width="16" height="105" fill="#fff" opacity=".85"/>
        <rect x="35" y="104" width="130" height="16" fill="#fff" opacity=".85"/>
        <circle cx="136" cy="112" r="12" fill="${c1}" stroke="#fff" stroke-width="3"/>
        ${label(80, 150, 11)}`;
      break;
    case 'sleeves':
      body = [0, 1, 2, 3].map((i) => `<rect x="${60 + i * 6}" y="${40 + i * 6}" width="80" height="112" rx="6" fill="${i === 3 ? `url(#${g})` : 'rgba(255,255,255,.35)'}" stroke="#fff" stroke-width="2"/>`).join('')
        + star(118, 110, 18) + label(118, 150, 10);
      break;
    case 'classeur':
      body = `
        <rect x="45" y="35" width="120" height="145" rx="10" fill="url(#${g})" stroke="rgba(0,0,0,.25)"/>
        <rect x="45" y="35" width="18" height="145" rx="6" fill="rgba(0,0,0,.25)"/>
        ${[0, 1, 2].map((r) => [0, 1, 2].map((c) => `<rect x="${72 + c * 30}" y="${48 + r * 40}" width="24" height="34" rx="3" fill="rgba(255,255,255,.3)" stroke="#fff"/>`).join('')).join('')}
        <rect x="160" y="95" width="16" height="26" rx="4" fill="${c2}" stroke="#fff"/>`;
      break;
    case 'protection':
      body = `
        <rect x="45" y="65" width="100" height="95" fill="url(#${g})" opacity=".9"/>${star(95, 108, 18)}
        <path d="M35 60 L55 42 L170 42 L170 150 L150 170 L35 170Z" fill="rgba(255,255,255,.18)" stroke="#fff" stroke-width="3"/>
        <path d="M35 60 L150 60 L170 42 M150 60 L150 170" fill="none" stroke="#fff" stroke-width="2"/>
        <path d="M60 150 L80 80" stroke="#fff" stroke-width="4" opacity=".5"/>`;
      break;
    case 'toploader':
      body = [0, 1, 2].map((i) => `<g transform="rotate(${(i - 1) * 10} 100 110)">
        <rect x="68" y="45" width="64" height="100" rx="4" fill="rgba(255,255,255,.35)" stroke="#fff" stroke-width="3"/>
        <rect x="75" y="58" width="50" height="80" rx="3" fill="url(#${g})"/>${star(100, 92, 12)}</g>`).join('');
      break;
  }
  return `<svg viewBox="0 0 200 200" class="art" role="img" aria-label="${p.name}">
    <defs>
      <linearGradient id="${g}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${c1}"/><stop offset="1" stop-color="${c2}"/></linearGradient>
      <radialGradient id="${gs}" cx=".5" cy=".95" r=".5"><stop offset="0" stop-color="rgba(0,0,0,.25)"/><stop offset="1" stop-color="rgba(0,0,0,0)"/></radialGradient>
    </defs>
    <ellipse cx="100" cy="182" rx="70" ry="10" fill="url(#${gs})"/>
    ${body}
  </svg>`;
}

function productVisual(p) {
  return `<img src="${p.img || `images/produit-${p.id}.jpg`}" alt="${p.name}" loading="lazy"
    onerror="this.replaceWith(document.getElementById('art-${p.id}').content.cloneNode(true))">
    <template id="art-${p.id}">${productArt(p)}</template>`;
}

function stockLabel(s) {
  if (s === 0) return '<span class="out">● Rupture de stock</span>';
  if (s <= 5) return `<span class="low">● Plus que ${s} en stock</span>`;
  return '<span class="in">● En stock</span>';
}

function renderProducts() {
  let list = PRODUCTS.filter(matches);
  if (sort === 'price-asc') list.sort((a, b) => a.price - b.price);
  if (sort === 'price-desc') list.sort((a, b) => b.price - a.price);
  if (sort === 'name') list.sort((a, b) => a.name.localeCompare(b.name, 'fr'));

  $('#productsTitle').textContent = query ? `Résultats pour « ${query} »` : LABELS[filter];
  $('#emptyMsg').hidden = list.length > 0;
  $('#productGrid').innerHTML = list.map((p) => {
    const tags = [
      p.tags.includes('promo') ? `<span class="tag tag-promo">-${Math.round((1 - p.price / p.old) * 100)}%</span>` : '',
      p.tags.includes('pre') ? '<span class="tag tag-pre">Précommande</span>' : '',
      p.tags.includes('jp') ? '<span class="tag tag-jp">JP</span>' : '',
    ].join('');
    return `
      <article class="product">
        <div class="p-img">
          <div class="p-tags">${tags}</div>
          ${productVisual(p)}
        </div>
        <div class="p-body">
          <span class="p-brand">${LABELS[p.cat]}</span>
          <h3 class="p-name">${p.name}</h3>
          <div class="p-price"><b>${fmt(p.price)}</b>${p.old ? `<s>${fmt(p.old)}</s>` : ''}</div>
          <div class="p-stock">${stockLabel(p.stock)}</div>
          <button class="add" data-id="${p.id}" ${p.stock === 0 ? 'disabled' : ''}>
            ${p.stock === 0 ? 'Indisponible' : p.tags.includes('pre') ? 'Précommander' : 'Ajouter au panier'}
          </button>
        </div>
      </article>`;
  }).join('');
}

function renderChips() {
  const keys = ['all', 'pokemon', 'onepiece', 'yugioh', 'magic', 'lorcana', 'dragonball', 'japon', 'accessoires', 'promo', 'precommande'];
  $('#chips').innerHTML = keys.map((k) =>
    `<button class="chip ${k === filter ? 'active' : ''}" data-filter="${k}">${k === 'all' ? 'Tout' : LABELS[k]}</button>`
  ).join('');
  document.querySelectorAll('.nav a').forEach((a) => a.classList.toggle('active', a.dataset.filter === filter));
}

function setFilter(f) {
  filter = f;
  query = '';
  $('#searchInput').value = '';
  renderChips();
  renderProducts();
}

/* Panier */
function saveCart() {
  try { localStorage.setItem('cart', JSON.stringify(cart)); } catch {}
}

function renderCart() {
  const entries = Object.entries(cart).map(([id, qty]) => ({ p: PRODUCTS.find((x) => x.id == id), qty })).filter((e) => e.p);
  const count = entries.reduce((n, e) => n + e.qty, 0);
  const total = entries.reduce((n, e) => n + e.qty * e.p.price, 0);

  $('#cartCount').textContent = count;
  $('#cartTotal').textContent = fmt(total);
  const left = FREE_SHIPPING - total;
  $('#freeShip').innerHTML = (left > 0
    ? `Plus que <b>${fmt(left)}</b> pour la livraison offerte !`
    : '🎉 Livraison offerte !') + `<div class="bar"><i style="width:${Math.min(100, total / FREE_SHIPPING * 100)}%"></i></div>`;

  $('#cartItems').innerHTML = entries.length ? entries.map(({ p, qty }) => `
    <li>
      <div class="ci-img">${productArt(p).replace(/id="([gs])/g, 'id="c$1').replace(/url\(#([gs])/g, 'url(#c$1')}</div>
      <div>
        <div class="ci-name">${p.name}</div>
        <div class="ci-price">${fmt(p.price * qty)}</div>
      </div>
      <div class="qty">
        <button data-dec="${p.id}" aria-label="Retirer">−</button>
        <span>${qty}</span>
        <button data-inc="${p.id}" aria-label="Ajouter">+</button>
      </div>
    </li>`).join('') : '<li class="cart-empty">Votre panier est vide.</li>';
  $('#checkout').disabled = !entries.length;
}

function addToCart(id, delta = 1) {
  const p = PRODUCTS.find((x) => x.id == id);
  const qty = (cart[id] || 0) + delta;
  if (qty > p.stock) return toast('Stock maximum atteint');
  if (qty <= 0) delete cart[id]; else cart[id] = qty;
  saveCart();
  renderCart();
  if (delta > 0) toast('Ajouté au panier ✓');
}

function toggleCart(open) {
  $('#drawer').classList.toggle('open', open);
  $('#overlay').classList.toggle('show', open);
}

let toastTimer;
function toast(msg) {
  const t = $('#toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('show'), 1800);
}

/* Événements */
document.addEventListener('click', (e) => {
  const f = e.target.closest('[data-filter]');
  if (f) { setFilter(f.dataset.filter); $('#nav').classList.remove('open'); }
  const add = e.target.closest('.add');
  if (add) addToCart(add.dataset.id);
  if (e.target.dataset.inc) addToCart(e.target.dataset.inc, 1);
  if (e.target.dataset.dec) addToCart(e.target.dataset.dec, -1);
});

$('#cartBtn').addEventListener('click', () => toggleCart(true));
$('#closeCart').addEventListener('click', () => toggleCart(false));
$('#overlay').addEventListener('click', () => toggleCart(false));
$('#burger').addEventListener('click', () => $('#nav').classList.toggle('open'));
$('#sortSelect').addEventListener('change', (e) => { sort = e.target.value; renderProducts(); });

$('#searchForm').addEventListener('submit', (e) => {
  e.preventDefault();
  query = $('#searchInput').value.trim();
  filter = 'all';
  renderChips();
  renderProducts();
  $('#produits').scrollIntoView();
});

$('#nlForm').addEventListener('submit', (e) => {
  e.preventDefault();
  e.target.reset();
  toast('Merci, vous êtes inscrit(e) ! 📬');
});

$('#checkout').addEventListener('click', () => toast('Paiement non disponible dans cette démo'));

$('#year').textContent = new Date().getFullYear();
renderChips();
renderProducts();
renderCart();
