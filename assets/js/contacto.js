const contactForm = document.querySelector('.contact-form');

if (contactForm) {
  contactForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const fields = [...contactForm.querySelectorAll('input, textarea')];
    let isValid = true;

    fields.forEach((field) => {
      const value = field.value.trim();
      if (!value) {
        field.style.borderColor = '#b42318';
        isValid = false;
      } else {
        field.style.borderColor = 'rgba(24, 32, 40, 0.10)';
      }
    });

    if (!isValid) return;

    const button = contactForm.querySelector('button[type="submit"]');
    if (button) {
      const originalText = button.textContent;
      button.textContent = 'Mensaje enviado ✓';
      button.disabled = true;

      setTimeout(() => {
        button.textContent = originalText;
        button.disabled = false;
      }, 2200);
    }

    contactForm.reset();
  });
}
