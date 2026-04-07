/* =========================
   ESTADO JS
========================= */
document.body.classList.add("js-ready");

/* =========================
   HELPERS
========================= */
function debounce(fn, delay = 120) {
  let timer = null;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

/* =========================
   MENÚ BURGER
========================= */
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

  window.addEventListener("resize", () => {
    if (window.innerWidth > 980) {
      menuToggle.classList.remove("active");
      nav.classList.remove("active");
      menuToggle.setAttribute("aria-expanded", "false");
    }
  });

  document.addEventListener("click", (event) => {
    const clickedInsideNav = nav.contains(event.target);
    const clickedToggle = menuToggle.contains(event.target);

    if (!clickedInsideNav && !clickedToggle && nav.classList.contains("active")) {
      menuToggle.classList.remove("active");
      nav.classList.remove("active");
      menuToggle.setAttribute("aria-expanded", "false");
    }
  });
}

/* =========================
   HEADER SCROLL
========================= */
const siteHeader = document.getElementById("siteHeader");

if (siteHeader) {
  let lastScrollY = window.scrollY;
  let headerStopTimer = null;
  let ticking = false;

  const showHeader = () => {
    siteHeader.classList.remove("header-hidden");
  };

  const hideHeader = () => {
    if (window.scrollY > 120) {
      siteHeader.classList.add("header-hidden");
    }
  };

  const updateHeaderState = () => {
    const currentScrollY = window.scrollY;

    siteHeader.classList.toggle("header-scrolled", currentScrollY > 14);

    if (currentScrollY <= 6) {
      showHeader();
      lastScrollY = currentScrollY;
      return;
    }

    if (currentScrollY > lastScrollY + 10) {
      hideHeader();
    } else if (currentScrollY < lastScrollY - 8) {
      showHeader();
    }

    clearTimeout(headerStopTimer);
    headerStopTimer = setTimeout(showHeader, 220);

    lastScrollY = currentScrollY;
  };

  const onScroll = () => {
    if (ticking) return;

    ticking = true;
    requestAnimationFrame(() => {
      updateHeaderState();
      ticking = false;
    });
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("load", updateHeaderState);
}

/* =========================
   ANIMACIÓN SCROLL
========================= */
const revealElements = document.querySelectorAll(".reveal");

revealElements.forEach((element, index) => {
  const delay = (index % 6) * 55;
  element.style.setProperty("--reveal-delay", `${delay}ms`);
});

function revealOnScroll() {
  const windowHeight = window.innerHeight;
  const visiblePoint = 110;

  revealElements.forEach((el) => {
    const rect = el.getBoundingClientRect();

    if (rect.top < windowHeight - visiblePoint && rect.bottom > 40) {
      el.classList.add("visible");
    }
  });
}

window.addEventListener("scroll", revealOnScroll, { passive: true });
window.addEventListener("load", revealOnScroll);
window.addEventListener("resize", revealOnScroll);

/* =========================
   PARALLAX SUAVE PARA IMÁGENES
========================= */
const parallaxItems = document.querySelectorAll(".parallax-soft");

function updateSoftParallax() {
  if (!parallaxItems.length || window.innerWidth <= 768) return;

  const viewportHeight = window.innerHeight;

  parallaxItems.forEach((item) => {
    const rect = item.getBoundingClientRect();

    if (rect.bottom < 0 || rect.top > viewportHeight) return;

    const center = rect.top + rect.height / 2;
    const viewportCenter = viewportHeight / 2;
    const offset = (center - viewportCenter) * -0.03;

    item.style.transform = `translate3d(0, ${offset}px, 0) scale(1.04)`;
  });
}

const updateSoftParallaxDebounced = debounce(updateSoftParallax, 10);

window.addEventListener("scroll", updateSoftParallaxDebounced, { passive: true });
window.addEventListener("load", updateSoftParallaxDebounced);
window.addEventListener("resize", () => {
  if (window.innerWidth <= 768) {
    parallaxItems.forEach((item) => {
      item.style.transform = "";
    });
  } else {
    updateSoftParallaxDebounced();
  }
});

/* =========================
   FLOAT EFECTO PREMIUM
========================= */
const floatCards = document.querySelectorAll(".image-lift");

function updateFloatingCards() {
  if (!floatCards.length || window.innerWidth <= 768) return;

  floatCards.forEach((card) => {
    const rect = card.getBoundingClientRect();
    const viewportCenter = window.innerHeight / 2;
    const cardCenter = rect.top + rect.height / 2;
    const distance = viewportCenter - cardCenter;
    const strength = Number(card.dataset.floatStrength || 10);
    const movement = Math.max(Math.min(distance * 0.02, strength), -strength);

    card.style.transform = `translate3d(0, ${movement}px, 0)`;
  });
}

const updateFloatingCardsDebounced = debounce(updateFloatingCards, 10);

window.addEventListener("scroll", updateFloatingCardsDebounced, { passive: true });
window.addEventListener("load", updateFloatingCardsDebounced);
window.addEventListener("resize", () => {
  if (window.innerWidth <= 768) {
    floatCards.forEach((card) => {
      card.style.transform = "";
    });
  } else {
    updateFloatingCardsDebounced();
  }
});

/* =========================
   MODAL PARA PRODUCTOS
========================= */
const productCards = document.querySelectorAll(".product-card");
const productModal = document.getElementById("productModal");
const productModalOverlay = document.getElementById("productModalOverlay");
const productModalClose = document.getElementById("productModalClose");
const productModalImage = document.getElementById("productModalImage");
const productModalTitle = document.getElementById("productModalTitle");
const productModalTag = document.getElementById("productModalTag");
const productModalDescription = document.getElementById("productModalDescription");
const productPrev = document.getElementById("productPrev");
const productNext = document.getElementById("productNext");
const productModalThumbs = document.getElementById("productModalThumbs");
const productModalImageWrap = document.getElementById("productModalImageWrap");

let currentImages = [];
let currentImageIndex = 0;
let touchStartX = 0;
let touchEndX = 0;

function renderProductThumbs() {
  if (!productModalThumbs) return;

  productModalThumbs.innerHTML = "";

  currentImages.forEach((src, index) => {
    const thumb = document.createElement("button");
    thumb.className = "product-modal-thumb";
    thumb.type = "button";
    thumb.setAttribute("aria-label", `Ver imagen ${index + 1}`);

    if (index === currentImageIndex) {
      thumb.classList.add("active");
    }

    thumb.innerHTML = `<img src="${src}" alt="Miniatura ${index + 1}">`;

    thumb.addEventListener("click", () => {
      currentImageIndex = index;
      updateProductModalImage();
    });

    productModalThumbs.appendChild(thumb);
  });
}

function updateProductModalImage() {
  if (!currentImages.length || !productModalImage) return;

  productModalImage.src = currentImages[currentImageIndex];
  renderProductThumbs();
}

function openProductModal(card) {
  if (!productModal) return;

  const title = card.dataset.title || "";
  const description = card.dataset.description || "";
  const images = card.dataset.images || "";

  currentImages = images
    .split(",")
    .map((img) => img.trim())
    .filter(Boolean);

  currentImageIndex = 0;

  if (productModalTag) productModalTag.textContent = title;
  if (productModalTitle) productModalTitle.textContent = title;
  if (productModalDescription) productModalDescription.textContent = description;

  updateProductModalImage();

  productModal.classList.add("active");
  productModal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function closeProductModal() {
  if (!productModal) return;

  productModal.classList.remove("active");
  productModal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

function nextProductImage() {
  if (!currentImages.length) return;
  currentImageIndex = (currentImageIndex + 1) % currentImages.length;
  updateProductModalImage();
}

function prevProductImage() {
  if (!currentImages.length) return;
  currentImageIndex = (currentImageIndex - 1 + currentImages.length) % currentImages.length;
  updateProductModalImage();
}

productCards.forEach((card) => {
  card.addEventListener("click", () => {
    openProductModal(card);
  });
});

if (productModalOverlay) {
  productModalOverlay.addEventListener("click", closeProductModal);
}

if (productModalClose) {
  productModalClose.addEventListener("click", closeProductModal);
}

if (productNext) {
  productNext.addEventListener("click", nextProductImage);
}

if (productPrev) {
  productPrev.addEventListener("click", prevProductImage);
}

if (productModalImageWrap) {
  productModalImageWrap.addEventListener("touchstart", (e) => {
    touchStartX = e.changedTouches[0].clientX;
  }, { passive: true });

  productModalImageWrap.addEventListener("touchend", (e) => {
    touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX - touchEndX;

    if (Math.abs(diff) > 50) {
      if (diff > 0) nextProductImage();
      else prevProductImage();
    }
  }, { passive: true });
}

document.addEventListener("keydown", (e) => {
  if (!productModal || !productModal.classList.contains("active")) return;

  if (e.key === "Escape") closeProductModal();
  if (e.key === "ArrowRight") nextProductImage();
  if (e.key === "ArrowLeft") prevProductImage();
});
