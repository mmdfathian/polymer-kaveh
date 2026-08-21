(async()=>{
const $=s=>document.querySelector(s);
const esc=s=>String(s??'').replace(/[&<>\\\"']/g,m=>({'&':'&','<':'<','>':'>','\\\"':'\\\"',"'":'&#039;'}[m]));
const fallback={settings:{siteName:'پلیمر کاوه',phone1:'09133282241',phone2:'09162285494',whatsapp:'09133282241',intro:'پلیمر کاوه با تیم مجرب و متخصص، در زمینه فروش و اجرای تمام انواع محصولات پلیمری، ژئومembreان، و سیستم‌های عایق‌کاری فعالیت می‌کند.',metaTitle:'پلیمر کاوه | فروش و نصب محصولات پلیمری',metaDescription:'پلیمر کاوه با سابقه درخشان در فروش و اجرای محصولات پلیمری، ژئومembreان، و عایق‌کاری خدمات می‌دهد.'},projects:[]};
let data=fallback; try{const r=await fetch('./data/content.json',{cache:'no-store'}); if(r.ok)data=await r.json()}catch{}
const s=data.settings||fallback.settings;
document.title=s.metaTitle; const md=document.querySelector('meta[name="description"]'); if(md)md.content=s.metaDescription;
const wa=n=>`https://wa.me/98${String(n).replace(/^0/,'').replace(/\\D/g,'')}`;
const set=(sel,val)=>{document.querySelectorAll(sel).forEach(e=>e.innerHTML=val)};
set('[data-site-name]',esc(s.siteName)); set('[data-phone1]',esc(s.phone1)); set('[data-phone2]',esc(s.phone2)); set('[data-intro]',esc(s.intro));
document.querySelectorAll('[data-phone1-link]').forEach(e=>e.href='tel:'+s.phone1); document.querySelectorAll('[data-phone2-link]').forEach(e=>e.href='tel:'+s.phone2); document.querySelectorAll('[data-whatsapp]').forEach(e=>{e.href=wa(s.whatsapp||s.phone1)});
const list=$('[data-projects]'); if(list){list.innerHTML=(data.projects||[]).map(p=>{const webp=p.image.replace(/\.jpg$/i,'.webp');return `<article class="card project reveal"><a href="${esc(p.image)}" data-lightbox><picture><source srcset="${esc(webp)}" type="image/webp"><img src="${esc(p.image)}" loading="lazy" alt="${esc(p.title)}"></picture></a><div class="project-body"><small>${esc(p.category)}</small><h3>${esc(p.title)}</h3><p>${esc(p.description)}</p></div></article>`}).join('')||'<p class="muted">نمونه‌کارها به‌زودی اضافه می‌شوند.</p>'};
document.addEventListener('click',e=>{const a=e.target.closest('[data-lightbox]');if(!a)return;e.preventDefault();const o=document.createElement('div');o.className='lightbox';o.innerHTML=`<button aria-label="بستن">×</button><img src="${a.href}" alt="">`;document.body.appendChild(o);o.onclick=()=>o.remove()});

/* Theme Toggle */
function initThemeToggle(){
  const btn=$('.theme-toggle');
  if(!btn) return;
  const prefersDark=window.matchMedia('(prefers-color-scheme:dark)').matches;
  const stored=localStorage.getItem('theme');
  const initial=stored||(prefersDark?'dark':'light');
  document.documentElement.setAttribute('data-theme',initial);
  updateIcon(initial);
  
  btn.addEventListener('click',()=>{
    const current=document.documentElement.getAttribute('data-theme')||'light';
    const next=current==='dark'?'light':'dark';
    document.documentElement.setAttribute('data-theme',next);
    localStorage.setItem('theme',next);
    updateIcon(next);
  });
  
  function updateIcon(theme){
    const sun=btn.querySelector('.sun-icon');
    const moon=btn.querySelector('.moon-icon');
    if(sun&&moon){
      if(theme==='dark'){
        sun.style.display='block';
        moon.style.display='none';
      }else{
        sun.style.display='none';
        moon.style.display='block';
      }
    }
  }
}

/* Hamburger Menu Toggle */
function initHamburger(){
  const hamburger=$('.hamburger');
  const navMenu=$('#nav-menu');
  if(!hamburger || !navMenu) return;
  
  const overlay=document.createElement('div');overlay.className='nav-overlay';document.body.appendChild(overlay);
  
  function toggleMenu(forceClose){
    const isOpen = hamburger.getAttribute('aria-expanded')==='true';
    const shouldClose = forceClose || isOpen;
    hamburger.setAttribute('aria-expanded', !shouldClose);
    navMenu.classList.toggle('open', !shouldClose);
    overlay.classList.toggle('visible', !shouldClose);
    document.body.style.overflow = shouldClose ? '' : 'hidden';
  }
  
  hamburger.addEventListener('click', (e)=>{
    e.stopPropagation();
    toggleMenu();
  });
  
  overlay.addEventListener('click', ()=> toggleMenu(true));
  
  navMenu.querySelectorAll('a').forEach(a=>{
    a.addEventListener('click', ()=> toggleMenu(true));
  });
  
  document.addEventListener('keydown', e=>{
    if(e.key==='Escape' && navMenu.classList.contains('open')) toggleMenu(true);
  });
  
  window.addEventListener('resize', ()=>{
    if(window.innerWidth > 800 && navMenu.classList.contains('open')) toggleMenu(true);
  });
}

function init(){
  initThemeToggle();
  initHamburger();
  initScrollReveal();
  initCopyPhone();
  initScrollToTop();
  // Hide loading overlay after a short delay for smooth transition
  setTimeout(()=>{
    const loader=$('#loading-overlay');
    if(loader) loader.classList.add('hidden');
  },300);
}

/* Click-to-Copy Phone Numbers */
function initCopyPhone(){
  document.querySelectorAll('[data-phone1],[data-phone2]').forEach(el=>{
    if(el.tagName === 'A') return; // Links already have href
    el.style.cursor = 'pointer';
    el.title = 'کلیک برای کپی';
    el.addEventListener('click', async ()=>{
      const text = el.textContent.trim();
      try{
        await navigator.clipboard.writeText(text);
        showToast(`کپی شد: ${text}`);
      }catch(e){
        // Fallback for older browsers
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        showToast(`کپی شد: ${text}`);
      }
    });
  });
}

/* Scroll to Top Button */
function initScrollToTop(){
  const btn = document.createElement('button');
  btn.className = 'scroll-to-top';
  btn.setAttribute('aria-label', 'بالای صفحه');
  btn.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 15l-6-6-6 6"/></svg>';
  document.body.appendChild(btn);

  const toggleBtn = () => {
    if(window.scrollY > 300) btn.classList.add('visible');
    else btn.classList.remove('visible');
  };

  window.addEventListener('scroll', toggleBtn, {passive: true});
  toggleBtn();

  btn.addEventListener('click', () => {
    window.scrollTo({top: 0, behavior: 'smooth'});
  });
}

/* Toast Notification Helper */
function showToast(message){
  const existing = document.querySelector('.toast');
  if(existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  document.body.appendChild(toast);

  requestAnimationFrame(() => toast.classList.add('visible'));

  setTimeout(() => {
    toast.classList.remove('visible');
    setTimeout(() => toast.remove(), 300);
  }, 2000);
}

/* Scroll Reveal Animations */
function initScrollReveal(){
  const prefersReduced=window.matchMedia('(prefers-reduced-motion:reduce)').matches;
  if(prefersReduced){
    // Show all immediately if reduced motion
    document.querySelectorAll('.reveal,.reveal-fade,.reveal-slide-right,.reveal-scale').forEach(el=>el.classList.add('visible'));
    return;
  }
  const observer=new IntersectionObserver((entries,obs)=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){
        entry.target.classList.add('visible');
        obs.unobserve(entry.target);
      }
    });
  },{threshold:0.1,rootMargin:'0px 0px -50px 0px'});
  document.querySelectorAll('.reveal,.reveal-fade,.reveal-slide-right,.reveal-scale').forEach(el=>observer.observe(el));
}

if(document.readyState === 'loading'){
  document.addEventListener('DOMContentLoaded', init);
}else{
  init();
}

// Register Service Worker
if('serviceWorker' in navigator){
  navigator.serviceWorker.register('./sw.js', {scope: './'})
    .then(reg => console.log('SW registered:', reg.scope))
    .catch(err => console.log('SW registration failed:', err));
}
})();