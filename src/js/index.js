import mobileNav from "./modules/mobile-nav.js"
mobileNav()

import "./modules/filters"
import initFormHandlers from "./modules/formHandler"
import initModals from "./modules/modal"
import initPhoneMasks from "./modules/phoneMask"
import "./modules/tabs"

// Инициализация модальных окон
initModals()

// Инициализация масок телефонных номеров
initPhoneMasks()

// Инициализация обработчиков форм
initFormHandlers()

require("fslightbox")

//SLIDER MAIN
// import Swiper bundle with all modules installed
import Swiper from "swiper/bundle"

// import styles bundle
import "swiper/css/bundle"

// init Swiper:
const swiper = new Swiper(".swiper", {
	// Optional parameters
	direction: "horizontal",
	loop: true,
	parallax: true,
	speed: 1000,

	keyboard: {
		enabled: true,
	},

	// If we need pagination
	pagination: {
		el: ".slider-controls__count",
		type: "fraction",
	},

	// Navigation arrows
	navigation: {
		nextEl: "#sliderNext",
		prevEl: "#sliderPrev",
	},

	// And if we need scrollbar
	scrollbar: {
		el: ".swiper-scrollbar",
	},
})

//SLIDER TABS APARTMENT
const swiperTabsNav = new Swiper(".apartment-swiper-tabs-nav", {
	spaceBetween: 90,
	slidesPerView: 4,
	loop: false,
	breakpoints: {
		360: {
			spaceBetween: 10,
			slidesPerView: 3.5,
		},
		998: {
			slidesPerView: 4,
		},
	},
})

// Swiper Content
const swiperTabsContent = new Swiper(".apartment-swiper-tabs-content", {
	spaceBetween: 0,
	allowTouchMove: false,
	loop: false,
	autoHeight: true,
	longSwipes: true,
	resistanceRatio: 0, // Disable First and Last Swiper
	watchOverflow: true,
	loopedSlides: 5,
	thumbs: {
		swiper: swiperTabsNav,
	},
})

//SLIDER APARTMENT
var swiperApartmentSimilar = new Swiper(".apartment-similar-swiper", {
	slidesPerView: 3,
	spaceBetween: 30,
	pagination: {
		el: ".apartment-similar-swiper-pag",
		clickable: true,
	},
	navigation: {
		nextEl: ".apartment-similar-swiper-next",
		prevEl: ".apartment-similar-swiper-prev",
	},
	breakpoints: {
		360: {
			spaceBetween: 5,
			slidesPerView: 1.3,
		},
		420: {
			spaceBetween: 5,
			slidesPerView: 1.5,
		},
		568: {
			spaceBetween: 5,
			slidesPerView: 2.2,
		},
		768: {
			spaceBetween: 5,
			slidesPerView: 2.4,
		},
		998: {
			spaceBetween: 5,
			slidesPerView: 3.2,
		},
	},
})

//FSLIGHTBOX
refreshFsLightbox()

let sliderOne = new Swiper(".commerce-info__slider", {
	pagination: {
		el: ".commerce-info__slider-pagination",
		clickable: true,
	},
	navigation: {
		nextEl: ".commerce-info__slider-next",
		prevEl: ".commerce-info__slider-prev",
	},
	loop: true,
})

//BUTTON SHARE

const btnShareCopy = document.querySelector(".share-copy-btn")
if (btnShareCopy) {
	btnShareCopy.addEventListener("click", function () {
		const button = this
		const text = document.querySelector(".share-copy-btn span")
		const originalText = text.textContent // Сохраняем оригинальный текст
		const url = window.location.href

		if (button.disabled) return // Если кнопка уже отключена, ничего не делаем

		button.disabled = true // Отключаем кнопку

		navigator.clipboard
			.writeText(url)
			.then(() => {
				text.style.transition = "all 0.5s ease-in-out" // Плавность анимации
				text.style.filter = "blur(2px)" // Размытие перед изменением
				text.style.opacity = "0" // Исчезновение

				setTimeout(() => {
					text.textContent = "Ссылка скопирована!!!"
					text.style.color = "green"

					text.style.filter = "blur(0px)"
					text.style.opacity = "1" // Плавное появление
				}, 500)

				setTimeout(() => {
					text.style.filter = "blur(2px)"
					text.style.opacity = "0"

					setTimeout(() => {
						text.textContent = originalText

						text.style.color = ""
						text.style.filter = "blur(0px)"
						text.style.opacity = "1"
					}, 500)
					button.disabled = false
				}, 3500)
			})
			.catch(err => {
				console.error("Ошибка при копировании: ", err)
			})
	})

	//URL telegram whatsapp
	const currentLinkPage = window.location.href // Получаем URL текущей страницы
	document.querySelector(
		".share-current-link-tg"
	).href = `https://t.me/share/url?url=${currentLinkPage}` // Устанавливаем в href
	document.querySelector(
		".share-current-link-wht"
	).href = `https://wa.me/?text=${currentLinkPage}`
}
