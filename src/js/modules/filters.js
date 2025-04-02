import noUiSlider from "nouislider"
import "nouislider/dist/nouislider.css"

// Функция для форматирования чисел с разделителями
function formatNumber(number) {
	// Проверяем, что число валидное
	if (isNaN(number) || number === null) return ""
	return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")
}

// Функция для валидации введенного значения
function validateInput(value, min, max) {
	const numValue = Number(value.replace(/\s/g, ""))
	if (isNaN(numValue)) return min
	return Math.min(Math.max(numValue, min), max)
}

// Функция для автоматического изменения ширины поля ввода
function adjustInputWidth(input) {
	// Создаем временный элемент для измерения ширины текста
	const temp = document.createElement("span")
	temp.style.visibility = "hidden"
	temp.style.position = "absolute"
	temp.style.whiteSpace = "nowrap"
	temp.style.fontSize = window.getComputedStyle(input).fontSize
	temp.style.fontFamily = window.getComputedStyle(input).fontFamily
	temp.style.fontWeight = window.getComputedStyle(input).fontWeight
	temp.innerText = input.value || input.placeholder || "0"

	document.body.appendChild(temp)
	// Добавляем небольшой отступ для комфортного отображения
	const width = temp.getBoundingClientRect().width + 8
	document.body.removeChild(temp)

	// Устанавливаем минимальную ширину
	input.style.width = `${Math.max(width, 40)}px`
}

function createSlider(
	sliderId,
	idInpMin,
	idInpMax,
	startMin,
	startMax,
	step,
	rangeMin,
	rangeMax
) {
	const slider = document.getElementById(sliderId)

	if (slider) {
		noUiSlider.create(slider, {
			start: [startMin, startMax],
			connect: true,
			step: step,
			range: {
				min: [rangeMin],
				max: [rangeMax],
			},
		})

		const inputMin = document.getElementById(idInpMin)
		const inputMax = document.getElementById(idInpMax)
		const inputs = [inputMin, inputMax]

		// Устанавливаем начальные значения в поля ввода
		if (idInpMin === "input-price-min" || idInpMax === "input-price-max") {
			inputMin.value = formatNumber(startMin)
			inputMax.value = formatNumber(startMax)
			// Устанавливаем начальную ширину полей ввода
			adjustInputWidth(inputMin)
			adjustInputWidth(inputMax)
		} else {
			inputMin.value = startMin
			inputMax.value = startMax
		}

		slider.noUiSlider.on("update", function (values, handle) {
			const value = Math.round(values[handle])
			// Применяем форматирование только для полей цены
			if (idInpMin === "input-price-min" || idInpMax === "input-price-max") {
				inputs[handle].value = formatNumber(value)
				// Обновляем ширину при изменении значения слайдером
				adjustInputWidth(inputs[handle])
			} else {
				inputs[handle].value = value
			}
		})

		const setRangeSlider = (i, value) => {
			let arr = [null, null]
			// Преобразуем строку в число, удаляя пробелы
			const numValue = Number(value.toString().replace(/\s/g, ""))
			arr[i] = isNaN(numValue)
				? rangeMin
				: Math.min(Math.max(numValue, rangeMin), rangeMax)
			slider.noUiSlider.set(arr)
		}

		// Обработка ввода значений
		inputs.forEach((el, index) => {
			el.addEventListener("input", e => {
				const value = e.currentTarget.value
				// Если это поле цены, форматируем значение при вводе
				if (idInpMin === "input-price-min" || idInpMax === "input-price-max") {
					const numValue = value.replace(/\s/g, "")
					if (numValue) {
						const formattedValue = formatNumber(Number(numValue))
						e.currentTarget.value = formattedValue
						// Обновляем ширину при ручном вводе значения
						adjustInputWidth(e.currentTarget)
					}
				}
			})

			el.addEventListener("change", e => {
				setRangeSlider(index, e.currentTarget.value)
			})
		})
	}
}

createSlider(
	"price-slider",
	"input-price-min",
	"input-price-max",
	4000000,
	12000000,
	500,
	4000000,
	12000000
)
createSlider(
	"square-slider",
	"input-square-min",
	"input-square-max",
	40,
	120,
	10,
	40,
	120
)
createSlider(
	"floor-slider",
	"input-floor-min",
	"input-floor-max",
	2,
	16,
	1,
	2,
	16
)

// Инициализация слайдеров для коммерческого фильтра
createSlider(
	"commerce-price-slider",
	"commerce-input-price-min",
	"commerce-input-price-max",
	4000000,
	12000000,
	500,
	4000000,
	12000000
)
createSlider(
	"commerce-square-slider",
	"commerce-input-square-min",
	"commerce-input-square-max",
	40,
	120,
	10,
	40,
	120
)
createSlider(
	"commerce-floor-slider",
	"commerce-input-floor-min",
	"commerce-input-floor-max",
	2,
	16,
	1,
	2,
	16
)

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
