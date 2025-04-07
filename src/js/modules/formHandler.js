/**
 * Модуль для обработки форм обратной связи
 */
function initFormHandlers() {
	// Находим все формы с классом form-contact
	const forms = document.querySelectorAll("form.form-contact")
	if (!forms.length) return

	// Для каждой найденной формы
	forms.forEach(form => {
		// Находим все поля ввода в форме
		const inputs = form.querySelectorAll("input[required]")

		// Добавляем слушатели событий на все поля для проверки валидности формы
		inputs.forEach(input => {
			input.addEventListener("input", () => checkFormValidity(form))
			input.addEventListener("change", () => checkFormValidity(form))
			input.addEventListener("blur", () => checkFormValidity(form))
		})

		// Проверка валидности при загрузке страницы
		checkFormValidity(form)

		// Обработка отправки формы
		form.addEventListener("submit", function (e) {
			e.preventDefault() // Предотвращаем стандартную отправку формы

			// Валидация формы перед отправкой
			if (isFormValid(form)) {
				// Здесь будет отправка данных формы на сервер
				// Можно использовать fetch или XMLHttpRequest

				// Эмуляция отправки формы (в реальном проекте здесь будет запрос на сервер)
				setTimeout(() => {
					// Очистка формы
					form.reset()

					// Закрытие модального окна, если форма находится в модальном окне
					const parentModal = form.closest(".modal")
					if (parentModal) {
						parentModal.classList.remove("active")
					}

					// Показываем модальное окно успешной отправки
					showSuccessModal()
				}, 500)
			}
		})
	})

	// Функция показа модального окна успешной отправки
	function showSuccessModal() {
		const successModal = document.getElementById("modal-success")
		if (successModal) {
			// Показываем модальное окно
			successModal.classList.add("active")
			document.body.classList.add("no-scroll")

			// Автоматическое закрытие через 5 секунд
			setTimeout(() => {
				successModal.classList.remove("active")
				document.body.classList.remove("no-scroll")
			}, 5000)
		}
	}

	// Функция проверки валидности формы
	function isFormValid(form) {
		const inputs = form.querySelectorAll("input[required]")
		let isValid = true

		// Проверяем все обязательные поля
		inputs.forEach(input => {
			// Для телефона проверяем корректность заполнения
			if (input.type === "tel" || input.id.includes("phone")) {
				// Получаем только цифры из введенного номера (игнорируем форматирование)
				const digitsOnly = input.value.replace(/\D/g, "")

				// Проверяем только количество цифр (должно быть 11 с кодом страны)
				const isPhoneComplete = digitsOnly.length === 11

				if (!isPhoneComplete) {
					isValid = false
				}
			}
			// Для чекбоксов проверяем, что они отмечены
			else if (input.type === "checkbox" && !input.checked) {
				isValid = false
			}
			// Для текстовых полей проверяем, что они не пусты
			else if (input.value.trim() === "") {
				isValid = false
			}
		})

		return isValid
	}

	// Функция проверки валидности формы и управления состоянием кнопки
	function checkFormValidity(form) {
		const submitButton = form.querySelector(".form-contact__btn")
		if (!submitButton) return

		// Проверяем валидность формы
		const isValid = isFormValid(form)

		// Устанавливаем/снимаем класс disabled для кнопки в зависимости от валидности формы
		if (isValid) {
			submitButton.classList.remove("disabled")
			submitButton.disabled = false
		} else {
			submitButton.classList.add("disabled")
			submitButton.disabled = true
		}
	}
}

export default initFormHandlers
