/**
 * Модуль для работы с модальными окнами
 */
function initModals() {
	const modals = document.querySelectorAll(".modal")
	if (!modals.length) return

	// Открытие модального окна
	function openModal(modalId) {
		const modal = document.getElementById(modalId)
		if (!modal) return

		modal.classList.add("active")
		document.body.classList.add("no-scroll")
	}

	// Закрытие модального окна
	function closeModal(modal) {
		modal.classList.remove("active")
		document.body.classList.remove("no-scroll")
	}

	// Обработчики событий для открытия модальных окон
	document.addEventListener("click", function (e) {
		// Проверяем, является ли элемент или его родитель кнопкой открытия модального окна
		const openButton = e.target.closest("[data-modal]")
		if (openButton) {
			e.preventDefault()
			const modalId = openButton.dataset.modal
			openModal(modalId)
		}
	})

	// Закрытие модальных окон
	modals.forEach(modal => {
		// Закрытие по клику на оверлей
		const overlay = modal.querySelector(".modal__overlay")
		if (overlay) {
			overlay.addEventListener("click", () => closeModal(modal))
		}

		// Закрытие по клику на кнопку закрытия
		const closeButton = modal.querySelector(".modal__close")
		if (closeButton) {
			closeButton.addEventListener("click", () => closeModal(modal))
		}

		// Закрытие по нажатию Esc
		document.addEventListener("keydown", function (e) {
			if (e.key === "Escape" && modal.classList.contains("active")) {
				closeModal(modal)
			}
		})
	})

	// Предотвращение всплытия события при клике на контент модального окна
	modals.forEach(modal => {
		const content = modal.querySelector(".modal__content")
		if (content) {
			content.addEventListener("click", e => e.stopPropagation())
		}
	})
}

export default initModals
