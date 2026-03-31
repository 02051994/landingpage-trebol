document.addEventListener("DOMContentLoaded", () => {
  const slides = [...document.querySelectorAll(".hero-slide")];
  const dots = [...document.querySelectorAll(".hero-dot")];
  const prevBtn = document.querySelector(".hero-prev");
  const nextBtn = document.querySelector(".hero-next");
  const heroSlider = document.getElementById("heroSlider");
  const heroTag = document.getElementById("heroTag");
  const heroTitle = document.getElementById("heroTitle");
  const heroText = document.getElementById("heroText");
  const heroCounter = document.getElementById("heroCounter");
  const metricValues = [...document.querySelectorAll(".hero-metric-value")];

  let current = 0;
  let autoplay;
  let countersDone = false;

  const formatMetric = (value, original) => {
    if (original.includes("%")) return `${value.toFixed(1)}%`;
    if (original.includes("t")) return `${value.toFixed(1)} t`;
    return value.toFixed(1);
  };

  const animateCounters = () => {
    if (countersDone) return;
    countersDone = true;

    metricValues.forEach((el) => {
      const start = Number(el.dataset.start || 0);
      const target = Number(el.dataset.target || start);
      const template = el.textContent;
      const startTime = performance.now();
      const duration = 1200;

      const tick = (now) => {
        const progress = Math.min((now - startTime) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const value = start + (target - start) * eased;
        el.textContent = formatMetric(value, template);
        if (progress < 1) requestAnimationFrame(tick);
      };

      requestAnimationFrame(tick);
    });
  };

  const render = (index) => {
    slides.forEach((slide, i) => slide.classList.toggle("active", i === index));
    dots.forEach((dot, i) => dot.classList.toggle("active", i === index));

    const data = slides[index].dataset;
    heroTag.textContent = data.tag;
    heroTitle.textContent = data.title;
    heroText.textContent = data.text;
    heroCounter.textContent = `${String(index + 1).padStart(2, "0")} / ${String(slides.length).padStart(2, "0")}`;
    current = index;
  };

  const next = () => render((current + 1) % slides.length);
  const prev = () => render((current - 1 + slides.length) % slides.length);

  const startAutoplay = () => {
    clearInterval(autoplay);
    autoplay = setInterval(next, 6000);
  };

  if (slides.length) {
    render(0);
    startAutoplay();
    animateCounters();
  }

  nextBtn?.addEventListener("click", () => {
    next();
    startAutoplay();
  });

  prevBtn?.addEventListener("click", () => {
    prev();
    startAutoplay();
  });

  dots.forEach((dot, index) => {
    dot.addEventListener("click", () => {
      render(index);
      startAutoplay();
    });
  });

  heroSlider?.addEventListener("mouseenter", () => clearInterval(autoplay));
  heroSlider?.addEventListener("mouseleave", startAutoplay);
});
