  const scrollTopBtn = document.getElementById("scrollTopBtn");

  // Mostrar ou esconder o botão conforme rola a página
  window.onscroll = () => {
    if (document.documentElement.scrollTop > 200) {
      scrollTopBtn.classList.add("show");
    } else {
      scrollTopBtn.classList.remove("show");
    }
  };

  // Função para rolar suavement até o topo
  function scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  }
