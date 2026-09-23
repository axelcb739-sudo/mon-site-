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

function colorVars(cat) {
  const [c1, c2] = COLORS[cat];
  return `--c1:${c1};--c2:${c2}`;
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
        <div class="p-img" style="${colorVars(p.cat)}">
          <div class="p-tags">${tags}</div>
          <div class="p-box">${p.type}</div>
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
      <div class="ci-img" style="${colorVars(p.cat)}"></div>
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
