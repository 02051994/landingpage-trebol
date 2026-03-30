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


document.addEventListener("DOMContentLoaded", () => {
  function formatKg(value) {
    return `${Number(value || 0).toLocaleString("es-PE")} Kg`;
  }

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
      mapRouteVehicle.innerHTML = `<svg viewBox="0 0 24 24"><path d="M21 16.5l-7.2-3.1V7.8l2.4-1.8V4.8l-4.2 1.5L7.8 4.8V6l2.4 1.8v5.6L3 16.5v1.8l7.2-1.5v3l-1.8 1.2v1.2L12 21l3.6 1.2V21l-1.8-1.2v-3l7.2 1.5z"/></svg>`;
    } else {
      mapRouteVehicle.innerHTML = `<svg viewBox="0 0 24 24"><path d="M4 15.5l1.5 1.2c.8.6 1.8.6 2.6 0l1-.8 1 .8c.8.6 1.8.6 2.6 0l1-.8 1 .8c.8.6 1.8.6 2.6 0L20 15.5V10l-3-1.2V6.5h-3V7.6L12 6 7 8.2v4.3L4 13.8zm5-2.7V9.7l3-1.2 3 1.2v3.1zM4.5 19c.7.7 1.8.7 2.5 0 .7.7 1.8.7 2.5 0 .7.7 1.8.7 2.5 0 .7.7 1.8.7 2.5 0 .7.7 1.8.7 2.5 0 .7.7 1.8.7 2.5 0"/></svg>`;
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

    const x = point.x * (routeBox.width / viewBox.width);
    const y = point.y * (routeBox.height / viewBox.height);

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
      const progress = Math.min((timestamp - start) / duration, 1);
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
    if (mapRoutePath) mapRoutePath.setAttribute("d", path);
    if (mapDestinationKg) mapDestinationKg.textContent = formatKg(kg);
    if (mapDestinationName) mapDestinationName.textContent = point;

    setVehicleIcon(icon);
    animateMapRoute();
  }

  certTabs.forEach((button, index) => {
    button.addEventListener("click", () => {
      updateCertificationContent(button);
      if (mobileDestinationSelect) mobileDestinationSelect.value = String(index);
    });
  });

  if (mobileDestinationSelect) {
    mobileDestinationSelect.addEventListener("change", (e) => {
      const index = Number(e.target.value);
      const selectedButton = certTabs[index];
      if (selectedButton) updateCertificationContent(selectedButton, false);
    });
  }

  if (certTabs.length) {
    updateCertificationContent(certTabs[0]);
  }

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
});
