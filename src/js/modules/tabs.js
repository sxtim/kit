"use strict"

/** MAIN TABS
 * @function Tabs()
 *
 * Simple tabbed content UI component
 *
 * @param args {object} Settings for controlling the functionality of the component
 * @returns bindEventListeners {function} Event listeners for the component
 */

function Tabs(args) {
	// Scope-safe constructors
	if (!(this instanceof Tabs)) {
		return new Tabs()
	}

	/**
	 * Default component settings
	 *
	 * @param container {string} Classname for container of the entire component
	 * @param trigger {string} Element that toggles content
	 * @param content {string} Classname for the content
	 */
	var defaults = {
		container: "[data-tab-component]",
		trigger: '[role="tab"]',
		content: '[role="tabpanel"]',
	}

	// If there are no settings overrides
	var settings = typeof args !== "undefined" ? args : defaults

	/**
	 * @function toggle()
	 *
	 * Handles the displaying/hiding of content
	 *
	 * @returns null
	 */
	var toggle = function () {
		var parent = this.closest(settings.container),
			target = this.getAttribute("aria-controls"),
			content = document.getElementById(target),
			toggles = parent.querySelectorAll(settings.trigger),
			all_content = parent.querySelectorAll(settings.content)

		// Сначала обновим состояние табов
		for (var i = 0, len = toggles.length; i < len; i++) {
			toggles[i].setAttribute("aria-selected", "false")
		}
		this.setAttribute("aria-selected", "true")

		// Затем анимированно скрываем все контентные панели
		var activePanel = parent.querySelector('[aria-hidden="false"]')
		if (activePanel && activePanel !== content) {
			activePanel.setAttribute("aria-hidden", "true")
		}

		// И показываем выбранную
		content.setAttribute("aria-hidden", "false")
	}

	/**
	 * @function bindEventListeners()
	 *
	 * Attach event listeners
	 *
	 * @returns null
	 */
	var bindEventListeners = function () {
		var trigger = document.querySelectorAll(settings.trigger)

		//
		// TODO
		// Use event delgation to add event handlers
		//
		for (var i = 0, len = trigger.length; i < len; i++) {
			trigger[i].addEventListener("click", function (event) {
				toggle.call(this)
			})

			trigger[i].addEventListener("keydown", function (event) {
				if (event.which == 13) {
					toggle.call(this)
				}
			})
		}
	}

	return bindEventListeners()
}

// Create an instance of component
window.onload = function () {
	// Находим все компоненты с табами
	var tabComponents = document.querySelectorAll("[data-tab-component]")

	// Для каждого компонента с табами
	tabComponents.forEach(function (component) {
		// Проверяем, есть ли уже контейнер
		var tabPanels = component.querySelectorAll('[role="tabpanel"]')
		if (tabPanels.length > 0) {
			// Проверяем, обернуты ли панели в контейнер
			var parent = tabPanels[0].parentElement
			if (parent === component) {
				// Создаем контейнер
				var container = document.createElement("div")
				container.className = "tab-content-container"

				// Перемещаем все панели в контейнер
				var fragment = document.createDocumentFragment()
				tabPanels.forEach(function (panel) {
					fragment.appendChild(panel)
				})
				container.appendChild(fragment)

				// Добавляем контейнер в компонент
				component.appendChild(container)
			}
		}

		// Инициализация начального состояния
		var selectedTab = component.querySelector(
			'[role="tab"][aria-selected="true"]'
		)
		if (selectedTab) {
			var targetId = selectedTab.getAttribute("aria-controls")
			var targetPanel = document.getElementById(targetId)

			// Скрываем все панели
			component.querySelectorAll('[role="tabpanel"]').forEach(function (panel) {
				panel.setAttribute("aria-hidden", "true")
			})

			// Показываем активную панель
			if (targetPanel) {
				targetPanel.setAttribute("aria-hidden", "false")
			}
		}
	})

	var tabs = new Tabs()
}

// Табы на странице ипотеки
function initMortgageTabs() {
	const tabBtns = document.querySelectorAll(".mortgage-types__tab-btn")
	if (!tabBtns.length) return

	const tabContents = document.querySelectorAll(".mortgage-types__tab-content")

	tabBtns.forEach(btn => {
		btn.addEventListener("click", () => {
			// Убираем активный класс у всех кнопок
			tabBtns.forEach(item => {
				item.classList.remove("tabs__nav-btn--active")
			})

			// Добавляем активный класс текущей кнопке
			btn.classList.add("tabs__nav-btn--active")

			// Скрываем все контенты табов
			tabContents.forEach(content => {
				content.classList.remove("tabs__content-item--active")
			})

			// Показываем нужный таб
			const tabId = btn.getAttribute("data-tab")
			const activeContent = document.querySelector(
				`[data-tab-content="${tabId}"]`
			)
			if (activeContent) {
				activeContent.classList.add("tabs__content-item--active")
			}
		})
	})
}

// Запускаем инициализацию табов на странице ипотеки
document.addEventListener("DOMContentLoaded", () => {
	initMortgageTabs()
})