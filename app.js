'use strict';
const TELEGRAM_USERNAME='voidx_exee';
const BRAND='VOID COURSE';
const $=id=>document.getElementById(id);
const esc=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const icon=name=>`<svg aria-hidden="true"><use href="#i-${name}"/></svg>`;
const courses=COURSES_DATA.map(c=>({...c,title:c.title.replace(/^\d+\.\s*/,'')}));
const byId=new Map(courses.map(c=>[c.id,c]));
const counts=courses.reduce((all,c)=>{all[c.category]=(all[c.category]||0)+1;return all;},Object.create(null));
const telegram=text=>`https://t.me/${TELEGRAM_USERNAME}${text?'?text='+encodeURIComponent(text):''}`;
const unlockMessage=c=>`Hi, I want to unlock ${c.title} (#${c.id}) from ${BRAND}. Please confirm the price, availability and payment details.`;
function cartMessage(ids=cart){return 'Hi, I am interested in these courses from '+BRAND+':\n\n'+[...ids].map((id,i)=>`${i+1}. ${byId.get(id).title} (#${id})`).join('\n')+'\n\nPlease confirm availability, prices and payment details.';}
let category='All Courses',filtered=[],rendered=0,cart=new Set(),toastTimer,searchTimer;
try{const saved=JSON.parse(localStorage.getItem('void-cart')||'[]');if(Array.isArray(saved))for(const id of saved){if(!byId.has(id)||cart.size>=15)continue;const next=new Set([...cart,id]);if(cartMessage(next).length<=3500)cart=next;}}catch{}

function renderCategories(){$('categories').innerHTML=[['All Courses',courses.length],...Object.entries(counts)].map(([name,count])=>`<button class="category ${category===name?'active':''}" data-category="${esc(name)}" aria-pressed="${category===name}"><span>${esc(name)}</span><span>${count.toLocaleString('en-IN')}</span></button>`).join('');}
function ratingHTML(c){
 const source=typeof COURSE_RATINGS==='object'&&COURSE_RATINGS!==null?COURSE_RATINGS:{};
 const r=source[c.id];
 if(!r||!Number.isFinite(r.score)||r.score<1||r.score>5||!Number.isSafeInteger(r.count)||r.count<1)return '';
 return `<span class="review-badge" aria-label="Rating ${r.score.toFixed(1)} out of 5 from ${r.count} reviews"><span aria-hidden="true">★</span> <strong>${r.score.toFixed(1)}</strong> <span class="review-count">(${r.count.toLocaleString('en-IN')})</span></span>`;
}
function cartButtonHTML(id){return icon('cart')+`<span>${cart.has(id)?'✓ Added':'+ Cart'}</span>`;}
function cardHTML(c){return `<article class="card" data-course="${c.id}"><div class="cover"><img src="${esc(c.image||'logo.jpg')}" alt="${esc(c.title)}" loading="lazy" decoding="async" referrerpolicy="no-referrer"></div><div class="card-body"><div class="card-meta"><span class="tag">${esc(c.category)}</span><span class="course-number">#${c.id}</span></div><h2 title="${esc(c.title)}">${esc(c.title)}</h2>${ratingHTML(c)}<div class="card-actions"><a class="unlock" href="${telegram(unlockMessage(c))}" target="_blank" rel="noopener noreferrer">${icon('unlock')}<span>Unlock Course</span></a><button class="add-cart ${cart.has(c.id)?'selected':''}" data-add="${c.id}" aria-label="${cart.has(c.id)?'Remove':'Add'} ${esc(c.title)} ${cart.has(c.id)?'from':'to'} cart" aria-pressed="${cart.has(c.id)}">${cartButtonHTML(c.id)}</button></div></div></article>`;}
function updateScrollStatus(){const more=rendered<filtered.length;$('shown-count').textContent=more?`${rendered.toLocaleString('en-IN')} of ${filtered.length.toLocaleString('en-IN')} courses · Keep scrolling`:(filtered.length?`You’ve explored all ${filtered.length.toLocaleString('en-IN')} matching courses`:'');$('scroll-spinner').hidden=!more;$('scroll-sentinel').hidden=!more;}
function appendCourses(){if(rendered>=filtered.length)return;const batch=filtered.slice(rendered,rendered+24);$('grid').insertAdjacentHTML('beforeend',batch.map(cardHTML).join(''));rendered+=batch.length;updateScrollStatus();}
function filterCourses(){const query=$('search').value.trim().toLowerCase();const idMatch=query.match(/^#?\s*(\d+)$/);filtered=courses.filter(c=>(category==='All Courses'||c.category===category)&&(idMatch?c.id===Number(idMatch[1]):(c.title+' '+c.category).toLowerCase().includes(query)));const sort=$('sort').value;if(sort==='az')filtered.sort((a,b)=>a.title.localeCompare(b.title));if(sort==='new')filtered.sort((a,b)=>(Date.parse(b.addedAt)||0)-(Date.parse(a.addedAt)||0));$('grid').replaceChildren();rendered=0;appendCourses();updateScrollStatus();$('result-count').textContent=`${filtered.length.toLocaleString('en-IN')} courses ${query?'found':'to explore'}`;$('active-category').innerHTML=esc(category)+' <span>⌄</span>';$('empty').hidden=filtered.length!==0;requestAnimationFrame(checkScroll);}
function checkScroll(){if(rendered<filtered.length&&$('scroll-sentinel').getBoundingClientRect().top<window.innerHeight+850)appendCourses();}
if('IntersectionObserver'in window){const observer=new IntersectionObserver(entries=>{if(entries.some(e=>e.isIntersecting))appendCourses();},{rootMargin:'850px'});observer.observe($('scroll-sentinel'));}else{window.addEventListener('scroll',checkScroll,{passive:true});}
window.addEventListener('resize',checkScroll,{passive:true});
$('grid').addEventListener('error',event=>{const img=event.target;if(img.tagName==='IMG'&&!img.dataset.failed){img.dataset.failed='true';img.src='logo.jpg';img.style.objectFit='contain';}},true);
function notify(message){$('toast').textContent=message;$('toast').classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('toast').classList.remove('show'),2600);}
function updateCartButtons(){document.querySelectorAll('[data-add]').forEach(button=>{const id=Number(button.dataset.add),c=byId.get(id),selected=cart.has(id);button.classList.toggle('selected',selected);button.setAttribute('aria-pressed',String(selected));button.setAttribute('aria-label',`${selected?'Remove':'Add'} ${c.title} ${selected?'from':'to'} cart`);button.innerHTML=cartButtonHTML(id);});}
function persistCart(){try{localStorage.setItem('void-cart',JSON.stringify([...cart]));}catch{}$('cart-count').textContent=cart.size;document.querySelector('.cart-trigger').setAttribute('aria-label',`Open cart, ${cart.size} courses`);$('sticky-cart').hidden=cart.size===0;document.body.classList.toggle('cart-active',cart.size>0);$('sticky-count').textContent=`${cart.size} course${cart.size===1?'':'s'} in cart`;$('sticky-total').textContent='Price confirmed on Telegram';$('sticky-checkout').href=telegram(cartMessage());renderCart();}
function renderCart(){const selected=[...cart].map(id=>byId.get(id));$('cart-items').innerHTML=selected.length?selected.map(c=>`<div class="cart-row"><div><strong>${esc(c.title)}</strong><small>#${c.id}</small></div><button data-remove="${c.id}" aria-label="Remove ${esc(c.title)}">×</button></div>`).join(''):'<p class="cart-note">Your cart is empty. Tap + Cart on a course to start your learning list.</p>';$('cart-total').textContent=selected.length?`${selected.length} course${selected.length===1?'':'s'} · Total confirmed on Telegram`:'';$('checkout').hidden=!selected.length;$('clear-cart').hidden=!selected.length;$('checkout').href=telegram(cartMessage());}

/* cart interactions */
$('grid').addEventListener('click',event=>{const add=event.target.closest('[data-add]');if(!add)return;const id=Number(add.dataset.add);if(cart.has(id)){cart.delete(id);notify('Removed from your cart');}else{const next=new Set([...cart,id]);if(next.size>15||cartMessage(next).length>3500){notify('Please send this enquiry first. Your cart has reached its message limit.');return;}cart=next;notify('Added to your cart ✓');}persistCart();updateCartButtons();});
function openCart(){renderCart();$('cart-dialog').showModal();}
document.querySelector('.cart-trigger').onclick=openCart;
$('view-cart').onclick=openCart;
$('close-cart').onclick=()=>$('cart-dialog').close();
$('cart-items').addEventListener('click',e=>{const button=e.target.closest('[data-remove]');if(button){cart.delete(Number(button.dataset.remove));persistCart();updateCartButtons();}});
$('clear-cart').onclick=()=>{cart.clear();persistCart();updateCartButtons();};

/* categories drawer */
function openCategories(){renderCategories();$('category-dialog').showModal();$('open-categories').setAttribute('aria-expanded','true');}
function closeCategories(){$('category-dialog').close();$('open-categories').setAttribute('aria-expanded','false');}
$('open-categories').onclick=openCategories;$('active-category').onclick=openCategories;$('close-categories').onclick=closeCategories;
$('category-dialog').addEventListener('close',()=>$('open-categories').setAttribute('aria-expanded','false'));
$('categories').addEventListener('click',e=>{const button=e.target.closest('[data-category]');if(button){category=button.dataset.category;filterCourses();closeCategories();window.scrollTo({top:0,behavior:'instant'});notify(category==='All Courses'?'Showing all courses':'Category: '+category);}});
function reset(){category='All Courses';$('search').value='';$('sort').value='default';filterCourses();renderCategories();}
$('reset').onclick=()=>{reset();closeCategories();window.scrollTo({top:0,behavior:'instant'});};
$('clear-search').onclick=reset;

/* search / sort / misc */
$('search').addEventListener('input',()=>{clearTimeout(searchTimer);searchTimer=setTimeout(filterCourses,100);});
$('sort').addEventListener('change',filterCourses);
$('refresh').onclick=()=>window.location.reload();
document.querySelectorAll('.faq-trigger').forEach(button=>button.onclick=()=>$('faq-dialog').showModal());
$('close-faq').onclick=()=>$('faq-dialog').close();
$('collapse-faq').onclick=()=>document.querySelectorAll('#faq-dialog details').forEach(d=>d.open=false);
document.querySelectorAll('dialog').forEach(dialog=>dialog.addEventListener('click',event=>{if(event.target!==dialog)return;const rect=dialog.getBoundingClientRect();if(event.clientX<rect.left||event.clientX>rect.right||event.clientY<rect.top||event.clientY>rect.bottom)dialog.close();}));
document.addEventListener('keydown',event=>{if(event.key==='/'&&!['INPUT','TEXTAREA','SELECT'].includes(document.activeElement.tagName)&&!document.querySelector('dialog[open]')){event.preventDefault();$('search').focus();}});
$('year').textContent=new Date().getFullYear();
renderCategories();filterCourses();persistCart();
setTimeout(()=>{const loader=$('loader');if(!loader)return;loader.style.opacity='0';setTimeout(()=>loader.remove(),320);},500);
