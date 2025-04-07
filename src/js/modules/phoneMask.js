/**
 * Модуль для инициализации масок телефонных номеров
 */
import IMask from "imask"

function initPhoneMasks() {
	// Выбираем все поля ввода телефона (по типу и id, содержащему 'phone')
	const phoneInputs = document.querySelectorAll(
		'input[type="tel"], input[id*="phone"]'
	)

	if (!phoneInputs.length) return

	// Применяем маску к каждому полю
	phoneInputs.forEach(input => {
		const maskOptions = {
			mask: "+{7} 000 000 00 00",
			lazy: false,
			placeholderChar: " ",
		}

		const mask = IMask(input, maskOptions)

		// При изменении поля телефона также инициируем событие change
		mask.on("accept", () => {
			// Создаем и вызываем событие input для запуска проверки валидности всей формы
			const event = new Event("input", { bubbles: true })
			input.dispatchEvent(event)

			// Создаем и вызываем событие change для надежности
			const changeEvent = new Event("change", { bubbles: true })
			input.dispatchEvent(changeEvent)

			// Также проверяем визуальную валидность
			validatePhoneInput(input, mask)
		})

		// Оставляем обработчик для визуальной индикации валидности поля
		input.addEventListener("blur", () => validatePhoneInput(input, mask))
		input.addEventListener("input", () => {
			// Проверяем валидность при вводе
			validatePhoneInput(input, mask)
		})
	})

	// Функция визуальной валидации телефонного номера
	function validatePhoneInput(input, mask) {
		// Получаем только цифры из введенного номера
		const digitsOnly = input.value.replace(/\D/g, "")

		// Проверяем количество цифр (должно быть 11 с кодом страны)
		const validLength = digitsOnly.length === 11

		// Проверяем, что маска полностью заполнена используя unmaskedValue маски
		const isComplete = validLength && mask.unmaskedValue.length === 11

		// Проверяем, что поле не пустое
		const hasValue = digitsOnly.length > 0

		// Убираем красную рамку, если номер корректен или поле пустое
		if (isComplete || !hasValue) {
			input.classList.remove("invalid-phone")
		} else if (hasValue) {
			// Добавляем красную рамку только если что-то введено, но номер не полный
			input.classList.add("invalid-phone")
		}
	}
}

export default initPhoneMasks
