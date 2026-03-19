document.addEventListener("DOMContentLoaded", () => {
  /* =========================
     HERO SLIDER PREMIUM
  ========================= */
  const heroSlider = document.getElementById("heroSlider");
  const slides = document.querySelectorAll(".hero-slide");
  const dots = document.querySelectorAll(".hero-dot");
  const prevBtn = document.querySelector(".hero-prev");
  const nextBtn = document.querySelector(".hero-next");
  const heroBlock = document.querySelector(".animate-hero-on-view");
  const heroTag = document.getElementById("heroTag");
  const heroTitle = document.getElementById("heroTitle");
  const heroText = document.getElementById("heroText");
  const heroActions = document.getElementById("heroActions");
  const heroCounter = document.getElementById("heroCounter");

  let currentSlide = 0;
  let autoPlayInterval = null;
  let heroTimers = [];
  let heroLettersBuilt = false;
  let heroOriginalText = "";

  function clearHeroTimers() {
    heroTimers.forEach((timer) => clearTimeout(timer));
    heroTimers = [];
  }

  function updateHeroContent(index) {
    const slide = slides[index];
    if (!slide || !heroTitle || !heroText || !heroTag || !heroCounter) return;

    const tag = slide.dataset.tag || "Bienvenidos";
    const title = slide.dataset.title || "";
    const text = slide.dataset.text || "";

    heroTag.textContent = tag;
    heroTitle.textContent = title;
    heroText.textContent = text;
    heroCounter.textContent = `${String(index + 1).padStart(2, "0")} / ${String(slides.length).padStart(2, "0")}`;

    heroOriginalText = title;
    heroLettersBuilt = false;
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
    if (!heroTitle || !heroText || !heroActions) return;

    clearHeroTimers();

    if (!heroLettersBuilt) {
      buildHeroLetters();
    }

    heroText.classList.remove("show");
    heroActions.classList.remove("show");

    const letters = heroTitle.querySelectorAll(".letter");
    letters.forEach((letter) => letter.classList.remove("show"));

    const buttons = heroActions.querySelectorAll(".btn");
    buttons.forEach((btn) => {
      btn.style.animation = "none";
      btn.offsetHeight;
      btn.style.animation = "";
    });
  }

  function playHeroAnimation() {
    if (!heroTitle || !heroText || !heroActions) return;

    if (!heroLettersBuilt) {
      buildHeroLetters();
    }

    const letters = heroTitle.querySelectorAll(".letter");
    const letterDelay = 28;

    letters.forEach((letter, index) => {
      const timer = setTimeout(() => {
        letter.classList.add("show");
      }, index * letterDelay);

      heroTimers.push(timer);
    });

    const titleAnimationTime = letters.length * letterDelay + 420;

    const textTimer = setTimeout(() => {
      heroText.classList.add("show");
    }, titleAnimationTime);

    const actionsTimer = setTimeout(() => {
      heroActions.classList.add("show");
    }, titleAnimationTime + 260);

    heroTimers.push(textTimer, actionsTimer);
  }

  function resetDotProgress() {
    dots.forEach((dot) => {
      const progress = dot.querySelector(".hero-dot-progress");
      if (!progress) return;

      progress.style.animation = "none";
      progress.offsetHeight;
      progress.style.animation = "";
    });
  }

  function showSlide(index, animateText = true) {
    if (!slides.length) return;

    slides.forEach((slide) => slide.classList.remove("active"));
    dots.forEach((dot) => dot.classList.remove("active"));

    slides[index].classList.add("active");
    if (dots[index]) dots[index].classList.add("active");

    updateHeroContent(index);
    resetHeroAnimation();

    if (animateText) {
      playHeroAnimation();
    }

    resetDotProgress();
    currentSlide = index;
  }

  function nextSlide() {
    if (!slides.length) return;
    let nextIndex = currentSlide + 1;
    if (nextIndex >= slides.length) nextIndex = 0;
    showSlide(nextIndex, true);
  }

  function prevSlide() {
    if (!slides.length) return;
    let prevIndex = currentSlide - 1;
    if (prevIndex < 0) prevIndex = slides.length - 1;
    showSlide(prevIndex, true);
  }

  function startAutoPlay() {
    if (!slides.length) return;

    clearInterval(autoPlayInterval);
    autoPlayInterval = setInterval(() => {
      nextSlide();
    }, 5000);
  }

  function stopAutoPlay() {
    clearInterval(autoPlayInterval);
  }

  function resetAutoPlay() {
    stopAutoPlay();
    startAutoPlay();
  }

  if (slides.length > 0) {
    showSlide(currentSlide, false);

    if (heroBlock) {
      resetHeroAnimation();
      playHeroAnimation();
    }

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
        showSlide(index, true);
        resetAutoPlay();
      });
    });

    if (heroSlider) {
      heroSlider.addEventListener("mouseenter", stopAutoPlay);
      heroSlider.addEventListener("mouseleave", startAutoPlay);
    }
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
      if (aboutIndex >= aboutSlides.length) aboutIndex = 0;
      updateAboutSlider();
    }

    function prevAboutSlide() {
      aboutIndex--;
      if (aboutIndex < 0) aboutIndex = aboutSlides.length - 1;
      updateAboutSlider();
    }

    function startAboutAutoplay() {
      clearInterval(aboutInterval);
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

    aboutSlider.addEventListener("mouseenter", () => clearInterval(aboutInterval));
    aboutSlider.addEventListener("mouseleave", startAboutAutoplay);

    updateAboutSlider();
    startAboutAutoplay();
  }

  /* =========================
     CINTA NOSOTROS
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
    const sideInset = 35 - progress * 35;

    cintaNosotrosImage.style.clipPath = `inset(0 ${sideInset}% 0 ${sideInset}%)`;
  }

  window.addEventListener("scroll", updateCintaNosotrosReveal, { passive: true });
  window.addEventListener("load", updateCintaNosotrosReveal);
  window.addEventListener("resize", updateCintaNosotrosReveal);

  /* =========================
     CAMPAIGN BAND
  ========================= */
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
      const value = start + (target - start) * easeOutCubic;

      element.textContent = value.toLocaleString("es-PE", {
        minimumFractionDigits: target % 1 !== 0 ? 2 : 0,
        maximumFractionDigits: target % 1 !== 0 ? 2 : 0
      });

      if (progress < 1) {
        const rafId = requestAnimationFrame(update);
        campaignRafIds.push(rafId);
      } else {
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

  /* =========================
     DESTINOS PREMIUM
  ========================= */
  const destinationsSection = document.getElementById("exportDestinationsSection");
  const destinationsIntro = document.getElementById("destIntro");
  const destinationCards = document.querySelectorAll(".export-destination-card");

  let destinationTimers = [];

  function clearDestinationTimers() {
    destinationTimers.forEach((timer) => clearTimeout(timer));
    destinationTimers = [];
  }

  function resetDestinationsSequence() {
    if (!destinationsIntro) return;

    clearDestinationTimers();

    destinationsIntro.classList.remove("show", "hide");
    destinationCards.forEach((card) => card.classList.remove("show"));
  }

  function playDestinationsSequence() {
    if (!destinationsIntro) return;

    resetDestinationsSequence();
    destinationsIntro.classList.add("show");

    const hideIntroTimer = setTimeout(() => {
      destinationsIntro.classList.add("hide");
    }, 1900);

    destinationCards.forEach((card, index) => {
      const cardTimer = setTimeout(() => {
        card.classList.add("show");
      }, 2050 + index * 120);

      destinationTimers.push(cardTimer);
    });

    destinationTimers.push(hideIntroTimer);
  }

  /* =========================
     MAP CARDS ROUTES
  ========================= */
  const animatedCards = document.querySelectorAll(".world-card.animate-on-view");

  function placeVehicleOnPath(vehicle, path, progress) {
    const totalLength = path.getTotalLength();
    const currentLength = totalLength * progress;

    const point = path.getPointAtLength(currentLength);

    const delta = 0.5;
    const prevLength = Math.max(0, currentLength - delta);
    const nextLength = Math.min(totalLength, currentLength + delta);

    const prevPoint = path.getPointAtLength(prevLength);
    const nextPoint = path.getPointAtLength(nextLength);

    const angleRad = Math.atan2(nextPoint.y - prevPoint.y, nextPoint.x - prevPoint.x);
    const angleDeg = (angleRad * 180) / Math.PI;

    const route = vehicle.closest(".route");
    const routeBox = route.getBoundingClientRect();

    const svg = path.ownerSVGElement;
    const viewBox = svg.viewBox.baseVal;

    const scaleX = routeBox.width / viewBox.width;
    const scaleY = routeBox.height / viewBox.height;

    const x = point.x * scaleX;
    const y = point.y * scaleY;

    const vehicleWidth = vehicle.offsetWidth || 38;
    const vehicleHeight = vehicle.offsetHeight || 38;

    vehicle.style.transform = `
      translate(${x - vehicleWidth / 2}px, ${y - vehicleHeight / 2}px)
      rotate(${angleDeg}deg)
    `;
  }

  function animateVehicle(vehicle, path, duration = 1800) {
    vehicle.style.opacity = "1";

    let start = null;
    let rafId = null;

    function step(timestamp) {
      if (!start) start = timestamp;

      const elapsed = timestamp - start;
      const progress = Math.min(elapsed / duration, 1);

      placeVehicleOnPath(vehicle, path, progress);

      if (progress < 1) {
        rafId = requestAnimationFrame(step);
      }
    }

    rafId = requestAnimationFrame(step);
    vehicle._rafId = rafId;
  }

  function resetWorldCard(card) {
    card.classList.remove("animate");

    const routeCurves = card.querySelectorAll(".route-path-curve");
    routeCurves.forEach((curve) => {
      curve.style.animation = "none";
      curve.getBoundingClientRect();
      curve.style.animation = "";
    });

    const vehicles = card.querySelectorAll(".route-vehicle");
    vehicles.forEach((vehicle) => {
      if (vehicle._rafId) {
        cancelAnimationFrame(vehicle._rafId);
        vehicle._rafId = null;
      }

      vehicle.style.opacity = "0";
      vehicle.style.transform = "translate(0px, 0px) rotate(0deg)";
    });
  }

  function playWorldCard(card) {
    resetWorldCard(card);

    requestAnimationFrame(() => {
      card.classList.add("animate");

      const routes = card.querySelectorAll(".route");

      routes.forEach((route) => {
        const path = route.querySelector(".route-path-curve");
        const vehicle = route.querySelector(".route-vehicle");

        if (!path || !vehicle) return;

        const duration = route.classList.contains("plane-route") ? 1700 : 1900;

        placeVehicleOnPath(vehicle, path, 0);
        animateVehicle(vehicle, path, duration);
      });
    });
  }

  /* =========================
     OBSERVERS
  ========================= */
  const observedItems = [];

  if (heroBlock) {
    observedItems.push({
      element: heroBlock,
      onEnter: () => {
        resetHeroAnimation();
        playHeroAnimation();
      },
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

  if (destinationsSection) {
    observedItems.push({
      element: destinationsSection,
      onEnter: playDestinationsSequence,
      onExit: resetDestinationsSequence
    });
  }

  animatedCards.forEach((card) => {
    observedItems.push({
      element: card,
      onEnter: () => playWorldCard(card),
      onExit: () => resetWorldCard(card)
    });
  });

  if (observedItems.length) {
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
        threshold: 0.35
      }
    );

    observedItems.forEach((item) => observer.observe(item.element));
  }

  window.addEventListener("resize", () => {
    animatedCards.forEach((card) => {
      if (card.classList.contains("animate")) {
        playWorldCard(card);
      }
    });

    updateCintaNosotrosReveal();
  });
});