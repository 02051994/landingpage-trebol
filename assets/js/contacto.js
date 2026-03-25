const contactForm = document.querySelector('.contact-form');
const contactStatus = contactForm?.querySelector('.contact-form-status');
const contactSubmit = contactForm?.querySelector('button[type="submit"]');

function updateContactStatus(message, type = '') {
  if (!contactStatus) return;

  contactStatus.textContent = message;
  contactStatus.classList.remove('is-success', 'is-error');

  if (type) {
    contactStatus.classList.add(type);
  }
}

async function sendContactEmail({ nombre, email, telefono, mensaje }) {
  const payload = {
    nombre,
    email,
    telefono,
    mensaje,
    _subject: 'Nuevo mensaje desde el formulario de contacto - Grupo Trébol',
    _captcha: 'false',
    _template: 'table'
  };

  const response = await fetch('https://formsubmit.co/ajax/gestionhumana@grupotrebol.pe', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json'
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    throw new Error('No se pudo enviar el correo.');
  }
}

function openContactWhatsApp({ nombre, email, telefono, mensaje }) {
  const whatsappMessage = [
    'Hola, soy ' + nombre + '.',
    'Mi correo es: ' + email + '.',
    'Mi teléfono es: ' + telefono + '.',
    'Mensaje:',
    mensaje
  ].join('\n');

  const whatsappURL = 'https://wa.me/51957035114?text=' + encodeURIComponent(whatsappMessage);
  window.open(whatsappURL, '_blank', 'noopener');
}

if (contactForm) {
  contactForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const formData = new FormData(contactForm);
    const nombre = (formData.get('nombre') || '').toString().trim();
    const email = (formData.get('email') || '').toString().trim();
    const telefono = (formData.get('telefono') || '').toString().trim();
    const mensaje = (formData.get('mensaje') || '').toString().trim();

    if (!nombre || !email || !telefono || !mensaje) {
      updateContactStatus('Completa nombre, correo, teléfono y mensaje para enviar el formulario.', 'is-error');
      return;
    }

    try {
      updateContactStatus('Enviando mensaje...');
      if (contactSubmit) contactSubmit.disabled = true;

      await sendContactEmail({ nombre, email, telefono, mensaje });
      openContactWhatsApp({ nombre, email, telefono, mensaje });

      contactForm.reset();
      updateContactStatus('¡Listo! Tu mensaje fue enviado al correo y se abrió WhatsApp para notificar al celular.', 'is-success');
    } catch (error) {
      updateContactStatus('No se pudo enviar el formulario. Inténtalo nuevamente en unos minutos.', 'is-error');
    } finally {
      if (contactSubmit) contactSubmit.disabled = false;
    }
  });
}
