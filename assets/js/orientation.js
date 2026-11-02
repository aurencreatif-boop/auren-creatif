// AUREN CRÉATIF · Landing Page d'Orientation
document.addEventListener('DOMContentLoaded', () => {
  const logo = document.getElementById('logoWrapper');
  const card = document.querySelector('.orientation-card');
  const buttons = document.querySelectorAll('.action-btn');

  // Animation dynamique interactive au survol de la carte (sur ordinateur)
  if (card && logo && window.matchMedia('(hover: hover)').matches) {
    card.addEventListener('mousemove', (e) => {
      const rect = logo.getBoundingClientRect();
      const logoCenterX = rect.left + rect.width / 2;
      const logoCenterY = rect.top + rect.height / 2;

      const deltaX = (e.clientX - logoCenterX) / 25;
      const deltaY = (e.clientY - logoCenterY) / 25;

      logo.style.transform = `perspective(600px) rotateY(${deltaX}deg) rotateX(${-deltaY}deg) translateY(-4px)`;
    });

    card.addEventListener('mouseleave', () => {
      logo.style.transform = '';
    });
  }

  // Micro-vibration sur mobile lors du clic
  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      if (navigator.vibrate) {
        navigator.vibrate(10);
      }
    });
  });
});
