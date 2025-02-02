//SLIDER MAIN
// import Swiper bundle with all modules installed
import Swiper from 'swiper/bundle';

// import styles bundle
import 'swiper/css/bundle';

// init Swiper:
const swiper = new Swiper('.swiper', {
  // Optional parameters
  direction: 'horizontal',
  loop: true,
  parallax: true,
  speed: 1000,

  keyboard: {
    enabled: true,
  },

  // If we need pagination
  pagination: {
    el: '.slider-controls__count',
    type: 'fraction',
  },

  // Navigation arrows
  navigation: {
    nextEl: '#sliderNext',
    prevEl: '#sliderPrev',
  },

  // And if we need scrollbar
  scrollbar: {
    el: '.swiper-scrollbar',
  },
});


//SLIDER TABS APARTMENT


//SLIDER APARTMENT
var swiperApartmentSimilar = new Swiper(".apartment-similar-swiper", {
  slidesPerView: 1.2,
  spaceBetween: 30,
  pagination: {
    el: ".apartment-similar-swiper-pag",
    clickable: true,
  },
  breakpoints: {
    360: {
      slidesPerView: 1.4
    },
    768: {
      slidesPerView: 2
    },
    998: {
      slidesPerView: 3.2
    }
  },
});


let sliderOne = new Swiper(".commerce-info__slider", {
  pagination: {
    el: ".commerce-info__slider-pagination",
    clickable: true
  },
  loop: true
});