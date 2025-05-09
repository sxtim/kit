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
			maximumFractionDigits: step % 1 !== 0 ? 1 : 0, // Если шаг дробный, показываем 1 знак после запятой
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
		// Сначала убираем все пробелы
		let cleanValue = value.replace(/\s+/g, "")
		// Заменяем запятую на точку для правильной обработки JavaScript
		cleanValue = cleanValue.replace(",", ".")
		return cleanValue
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
				// Округляем с учетом шага (для дробных значений)
				return step % 1 !== 0
					? parseFloat(parseFloat(value).toFixed(1))
					: Math.round(value)
			},
			from: function (value) {
				// Убеждаемся, что value - всегда строка, затем конвертируем её в число
				return Number(unformatNumber(String(value)))
			},
		},
	})

	// Обновление значений в инпутах и их ширины
	slider.noUiSlider.on("update", function (values, handle) {
		// Форматируем значение для отображения с учетом локали
		const formattedValue = formatNumber(values[handle])

		// Если инпут имеет type="number", нам нужно заменить запятую на точку
		// для совместимости с требованиями HTML
		if (inputs[handle].type === "number") {
			// Для числовых инпутов используем значение с точкой
			const valueWithDot = String(values[handle]).replace(",", ".")
			inputs[handle].value = valueWithDot
		} else {
			// Для текстовых инпутов можно использовать форматированное значение с запятой
			inputs[handle].value = formattedValue
		}

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
		// При фокусе показываем необработанное значение
		input.addEventListener("focus", function () {
			if (input.type === "number") {
				// Для числовых инпутов уже используется точка, просто убираем форматирование
				this.value = this.value
			} else {
				// Для текстовых инпутов преобразуем запятую в точку
				this.value = unformatNumber(this.value)
			}
			adjustInputWidth(this)
		})

		// При потере фокуса форматируем число
		input.addEventListener("blur", function () {
			const value = unformatNumber(this.value)

			if (input.type === "number") {
				// Для числовых инпутов сохраняем значение с точкой
				this.value = value
			} else {
				// Для текстовых инпутов форматируем с запятой
				const formattedValue = formatNumber(value)
				this.value = formattedValue
			}

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
	// Динамическая инициализация слайдера цены
	const priceSlider = document.getElementById("price-slider")
	if (priceSlider) {
		// Получаем минимальное и максимальное значения из атрибутов data-*
		const minValue = parseInt(priceSlider.dataset.min)
		const maxValue = parseInt(priceSlider.dataset.max)
		const stepValue = parseFloat(priceSlider.dataset.step)

		// Инициализируем слайдер с динамическими значениями
		createSlider({
			sliderId: "price-slider",
			inputMinId: "input-price-min",
			inputMaxId: "input-price-max",
			startMin: minValue,
			startMax: maxValue,
			step: stepValue,
			rangeMin: minValue,
			rangeMax: maxValue,
		})
	}

	// Динамическая инициализация слайдера площади
	const squareSlider = document.getElementById("square-slider")
	if (squareSlider) {
		// Получаем минимальное и максимальное значения из атрибутов data-*
		const minValue = parseInt(squareSlider.dataset.min)
		const maxValue = parseInt(squareSlider.dataset.max)
		const stepValue = parseFloat(squareSlider.dataset.step)

		// Инициализируем слайдер с динамическими значениями
		createSlider({
			sliderId: "square-slider",
			inputMinId: "input-square-min",
			inputMaxId: "input-square-max",
			startMin: minValue,
			startMax: maxValue,
			step: stepValue,
			rangeMin: minValue,
			rangeMax: maxValue,
		})
	}

	// Динамическая инициализация слайдера этажей
	const floorSlider = document.getElementById("floor-slider")
	if (floorSlider) {
		// Получаем минимальное и максимальное значения из атрибутов data-*
		const minValue = parseInt(floorSlider.dataset.min)
		const maxValue = parseInt(floorSlider.dataset.max)
		const stepValue = parseFloat(floorSlider.dataset.step)

		// Инициализируем слайдер с динамическими значениями
		createSlider({
			sliderId: "floor-slider",
			inputMinId: "input-floor-min",
			inputMaxId: "input-floor-max",
			startMin: minValue,
			startMax: maxValue,
			step: stepValue,
			rangeMin: minValue,
			rangeMax: maxValue,
		})
	}

	// Динамическая инициализация слайдера цены коммерческих помещений
	const commercePriceSlider = document.getElementById("commerce-price-slider")
	if (commercePriceSlider) {
		// Получаем минимальное и максимальное значения из атрибутов data-*
		const minValue = parseInt(commercePriceSlider.dataset.min)
		const maxValue = parseInt(commercePriceSlider.dataset.max)
		const stepValue = parseFloat(commercePriceSlider.dataset.step)

		// Инициализируем слайдер с динамическими значениями
		createSlider({
			sliderId: "commerce-price-slider",
			inputMinId: "commerce-input-price-min",
			inputMaxId: "commerce-input-price-max",
			startMin: minValue,
			startMax: maxValue,
			step: stepValue,
			rangeMin: minValue,
			rangeMax: maxValue,
		})
	}

	// Динамическая инициализация слайдера площади коммерческих помещений
	const commerceSquareSlider = document.getElementById("commerce-square-slider")
	if (commerceSquareSlider) {
		// Получаем минимальное и максимальное значения из атрибутов data-*
		const minValue = parseInt(commerceSquareSlider.dataset.min)
		const maxValue = parseInt(commerceSquareSlider.dataset.max)
		const stepValue = parseFloat(commerceSquareSlider.dataset.step)

		// Инициализируем слайдер с динамическими значениями
		createSlider({
			sliderId: "commerce-square-slider",
			inputMinId: "commerce-input-square-min",
			inputMaxId: "commerce-input-square-max",
			startMin: minValue,
			startMax: maxValue,
			step: stepValue,
			rangeMin: minValue,
			rangeMax: maxValue,
		})
	}

	// Обработчик для кнопки "Показать все фильтры"
	const showAllFiltersBtn = document.querySelector(".filter__show-all-btn")
	if (showAllFiltersBtn) {
		showAllFiltersBtn.addEventListener("click", function (event) {
			event.preventDefault() // Предотвращаем отправку формы
			const hiddenElements = document.querySelectorAll(
				".filter__hidden-elements"
			)
			hiddenElements.forEach(element => {
				element.classList.toggle("active")
			})
			this.textContent =
				this.textContent === "Все фильтры" ? "Скрыть фильтры" : "Все фильтры"
		})
	}
})

//DROPDOWN FILTER
document.addEventListener("DOMContentLoaded", function () {
	// Получаем все элементы с классом .filter__dropdown (списки выбора)
	const dropdowns = document.querySelectorAll(".filter__dropdown")
	// Пустой массив для хранения всех контейнеров содержимого дропдаунов
	const allDropdownContents = []

	dropdowns.forEach(dropdown => {
		// Кнопка, которая открывает выпадающее меню
		const dropdownBtn = dropdown.querySelector(".filter__dropdown-menu-btn")
		// Контейнер с содержимым
		const dropdownContent = dropdown.querySelector(".filter__dropdown-content")

		// Добавляем контейнер в общий массив для закрытия всех при клике вне
		if (dropdownContent) {
			allDropdownContents.push({
				content: dropdownContent,
				button: dropdownBtn,
			})
		}

		// Если это дропдаун сортировки
		if (dropdown.classList.contains("catalog-sort__dropdown")) {
			const sortItems = dropdownContent.querySelectorAll(".sort-item")

			// Открытие/закрытие выпадающего списка при клике на кнопку
			dropdownBtn.addEventListener("click", function (event) {
				event.stopPropagation() // Предотвращаем всплытие события

				// Закрываем все другие открытые дропдауны
				allDropdownContents.forEach(item => {
					if (item.content !== dropdownContent) {
						item.content.classList.remove("active")
						if (item.button) item.button.classList.remove("open")
					}
				})

				// Открываем/закрываем текущее меню
				dropdownContent.classList.toggle("active")
				dropdownBtn.classList.toggle("open")
			})

			// Обработка выбора элемента сортировки
			sortItems.forEach(item => {
				item.addEventListener("click", function (event) {
					// Находим radio-input внутри элемента и проверяем его
					const radioInput = this.querySelector('input[type="radio"]')
					if (radioInput) {
						radioInput.checked = true
					}

					// Убираем активный класс у всех элементов
					sortItems.forEach(sortItem => sortItem.classList.remove("selected"))
					// Добавляем активный класс выбранному элементу
					this.classList.add("selected")
					// Обновляем текст кнопки
					dropdownBtn.textContent = this.querySelector("label").textContent
					// Закрываем дропдаун
					dropdownContent.classList.remove("active")
					dropdownBtn.classList.remove("open")

					// Здесь можно добавить логику для сортировки элементов
					const sortType = this.dataset.sort
					console.log("Сортировка по:", sortType)

					// Предотвращаем всплытие события
					event.stopPropagation()
				})
			})

			return // Пропускаем остальной код для дропдауна фильтра
		}

		// Для обычных дропдаунов фильтра
		// Все элементы чекбоксов внутри списка
		const inputFields = dropdownContent
			? dropdownContent.querySelectorAll(".input_field")
			: []
		// Отдельный элемент "Любой" (если он есть)
		const allInputField = dropdownContent
			? dropdownContent.querySelector(".input_field.all-input-field")
			: null
		// Все чекбоксы внутри выпадающего списка
		const checkboxes = dropdownContent
			? dropdownContent.querySelectorAll('input[type="checkbox"]')
			: []

		// Сохраняем начальный текст кнопки
		const initialText = dropdownBtn ? dropdownBtn.textContent : ""

		// Открытие/закрытие выпадающего списка при клике на кнопку
		if (dropdownBtn && dropdownContent) {
			dropdownBtn.addEventListener("click", function (event) {
				event.stopPropagation() // Предотвращаем всплытие события

				// Закрываем все другие открытые дропдауны
				allDropdownContents.forEach(item => {
					if (item.content !== dropdownContent) {
						item.content.classList.remove("active")
						if (item.button) item.button.classList.remove("open")
					}
				})

				// Открываем/закрываем текущее меню
				dropdownContent.classList.toggle("active")
				dropdownBtn.classList.toggle("open")
			})
		}

		// Функция обновления текста кнопки в зависимости от выбранных чекбоксов
		const updateButtonText = () => {
			// Получаем текст всех выбранных элементов и соединяем запятой
			const selectedValues = Array.from(inputFields)
				.filter(field => field.querySelector("input").checked)
				.map(field => field.querySelector("label").textContent)
				.join(", ")

			// Если ничего не выбрано, оставляем исходный текст
			if (dropdownBtn) {
				dropdownBtn.textContent = selectedValues || initialText
			}
		}

		// Функция проверки, нужно ли автоматически выбрать "Любой"
		const checkAndSelectAllInputField = () => {
			if (!allInputField) return

			const isAnyChecked = Array.from(inputFields).some(
				field => field !== allInputField && field.querySelector("input").checked
			)

			// Если ни один чекбокс (кроме "Любой") не выбран, включаем его
			if (!isAnyChecked) {
				allInputField.querySelector("input").checked = true
			}
		}

		// Функция обновления класса .selected для изменения фона активных чекбоксов
		const updateSelectedFields = () => {
			inputFields.forEach(field => {
				const checkbox = field.querySelector("input")
				if (checkbox && checkbox.checked) {
					field.classList.add("selected") // Добавляем серый фон
				} else {
					field.classList.remove("selected") // Убираем серый фон
				}
			})
		}

		// Добавляем обработчики событий для чекбоксов
		checkboxes.forEach(checkbox => {
			checkbox.addEventListener("change", function () {
				// Если это обычный дропдаун фильтра с чекбоксами
				if (allInputField) {
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
				}
			})
		})

		// Проверяем, есть ли выбранные элементы при загрузке страницы
		const hasChecked = Array.from(inputFields).some(
			field =>
				field.querySelector("input") && field.querySelector("input").checked
		)

		// Если ничего не выбрано, включаем "Любой" по умолчанию
		if (!hasChecked && allInputField && dropdownBtn) {
			allInputField.querySelector("input").checked = true
			dropdownBtn.textContent = allInputField.querySelector("label").textContent
		}

		// Вызываем функцию обновления фона для активных чекбоксов при загрузке
		updateSelectedFields()
	})

	// Закрытие всех дропдаунов при клике вне
	document.addEventListener("click", function (event) {
		allDropdownContents.forEach(item => {
			const { content, button } = item
			if (
				content &&
				button &&
				!content.contains(event.target) &&
				!button.contains(event.target)
			) {
				content.classList.remove("active")
				button.classList.remove("open")
			}
		})
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
