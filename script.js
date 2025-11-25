
// Sample data will be loaded from products.json and blog.json (local)
const PRODUCTS_URL = 'data/products.json';
const BLOG_URL = 'data/blog.json';

document.addEventListener('DOMContentLoaded', init);

function init(){
  document.getElementById('year')?.textContent = new Date().getFullYear();
  document.getElementById('nav-toggle')?.addEventListener('click', ()=>{
    document.getElementById('main-nav').classList.toggle('show');
  });
  document.getElementById('cart-btn')?.addEventListener('click', toggleCart);
  fetch(PRODUCTS_URL).then(r=>r.json()).then(renderProducts);
  fetch(BLOG_URL).then(r=>r.json()).then(renderBlogs);
  loadCartFromStorage();
  // render product page if on product.html?sku=
  if(location.pathname.endsWith('product.html') || location.pathname.endsWith('product')){
    const params = new URLSearchParams(location.search);
    const sku = params.get('sku');
    if(sku) showProductPage(sku);
  }
}

function renderProducts(products){
  const grid = document.getElementById('product-grid') || document.getElementById('product-grid-all');
  if(!grid) return;
  grid.innerHTML = '';
  products.forEach(p=>{
    const card = document.createElement('article');
    card.className='card';
    card.innerHTML = `<img src="${p.image}" alt="${p.name}" loading="lazy">
      <h3>${p.name}</h3>
      <div class="price">$${p.price.toFixed(2)}</div>
      <p>${p.excerpt}</p>
      <div class="card-actions">
        <button class="btn primary" onclick="addToCart('${p.sku}')">Add to cart</button>
        <a class="btn outline" href="product.html?sku=${p.sku}">View</a>
      </div>`;
    grid.appendChild(card);
  });
}

function renderBlogs(posts){
  const list = document.getElementById('blog-list') || document.getElementById('blog-list-all');
  if(!list) return;
  list.innerHTML = '';
  posts.forEach(b=>{
    const el = document.createElement('div');
    el.className='card';
    el.innerHTML = `<h3>${b.title}</h3><p>${b.excerpt}</p><a class="btn ghost" href="#">Read</a>`;
    list.appendChild(el);
  });
}

// Product detail rendering
function showProductPage(sku){
  fetch(PRODUCTS_URL).then(r=>r.json()).then(products=>{
    const p = products.find(x=>x.sku===sku);
    const container = document.getElementById('product-page');
    if(!p || !container) { container.innerHTML='<p>Product not found</p>'; return; }
    container.innerHTML = `<div class="product-detail"><div style="display:grid;grid-template-columns:1fr 360px;gap:18px"><div><img src="${p.image}" alt="${p.name}" style="width:100%;border-radius:8px"></div><div><h1>${p.name}</h1><div class="price">$${p.price.toFixed(2)}</div><p>${p.description}</p><ul><li>Size: ${p.size}</li><li>Ingredients: ${p.ingredients}</li></ul><div style="margin-top:12px"><button class="btn primary" onclick="addToCart('${p.sku}')">Add to cart</button></div></div></div></div>`;
  });
}

// Simple cart (localStorage)
let CART = {};
function loadCartFromStorage(){
  try{
    CART = JSON.parse(localStorage.getItem('lsv_cart')||'{}');
  }catch(e){ CART = {}; }
  updateCartUI();
}
function saveCart(){
  localStorage.setItem('lsv_cart', JSON.stringify(CART));
  updateCartUI();
}
function addToCart(sku){
  CART[sku] = (CART[sku]||0)+1;
  saveCart();
  alert('Added to cart');
}
function updateCartUI(){
  const count = Object.values(CART).reduce((s,a)=>s+a,0);
  document.getElementById('cart-count') && (document.getElementById('cart-count').textContent=count);
  const itemsEl = document.getElementById('cart-items');
  if(itemsEl){
    itemsEl.innerHTML='';
    fetch(PRODUCTS_URL).then(r=>r.json()).then(products=>{
      let total=0;
      for(const sku in CART){
        const p = products.find(x=>x.sku===sku);
        if(!p) continue;
        const qty=CART[sku];
        const line = document.createElement('div');
        line.style.display='flex';line.style.justifyContent='space-between';line.style.marginBottom='8px';
        line.innerHTML = `<div>${p.name} × ${qty}</div><div>$${(p.price*qty).toFixed(2)}</div>`;
        itemsEl.appendChild(line);
        total += p.price*qty;
      }
      document.getElementById('cart-total') && (document.getElementById('cart-total').textContent = 'Total: $'+total.toFixed(2));
    });
  }
}
function toggleCart(){
  const modal = document.getElementById('cart-modal');
  if(!modal) return;
  const isHidden = modal.getAttribute('aria-hidden') === 'true' || !modal.hasAttribute('aria-hidden');
  modal.setAttribute('aria-hidden', isHidden ? 'false' : 'true');
  if(!isHidden) updateCartUI();
}
function checkout(){
  alert('This demo site does not perform real checkout. Export cart to email by copying cart contents.');
}

// Forms (demo)
function submitContact(e){
  e.preventDefault();
  const f = e.target;
  alert('Thanks '+f.name.value+' — message sent (demo).');
  f.reset();
}
function subscribe(e){
  e.preventDefault();
  const email = new FormData(e.target).get('email');
  alert('Subscribed: '+email+' (demo)');
  e.target.reset();
}
