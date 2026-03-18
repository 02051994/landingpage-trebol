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

  const progress = 1 - Math.min(distance / maxDistance, 1);
  const sideInset = 35 - (progress * 35);

  cintaNosotrosImage.style.clipPath = `inset(0 ${sideInset}% 0 ${sideInset}%)`;
}

window.addEventListener("scroll", updateCintaNosotrosReveal);
window.addEventListener("load", updateCintaNosotrosReveal);
window.addEventListener("resize", updateCintaNosotrosReveal);

/* =========================
   DOM READY
========================= */
document.addEventListener("DOMContentLoaded", () => {
  /* =========================================================
     HERO DINAMICO
  ========================================================= */
  const heroBlock = document.querySelector(".animate-hero-on-view");
  const heroTitle = document.getElementById("heroTitle");
  const heroText = document.getElementById("heroText");
  const heroActions = document.getElementById("heroActions");

  let heroOriginalText = "";
  let heroTimers = [];
  let heroLettersBuilt = false;

  function clearHeroTimers() {
    heroTimers.forEach((timer) => clearTimeout(timer));
    heroTimers = [];
  }

  function buildHeroLetters() {
    if (!heroTitle) return;

    if (!heroOriginalText) {
      heroOriginalText = heroTitle.textContent.trim();
    }

    heroTitle.innerHTML = "";

    const directions = ["from-bottom", "from-left", "from-right"];
    const words = heroOriginalText.split(" ");

    words.forEach((word, wordIndex) => {
      const wordSpan = document.createElement("span");
      wordSpan.classList.add("word");

      [...word].forEach((char, charIndex) => {
        const letterSpan = document.createElement("span");
        const direction = directions[(wordIndex + charIndex) % directions.length];

        letterSpan.classList.add("letter", direction);
        letterSpan.textContent = char;

        wordSpan.appendChild(letterSpan);
      });

      heroTitle.appendChild(wordSpan);

      if (wordIndex < words.length - 1) {
        const spacer = document.createElement("span");
        spacer.classList.add("word-space");
        spacer.innerHTML = "&nbsp;";
        heroTitle.appendChild(spacer);
      }
    });

    heroLettersBuilt = true;
  }

  function resetHeroAnimation() {
    if (!heroBlock || !heroTitle || !heroText || !heroActions) return;

    clearHeroTimers();

    heroLettersBuilt = false;
    buildHeroLetters();

    heroText.classList.remove("show");
    heroActions.classList.remove("show");

    const letters = heroTitle.querySelectorAll(".letter");
    letters.forEach((letter) => {
      letter.classList.remove("show");
    });

    const buttons = heroActions.querySelectorAll(".btn");
    buttons.forEach((btn) => {
      btn.style.animation = "none";
      btn.offsetHeight;
      btn.style.animation = "";
    });
  }

  function playHeroAnimation() {
    if (!heroBlock || !heroTitle || !heroText || !heroActions) return;

    if (!heroLettersBuilt) {
      buildHeroLetters();
    }

    const letters = heroTitle.querySelectorAll(".letter");
    const letterDelay = 34;

    letters.forEach((letter, index) => {
      const timer = setTimeout(() => {
        letter.classList.add("show");
      }, index * letterDelay);

      heroTimers.push(timer);
    });

    const titleAnimationTime = letters.length * letterDelay + 500;

    const textTimer = setTimeout(() => {
      heroText.classList.add("show");
    }, titleAnimationTime);

    const actionsTimer = setTimeout(() => {
      heroActions.classList.add("show");
    }, titleAnimationTime + 450);

    heroTimers.push(textTimer, actionsTimer);
  }

  if (heroBlock && heroTitle && heroText && heroActions) {
    resetHeroAnimation();
  }

  /* =========================================================
     CAMPAÑA
  ========================================================= */
  const band = document.getElementById("campaignBand");
  const intro = document.getElementById("campaignIntro");
  const stats = document.getElementById("campaignStats");

  let campaignTimers = [];
  let campaignRafIds = [];

  function clearCampaignTimers() {
    campaignTimers.forEach((timer) => clearTimeout(timer));
    campaignTimers = [];
  }

  function clearCampaignRafs() {
    campaignRafIds.forEach((id) => cancelAnimationFrame(id));
    campaignRafIds = [];
  }

  function resetCampaignSequence() {
    if (!band || !intro || !stats) return;

    clearCampaignTimers();
    clearCampaignRafs();

    intro.classList.remove("show", "hide");
    stats.classList.remove("show");

    const values = stats.querySelectorAll(".campaign-value");
    values.forEach((valueEl) => {
      valueEl.textContent = "0";
    });

    const statCards = stats.querySelectorAll(".campaign-stat");
    statCards.forEach((card) => card.classList.remove("burst"));
  }

  function animateCounter(element, target, duration = 1400) {
    const start = 0;
    const startTime = performance.now();

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      const easeOutCubic = 1 - Math.pow(1 - progress, 3);
      const value = Math.floor(start + (target - start) * easeOutCubic);

      element.textContent = value.toLocaleString("es-PE");

      if (progress < 1) {
        const rafId = requestAnimationFrame(update);
        campaignRafIds.push(rafId);
      } else {
        element.textContent = target.toLocaleString("es-PE");
        const statCard = element.closest(".campaign-stat");
        if (statCard) {
          statCard.classList.add("burst");
          const burstTimer = setTimeout(() => {
            statCard.classList.remove("burst");
          }, 800);
          campaignTimers.push(burstTimer);
        }
      }
    }

    const rafId = requestAnimationFrame(update);
    campaignRafIds.push(rafId);
  }

  function playCampaignSequence() {
    if (!band || !intro || !stats) return;

    resetCampaignSequence();

    intro.classList.add("show");

    const hideIntroTimer = setTimeout(() => {
      intro.classList.add("hide");
    }, 1800);

    const showStatsTimer = setTimeout(() => {
      stats.classList.add("show");

      const values = stats.querySelectorAll(".campaign-value");

      values.forEach((valueEl, index) => {
        const target = Number(valueEl.dataset.target || 0);

        const counterTimer = setTimeout(() => {
          animateCounter(valueEl, target, 1500);
        }, 250 + index * 180);

        campaignTimers.push(counterTimer);
      });
    }, 2300);

    campaignTimers.push(hideIntroTimer, showStatsTimer);
  }

  /* =========================================================
     MAPAS DE DESTINOS
  ========================================================= */
  const animatedCards = document.querySelectorAll(".world-card.animate-on-view");

  function resetWorldCard(card) {
    card.classList.remove("animate");

    const routeCurves = card.querySelectorAll(".route-path-curve");
    routeCurves.forEach((curve) => {
      curve.style.animation = "none";
      curve.offsetHeight;
      curve.style.animation = "";
    });

    const vehicles = card.querySelectorAll(".route-vehicle");
    vehicles.forEach((vehicle) => {
      vehicle.style.animation = "none";
      vehicle.offsetHeight;
      vehicle.style.animation = "";
    });
  }

  function playWorldCard(card) {
    resetWorldCard(card);
    requestAnimationFrame(() => {
      card.classList.add("animate");
    });
  }

  /* =========================================================
     OBSERVER GLOBAL
  ========================================================= */
  const observedItems = [];

  if (heroBlock) {
    observedItems.push({
      element: heroBlock,
      onEnter: playHeroAnimation,
      onExit: resetHeroAnimation
    });
  }

  if (band && intro && stats) {
    observedItems.push({
      element: band,
      onEnter: playCampaignSequence,
      onExit: resetCampaignSequence
    });
  }

  animatedCards.forEach((card) => {
    observedItems.push({
      element: card,
      onEnter: () => playWorldCard(card),
      onExit: () => resetWorldCard(card)
    });
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const item = observedItems.find((x) => x.element === entry.target);
        if (!item) return;

        if (entry.isIntersecting) {
          item.onEnter();
        } else {
          item.onExit();
        }
      });
    },
    {
      threshold: 0.45
    }
  );

  observedItems.forEach((item) => observer.observe(item.element));
});