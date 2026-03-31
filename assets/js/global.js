document.body.classList.add("js-ready");

const menuToggle = document.querySelector(".menu-toggle");
const nav = document.querySelector(".nav");
const navLinks = document.querySelectorAll(".nav-list a");

if (menuToggle && nav) {
  menuToggle.addEventListener("click", () => {
    const isOpen = menuToggle.classList.toggle("active");
    nav.classList.toggle("active", isOpen);
    menuToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      if (window.innerWidth <= 980) {
        menuToggle.classList.remove("active");
        nav.classList.remove("active");
        menuToggle.setAttribute("aria-expanded", "false");
      }
    });
  });

  document.addEventListener("click", (event) => {
    if (!nav.contains(event.target) && !menuToggle.contains(event.target)) {
      menuToggle.classList.remove("active");
      nav.classList.remove("active");
      menuToggle.setAttribute("aria-expanded", "false");
    }
  });
}

const siteHeader = document.getElementById("siteHeader");
if (siteHeader) {
  const onScroll = () => {
    siteHeader.classList.toggle("header-scrolled", window.scrollY > 14);
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("load", onScroll);
}

const revealElements = document.querySelectorAll(".reveal");
const revealOnScroll = () => {
  const windowHeight = window.innerHeight;
  revealElements.forEach((el) => {
    const rect = el.getBoundingClientRect();
    if (rect.top < windowHeight - 100 && rect.bottom > 30) el.classList.add("visible");
  });
};

window.addEventListener("scroll", revealOnScroll, { passive: true });
window.addEventListener("load", revealOnScroll);
window.addEventListener("resize", revealOnScroll);
