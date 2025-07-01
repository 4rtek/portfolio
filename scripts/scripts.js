window.addEventListener("DOMContentLoaded", () => {
  fetch("template/nav.html")
    .then(res => res.text())
    .then(data => {
      const placeholder = document.getElementById("nav-placeholder");
      placeholder.innerHTML = data;

      const burger = document.getElementById("burger-btn");
      const svgIcon = burger.querySelector(".ham");
      const mobileMenu = document.getElementById("mobile-menu");

      if (burger && svgIcon && mobileMenu) {
        burger.addEventListener("click", () => {
          svgIcon.classList.toggle("active");
          mobileMenu.classList.toggle("open");
        });
      }
    });
});