(async()=>{
const $=s=>document.querySelector(s);
const esc=s=>String(s??'').replace(/[&<>\"']/g,m=>({'&':'&','<':'<','>':'>','\"':'\"',"'":'&#039;'}[m]));
const fallback={settings:{siteName:'پلیمر کاوه',phone1:'09133282241',phone2:'09162285494',whatsapp:'09133282241',intro:'پلیمر کاوه با تیم مجرب و متخصص، در زمینه فروش و اجرای تمام loại محصولات پلیمری، ژئوممبران، و سیستم‌های عایق‌کاری فعالیت می‌کند.',metaTitle:'پلیمر کاوه | فروش و نصب محصولات پلیمری',metaDescription:'پلیمر کاوه با سابقه درخشان در فروش و اجرای محصولات پلیمری، ژئوممبران، و عایق‌کاری خدمات می‌دهد.'},projects:[],posts:[]};
let data=fallback; try{const r=await fetch('./data/content.json',{cache:'no-store'}); if(r.ok)data=await r.json()}catch{}
const s=data.settings||fallback.settings;
document.title=s.metaTitle; const md=document.querySelector('meta[name="description"]'); if(md)md.content=s.metaDescription;
const wa=n=>`https://wa.me/98${String(n).replace(/^0/,'').replace(/\\D/g,'')}`;
const set=(sel,val)=>{document.querySelectorAll(sel).forEach(e=>e.innerHTML=val)};
set('[data-site-name]',esc(s.siteName)); set('[data-phone1]',esc(s.phone1)); set('[data-phone2]',esc(s.phone2)); set('[data-intro]',esc(s.intro));
document.querySelectorAll('[data-phone1-link]').forEach(e=>e.href='tel:'+s.phone1); document.querySelectorAll('[data-phone2-link]').forEach(e=>e.href='tel:'+s.phone2); document.querySelectorAll('[data-whatsapp]').forEach(e=>{e.href=wa(s.whatsapp||s.phone1)});
const list=$('[data-projects]'); if(list){list.innerHTML=(data.projects||[]).map(p=>`<article class="card project"><a href="${esc(p.image)}" data-lightbox><img src="${esc(p.image)}" loading="lazy" alt="${esc(p.title)}"></a><div class="project-body"><small>${esc(p.category)}</small><h3>${esc(p.title)}</h3><p>${esc(p.description)}</p></div></article>`).join('')||'<p class="muted">نمونه‌کارها به‌زودی اضافه می‌شوند.</p>'};
document.addEventListener('click',e=>{const a=e.target.closest('[data-lightbox]');if(!a)return;e.preventDefault();const o=document.createElement('div');o.className='lightbox';o.innerHTML=`<button aria-label="بستن">×</button><img src="${a.href}" alt="">`;document.body.appendChild(o);o.onclick=()=>o.remove()});

/* Hamburger Menu Toggle - Fixed */
function initHamburger(){
  const hamburger=$('.hamburger');
  const navMenu=$('#nav-menu');
  if(!hamburger || !navMenu){
    console.warn('Hamburger or navMenu not found');
    return;
  }
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
  
  // Close on link click but allow navigation
  navMenu.querySelectorAll('a').forEach(a=>{
    a.addEventListener('click', ()=> toggleMenu(true));
  });
  
  document.addEventListener('keydown', e=>{
    if(e.key==='Escape' && navMenu.classList.contains('open')) toggleMenu(true);
  });
  
  // Close on resize to desktop
  window.addEventListener('resize', ()=>{
    if(window.innerWidth > 800 && navMenu.classList.contains('open')) toggleMenu(true);
  });
}

// Initialize when DOM ready
if(document.readyState === 'loading'){
  document.addEventListener('DOMContentLoaded', initHamburger);
}else{
  initHamburger();
}
})();