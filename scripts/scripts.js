//NAVIGATION
fetch('./template/nav.html')
    .then(response => response.text())
    .then(data => {
      document.getElementById('nav').innerHTML = data;
});
function toggleMenu() {
    document.getElementById('navContainer').classList.toggle('open');
}
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  if (window.scrollY > 0) {
    nav.classList.add('scrolled');
  } else {
    nav.classList.remove('scrolled');
  }
});

//ANIMATED LETTERS
window.addEventListener("DOMContentLoaded", () => {
  let oldX = 0, oldY = 0, deltaX = 5, deltaY = 5

  const root = document.querySelector('.tp')

  // Beide Textbereiche automatisch vorbereiten
  document.querySelectorAll('.letters, .letters-2').forEach(container => {
    const text = container.textContent
    container.textContent = ''

    for (let char of text) {
      const span = document.createElement('span')
      span.classList.add('letter')
      span.textContent = char
      container.appendChild(span)
    }
  })

  // Mausbewegung erfassen
  root.addEventListener("mousemove", (e) => {
    deltaX = e.clientX - oldX
    deltaY = e.clientY - oldY
    oldX = e.clientX
    oldY = e.clientY
  })

  // Animation für jeden Buchstaben
  document.querySelectorAll('.letter').forEach(letter => {
    letter.addEventListener('mouseenter', () => {
      const moveX = deltaX === 0 ? (Math.random() - 0.5) * 10 : deltaX * 1.2
      const moveY = deltaY === 0 ? (Math.random() - 0.5) * 10 : deltaY * 1.2
      const rotate = (Math.random() - 0.5) * 20

      letter.style.transform = `translate(${moveX}px, ${moveY}px) rotate(${rotate}deg)`

      setTimeout(() => {
        letter.style.transform = 'translate(0px, 0px) rotate(0deg)'
      }, 400)
    })
  })
})

document.addEventListener("DOMContentLoaded", () => {
  const links = document.querySelectorAll('#nav .menu ul li a');
  links.forEach(link => {
    // Force Repaint Hack
    link.style.display = 'none';
    void link.offsetHeight; // Trigger reflow
    link.style.display = '';
  });
});

//CURSOR FOLLOWS LINK
(() => {
  const CONFIG = {
    minWidth: 1024,
    size: 300,                 // Normalgröße in px
    hoverSize: 0,            // Zielgröße beim Hover in px
    targetSelector: '.work-link',
    moveSmooth: 0.125,         // Interpolationsfaktor für Position
    sizeSmooth: 0.06         // Interpolationsfaktor für Scale
  };

  let enabled = false;
  let cursorEl, styleEl, rafId = null;
  let mouseX = 0, mouseY = 0;
  let cursorX = 0, cursorY = 0;      
  let linkData = [];
  let needsRefresh = true;

  let currentScale = 1;
  let targetScale  = 1;
  const HOVER_SCALE = CONFIG.hoverSize / CONFIG.size;

  const mql = window.matchMedia(`(min-width: ${CONFIG.minWidth}px)`);

  function injectCSS(){
    styleEl = document.createElement('style');
    styleEl.textContent = `
@media (min-width: ${CONFIG.minWidth}px){
  html, body { cursor: none !important; }
  .ai-cursor{
    position: fixed; left: 0; top: 0;
    width: ${CONFIG.size}px; height: ${CONFIG.size}px;
    pointer-events: none; z-index: 2147483647;
    transform: translate(-50%,-50%) rotate(var(--angle,0deg)) scale(var(--scale,1));
    transform-origin: 50% 50%; will-change: transform;
  }
  .ai-cursor img{ width: 100%; height: 100%; display: block; }
}`;
    document.head.appendChild(styleEl);
  }

  function makeCursor(){
    cursorEl = document.createElement('div');
    cursorEl.className = 'ai-cursor';
    cursorEl.style.setProperty('--angle','0deg');
    cursorEl.style.setProperty('--scale','1');
    cursorEl.innerHTML = `<img src="./images/icons/cursor.svg" alt="cursor arrow">`;
    document.body.appendChild(cursorEl);
    cursorX = window.innerWidth / 2;
    cursorY = window.innerHeight / 2;
  }

  function bindHoverHandlers(el){
    if (el.dataset.aiCursorBound === '1') return;
    el.addEventListener('mouseenter', () => { targetScale = HOVER_SCALE; }, { passive: true });
    el.addEventListener('mouseleave', () => { targetScale = 1; }, { passive: true });
    el.dataset.aiCursorBound = '1';
  }

  function refreshLinks(){
    const vw = window.innerWidth, vh = window.innerHeight;
    const els = Array.from(document.querySelectorAll(CONFIG.targetSelector));
    linkData = [];
    for (const el of els){
      const r = el.getBoundingClientRect();
      if (r.width <= 0 || r.height <= 0) continue;
      if (r.right < 0 || r.left > vw || r.bottom < 0 || r.top > vh) continue;
      linkData.push({ el, cx: r.left + r.width/2, cy: r.top + r.height/2 });
      bindHoverHandlers(el);
    }
    needsRefresh = false;
  }

  function onMove(e){ mouseX = e.clientX; mouseY = e.clientY; }
  function onScrollOrResize(){ needsRefresh = true; }

  function loop(){
    // Position
    cursorX += (mouseX - cursorX) * CONFIG.moveSmooth;
    cursorY += (mouseY - cursorY) * CONFIG.moveSmooth;

    // Scale
    currentScale += (targetScale - currentScale) * CONFIG.sizeSmooth;

    if (cursorEl){
      cursorEl.style.left = cursorX + 'px';
      cursorEl.style.top  = cursorY + 'px';
      cursorEl.style.setProperty('--scale', currentScale.toFixed(4));
    }
    if (needsRefresh) refreshLinks();

    if (linkData.length){
      let nearest = null, best = Infinity;
      for (const d of linkData){
        const dx = d.cx - cursorX, dy = d.cy - cursorY;
        const dist2 = dx*dx + dy*dy;
        if (dist2 < best){ best = dist2; nearest = d; }
      }
      if (nearest){
        const angleDeg = Math.atan2(nearest.cy - cursorY, nearest.cx - cursorX) * 180 / Math.PI;
        cursorEl && cursorEl.style.setProperty('--angle', angleDeg.toFixed(2) + 'deg');
      }
    }
    rafId = window.requestAnimationFrame(loop);
  }

  let mo;
  function enable(){
    if (enabled) return;
    enabled = true;
    injectCSS();
    makeCursor();
    refreshLinks();
    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('scroll', onScrollOrResize, { passive: true });
    window.addEventListener('resize', onScrollOrResize);
    mo = new MutationObserver(() => { needsRefresh = true; });
    mo.observe(document.documentElement, { childList: true, subtree: true, attributes: true, attributeFilter: ['class','style'] });
    rafId = window.requestAnimationFrame(loop);
  }

  function disable(){
    if (!enabled) return;
    enabled = false;
    if (rafId) cancelAnimationFrame(rafId), rafId = null;
    window.removeEventListener('mousemove', onMove);
    window.removeEventListener('scroll', onScrollOrResize);
    window.removeEventListener('resize', onScrollOrResize);
    if (mo) mo.disconnect(), mo = null;
    if (cursorEl?.parentNode) cursorEl.parentNode.removeChild(cursorEl);
    if (styleEl?.parentNode) styleEl.parentNode.removeChild(styleEl);
    cursorEl = null; styleEl = null;
  }

  function handleMQL(ev){ ev.matches ? enable() : disable(); }
  if ('addEventListener' in mql) mql.addEventListener('change', handleMQL);
  else if ('addListener' in mql) mql.addListener(handleMQL);

  if (mql.matches) enable();
})();






//CONSOLE TEST
window.addEventListener("DOMContentLoaded", () => {
  console.log("Script läuft ✅")
  // restlicher Code...
})



