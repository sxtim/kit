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
				// Получаем ссылку на родительское модальное окно до очистки формы
				const parentModal = form.closest(".modal")

				// Отключаем кнопку отправки формы для предотвращения повторных отправок
				const submitButton = form.querySelector(".form-contact__btn")
				if (submitButton) {
					submitButton.disabled = true
					submitButton.classList.add("disabled")
				}

				// Создаем объект с данными формы
				const formData = new FormData(form)
				const formDataObj = {}
				formData.forEach((value, key) => {
					formDataObj[key] = value
				})

				// Отправка данных на API
				fetch("/api/contact", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify(formDataObj),
				})
					.then(response => response.json())
					.then(data => {
						// Очистка формы
						form.reset()

						// Сначала закрываем модальное окно, если форма находится в нём
						if (parentModal) {
							parentModal.classList.remove("active")
							document.body.classList.remove("no-scroll")
						}

						// После небольшой задержки показываем модальное окно с результатом
						setTimeout(() => {
							if (data.success) {
								showSuccessModal()
							} else {
								showErrorModal()
							}

							// Возвращаем активное состояние кнопки
							if (submitButton) {
								submitButton.disabled = false
								submitButton.classList.remove("disabled")
							}
						}, 300)
					})
					.catch(error => {
						console.error("Ошибка при отправке данных:", error)

						// Показываем модальное окно с ошибкой
						showErrorModal()

						// Возвращаем активное состояние кнопки
						if (submitButton) {
							submitButton.disabled = false
							submitButton.classList.remove("disabled")
						}
					})
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

	// Функция показа модального окна с ошибкой
	function showErrorModal() {
		const errorModal = document.getElementById("modal-error")
		if (errorModal) {
			// Показываем модальное окно
			errorModal.classList.add("active")
			document.body.classList.add("no-scroll")

			// Автоматическое закрытие через 5 секунд
			setTimeout(() => {
				errorModal.classList.remove("active")
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
