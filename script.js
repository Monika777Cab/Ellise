// Ellise interactions: mobile nav + carousel + year
(function(){
  // CDN config: set window.ELLise_CDN_BASE = "https://cdn.tu-dominio.com/ellise" before this script to override.
  const CDN_BASE = window.ELLise_CDN_BASE || "https://cdn.example.com/ellise";
  // Width breakpoints for responsive images
  const RESPONSIVE_WIDTHS = [400, 600, 800, 1200];
  const navToggle = document.querySelector('.nav-toggle');
  const nav = document.getElementById('primary-nav');
  if(navToggle && nav){
    navToggle.addEventListener('click', function(){
      const isOpen = nav.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
    });
  }

  const track = document.querySelector('.carousel-track');
  const prev = document.querySelector('.carousel-btn.prev');
  const next = document.querySelector('.carousel-btn.next');
  if(track && prev && next){
    const scrollByOne = () => track.scrollBy({left: track.clientWidth * 0.5, behavior: 'smooth'});
    prev.addEventListener('click', () => track.scrollBy({left: -track.clientWidth * 0.5, behavior: 'smooth'}));
    next.addEventListener('click', () => scrollByOne());
  }

  const year = document.getElementById('year');
  if(year){ year.textContent = new Date().getFullYear(); }

  // Sidebar toggle (mobile)
  const sidebar = document.getElementById('shop-sidebar');
  const sidebarToggle = document.querySelector('.sidebar-toggle');
  if(sidebar && sidebarToggle){
    sidebarToggle.addEventListener('click', function(){
      const isOpen = sidebar.classList.toggle('open');
      sidebarToggle.setAttribute('aria-expanded', String(isOpen));
    });
  }

  // Cart state
  const CART_KEY = 'ellise_cart_v1';
  function loadCart(){
    try{ return JSON.parse(localStorage.getItem(CART_KEY) || '[]'); }catch{ return []; }
  }
  function saveCart(items){ localStorage.setItem(CART_KEY, JSON.stringify(items)); }
  function formatMoney(cents){
    return new Intl.NumberFormat('es-ES', { style:'currency', currency:'CLP', maximumFractionDigits:0 }).format(cents);
  }

  const cartBtn = document.querySelector('.cart-button');
  const cartDrawer = document.getElementById('cart-drawer');
  const cartOverlay = document.getElementById('cart-overlay');
  const cartItemsEl = document.getElementById('cart-items');
  const cartCountEl = document.getElementById('cart-count');
  const cartTotalEl = document.getElementById('cart-total');
  const checkoutBtn = document.getElementById('checkout-btn');
  const clearBtn = document.getElementById('clear-cart-btn');
  const cartClose = document.querySelector('.cart-close');

  let cart = loadCart();

  function updateCartUI(){
    // Count and total
    const count = cart.reduce((a,i)=>a+i.qty,0);
    const total = cart.reduce((a,i)=>a + (i.price * i.qty),0);
    if(cartCountEl) cartCountEl.textContent = String(count);
    if(cartTotalEl) cartTotalEl.textContent = formatMoney(total);
    if(checkoutBtn) checkoutBtn.disabled = cart.length === 0;
    // Render items
    if(!cartItemsEl) return;
    cartItemsEl.innerHTML = '';
    cart.forEach(function(item, idx){
      const el = document.createElement('div');
      el.className = 'cart-item';
      el.innerHTML = `
        <img src="${window.ELLise_CDN_BASE ? (window.ELLise_CDN_BASE.replace(/\/$/,'') + '/' + item.img) : ''}" alt="${item.name}">
        <div>
          <h4>${item.name}</h4>
          <div class="price">${formatMoney(item.price)}</div>
        </div>
        <div class="qty-controls">
          <button aria-label="Quitar uno" data-action="dec" data-index="${idx}">-</button>
          <span>${item.qty}</span>
          <button aria-label="Agregar uno" data-action="inc" data-index="${idx}">+</button>
          <button aria-label="Eliminar" data-action="del" data-index="${idx}">✕</button>
        </div>
      `;
      cartItemsEl.appendChild(el);
    });
  }

  function openCart(){
    if(cartOverlay) cartOverlay.hidden = false;
    if(cartDrawer){ cartDrawer.classList.add('open'); cartDrawer.setAttribute('aria-hidden','false'); }
    if(cartBtn) cartBtn.setAttribute('aria-expanded','true');
  }
  function closeCart(){
    if(cartOverlay) cartOverlay.hidden = true;
    if(cartDrawer){ cartDrawer.classList.remove('open'); cartDrawer.setAttribute('aria-hidden','true'); }
    if(cartBtn) cartBtn.setAttribute('aria-expanded','false');
  }

  if(cartBtn){ cartBtn.addEventListener('click', openCart); }
  if(cartOverlay){ cartOverlay.addEventListener('click', closeCart); }
  if(cartClose){ cartClose.addEventListener('click', closeCart); }

  if(clearBtn){
    clearBtn.addEventListener('click', function(){ cart = []; saveCart(cart); updateCartUI(); });
  }

  cartItemsEl?.addEventListener('click', function(e){
    const t = e.target;
    if(!(t instanceof Element)) return;
    const action = t.getAttribute('data-action');
    const idx = Number(t.getAttribute('data-index'));
    if(Number.isNaN(idx)) return;
    if(action === 'inc'){ cart[idx].qty += 1; }
    if(action === 'dec'){ cart[idx].qty = Math.max(1, cart[idx].qty - 1); }
    if(action === 'del'){ cart.splice(idx,1); }
    saveCart(cart); updateCartUI();
  });

  function addToCart(data){
    const existing = cart.find(i => i.id === data.id);
    if(existing){ existing.qty += 1; }
    else{ cart.push({ id: data.id, name: data.name, price: data.price, img: data.img, qty: 1 }); }
    saveCart(cart); updateCartUI(); openCart();
  }

  document.querySelectorAll('.add-to-cart').forEach(function(btn){
    btn.addEventListener('click', function(){
      const id = btn.getAttribute('data-id');
      const name = btn.getAttribute('data-name');
      const price = Number(btn.getAttribute('data-price'));
      const img = btn.getAttribute('data-img');
      addToCart({ id, name, price, img });
    });
  });

  // Checkout navigation
  if(checkoutBtn){
    checkoutBtn.addEventListener('click', function(){
      if(cart.length === 0) return;
      window.location.href = 'checkout.html';
    });
  }

  updateCartUI();
  // Featured slides → open shop, open sidebar and activate category
  function activateCategory(catId){
    const shopSection = document.getElementById('tienda');
    if(shopSection && shopSection.scrollIntoView){
      shopSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    // Open sidebar on mobile
    const sidebarEl = document.getElementById('shop-sidebar');
    const sidebarBtn = document.querySelector('.sidebar-toggle');
    if(sidebarEl){
      sidebarEl.classList.add('open');
      if(sidebarBtn){ sidebarBtn.setAttribute('aria-expanded', 'true'); }
    }
    // Activate category link
    const links = document.querySelectorAll('.category-list a');
    links.forEach(function(a){ a.classList.remove('active'); });
    const targetLink = document.getElementById(catId);
    if(targetLink){ targetLink.classList.add('active'); }
  }

  document.querySelectorAll('.slide-caption a[href^="#tienda-cat-"]').forEach(function(link){
    link.addEventListener('click', function(ev){
      const hash = (link.getAttribute('href') || '').replace('#','');
      if(!hash) return;
      ev.preventDefault();
      activateCategory(hash);
    });
  });

  // Reviews: fetch JSON and render + average
  async function renderReviews(){
    const container = document.querySelector('.testimonials');
    const heading = document.getElementById('resenas-title');
    if(!container) return;
    try{
      const res = await fetch('data/reviews.json', { cache: 'no-store' });
      if(!res.ok) throw new Error('Failed to load reviews');
      const items = await res.json();
      // Compute average rating
      const avg = items.length ? (items.reduce((a, r) => a + (r.rating || 0), 0) / items.length) : 0;
      if(heading){
        const rounded = Math.round(avg * 10) / 10;
        const summary = document.createElement('span');
        summary.className = 'rating-summary';
        summary.textContent = ` · ${rounded} / 5`;
        heading.appendChild(summary);
      }
      // Render
      container.innerHTML = '';
      items.forEach(function(r){
        const article = document.createElement('article');
        article.className = 'review';
        article.setAttribute('role', 'listitem');
        article.innerHTML = `
          <div class="review-head">
            <img class="avatar" src="${r.avatar}" alt="Avatar de ${r.name}" loading="lazy">
            <div>
              <strong>${r.name}</strong>
              <div class="stars" aria-label="${r.rating} de 5">${'★'.repeat(r.rating)}${'☆'.repeat(5 - r.rating)}</div>
            </div>
          </div>
          <p>${r.text}</p>
        `;
        container.appendChild(article);
      });
    }catch(e){
      // leave static content if present
      console.warn('Reviews failed:', e.message);
    }
  }

  renderReviews();
  // Build a CDN URL, allowing optional size parameter using ?w=WIDTH
  function buildCdnUrl(relativePath, width){
    const base = CDN_BASE.replace(/\/$/, '') + '/' + String(relativePath).replace(/^\//, '');
    if(typeof width === 'number' && width > 0){
      // Append width as query param. If CDN needs a different format, adjust here.
      const joiner = base.includes('?') ? '&' : '?';
      return base + joiner + 'w=' + width;
    }
    return base;
  }

  function setImageSources(img){
    // If a fallback is provided, prefer showing it immediately
    const fallback = img.getAttribute('data-fallback');
    const path = img.getAttribute('data-cdn');
    if(!path){
      if(fallback) img.src = fallback;
      return;
    }
    // Set srcset for responsive variants
    const srcset = RESPONSIVE_WIDTHS.map(function(w){
      return buildCdnUrl(path, w) + ' ' + w + 'w';
    }).join(', ');
    img.setAttribute('srcset', srcset);
    // Fallback src (medium)
    img.setAttribute('src', buildCdnUrl(path, 800));
  }

  // Helper to pick a random fallback image if multiple provided
  function pickRandomFallback(img){
    const list = img.getAttribute('data-fallbacks');
    if(list){
      const urls = list.split('|').map(s => s.trim()).filter(Boolean);
      if(urls.length){
        return urls[Math.floor(Math.random() * urls.length)];
      }
    }
    const single = img.getAttribute('data-fallback');
    return single || '';
  }

  // Lazy load with IntersectionObserver
  const cdnImages = document.querySelectorAll('img[data-cdn]');
  if('IntersectionObserver' in window){
    const observer = new IntersectionObserver(function(entries, obs){
      entries.forEach(function(entry){
        if(entry.isIntersecting){
          const target = entry.target;
          setImageSources(target);
          obs.unobserve(target);
        }
      });
    }, { rootMargin: '200px 0px', threshold: 0.01 });
    cdnImages.forEach(function(img){
      // If there's a fallback(s), show one immediately and still observe for CDN swap later
      const fb = pickRandomFallback(img);
      if(fb){ img.src = fb; }
      observer.observe(img);
    });
  } else {
    // Fallback: eagerly set sources
    cdnImages.forEach(function(img){
      const fb = pickRandomFallback(img);
      if(fb) img.src = fb;
      setImageSources(img);
    });
  }
})();


