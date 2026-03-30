document.addEventListener("DOMContentLoaded", () => {
  function debounce(fn, delay = 120) {
    let timer = null;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => fn(...args), delay);
    };
  }

  function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  function formatKg(value) {
    return `${Number(value || 0).toLocaleString("es-PE")} Kg`;
  }

  function wait(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

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
  const heroMetrics = document.getElementById("heroMetrics");
  const heroMetricValues = document.querySelectorAll(".hero-metric-value");

  let currentSlide = 0;
  let autoPlayInterval = null;
  let heroTimers = [];
  let heroLettersBuilt = false;
  let heroOriginalText = "";
  let heroTouched = false;
  let heroTouchStartX = 0;
  let heroTouchEndX = 0;
  let heroCountersStarted = false;
  let heroCounterAnimationFrameIds = [];

  function clearHeroTimers() {
    heroTimers.forEach((timer) => clearTimeout(timer));
    heroTimers = [];
  }

  function clearHeroCounterRafs() {
    heroCounterAnimationFrameIds.forEach((id) => cancelAnimationFrame(id));
    heroCounterAnimationFrameIds = [];
  }

  function formatCounterValue(target, value) {
    return value.toLocaleString("es-PE", {
      minimumFractionDigits: target % 1 !== 0 ? 2 : 0,
      maximumFractionDigits: target % 1 !== 0 ? 2 : 0
    });
  }

  function animateHeroCounters() {
    if (heroCountersStarted || !heroMetricValues.length) return;

    heroCountersStarted = true;
    clearHeroCounterRafs();

    heroMetricValues.forEach((element, index) => {
      const target = Number(element.dataset.target || 0);
      const duration = 1300 + index * 180;
      const startTime = performance.now();

      function step(now) {
        const progress = Math.min((now - startTime) / duration, 1);
        const value = target * easeOutCubic(progress);
        element.textContent = formatCounterValue(target, value);

        if (progress < 1) {
          const rafId = requestAnimationFrame(step);
          heroCounterAnimationFrameIds.push(rafId);
        } else {
          element.textContent = formatCounterValue(target, target);
        }
      }

      const rafId = requestAnimationFrame(step);
      heroCounterAnimationFrameIds.push(rafId);
    });
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

    if (heroActions) {
      heroActions.classList.remove("show");
    }

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
    if (!heroTitle || !heroText || !heroMetrics) return;

    clearHeroTimers();

    if (!heroLettersBuilt) buildHeroLetters();

    heroText.classList.remove("show");
    heroMetrics.classList.remove("show");

    if (heroActions) {
      heroActions.classList.remove("show");
    }

    const letters = heroTitle.querySelectorAll(".letter");
    letters.forEach((letter) => letter.classList.remove("show"));
  }

  function playHeroAnimation() {
    if (!heroTitle || !heroText || !heroMetrics) return;

    if (!heroLettersBuilt) buildHeroLetters();

    const letters = heroTitle.querySelectorAll(".letter");
    const letterDelay = 24;

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
      if (heroActions) {
        heroActions.classList.add("show");
      }
    }, titleAnimationTime + 120);

    const metricsTimer = setTimeout(() => {
      heroMetrics.classList.add("show");
      animateHeroCounters();
    }, titleAnimationTime + 240);

    heroTimers.push(textTimer, actionsTimer, metricsTimer);
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

    if (animateText) playHeroAnimation();

    resetDotProgress();
    currentSlide = index;
  }

  function nextSlide() {
    if (!slides.length) return;
    const nextIndex = (currentSlide + 1) % slides.length;
    showSlide(nextIndex, true);
  }

  function prevSlide() {
    if (!slides.length) return;
    const prevIndex = (currentSlide - 1 + slides.length) % slides.length;
    showSlide(prevIndex, true);
  }

  function startAutoPlay() {
    if (!slides.length) return;
    clearInterval(autoPlayInterval);
    autoPlayInterval = setInterval(nextSlide, 5500);
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
    resetHeroAnimation();
    playHeroAnimation();
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

      heroSlider.addEventListener("touchstart", (e) => {
        heroTouched = true;
        heroTouchStartX = e.changedTouches[0].clientX;
        stopAutoPlay();
      }, { passive: true });

      heroSlider.addEventListener("touchend", (e) => {
        if (!heroTouched) return;
        heroTouchEndX = e.changedTouches[0].clientX;
        const diff = heroTouchStartX - heroTouchEndX;

        if (Math.abs(diff) > 50) {
          if (diff > 0) nextSlide();
          else prevSlide();
        }

        heroTouched = false;
        startAutoPlay();
      }, { passive: true });
    }
  }

  /* =========================
     ABOUT SLIDER
  ========================= */
  const aboutSlider = document.getElementById("aboutSlider");

  if (aboutSlider) {
    const aboutTrack = aboutSlider.querySelector(".about-slider-track");
    const aboutSlides = aboutSlider.querySelectorAll(".about-slide");
    const aboutIndicators = aboutSlider.querySelectorAll(".about-indicator");
    const aboutPrev = aboutSlider.querySelector(".about-prev");
    const aboutNext = aboutSlider.querySelector(".about-next");

    let aboutIndex = 0;
    let aboutInterval = null;
    let startY = 0;
    let endY = 0;

    function updateAboutSlider() {
      if (!aboutTrack || !aboutSlides.length) return;

      aboutTrack.style.transform = `translateY(-${aboutIndex * 100}%)`;
      aboutSlides.forEach((slide, index) => {
        slide.classList.toggle("is-active", index === aboutIndex);
      });

      aboutIndicators.forEach((dot, index) => {
        dot.classList.toggle("active", index === aboutIndex);
      });
    }

    function nextAboutSlide() {
      aboutIndex = (aboutIndex + 1) % aboutSlides.length;
      updateAboutSlider();
    }

    function prevAboutSlide() {
      aboutIndex = (aboutIndex - 1 + aboutSlides.length) % aboutSlides.length;
      updateAboutSlider();
    }

    function startAboutAutoplay() {
      clearInterval(aboutInterval);
      aboutInterval = setInterval(nextAboutSlide, 5000);
    }

    function stopAboutAutoplay() {
      clearInterval(aboutInterval);
    }

    aboutIndicators.forEach((dot, index) => {
      dot.addEventListener("click", () => {
        aboutIndex = index;
        updateAboutSlider();
        startAboutAutoplay();
      });
    });

    if (aboutNext) {
      aboutNext.addEventListener("click", () => {
        nextAboutSlide();
        startAboutAutoplay();
      });
    }

    if (aboutPrev) {
      aboutPrev.addEventListener("click", () => {
        prevAboutSlide();
        startAboutAutoplay();
      });
    }

    aboutSlider.addEventListener("touchstart", (e) => {
      startY = e.touches[0].clientY;
      stopAboutAutoplay();
    }, { passive: true });

    aboutSlider.addEventListener("touchend", (e) => {
      endY = e.changedTouches[0].clientY;
      const diff = startY - endY;

      if (Math.abs(diff) > 50) {
        if (diff > 0) nextAboutSlide();
        else prevAboutSlide();
      }

      startAboutAutoplay();
    }, { passive: true });

    aboutSlider.addEventListener("mouseenter", stopAboutAutoplay);
    aboutSlider.addEventListener("mouseleave", startAboutAutoplay);

    updateAboutSlider();
    startAboutAutoplay();
  }

  /* =========================
     CINTA NOSOTROS
  ========================= */
  const cintaNosotros = document.getElementById("cintaNosotros");
  const cintaNosotrosImage = document.getElementById("cintaNosotrosImage");
  const cintaFloatingItems = document.querySelectorAll(".cinta-floating-item[data-modal-image]");
  const cintaImageModal = document.getElementById("cintaImageModal");
  const cintaImageModalOverlay = document.getElementById("cintaImageModalOverlay");
  const cintaImageModalClose = document.getElementById("cintaImageModalClose");
  const cintaImageModalImg = document.getElementById("cintaImageModalImg");
  const cintaImageModalTitle = document.getElementById("cintaImageModalTitle");

  function updateCintaNosotrosReveal() {
    if (!cintaNosotros || !cintaNosotrosImage || window.innerWidth <= 768) {
      if (cintaNosotrosImage && window.innerWidth <= 768) {
        cintaNosotrosImage.style.transform = "scale(1.02)";
      }
      return;
    }

    const rect = cintaNosotros.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const sectionCenter = rect.top + rect.height / 2;
    const viewportCenter = viewportHeight / 2;
    const distance = Math.abs(sectionCenter - viewportCenter);
    const maxDistance = viewportHeight * 0.62;
    const progress = 1 - Math.min(distance / maxDistance, 1);
    const travelY = (0.5 - progress) * 14;
    const scale = 1.01 + progress * 0.035;

    cintaNosotrosImage.style.transform = `translate3d(0, ${travelY}px, 0) scale(${scale})`;
  }

  window.addEventListener("scroll", updateCintaNosotrosReveal, { passive: true });
  window.addEventListener("load", updateCintaNosotrosReveal);
  window.addEventListener("resize", debounce(updateCintaNosotrosReveal, 100));

  function closeCintaImageModal() {
    if (!cintaImageModal) return;
    cintaImageModal.classList.remove("is-open");
    cintaImageModal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  function openCintaImageModal(src, altText) {
    if (!cintaImageModal || !cintaImageModalImg) return;
    cintaImageModalImg.src = src;
    cintaImageModalImg.alt = altText || "Imagen ampliada del equipo";
    if (cintaImageModalTitle) {
      cintaImageModalTitle.textContent = altText || "Vista ampliada";
    }
    cintaImageModal.classList.add("is-open");
    cintaImageModal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  if (cintaFloatingItems.length && cintaImageModal) {
    cintaFloatingItems.forEach((item) => {
      item.addEventListener("click", () => {
        openCintaImageModal(item.dataset.modalImage, item.dataset.modalAlt);
      });
    });

    if (cintaImageModalOverlay) {
      cintaImageModalOverlay.addEventListener("click", closeCintaImageModal);
    }

    if (cintaImageModalClose) {
      cintaImageModalClose.addEventListener("click", closeCintaImageModal);
    }

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && cintaImageModal.classList.contains("is-open")) {
        closeCintaImageModal();
      }
    });
  }

  /* =========================
     MAPA + DESTINOS
  ========================= */
  const certTabs = document.querySelectorAll(".tab-button");
  const mobileDestinationSelect = document.getElementById("mobileDestinationSelect");
  const mapCardTag = document.getElementById("mapCardTag");
  const mapCardRoute = document.getElementById("mapCardRoute");
  const mapRouteLayer = document.getElementById("mapRouteLayer");
  const mapRoutePath = document.getElementById("mapRoutePath");
  const mapRouteVehicle = document.getElementById("mapRouteVehicle");
  const mapDestinationKg = document.getElementById("mapDestinationKg");
  const mapDestinationName = document.getElementById("mapDestinationName");

  function setVehicleIcon(type) {
    if (!mapRouteVehicle) return;

    if (type === "plane") {
      mapRouteVehicle.innerHTML = `
        <svg viewBox="0 0 24 24">
          <path d="M21 16.5l-7.2-3.1V7.8l2.4-1.8V4.8l-4.2 1.5L7.8 4.8V6l2.4 1.8v5.6L3 16.5v1.8l7.2-1.5v3l-1.8 1.2v1.2L12 21l3.6 1.2V21l-1.8-1.2v-3l7.2 1.5z"/>
        </svg>
      `;
    } else {
      mapRouteVehicle.innerHTML = `
        <svg viewBox="0 0 24 24">
          <path d="M4 15.5l1.5 1.2c.8.6 1.8.6 2.6 0l1-.8 1 .8c.8.6 1.8.6 2.6 0l1-.8 1 .8c.8.6 1.8.6 2.6 0L20 15.5V10l-3-1.2V6.5h-3V7.6L12 6 7 8.2v4.3L4 13.8zm5-2.7V9.7l3-1.2 3 1.2v3.1zM4.5 19c.7.7 1.8.7 2.5 0 .7.7 1.8.7 2.5 0 .7.7 1.8.7 2.5 0 .7.7 1.8.7 2.5 0 .7.7 1.8.7 2.5 0 .7.7 1.8.7 2.5 0"/>
        </svg>
      `;
    }
  }

  function placeVehicleOnPath(vehicle, path, progress) {
    if (!vehicle || !path || !mapRouteLayer) return;

    const totalLength = path.getTotalLength();
    const currentLength = totalLength * progress;

    const point = path.getPointAtLength(currentLength);
    const delta = 0.5;
    const prevPoint = path.getPointAtLength(Math.max(0, currentLength - delta));
    const nextPoint = path.getPointAtLength(Math.min(totalLength, currentLength + delta));

    const angleRad = Math.atan2(nextPoint.y - prevPoint.y, nextPoint.x - prevPoint.x);
    const angleDeg = (angleRad * 180) / Math.PI;

    const routeBox = mapRouteLayer.getBoundingClientRect();
    const svg = path.ownerSVGElement;
    const viewBox = svg.viewBox.baseVal;

    const scaleX = routeBox.width / viewBox.width;
    const scaleY = routeBox.height / viewBox.height;

    const x = point.x * scaleX;
    const y = point.y * scaleY;

    const vehicleWidth = vehicle.offsetWidth || 38;
    const vehicleHeight = vehicle.offsetHeight || 38;

    vehicle.style.transform = `translate(${x - vehicleWidth / 2}px, ${y - vehicleHeight / 2}px) rotate(${angleDeg}deg)`;
  }

  function animateMapVehicle() {
    if (!mapRouteVehicle || !mapRoutePath) return;

    if (mapRouteVehicle._rafId) {
      cancelAnimationFrame(mapRouteVehicle._rafId);
      mapRouteVehicle._rafId = null;
    }

    mapRouteVehicle.style.opacity = "1";
    placeVehicleOnPath(mapRouteVehicle, mapRoutePath, 0);

    let start = null;
    const duration = 1800;

    function step(timestamp) {
      if (!start) start = timestamp;
      const elapsed = timestamp - start;
      const progress = Math.min(elapsed / duration, 1);

      placeVehicleOnPath(mapRouteVehicle, mapRoutePath, progress);

      if (progress < 1) {
        mapRouteVehicle._rafId = requestAnimationFrame(step);
      } else {
        setTimeout(() => {
          mapRouteVehicle.style.opacity = "0";
        }, 250);
      }
    }

    mapRouteVehicle._rafId = requestAnimationFrame(step);
  }

  function animateMapRoute() {
    if (!mapRoutePath) return;

    mapRoutePath.classList.remove("animate");
    mapRoutePath.style.animation = "none";
    mapRoutePath.getBoundingClientRect();
    mapRoutePath.style.animation = "";
    mapRoutePath.classList.add("animate");

    animateMapVehicle();
  }

  function updateCertificationContent(button, syncSelect = true) {
    if (!button) return;

    certTabs.forEach((tab, index) => {
      const isActive = tab === button;
      tab.classList.toggle("active", isActive);
      tab.setAttribute("aria-selected", isActive ? "true" : "false");

      if (isActive && mobileDestinationSelect && syncSelect) {
        mobileDestinationSelect.value = String(index);
      }
    });

    const tag = button.dataset.tag || "";
    const route = button.dataset.route || "";
    const path = button.dataset.path || "M 36 72 Q 48 30, 66 28";
    const destX = button.dataset.destx || "66%";
    const destY = button.dataset.desty || "28%";
    const point = button.dataset.point || "";
    const icon = button.dataset.icon || "ship";
    const kg = button.dataset.kg || "0";

    if (mapCardTag) mapCardTag.textContent = tag;
    if (mapCardRoute) mapCardRoute.textContent = route;

    if (mapRouteLayer) {
      mapRouteLayer.style.setProperty("--dest-x", destX);
      mapRouteLayer.style.setProperty("--dest-y", destY);
    }

    if (mapRoutePath) {
      mapRoutePath.setAttribute("d", path);
    }

    if (mapDestinationKg) {
      mapDestinationKg.textContent = formatKg(kg);
    }

    if (mapDestinationName) {
      mapDestinationName.textContent = point;
    }

    setVehicleIcon(icon);
    animateMapRoute();
  }

  certTabs.forEach((button, index) => {
    button.addEventListener("click", () => {
      updateCertificationContent(button);

      if (mobileDestinationSelect) {
        mobileDestinationSelect.value = String(index);
      }
    });
  });

  if (mobileDestinationSelect) {
    mobileDestinationSelect.addEventListener("change", (e) => {
      const index = Number(e.target.value);
      const selectedButton = certTabs[index];
      if (selectedButton) {
        updateCertificationContent(selectedButton, false);
      }
    });
  }

  if (certTabs.length) {
    updateCertificationContent(certTabs[0]);
  }

  /* =========================
     CERTIFICACIONES ACORDEÓN
  ========================= */
  const certAccordionItems = document.querySelectorAll(".cert-accordion-item");
  const certAccordionHeaders = document.querySelectorAll(".cert-accordion-header");

  function openCertAccordion(item) {
    certAccordionItems.forEach((accordionItem) => {
      const body = accordionItem.querySelector(".cert-accordion-body");
      const header = accordionItem.querySelector(".cert-accordion-header");

      accordionItem.classList.remove("active");
      header.setAttribute("aria-expanded", "false");
      body.style.maxHeight = "0px";
    });

    const body = item.querySelector(".cert-accordion-body");
    const header = item.querySelector(".cert-accordion-header");

    item.classList.add("active");
    header.setAttribute("aria-expanded", "true");
    body.style.maxHeight = `${body.scrollHeight}px`;
  }

  certAccordionHeaders.forEach((header) => {
    header.addEventListener("click", () => {
      const item = header.closest(".cert-accordion-item");
      openCertAccordion(item);
    });
  });

  const activeCertAccordion = document.querySelector(".cert-accordion-item.active");
  if (activeCertAccordion) {
    openCertAccordion(activeCertAccordion);
  }

  /* =========================
     VALORES / ACORDEÓN
  ========================= */
  const accordionItems = document.querySelectorAll(".accordion-item");
  const accordionHeaders = document.querySelectorAll(".accordion-header");
  const valuesImage = document.getElementById("valuesImage");
  const valuesImageTitle = document.getElementById("valuesImageTitle");
  const valuesImageText = document.getElementById("valuesImageText");

  function openAccordionItem(item) {
    accordionItems.forEach((accordionItem) => {
      const body = accordionItem.querySelector(".accordion-body");
      const header = accordionItem.querySelector(".accordion-header");

      accordionItem.classList.remove("active");
      header.setAttribute("aria-expanded", "false");
      body.style.maxHeight = "0px";
    });

    const body = item.querySelector(".accordion-body");
    const header = item.querySelector(".accordion-header");

    item.classList.add("active");
    header.setAttribute("aria-expanded", "true");
    body.style.maxHeight = `${body.scrollHeight}px`;

    if (valuesImage && valuesImageTitle && valuesImageText) {
      valuesImage.src = header.dataset.image || valuesImage.src;
      valuesImageTitle.textContent = header.dataset.title || header.textContent.trim();
      valuesImageText.textContent = header.dataset.text || "";
    }
  }

  accordionHeaders.forEach((header) => {
    header.addEventListener("click", () => {
      const item = header.closest(".accordion-item");
      openAccordionItem(item);
    });
  });

  const activeAccordion = document.querySelector(".accordion-item.active");
  if (activeAccordion) {
    openAccordionItem(activeAccordion);
  }

  /* =========================
     OBSERVER HERO COUNTERS
  ========================= */
  if (heroBlock) {
    const heroObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateHeroCounters();
          }
        });
      },
      { threshold: 0.35 }
    );

    heroObserver.observe(heroBlock);
  }

  /* =========================
     CINTA FLIP DE CAPACIDADES
  ========================= */
  const ribbon = document.querySelector(".tech-ribbon");
  const cards = document.querySelectorAll(".flip-card");

  let isAnimatingRibbon = false;
  let ribbonWasVisible = false;

  async function animateRibbonOnce() {
    if (isAnimatingRibbon || !cards.length) return;

    isAnimatingRibbon = true;

    for (let i = 0; i < cards.length; i++) {
      cards[i].classList.add("flipped");
      await wait(220);
    }

    await wait(900);

    for (let i = cards.length - 1; i >= 0; i--) {
      cards[i].classList.remove("flipped");
      await wait(220);
    }

    isAnimatingRibbon = false;
  }

  cards.forEach((card) => {
    card.addEventListener("click", () => {
      if (isAnimatingRibbon) return;
      card.classList.toggle("flipped");
    });

    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        if (isAnimatingRibbon) return;
        card.classList.toggle("flipped");
      }
    });
  });

  if (ribbon) {
    const ribbonObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !ribbonWasVisible) {
            ribbonWasVisible = true;
            animateRibbonOnce();
          }

          if (!entry.isIntersecting) {
            ribbonWasVisible = false;
          }
        });
      },
      {
        threshold: 0.45
      }
    );

    ribbonObserver.observe(ribbon);
  }

  /* =========================
     CONTACTO PREMIUM (EMAIL + WHATSAPP)
  ========================= */
  const premiumContactForm = document.querySelector(".contact-premium-section .contact-form");
  const premiumContactStatus = premiumContactForm?.querySelector(".contact-form-status");
  const premiumContactSubmit = premiumContactForm?.querySelector('button[type="submit"]');

  function updatePremiumContactStatus(message, type = "") {
    if (!premiumContactStatus) return;

    premiumContactStatus.textContent = message;
    premiumContactStatus.classList.remove("is-success", "is-error");

    if (type) {
      premiumContactStatus.classList.add(type);
    }
  }

  async function sendPremiumContactEmail({ nombre, email, telefono, mensaje }) {
    const payload = {
      nombre,
      email,
      telefono,
      mensaje,
      _subject: "Nuevo mensaje desde el formulario de inicio - Grupo Trébol",
      _captcha: "false",
      _template: "table"
    };

    const response = await fetch("https://formsubmit.co/ajax/gestionhumana@grupotrebol.pe", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error("No se pudo enviar el correo.");
    }
  }

  function openPremiumContactWhatsApp({ nombre, email, telefono, mensaje }) {
    const whatsappMessage = [
      "Hola, soy " + nombre + ".",
      "Mi correo es: " + email + ".",
      "Mi teléfono es: " + telefono + ".",
      "Mensaje:",
      mensaje
    ].join("\n");

    const whatsappURL = "https://wa.me/51957035114?text=" + encodeURIComponent(whatsappMessage);
    window.open(whatsappURL, "_blank", "noopener");
  }

  if (premiumContactForm) {
    premiumContactForm.addEventListener("submit", async (event) => {
      event.preventDefault();

      const formData = new FormData(premiumContactForm);
      const nombre = (formData.get("nombre") || "").toString().trim();
      const email = (formData.get("email") || "").toString().trim();
      const telefono = (formData.get("telefono") || "").toString().trim();
      const mensaje = (formData.get("mensaje") || "").toString().trim();

      if (!nombre || !email || !telefono || !mensaje) {
        updatePremiumContactStatus("Completa nombre, correo, teléfono y mensaje para enviar el formulario.", "is-error");
        return;
      }

      try {
        updatePremiumContactStatus("Enviando mensaje...");
        if (premiumContactSubmit) premiumContactSubmit.disabled = true;

        await sendPremiumContactEmail({ nombre, email, telefono, mensaje });
        openPremiumContactWhatsApp({ nombre, email, telefono, mensaje });

        premiumContactForm.reset();
        updatePremiumContactStatus("¡Listo! Tu mensaje fue enviado al correo y se abrió WhatsApp para notificar al celular.", "is-success");
      } catch (error) {
        updatePremiumContactStatus("No se pudo enviar el formulario. Inténtalo nuevamente en unos minutos.", "is-error");
      } finally {
        if (premiumContactSubmit) premiumContactSubmit.disabled = false;
      }
    });
  }

  /* =========================
     RESIZE
  ========================= */
  window.addEventListener("resize", debounce(() => {
    updateCintaNosotrosReveal();

    if (mapRoutePath && mapRouteVehicle) {
      animateMapRoute();
    }

    const activeValueAccordion = document.querySelector(".accordion-item.active .accordion-body");
    if (activeValueAccordion) {
      activeValueAccordion.style.maxHeight = `${activeValueAccordion.scrollHeight}px`;
    }

    const activeCertAccordionBody = document.querySelector(".cert-accordion-item.active .cert-accordion-body");
    if (activeCertAccordionBody) {
      activeCertAccordionBody.style.maxHeight = `${activeCertAccordionBody.scrollHeight}px`;
    }
  }, 120));
});
