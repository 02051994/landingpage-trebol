const kpiValues = document.querySelectorAll('.hero-kpis .value');

function animateValue(element) {
  const raw = element.textContent.trim();
  const numeric = parseInt(raw.replace(/\D/g, ''), 10);

  if (Number.isNaN(numeric)) return;

  let current = 0;
  const step = Math.max(1, Math.floor(numeric / 40));

  const timer = setInterval(() => {
    current += step;
    if (current >= numeric) {
      current = numeric;
      clearInterval(timer);
    }

    if (raw.includes('%')) element.textContent = `${current}%`;
    else element.textContent = `${current}`;
  }, 24);
}

const observer = new IntersectionObserver((entries, obs) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    animateValue(entry.target);
    obs.unobserve(entry.target);
  });
}, { threshold: 0.6 });

kpiValues.forEach((item) => observer.observe(item));
