const principles = document.querySelectorAll('.principle');

principles.forEach((item, index) => {
  item.style.transitionDelay = `${index * 120}ms`;
});
