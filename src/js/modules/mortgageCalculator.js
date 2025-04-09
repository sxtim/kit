import noUiSlider from "nouislider"
import "nouislider/dist/nouislider.css"

class MortgageCalculator {
	constructor() {
		// Значения по умолчанию
		this.apartmentPrice = 4000000
		this.downPayment = 800000 // 20% от цены квартиры
		this.loanTerm = 20
		this.interestRate = 19.8
		this.mortgageType = "standard"

		// Флаг для предотвращения рекурсивных вызовов
		this.isCalculating = false

		// Домен страницы квартиры для автоматической подстановки стоимости
		this.isApartmentPage = document.querySelector(".apartment-info__price")

		// Если мы на странице квартиры, берем стоимость из страницы
		if (this.isApartmentPage) {
			const priceText = this.isApartmentPage.textContent
			const cleanPrice = priceText.replace(/\s+/g, "").replace(/[^\d]/g, "")
			if (cleanPrice && !isNaN(Number(cleanPrice))) {
				this.apartmentPrice = Number(cleanPrice)
				this.downPayment = this.apartmentPrice * 0.2 // 20% от цены
			}
		}

		this.initializeTypeSelector()
		this.initializeSliders()
		this.calculateMortgage()
	}

	initializeTypeSelector() {
		const typeItems = document.querySelectorAll(
			".mortgage-calculator__type-item"
		)

		if (!typeItems.length) return

		typeItems.forEach(item => {
			item.addEventListener("click", () => {
				// Удаляем активный класс у всех элементов
				typeItems.forEach(el =>
					el.classList.remove("mortgage-calculator__type-item--active")
				)

				// Добавляем активный класс к выбранному элементу
				item.classList.add("mortgage-calculator__type-item--active")

				// Получаем тип и ставку из атрибутов
				this.mortgageType = item.dataset.type
				this.interestRate = parseFloat(item.dataset.rate)

				// Обновляем ставку в результатах
				document.getElementById(
					"interest-rate"
				).textContent = `${this.interestRate}%`

				// Пересчитываем ипотеку
				this.calculateMortgage()
			})
		})
	}

	initializeSliders() {
		// Слайдер стоимости квартиры
		this.createSlider({
			sliderId: "apartment-price-slider",
			inputId: "input-apartment-price",
			start: this.apartmentPrice,
			step: 50000,
			rangeMin: 4000000,
			rangeMax: 30000000,
			formatOptions: {
				style: "decimal",
				useGrouping: true,
				minimumFractionDigits: 0,
				maximumFractionDigits: 0,
			},
			onChange: value => {
				this.apartmentPrice = value

				// Обновляем максимальное значение для первоначального взноса
				const downPaymentSlider = document.getElementById("down-payment-slider")
				if (downPaymentSlider && downPaymentSlider.noUiSlider) {
					const maxDownPayment = Math.min(value * 0.99, 25000000) // 99% от стоимости квартиры
					const minDownPayment = value * 0.2 // 20% от стоимости квартиры

					if (!this.isCalculating) {
						this.isCalculating = true

						downPaymentSlider.noUiSlider.updateOptions({
							range: {
								min: minDownPayment,
								max: maxDownPayment,
							},
						})

						// Если текущий взнос больше максимального, корректируем
						if (this.downPayment > maxDownPayment) {
							this.downPayment = maxDownPayment
							downPaymentSlider.noUiSlider.set(maxDownPayment)
						}

						// Если текущий взнос меньше минимального, корректируем
						if (this.downPayment < minDownPayment) {
							this.downPayment = minDownPayment
							downPaymentSlider.noUiSlider.set(minDownPayment)
						}

						this.isCalculating = false
					}
				}

				this.calculateMortgage()
			},
		})

		// Слайдер первоначального взноса
		this.createSlider({
			sliderId: "down-payment-slider",
			inputId: "input-down-payment",
			start: this.downPayment,
			step: 50000,
			rangeMin: this.apartmentPrice * 0.2, // 20% от стоимости
			rangeMax: Math.min(this.apartmentPrice * 0.99, 25000000), // 99% от стоимости, но не более 25 млн
			formatOptions: {
				style: "decimal",
				useGrouping: true,
				minimumFractionDigits: 0,
				maximumFractionDigits: 0,
			},
			onChange: value => {
				this.downPayment = value
				this.calculateMortgage()
			},
		})

		// Слайдер срока кредита
		this.createSlider({
			sliderId: "loan-term-slider",
			inputId: "input-loan-term",
			start: this.loanTerm,
			step: 1,
			rangeMin: 1,
			rangeMax: 30,
			formatOptions: {
				style: "decimal",
				useGrouping: false,
				minimumFractionDigits: 0,
				maximumFractionDigits: 0,
			},
			onChange: value => {
				this.loanTerm = value
				this.calculateMortgage()
			},
		})
	}

	createSlider(config) {
		const {
			sliderId,
			inputId,
			start,
			step,
			rangeMin,
			rangeMax,
			formatOptions,
			onChange,
		} = config

		const slider = document.getElementById(sliderId)
		const input = document.getElementById(inputId)

		if (!slider || !input) return

		// Форматирование числа с разделением разрядов
		const formatNumber = value => {
			return Number(value).toLocaleString("ru-RU", formatOptions)
		}

		// Очистка форматирования для обработки ввода
		const unformatNumber = value => {
			return value.replace(/\s+/g, "").replace(",", ".")
		}

		// Функция для автоподстройки ширины поля по содержимому
		const adjustInputWidth = input => {
			const tempSpan = document.createElement("span")
			tempSpan.style.visibility = "hidden"
			tempSpan.style.position = "absolute"
			tempSpan.style.whiteSpace = "pre"
			tempSpan.style.font = window.getComputedStyle(input).font
			tempSpan.textContent = input.value || "0"

			document.body.appendChild(tempSpan)
			const width = tempSpan.getBoundingClientRect().width + 6
			document.body.removeChild(tempSpan)

			input.style.width = `${Math.max(1, width)}px`
		}

		noUiSlider.create(slider, {
			start: start,
			connect: "lower",
			step: step,
			range: {
				min: rangeMin,
				max: rangeMax,
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

		// Обновление значения в инпуте
		slider.noUiSlider.on("update", function (values) {
			const formattedValue = formatNumber(values[0])
			input.value = formattedValue
			adjustInputWidth(input)
			if (onChange) onChange(Number(values[0]))
		})

		// Обработчики для инпута
		input.addEventListener("focus", function () {
			this.value = unformatNumber(this.value)
			adjustInputWidth(this)
		})

		input.addEventListener("blur", function () {
			const value = unformatNumber(this.value)
			const formattedValue = formatNumber(value)
			this.value = formattedValue
			adjustInputWidth(this)
		})

		input.addEventListener("change", function () {
			const value = unformatNumber(this.value)
			slider.noUiSlider.set(value)
		})

		input.addEventListener("input", function () {
			adjustInputWidth(this)
		})

		// Инициализация ширины поля
		adjustInputWidth(input)
	}

	calculateMortgage() {
		// Избегаем вычислений при активном флаге расчетов
		if (this.isCalculating) return

		this.isCalculating = true

		// Проверяем, чтобы первоначальный взнос не превышал стоимость квартиры (99%)
		if (this.downPayment >= this.apartmentPrice * 0.99) {
			this.downPayment = this.apartmentPrice * 0.99 // Устанавливаем 99% от стоимости
			const downPaymentSlider = document.getElementById("down-payment-slider")
			if (downPaymentSlider && downPaymentSlider.noUiSlider) {
				downPaymentSlider.noUiSlider.set(this.downPayment)
			}
		}

		// Также проверяем минимальное значение (20% от стоимости)
		if (this.downPayment < this.apartmentPrice * 0.2) {
			this.downPayment = this.apartmentPrice * 0.2
			const downPaymentSlider = document.getElementById("down-payment-slider")
			if (downPaymentSlider && downPaymentSlider.noUiSlider) {
				downPaymentSlider.noUiSlider.set(this.downPayment)
			}
		}

		const loanAmount = this.apartmentPrice - this.downPayment
		const monthlyRate = this.interestRate / 100 / 12
		const numberOfPayments = this.loanTerm * 12

		// Проверяем, что сумма кредита положительная
		if (loanAmount <= 0) {
			document.getElementById("monthly-payment").textContent = "0 ₽"
			document.getElementById("loan-amount").textContent = "0 ₽"
			document.getElementById("overpayment").textContent = "0 ₽"
			document.getElementById("total-payment").textContent = "0 ₽"
			this.isCalculating = false
			return
		}

		// Формула аннуитетного платежа
		const monthlyPayment =
			(loanAmount *
				(monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments))) /
			(Math.pow(1 + monthlyRate, numberOfPayments) - 1)

		const totalPayment = monthlyPayment * numberOfPayments
		const overpayment = totalPayment - loanAmount

		// Обновление результатов
		document.getElementById("monthly-payment").textContent = `${Math.round(
			monthlyPayment
		).toLocaleString("ru-RU")} ₽`

		document.getElementById("loan-amount").textContent = `${Math.round(
			loanAmount
		).toLocaleString("ru-RU")} ₽`

		document.getElementById("overpayment").textContent = `${Math.round(
			overpayment
		).toLocaleString("ru-RU")} ₽`

		document.getElementById("total-payment").textContent = `${Math.round(
			totalPayment
		).toLocaleString("ru-RU")} ₽`

		this.isCalculating = false
	}
}

// Инициализация калькулятора при загрузке страницы
document.addEventListener("DOMContentLoaded", function () {
	const mortgageCalculatorElement = document.querySelector(
		".mortgage-calculator"
	)
	if (mortgageCalculatorElement) {
		new MortgageCalculator()
	}
})
