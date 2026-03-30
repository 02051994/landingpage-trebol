document.addEventListener("DOMContentLoaded", () => {
  const premiumContactForm = document.querySelector(".contact-premium-section .contact-form");
  const premiumContactStatus = premiumContactForm?.querySelector(".contact-form-status");
  const premiumContactSubmit = premiumContactForm?.querySelector('button[type="submit"]');

  function updatePremiumContactStatus(message, type = "") {
    if (!premiumContactStatus) return;
    premiumContactStatus.textContent = message;
    premiumContactStatus.classList.remove("is-success", "is-error");
    if (type) premiumContactStatus.classList.add(type);
  }

  async function sendPremiumContactEmail({ nombre, email, telefono, mensaje }) {
    const payload = { nombre, email, telefono, mensaje, _subject: "Nuevo mensaje desde operaciones - Grupo Trébol", _captcha: "false", _template: "table" };
    const response = await fetch("https://formsubmit.co/ajax/gestionhumana@grupotrebol.pe", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(payload)
    });
    if (!response.ok) throw new Error("No se pudo enviar el correo.");
  }

  function openPremiumContactWhatsApp({ nombre, email, telefono, mensaje }) {
    const whatsappMessage = ["Hola, soy " + nombre + ".", "Mi correo es: " + email + ".", "Mi teléfono es: " + telefono + ".", "Mensaje:", mensaje].join("\n");
    const whatsappURL = "https://wa.me/51957035114?text=" + encodeURIComponent(whatsappMessage);
    window.open(whatsappURL, "_blank", "noopener");
  }

  if (!premiumContactForm) return;

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
    } catch {
      updatePremiumContactStatus("No se pudo enviar el formulario. Inténtalo nuevamente en unos minutos.", "is-error");
    } finally {
      if (premiumContactSubmit) premiumContactSubmit.disabled = false;
    }
  });
});
