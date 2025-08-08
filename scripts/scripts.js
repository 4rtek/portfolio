//Navi Template
fetch('./template/nav.html')
    .then(response => response.text())
    .then(data => {
      document.getElementById('nav').innerHTML = data;
});
//Burgermenu
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

window.addEventListener("DOMContentLoaded", () => {
  console.log("Script läuft ✅")
  // restlicher Code...
})



