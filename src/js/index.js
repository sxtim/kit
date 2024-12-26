import mobileNav from './modules/mobile-nav.js';
mobileNav();
import  './modules/tabs';
import  './modules/range-slider';
require("fslightbox");


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
const swiperTabsNav = new Swiper('.swiper-tabs-nav', {
    spaceBetween: 16,
    slidesPerView: 4,
});

// Swiper Content
const swiperTabsContent = new Swiper('.swiper-tabs-content', {
    spaceBetween: 0,
    allowTouchMove: false,
    loop:false,
    autoHeight: true,
    longSwipes: true,
    resistanceRatio: 0, // Disable First and Last Swiper
    watchOverflow: true,
    loopedSlides: 5,
    thumbs: {
        swiper: swiperTabsNav,
    },
});

//MODAL TABS APARTMENT

// Открыть модальное окно
document.getElementById("open-modal-btn1").addEventListener("click", function() {
  document.getElementById("my-modal").classList.add("open")
})


// Закрыть модальное окно
document.getElementById("close-my-modal-btn").addEventListener("click", function() {
  document.getElementById("my-modal").classList.remove("open")
})

// Закрыть модальное окно при нажатии на Esc
window.addEventListener('keydown', (e) => {
  if (e.key === "Escape") {
    document.getElementById("my-modal").classList.remove("open")
  }
});

// Закрыть модальное окно при клике вне его
document.querySelector("#my-modal .modal__box").addEventListener('click', event => {
  event._isClickWithInModal = true;
});
document.getElementById("my-modal").addEventListener('click', event => {
  if (event._isClickWithInModal) return;
  event.currentTarget.classList.remove('open');
});



//FSLIGHTBOX

refreshFsLightbox();


