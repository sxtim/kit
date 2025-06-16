export default function initCookieConsent() {
	const cookieConsent = document.getElementById("cookieConsent")
	const cookieConsentButton = document.getElementById("cookieConsentButton")

	if (!cookieConsent || !cookieConsentButton) return

	const cookieAccepted = localStorage.getItem("cookieConsent")

	if (!cookieAccepted) {
		// Показываем уведомление с небольшой задержкой
		setTimeout(() => {
			cookieConsent.classList.add("show")
		}, 1000)
	}

	cookieConsentButton.addEventListener("click", () => {
		// Сохраняем согласие в localStorage
		localStorage.setItem("cookieConsent", "true")

		// Скрываем уведомление
		cookieConsent.classList.remove("show")

		// Если используется Яндекс.Метрика, можно активировать её здесь
		// или просто перезагрузить страницу
		// window.location.reload();
	})
}
