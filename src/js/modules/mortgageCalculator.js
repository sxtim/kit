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
		this.initModalForm()
		this.initBankCards()
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

	// Метод для инициализации карточек банков
	initBankCards() {
		const bankCards = document.querySelectorAll(
			".mortgage-calculator__bank-card"
		)

		bankCards.forEach(card => {
			const modalId = card.getAttribute("data-modal-id")
			if (modalId) {
				card.addEventListener("click", () => {
					const modal = document.getElementById(modalId)
					if (modal) {
						modal.classList.add("active")
						document.body.classList.add("no-scroll")
					}
				})
			}
		})
	}

	// Метод для инициализации формы консультации
	initModalForm() {
		// Инициализация маски для телефона
		const phoneInput = document.getElementById("mortgage-phone")
		if (phoneInput) {
			phoneInput.addEventListener("input", function (e) {
				let value = e.target.value.replace(/\D/g, "")

				// Ограничиваем ввод до 11 цифр
				if (value.length > 11) {
					value = value.slice(0, 11)
				}

				// Форматируем телефон
				if (value.length > 0) {
					if (value[0] === "7" || value[0] === "8") {
						value = "7" + value.slice(1)
					} else if (value[0] !== "7") {
						value = "7" + value
					}

					let formattedPhone = "+"

					if (value.length > 0) {
						formattedPhone += value[0]
					}
					if (value.length > 1) {
						formattedPhone += " " + value.substring(1, 4)
					}
					if (value.length > 4) {
						formattedPhone += " " + value.substring(4, 7)
					}
					if (value.length > 7) {
						formattedPhone += " " + value.substring(7, 9)
					}
					if (value.length > 9) {
						formattedPhone += " " + value.substring(9, 11)
					}

					e.target.value = formattedPhone
				}
			})
		}

		// Обработка отправки формы
		const mortgageForm = document.querySelector(
			"#mortgage-consultation-modal .form-contact"
		)
		if (mortgageForm) {
			mortgageForm.addEventListener("submit", function (e) {
				e.preventDefault()

				// Проверка заполнения обязательных полей
				const nameInput = document.getElementById("mortgage-name")
				const phoneInput = document.getElementById("mortgage-phone")
				const agreementCheckbox = document.getElementById("mortgage-agreement")

				if (!nameInput.value.trim()) {
					nameInput.focus()
					return
				}

				if (
					!phoneInput.value.trim() ||
					phoneInput.value.replace(/\D/g, "").length < 11
				) {
					phoneInput.focus()
					phoneInput.classList.add("invalid-phone")
					return
				} else {
					phoneInput.classList.remove("invalid-phone")
				}

				if (!agreementCheckbox.checked) {
					agreementCheckbox.focus()
					return
				}

				// Здесь можно добавить код для отправки формы на сервер
				// Для демонстрации просто показываем сообщение об успехе

				// Закрываем модальное окно с формой
				const modal = document.getElementById("mortgage-consultation-modal")
				if (modal) {
					modal.classList.remove("active")
				}

				// Показываем модальное окно с благодарностью
				const successModal = document.getElementById("modal-success")
				if (successModal) {
					setTimeout(() => {
						successModal.classList.add("active")
						document.body.classList.add("no-scroll")
					}, 300)
				}

				// Сбрасываем форму
				mortgageForm.reset()
			})
		}
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
