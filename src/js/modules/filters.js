import noUiSlider from "nouislider"
import "nouislider/dist/nouislider.css"

/**
 * Очистка форматирования для обработки ввода из слайдеров и других полей
 */
function unformatNumber(value) {
	if (!value && value !== 0) return ""
	// Преобразуем к строке, если value не строка
	const strValue = String(value)
	// Сначала убираем все пробелы
	let cleanValue = strValue.replace(/\s+/g, "")
	// Заменяем запятую на точку для правильной обработки JavaScript
	cleanValue = cleanValue.replace(",", ".")
	return cleanValue
}

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

/**
 * Универсальный обработчик фильтров
 * Собирает данные со всех фильтров и отправляет на сервер
 */
document.addEventListener("DOMContentLoaded", function () {
	// Находим все формы фильтров
	const filterForms = document.querySelectorAll(
		".filter__form, [data-type='filter']"
	)

	filterForms.forEach(form => {
		// Находим существующую кнопку фильтра
		const submitButton = form.querySelector(".filter__submit-button")

		if (submitButton) {
			// Обработчик нажатия на кнопку фильтра
			submitButton.addEventListener("click", async function () {
				// Получаем форму, с которой работаем
				const form =
					this.closest(".filter__form") || this.closest("[data-type='filter']")
				if (!form) return

				const filterData = collectFilterData(form)
				await sendFilterData(filterData, form)
			})
		}
	})

	/**
	 * Собирает данные со всех фильтров
	 * @param {HTMLElement} filterForm - форма фильтра
	 * @return {Object} - объект с данными фильтров
	 */
	function collectFilterData(filterForm) {
		const filterData = {}

		// Проверяем, является ли форма фильтром
		const isFilterForm =
			filterForm.classList.contains("filter__form") ||
			filterForm.getAttribute("data-type") === "filter"

		if (!isFilterForm) {
			console.warn("Переданная форма не является фильтром")
			return filterData
		}

		// Обработка слайдеров (диапазоны цен, площади, этажей)
		collectRangeSliderData(filterForm, filterData)

		// Обработка чекбоксов (комнат, типов и других категорий)
		collectCheckboxData(filterForm, filterData)

		// Обработка кнопок-переключателей (rooms)
		collectButtonsData(filterForm, filterData)

		// Обработка дропдаунов (сортировка и другие выпадающие списки)
		collectDropdownData(filterForm, filterData)

		return filterData
	}

	/**
	 * Собирает данные из слайдеров диапазонов
	 */
	function collectRangeSliderData(filterForm, filterData) {
		// Обработка слайдера цены
		collectSingleRangeData(
			filterForm,
			"price-slider",
			"input-price-min",
			"input-price-max",
			"price",
			filterData
		)

		// Обработка слайдера площади
		collectSingleRangeData(
			filterForm,
			"square-slider",
			"input-square-min",
			"input-square-max",
			"square",
			filterData
		)

		// Обработка слайдера этажей
		collectSingleRangeData(
			filterForm,
			"floor-slider",
			"input-floor-min",
			"input-floor-max",
			"floor",
			filterData
		)

		// Обработка слайдера цены коммерческих помещений
		collectSingleRangeData(
			filterForm,
			"commerce-price-slider",
			"commerce-input-price-min",
			"commerce-input-price-max",
			"commercePrice",
			filterData
		)

		// Обработка слайдера площади коммерческих помещений
		collectSingleRangeData(
			filterForm,
			"commerce-square-slider",
			"commerce-input-square-min",
			"commerce-input-square-max",
			"commerceSquare",
			filterData
		)
	}

	/**
	 * Собирает данные из одного слайдера диапазона
	 */
	function collectSingleRangeData(
		filterForm,
		sliderId,
		minInputId,
		maxInputId,
		dataKey,
		filterData
	) {
		const slider = filterForm.querySelector(`#${sliderId}`)
		if (!slider) return

		const minInput = filterForm.querySelector(`#${minInputId}`)
		const maxInput = filterForm.querySelector(`#${maxInputId}`)
		if (!minInput || !maxInput) return

		// Получаем значения без форматирования
		const minValueStr = unformatNumber(minInput.value)
		const maxValueStr = unformatNumber(maxInput.value)

		// Преобразуем строки в числа
		let minValue = minValueStr ? parseFloat(minValueStr) : ""
		let maxValue = maxValueStr ? parseFloat(maxValueStr) : ""

		// Проверяем, являются ли преобразованные значения числами
		if (isNaN(minValue)) minValue = ""
		if (isNaN(maxValue)) maxValue = ""

		filterData[dataKey] = {
			min: minValue,
			max: maxValue,
		}
	}

	/**
	 * Собирает данные из чекбоксов
	 */
	function collectCheckboxData(filterForm, filterData) {
		// Собираем все группы чекбоксов по их атрибутам data-filter-group
		const checkboxGroups = filterForm.querySelectorAll("[data-filter-group]")

		const groups = {}
		checkboxGroups.forEach(group => {
			const groupName = group.dataset.filterGroup
			if (!groups[groupName]) {
				groups[groupName] = []
			}
			groups[groupName].push(group)
		})

		// Обрабатываем каждую группу чекбоксов
		for (const [groupName, elements] of Object.entries(groups)) {
			const checkedValues = []

			elements.forEach(el => {
				const checkbox = el.querySelector('input[type="checkbox"]')
				if (
					checkbox &&
					checkbox.checked &&
					!checkbox.closest(".all-input-field")
				) {
					// Получаем значение из атрибута data-value или value
					const value = checkbox.dataset.value || checkbox.value

					// Пытаемся преобразовать значение в число, если возможно
					if (value && !isNaN(value) && value.trim() !== "") {
						const numValue = Number(value)
						// Добавляем числовое значение, если это действительно число
						checkedValues.push(
							Number.isInteger(numValue) ? parseInt(value, 10) : numValue
						)
					} else {
						// Иначе добавляем строковое значение
						checkedValues.push(value)
					}
				}
			})

			// Если есть выбранные значения, добавляем их в результат
			if (checkedValues.length > 0) {
				filterData[groupName] = checkedValues
			}
		}
	}

	/**
	 * Собирает данные из кнопок выбора (например, кнопки комнат)
	 */
	function collectButtonsData(filterForm, filterData) {
		// Проверяем наличие группы кнопок с комнатами
		const roomButtons = filterForm.querySelectorAll(
			".filter__el-btns[data-room]"
		)
		if (roomButtons.length > 0) {
			const selectedRooms = []

			roomButtons.forEach(button => {
				if (button.classList.contains("active")) {
					const roomValue = button.dataset.room
					if (roomValue) {
						// Пытаемся преобразовать к числу, если это возможно
						const roomNumValue = parseInt(roomValue, 10)
						// Если преобразование успешно - добавляем число, иначе - строку
						selectedRooms.push(isNaN(roomNumValue) ? roomValue : roomNumValue)
					}
				}
			})

			// Если ничего не выбрано, устанавливаем значение "any"
			filterData.rooms = selectedRooms.length > 0 ? selectedRooms : ["any"]
		}
	}

	/**
	 * Собирает данные из выпадающих списков
	 */
	function collectDropdownData(filterForm, filterData) {
		const dropdowns = filterForm.querySelectorAll(".filter__dropdown")

		dropdowns.forEach(dropdown => {
			const dropdownKey = dropdown.dataset.filterKey
			if (!dropdownKey) return

			// Для сортировки собираем выбранное radio
			if (dropdown.classList.contains("catalog-sort__dropdown")) {
				const selectedRadio = dropdown.querySelector(
					'input[type="radio"]:checked'
				)
				if (selectedRadio) {
					filterData[dropdownKey] = selectedRadio.value
				}
				return
			}

			// Для обычных дропдаунов собираем выбранные чекбоксы
			const checkboxes = dropdown.querySelectorAll(
				'input[type="checkbox"]:checked'
			)

			// Проверяем, выбрана ли опция "Любой"
			const anyOption = dropdown.querySelector(
				'.all-input-field input[type="checkbox"]:checked'
			)

			if (anyOption) {
				// Если выбрана опция "Любой", передаем специальное значение
				filterData[dropdownKey] = ["any"]
			} else {
				// Иначе собираем выбранные значения
				const selectedValues = []

				checkboxes.forEach(checkbox => {
					// Пропускаем опцию "Любой" для обычного сбора значений
					if (!checkbox.closest(".all-input-field")) {
						const value = checkbox.dataset.value || checkbox.value
						selectedValues.push(value)
					}
				})

				if (selectedValues.length > 0) {
					filterData[dropdownKey] = selectedValues
				}
			}
		})
	}

	// Добавляем обработчик для кнопки "назад"
	window.addEventListener("popstate", function (event) {
		// При нажатии кнопки "назад" перезагружаем страницу
		window.location.reload()
	})

	/**
	 * Отправляет данные фильтра на сервер
	 * @param {Object} filterData - объект с данными фильтров
	 * @param {HTMLElement} form - форма, из которой были отправлены данные
	 */
	async function sendFilterData(filterData, form) {
		let url = form.getAttribute("action")

		// Кодируем объект filterData в JSON и затем в URL-safe строку
		const encodedData = encodeURIComponent(JSON.stringify(filterData))

		// Формируем URL с данными в виде одного параметра
		const getUrl = `${url}?data=${encodedData}`

		// Переходим на URL с фильтрами
		window.location.href = getUrl
	}
})
