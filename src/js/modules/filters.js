import noUiSlider from "nouislider"
import "nouislider/dist/nouislider.css"

/**
 * Создает слайдер с форматированием значений
 * @param {Object} config - конфигурация слайдера
 */
function createSlider(config) {
	const {
		sliderId,
		inputMinId,
		inputMaxId,
		startMin,
		startMax,
		step,
		rangeMin,
		rangeMax,
		formatOptions = {
			style: "decimal",
			useGrouping: true,
			minimumFractionDigits: 0,
			maximumFractionDigits: 0,
		},
	} = config

	const slider = document.getElementById(sliderId)

	if (!slider) return

	const inputMin = document.getElementById(inputMinId)
	const inputMax = document.getElementById(inputMaxId)

	if (!inputMin || !inputMax) return

	const inputs = [inputMin, inputMax]

	// Форматирование числа с разделением разрядов
	const formatNumber = value => {
		return Number(value).toLocaleString("ru-RU", formatOptions)
	}

	// Очистка форматирования для обработки ввода
	const unformatNumber = value => {
		return value.replace(/\s+/g, "").replace(",", ".")
	}

	// Автоподстройка ширины поля по содержимому
	const adjustInputWidth = input => {
		const tempSpan = document.createElement("span")
		tempSpan.style.visibility = "hidden"
		tempSpan.style.position = "absolute"
		tempSpan.style.whiteSpace = "pre"
		tempSpan.style.font = window.getComputedStyle(input).font
		tempSpan.textContent = input.value || "0"

		document.body.appendChild(tempSpan)
		const width = tempSpan.getBoundingClientRect().width + 8 // добавляем небольшой отступ
		document.body.removeChild(tempSpan)

		input.style.width = `${Math.max(40, width)}px`
	}

	noUiSlider.create(slider, {
		start: [startMin, startMax],
		connect: true,
		step: step,
		range: {
			min: [rangeMin],
			max: [rangeMax],
		},
		format: {
			to: function (value) {
				return Math.round(value)
			},
			from: function (value) {
				return Number(unformatNumber(value))
			},
		},
	})

	// Обновление значений в инпутах и их ширины
	slider.noUiSlider.on("update", function (values, handle) {
		const formattedValue = formatNumber(values[handle])
		inputs[handle].value = formattedValue
		adjustInputWidth(inputs[handle])
	})

	// Функция обновления слайдера при изменении значений в инпутах
	const setRangeSlider = (i, value) => {
		let arr = [null, null]
		arr[i] = value
		slider.noUiSlider.set(arr)
	}

	// Обработчики событий для инпутов
	inputs.forEach((input, index) => {
		// При фокусе убираем форматирование для удобства редактирования
		input.addEventListener("focus", function () {
			this.value = unformatNumber(this.value)
			adjustInputWidth(this)
		})

		// При потере фокуса форматируем число
		input.addEventListener("blur", function () {
			const value = unformatNumber(this.value)
			const formattedValue = formatNumber(value)
			this.value = formattedValue
			adjustInputWidth(this)
		})

		// При изменении значения обновляем слайдер
		input.addEventListener("change", function (e) {
			const value = unformatNumber(this.value)
			setRangeSlider(index, value)
		})

		// Подстраиваем ширину при вводе
		input.addEventListener("input", function () {
			adjustInputWidth(this)
		})
	})

	// Инициализация ширины полей при загрузке
	inputs.forEach(input => adjustInputWidth(input))
}

// Создание слайдеров с использованием объекта конфигурации
document.addEventListener("DOMContentLoaded", function () {
	// Слайдер цены
	createSlider({
		sliderId: "price-slider",
		inputMinId: "input-price-min",
		inputMaxId: "input-price-max",
		startMin: 4000000,
		startMax: 12000000,
		step: 500,
		rangeMin: 4000000,
		rangeMax: 12000000,
	})

	// Слайдер площади
	createSlider({
		sliderId: "square-slider",
		inputMinId: "input-square-min",
		inputMaxId: "input-square-max",
		startMin: 40,
		startMax: 120,
		step: 10,
		rangeMin: 40,
		rangeMax: 120,
	})

	// Слайдер этажей
	createSlider({
		sliderId: "floor-slider",
		inputMinId: "input-floor-min",
		inputMaxId: "input-floor-max",
		startMin: 2,
		startMax: 16,
		step: 1,
		rangeMin: 2,
		rangeMax: 16,
	})

	// Слайдеры для коммерческого фильтра
	createSlider({
		sliderId: "commerce-price-slider",
		inputMinId: "commerce-input-price-min",
		inputMaxId: "commerce-input-price-max",
		startMin: 12000000,
		startMax: 160000000,
		step: 500,
		rangeMin: 12000000,
		rangeMax: 160000000,
	})

	createSlider({
		sliderId: "commerce-square-slider",
		inputMinId: "commerce-input-square-min",
		inputMaxId: "commerce-input-square-max",
		startMin: 80,
		startMax: 12000,
		step: 10,
		rangeMin: 80,
		rangeMax: 12000,
	})
})

//DROPDOWN FILTER
document.addEventListener("DOMContentLoaded", function () {
	// Получаем все элементы с классом .filter__dropdown (списки выбора)
	const dropdowns = document.querySelectorAll(".filter__dropdown")

	dropdowns.forEach(dropdown => {
		// Кнопка, которая открывает выпадающее меню
		const dropdownBtn = dropdown.querySelector(".filter__dropdown-menu-btn")
		// Контейнер с чекбоксами
		const dropdownContent = dropdown.querySelector(".filter__dropdown-content")
		// Все элементы чекбоксов внутри списка
		const inputFields = dropdownContent.querySelectorAll(".input_field")
		// Отдельный элемент "Любой" (если он есть)
		const allInputField = dropdownContent.querySelector(
			".input_field.all-input-field"
		)
		// Все чекбоксы внутри выпадающего списка
		const checkboxes = dropdownContent.querySelectorAll(
			'input[type="checkbox"]'
		)

		// Сохраняем начальный текст кнопки
		const initialText = dropdownBtn.textContent

		// Открытие/закрытие выпадающего списка при клике на кнопку
		dropdownBtn.addEventListener("click", function (event) {
			event.stopPropagation() // Предотвращаем всплытие события (чтобы не закрывался сразу)

			// Закрываем другие открытые списки
			dropdowns.forEach(otherDropdown => {
				if (otherDropdown !== dropdown) {
					otherDropdown
						.querySelector(".filter__dropdown-content")
						.classList.remove("active")
					otherDropdown
						.querySelector(".filter__dropdown-menu-btn")
						.classList.remove("open")
				}
			})

			// Открываем/закрываем текущее меню
			dropdownContent.classList.toggle("active")
			dropdownBtn.classList.toggle("open")
		})

		// Закрытие списка при клике вне него
		document.addEventListener("click", function (event) {
			if (!dropdownContent.contains(event.target)) {
				dropdownContent.classList.remove("active")
				dropdownBtn.classList.remove("open")
			}
		})

		// Функция обновления текста кнопки в зависимости от выбранных чекбоксов
		const updateButtonText = () => {
			// Получаем текст всех выбранных элементов и соединяем запятой
			const selectedValues = Array.from(inputFields)
				.filter(field => field.querySelector("input").checked)
				.map(field => field.querySelector("label").textContent)
				.join(", ")

			// Если ничего не выбрано, оставляем исходный текст
			dropdownBtn.textContent = selectedValues || initialText
		}

		// Функция проверки, нужно ли автоматически выбрать "Любой"
		const checkAndSelectAllInputField = () => {
			const isAnyChecked = Array.from(inputFields).some(
				field => field !== allInputField && field.querySelector("input").checked
			)

			// Если ни один чекбокс (кроме "Любой") не выбран, включаем его
			if (!isAnyChecked && allInputField) {
				allInputField.querySelector("input").checked = true
			}
		}

		// Функция обновления класса .selected для изменения фона активных чекбоксов
		const updateSelectedFields = () => {
			inputFields.forEach(field => {
				const checkbox = field.querySelector("input")
				if (checkbox.checked) {
					field.classList.add("selected") // Добавляем серый фон
				} else {
					field.classList.remove("selected") // Убираем серый фон
				}
			})
		}

		// Добавляем обработчики событий для чекбоксов
		checkboxes.forEach(checkbox => {
			checkbox.addEventListener("change", function () {
				// Если пользователь выбрал "Любой", снимаем отметку с остальных чекбоксов
				if (this === allInputField.querySelector("input")) {
					if (this.checked) {
						checkboxes.forEach(cb => {
							if (cb !== this) cb.checked = false
						})
					}
				} else {
					// Если пользователь выбрал любой другой вариант, снимаем отметку с "Любой"
					allInputField.querySelector("input").checked = false
				}

				// Проверяем, нужно ли включить "Любой", обновляем текст и фон
				checkAndSelectAllInputField()
				updateButtonText()
				updateSelectedFields() // Применяем класс .selected к выбранным элементам
			})
		})

		// Проверяем, есть ли выбранные элементы при загрузке страницы
		const hasChecked = Array.from(inputFields).some(
			field => field.querySelector("input").checked
		)

		// Если ничего не выбрано, включаем "Любой" по умолчанию
		if (!hasChecked && allInputField) {
			allInputField.querySelector("input").checked = true
			dropdownBtn.textContent = allInputField.querySelector("label").textContent
		}

		// Вызываем функцию обновления фона для активных чекбоксов при загрузке
		updateSelectedFields()
	})
})

//Конпки фильтра "Комнаты"
document.addEventListener("DOMContentLoaded", function () {
	const buttons = document.querySelectorAll(".filter__el-btns")

	buttons.forEach(button => {
		button.addEventListener("click", function () {
			// Если кнопка уже активна, снимаем активность
			if (this.classList.contains("active")) {
				this.classList.remove("active")
			} else {
				// Иначе добавляем активность только для этой кнопки
				this.classList.add("active")
			}
		})
	})
})

// Обработчик для кнопки "Показать все фильтры"
const showAllFiltersBtn = document.querySelector(".filter__show-all-btn")
if (showAllFiltersBtn) {
	showAllFiltersBtn.addEventListener("click", () => {
		const hiddenElements = document.querySelectorAll(".filter__hidden-elements")
		hiddenElements.forEach(element => {
			element.classList.toggle("active")
		})
		showAllFiltersBtn.textContent =
			showAllFiltersBtn.textContent === "Все фильтры"
				? "Скрыть фильтры"
				: "Все фильтры"
	})
}
