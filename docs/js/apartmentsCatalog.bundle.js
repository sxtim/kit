/******/ (function() { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ 56:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   COUNT_SHOW_CARDS_CLICK: function() { return /* binding */ COUNT_SHOW_CARDS_CLICK; },
/* harmony export */   ERROR_SERVER: function() { return /* binding */ ERROR_SERVER; },
/* harmony export */   NO_ITEMS_CART: function() { return /* binding */ NO_ITEMS_CART; },
/* harmony export */   NO_PRODUCTS_IN_THIS_CATEGORY: function() { return /* binding */ NO_PRODUCTS_IN_THIS_CATEGORY; },
/* harmony export */   PRODUCT_INFORMATION_NOT_FOUND: function() { return /* binding */ PRODUCT_INFORMATION_NOT_FOUND; }
/* harmony export */ });
// Количество показываемых карточек при первом рендере
const COUNT_SHOW_CARDS_CLICK = 2;

const ERROR_SERVER = 'Ошибка сервера, попробуйте позже!';
const NO_PRODUCTS_IN_THIS_CATEGORY = 'Товаров в этой категории нет!';
const PRODUCT_INFORMATION_NOT_FOUND = 'Информация о товаре не найдена!';
const NO_ITEMS_CART = 'В корзине нет товаров!';

/***/ }),

/***/ 55:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getBasketLocalStorage: function() { return /* binding */ getBasketLocalStorage; },
/* harmony export */   setBasketLocalStorage: function() { return /* binding */ setBasketLocalStorage; },
/* harmony export */   showErrorMessage: function() { return /* binding */ showErrorMessage; }
/* harmony export */ });

//==========================================

// Вывод ошибки
function showErrorMessage(message) {
  const h1 = document.querySelector('.cards-catalog')
  if (h1) {
  const msg =
      `<div class="error">
            <p>${message}</p>
            <p><a href="/">Перейти к списку товаров!</a></p>
        </div>`;
  h1.insertAdjacentHTML('afterend', msg);
  }
}

// Получение id из LS
function getBasketLocalStorage() {
  const cartDataJSON = localStorage.getItem('basket');
  return cartDataJSON ? JSON.parse(cartDataJSON) : [];
}

// Запись id товаров в LS
function setBasketLocalStorage(basket) {
  const basketCount = document.querySelector('.basket__count');
  localStorage.setItem('basket', JSON.stringify(basket));
  basketCount.textContent = basket.length;
}

// Проверка, существует ли товар указанный в LS
//(если например пару дней не заходил юзер, а товар, который у него в корзине, уже не существует)
// export function checkingRelevanceValueBasket(productsData) {
//   const basket = getBasketLocalStorage();
//
//   basket.forEach((basketId, index) => {
//     const existsInProducts = productsData.some(item => item.id === Number(basketId));
//     if (!existsInProducts) {
//       basket.splice(index, 1);
//     }
//   });
//
//   setBasketLocalStorage(basket);
// }

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	!function() {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = function(exports, definition) {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	!function() {
/******/ 		__webpack_require__.o = function(obj, prop) { return Object.prototype.hasOwnProperty.call(obj, prop); }
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	!function() {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = function(exports) {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	}();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
!function() {
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _modules_product_catalog_render_utils_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(55);
/* harmony import */ var _modules_product_catalog_render_constants_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(56);

//==========================================
;



const cards = document.querySelector('.cards-catalog');
const btnShowCards = document.querySelector('.btn-show-cards');
let shownCards = _modules_product_catalog_render_constants_js__WEBPACK_IMPORTED_MODULE_1__.COUNT_SHOW_CARDS_CLICK;// сколько карточек показано на странице
let countClickBtnShowCards = 1;// счетчик партии отображаемых карточек
let productsData = [];

// Загрузка товаров
getProducts()
console.log('hello');
// Обработка клика по кнопке "Показать еще"
if  (btnShowCards){
btnShowCards.addEventListener('click', sliceArrCards);
}

// Обработка клика по кнопке "В корзину"
// cards.addEventListener('click', handleCardClick);


// Получение товаров
async function getProducts() {
  try {

    if (!productsData.length) {
      const res = await fetch('./data/products.json');

      if (!res.ok) {
        throw new Error(res.statusText)
      }
      productsData = await res.json();
    }


    if ((productsData.length > _modules_product_catalog_render_constants_js__WEBPACK_IMPORTED_MODULE_1__.COUNT_SHOW_CARDS_CLICK) &&
        btnShowCards.classList.contains('none')) {
      btnShowCards.classList.remove('none');
    }
    console.log("hello")
    renderStartPage(productsData);

  } catch (err) {

    // TODO
    (0,_modules_product_catalog_render_utils_js__WEBPACK_IMPORTED_MODULE_0__.showErrorMessage)(_modules_product_catalog_render_constants_js__WEBPACK_IMPORTED_MODULE_1__.ERROR_SERVER);
    console.log(err.message);
  }
}

function renderStartPage(data) {

  if (!data || !data.length) {
    (0,_modules_product_catalog_render_utils_js__WEBPACK_IMPORTED_MODULE_0__.showErrorMessage)(_modules_product_catalog_render_constants_js__WEBPACK_IMPORTED_MODULE_1__.NO_PRODUCTS_IN_THIS_CATEGORY);
    return
  };

  const arrCards = data.slice(0, _modules_product_catalog_render_constants_js__WEBPACK_IMPORTED_MODULE_1__.COUNT_SHOW_CARDS_CLICK);
  createCards(arrCards);

  // checkingRelevanceValueBasket(data);

  // const basket = getBasketLocalStorage();//получаем данные из ls
  // // checkingActiveButtons(basket);//проходимся по всем кнопкам
}


function sliceArrCards() {
  if(shownCards >= productsData.length) return;

  countClickBtnShowCards++;
  const countShowCards = _modules_product_catalog_render_constants_js__WEBPACK_IMPORTED_MODULE_1__.COUNT_SHOW_CARDS_CLICK * countClickBtnShowCards;//какое количество карточек нам нужно отрендерить

  const arrCards = productsData.slice(shownCards, countShowCards);
  createCards(arrCards);
  //после рендера карточек
  shownCards = cards.children.length;

  if(shownCards >= productsData.length) {
    btnShowCards.classList.add('none');
  }
}


// function handleCardClick(event) {
//   const targetButton = event.target.closest('.card__add');//ищем кнопку добавления в корзину
//   if (!targetButton) return;
//
//   const card = targetButton.closest('.card');//находим саму карточку
//   const id = card.dataset.productId;//ищем атрибут id карточки
//   const basket = getBasketLocalStorage();//получаем значение из LS
//
//   if (basket.includes(id)) return;//проверяем id карточки в ls, если есть то выходим
//
//   basket.push(id);//если новая карточка, пушим id карточки в массив
//   setBasketLocalStorage(basket);//передаем массив idшек карточек в ls
//   checkingActiveButtons(basket);//проходимся по всем кнопкам карточек, активны ли кнопки карточек которые находятся в ls
// }


// function checkingActiveButtons(basket) {
//   const buttons = document.querySelectorAll('.card__add');//находим все кнопки "добавить в корзину"
//
//   buttons.forEach(btn => {
//     const card = btn.closest('.card');//у каждой кнопки ищем родителя(крточку)
//     const id = card.dataset.productId;//получаем ее id
//     const isInBasket = basket.includes(id);//есть ли id в basket ls
//
//     btn.disabled = isInBasket;//делаем кнопку не кликабельной/кликабельной
//     btn.classList.toggle('active', isInBasket);//добавляем стили
//     btn.textContent = isInBasket ? 'В корзине' : 'В корзину';
//   });
// }


// Рендер карточки
function createCards(data) {
  data.forEach(card => {
    const {id, rooms, square, deliveryDate, number, floor, project, address, price, img} = card;
    // const priceDiscount = price - ((price * discount) / 100);
    const cardItem =
        `
                <article class="card-apartment" data-product-id="${id}">
  <div class="card-apartment_header">
    <div class="card-apartment__info">
      <p><span>${rooms}</span></p>
      <p><span>${square}</span></p>
    </div>
    <div class="card-apartment__delivery">
            <p>Сдача <span>${deliveryDate}</span></p>
    </div>

  </div>
  <div class="card-apartment__body">
    <img src="./img/apartments/${img}" alt="${project}">
    <div class="card-apartment__details">
      <p>Кв. № <span>${number}</span></p>
      <p>Этаж <span>${floor}</span></p>
    </div>
  </div>
  <div class="card-apartment__footer">
    <div class="card-apartment__address">
      <span>${project}</span><br>
      ${address}
    </div>
    <div class="card-apartment__btns-wrap">
      <div class="card-apartment__price">${price}</div>
    </div>
  </div>
  <a class="card-apartment__link" href="apartment.html?id=${id}"></a>
</article>         
            `
  //       < div
  //
  //   class
  //
  //   = "card"
  //   data - product - id = "${id}" >
  //       < div
  //
  //   class
  //
  //   = "card__top" >
  //       < a
  //   href = "card.html?id=${id}"
  //
  //   class
  //
  //   = "card__image" >
  //       < img
  //   src = "./images/${img}"
  //   alt = "${title}"
  //       / >
  //       < /a>
  //   <div className="card__label">-${discount}%</div>
  // </div>
  //   <div className="card__bottom">
  //     <div className="card__prices">
  //       <div className="card__price card__price--discount">${priceDiscount}</div>
  //       <div className="card__price card__price--common">${price}</div>
  //     </div>
  //     <a href="/card.html?id=${id}" className="card__title">${title}</a>
  //     <button className="card__add">В корзину</button>
  //   </div>
  // </div>
    cards.insertAdjacentHTML('beforeend', cardItem);
  });
}





}();
/******/ })()
;