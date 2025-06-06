// carrossel de imagens (estudo de caso)

const carousel = document.getElementById('caroussel');
let index = 0;

setInterval(() => {
  index = (index + 1) % 5;
  carousel.style.transform = `translateX(-${index * 100}%)`;
}, 3000); // troca a cada 3 segundos
