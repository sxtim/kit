/**
 * Модуль для работы с API банков и отображения данных в модальном окне
 */

function initBankApi() {
	// Функция для загрузки информации о банке
	async function loadBankInfo(bankId) {
		try {
			// Прямой запрос к API
			const apiUrl = ` https://oooipkit.ru/bank/info/${bankId}`

			const response = await fetch(apiUrl, {
				method: "GET",
				headers: {
					Accept: "application/json",
				},
				// Для обхода CORS при локальной разработке
				mode: "cors",
			})

			if (!response.ok) {
				throw new Error(`Ошибка HTTP: ${response.status}`)
			}

			const bankData = await response.json()
			return bankData
		} catch (error) {
			console.error("Ошибка при загрузке данных банка:", error)
			return null
		}
	}

	// Функция заполнения модального окна данными банка
	function fillBankModal(bankData) {
		if (!bankData) return

		// Получаем элементы модального окна
		const bankLogo = document.getElementById("bank-logo")
		const bankTitle = document.getElementById("bank-title")
		const bankContact = document.getElementById("bank-contact")
		const bankPhone = document.getElementById("bank-phone")
		const bankMobilePhone = document.getElementById("bank-mobile-phone")
		const bankEmail = document.getElementById("bank-email")
		const bankSite = document.getElementById("bank-site")

		// Заполняем данными
		bankLogo.src = bankData.img || ""
		bankLogo.alt = bankData.title || ""
		bankTitle.textContent = bankData.title || ""
		bankContact.textContent = bankData.contact || ""
		bankPhone.textContent = bankData.phone || ""
		bankMobilePhone.textContent = bankData.mobile_phone
			? `сот. ${bankData.mobile_phone}`
			: ""
		bankEmail.textContent = bankData.email || ""

		if (bankData.site) {
			bankSite.href = bankData.site
			bankSite.textContent = bankData.site
			bankSite.style.display = "inline-block"
		} else {
			bankSite.style.display = "none"
		}
	}

	// Функция закрытия модального окна
	function closeModal(modal) {
		modal.classList.remove("active")
		document.body.classList.remove("no-scroll")
	}

	// Инициализация обработчиков модального окна банка
	function initBankModalHandlers() {
		const modal = document.getElementById("modal-bank")
		if (!modal) return

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
	}

	// Обработчик кликов на карточки банков
	function initBankCards() {
		// Находим все карточки банков
		const bankCards = document.querySelectorAll(
			".mortgage-calculator__bank-card"
		)

		bankCards.forEach(card => {
			card.addEventListener("click", async function (e) {
				e.preventDefault()

				// Получаем ID банка из атрибута data-bank-id
				const bankId = this.getAttribute("data-bank-id")

				if (!bankId) {
					console.error("ID банка не указан")
					return
				}

				// Загружаем данные банка
				const bankData = await loadBankInfo(bankId)

				if (bankData) {
					// Заполняем модальное окно данными
					fillBankModal(bankData)

					// Открываем модальное окно
					const modal = document.getElementById("modal-bank")
					if (modal) {
						modal.classList.add("active")
						document.body.classList.add("no-scroll")
					} else {
						console.error('Модальное окно с ID "modal-bank" не найдено')
					}
				} else {
					// Обработка ошибки - можно показать сообщение пользователю
					console.error("Не удалось загрузить информацию о банке")
				}
			})
		})
	}

	// Инициализация карточек банков при загрузке страницы
	if (document.querySelector(".mortgage-calculator__bank-card")) {
		initBankCards()
	}

	// Инициализация обработчиков модального окна
	initBankModalHandlers()
}

export default initBankApi
