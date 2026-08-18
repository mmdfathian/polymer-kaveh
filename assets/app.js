(async()=>{
const $=s=>document.querySelector(s);
const esc=s=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]));
const fallback={settings:{siteName:'ژئوممبران اصفهان',phone1:'09133282241',phone2:'09162285494',whatsapp:'09133282241',intro:'ژئوممبران اصفهان با ۱۵ سال سابقه در فروش و اجرای ورق ژئوممبران فعالیت می‌کند.',metaTitle:'ژئوممبران در اصفهان | فروش و نصب ورق ژئوممبران',metaDescription:'فروش و نصب ورق ژئوممبران در اصفهان'},projects:[],posts:[]};
let data=fallback; try{const r=await fetch('./data/content.json',{cache:'no-store'}); if(r.ok)data=await r.json()}catch{}
const s=data.settings||fallback.settings;
document.title=s.metaTitle; const md=document.querySelector('meta[name="description"]'); if(md)md.content=s.metaDescription;
const wa=n=>`https://wa.me/98${String(n).replace(/^0/,'').replace(/\D/g,'')}`;
const set=(sel,val)=>{document.querySelectorAll(sel).forEach(e=>e.innerHTML=val)};
set('[data-site-name]',esc(s.siteName)); set('[data-phone1]',esc(s.phone1)); set('[data-phone2]',esc(s.phone2)); set('[data-intro]',esc(s.intro));
document.querySelectorAll('[data-phone1-link]').forEach(e=>e.href='tel:'+s.phone1); document.querySelectorAll('[data-phone2-link]').forEach(e=>e.href='tel:'+s.phone2); document.querySelectorAll('[data-whatsapp]').forEach(e=>{e.href=wa(s.whatsapp||s.phone1)});
const list=$('[data-projects]'); if(list){list.innerHTML=(data.projects||[]).map(p=>`<article class="card project"><a href="${esc(p.image)}" data-lightbox><img src="${esc(p.image)}" loading="lazy" alt="${esc(p.title)}"></a><div class="project-body"><small>${esc(p.category)}</small><h3>${esc(p.title)}</h3><p>${esc(p.description)}</p></div></article>`).join('')||'<p class="muted">نمونه‌کارها به‌زودی اضافه می‌شوند.</p>'}
document.addEventListener('click',e=>{const a=e.target.closest('[data-lightbox]');if(!a)return;e.preventDefault();const o=document.createElement('div');o.className='lightbox';o.innerHTML=`<button aria-label="بستن">×</button><img src="${a.href}" alt="">`;document.body.appendChild(o);o.onclick=()=>o.remove()});
})();
