/* =========================
   HERO SLIDER
========================= */
const slides = document.querySelectorAll(".hero-slide");
const dots = document.querySelectorAll(".hero-dot");
const prevBtn = document.querySelector(".hero-prev");
const nextBtn = document.querySelector(".hero-next");

let currentSlide = 0;
let autoPlayInterval;

function showSlide(index) {
  if (!slides.length) return;

  slides.forEach((slide) => slide.classList.remove("active"));
  dots.forEach((dot) => dot.classList.remove("active"));

  slides[index].classList.add("active");
  if (dots[index]) {
    dots[index].classList.add("active");
  }

  currentSlide = index;
}

function nextSlide() {
  if (!slides.length) return;

  let nextIndex = currentSlide + 1;
  if (nextIndex >= slides.length) {
    nextIndex = 0;
  }
  showSlide(nextIndex);
}

function prevSlide() {
  if (!slides.length) return;

  let prevIndex = currentSlide - 1;
  if (prevIndex < 0) {
    prevIndex = slides.length - 1;
  }
  showSlide(prevIndex);
}

function startAutoPlay() {
  if (!slides.length) return;

  autoPlayInterval = setInterval(() => {
    nextSlide();
  }, 5000);
}

function resetAutoPlay() {
  clearInterval(autoPlayInterval);
  startAutoPlay();
}

if (slides.length > 0) {
  showSlide(currentSlide);
  startAutoPlay();

  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      nextSlide();
      resetAutoPlay();
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener("click", () => {
      prevSlide();
      resetAutoPlay();
    });
  }

  dots.forEach((dot, index) => {
    dot.addEventListener("click", () => {
      showSlide(index);
      resetAutoPlay();
    });
  });
}

/* =========================
   ABOUT SLIDER VERTICAL
========================= */
const aboutSlider = document.getElementById("aboutSlider");

if (aboutSlider) {
  const aboutTrack = aboutSlider.querySelector(".about-slider-track");
  const aboutSlides = aboutSlider.querySelectorAll(".about-slide");
  const aboutIndicators = aboutSlider.querySelectorAll(".about-indicator");

  let aboutIndex = 0;
  let aboutInterval;
  let startY = 0;
  let endY = 0;

  function updateAboutSlider() {
  aboutTrack.style.transform = `translateY(-${aboutIndex * 100}%)`;

  aboutIndicators.forEach((dot) => dot.classList.remove("active"));
    if (aboutIndicators[aboutIndex]) {
      aboutIndicators[aboutIndex].classList.add("active");
    }
  } 

  function nextAboutSlide() {
    aboutIndex++;
    if (aboutIndex >= aboutSlides.length) {
      aboutIndex = 0;
    }
    updateAboutSlider();
  }

  function prevAboutSlide() {
    aboutIndex--;
    if (aboutIndex < 0) {
      aboutIndex = aboutSlides.length - 1;
    }
    updateAboutSlider();
  }

  function startAboutAutoplay() {
    aboutInterval = setInterval(() => {
      nextAboutSlide();
    }, 5000);
  }

  function resetAboutAutoplay() {
    clearInterval(aboutInterval);
    startAboutAutoplay();
  }

  aboutSlider.addEventListener("touchstart", (e) => {
    startY = e.touches[0].clientY;
  });

  aboutSlider.addEventListener("touchend", (e) => {
    endY = e.changedTouches[0].clientY;
    const diff = startY - endY;

    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        nextAboutSlide();
      } else {
        prevAboutSlide();
      }
      resetAboutAutoplay();
    }
  });

  updateAboutSlider();
  startAboutAutoplay();
}

/* =========================
   CINTA NOSOTROS APERTURA HORIZONTAL
========================= */
const cintaNosotros = document.getElementById("cintaNosotros");
const cintaNosotrosImage = document.getElementById("cintaNosotrosImage");

function updateCintaNosotrosReveal() {
  if (!cintaNosotros || !cintaNosotrosImage) return;

  const rect = cintaNosotros.getBoundingClientRect();
  const viewportHeight = window.innerHeight;

  const sectionCenter = rect.top + rect.height / 2;
  const viewportCenter = viewportHeight / 2;

  const distance = Math.abs(sectionCenter - viewportCenter);
  const maxDistance = viewportHeight * 0.6;

  let progress = 1 - Math.min(distance / maxDistance, 1);

  /* 
    progress:
    0 = lejos del centro
    1 = perfectamente centrada
  */

  const sideInset = 35 - (progress * 35);
  cintaNosotrosImage.style.clipPath = `inset(0 ${sideInset}% 0 ${sideInset}%)`;
}

window.addEventListener("scroll", updateCintaNosotrosReveal);
window.addEventListener("load", updateCintaNosotrosReveal);
window.addEventListener("resize", updateCintaNosotrosReveal);