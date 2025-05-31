  const whatsappBtn = document.getElementById('whatsappBtn');
  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const currentScroll = window.scrollY;

    if (currentScroll > lastScroll && currentScroll > 100) {
      whatsappBtn.classList.add('hidden'); // Rolando para baixo
    } else {
      whatsappBtn.classList.remove('hidden'); // Rolando para cima
    }

    lastScroll = currentScroll;
  });
