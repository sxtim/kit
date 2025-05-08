/**
 * Модуль для работы с модальными окнами
 */
function initModals() {
	// Функция для инициализации обработчиков модального окна
	function initModalHandlers(modal) {
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

		// Предотвращение всплытия события при клике на контент модального окна
		const content = modal.querySelector(".modal__content")
		if (content) {
			content.addEventListener("click", e => e.stopPropagation())
		}
	}

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

	document.addEventListener("click", function (e) {
		const openButton = e.target.closest("[data-modal]")
		if (openButton) {
			e.preventDefault()
			const modalId = openButton.dataset.modal
			openModal(modalId)
		}
	})

	// Закрытие по нажатию Esc
	document.addEventListener("keydown", function (e) {
		if (e.key === "Escape") {
			const activeModal = document.querySelector(".modal.active")
			if (activeModal) {
				closeModal(activeModal)
			}
		}
	})

	// Инициализация существующих модальных окон
	const modals = document.querySelectorAll(".modal")
	modals.forEach(modal => initModalHandlers(modal))

	// Наблюдатель за изменениями DOM для обработки новых модальных окон
	const observer = new MutationObserver(mutations => {
		mutations.forEach(mutation => {
			mutation.addedNodes.forEach(node => {
				if (
					node.nodeType === 1 &&
					node.classList &&
					node.classList.contains("modal")
				) {
					initModalHandlers(node)
				}
			})
		})
	})

	// Начинаем наблюдение за изменениями в body
	observer.observe(document.body, {
		childList: true,
		subtree: true,
	})
}

export default initModals
