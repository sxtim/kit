"use strict"
//==========================================
import './product-detail'

import {
  showErrorMessage,
  setBasketLocalStorage,
  getBasketLocalStorage,
  checkingRelevanceValueBasket
} from './utils.js';

import {
  COUNT_SHOW_CARDS_CLICK,
  ERROR_SERVER,
  NO_PRODUCTS_IN_THIS_CATEGORY
} from './constants.js';

const cards = document.querySelector('.cards-catalog');
const btnShowCards = document.querySelector('.btn-show-cards');
let shownCards = COUNT_SHOW_CARDS_CLICK;// сколько карточек показано на странице
let countClickBtnShowCards = 1;// счетчик партии отображаемых карточек
let productsData = [];

// Загрузка товаров
getProducts()

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


    if ((productsData.length > COUNT_SHOW_CARDS_CLICK) &&
        btnShowCards.classList.contains('none')) {
      btnShowCards.classList.remove('none');
    }
    console.log("hello")
    renderStartPage(productsData);

  } catch (err) {

    // TODO
    showErrorMessage(ERROR_SERVER);
    console.log(err.message);
  }
}

function renderStartPage(data) {

  if (!data || !data.length) {
    showErrorMessage(NO_PRODUCTS_IN_THIS_CATEGORY);
    return
  };

  const arrCards = data.slice(0, COUNT_SHOW_CARDS_CLICK);
  createCards(arrCards);

  // checkingRelevanceValueBasket(data);

  // const basket = getBasketLocalStorage();//получаем данные из ls
  // // checkingActiveButtons(basket);//проходимся по всем кнопкам
}


function sliceArrCards() {
  if(shownCards >= productsData.length) return;

  countClickBtnShowCards++;
  const countShowCards = COUNT_SHOW_CARDS_CLICK * countClickBtnShowCards;//какое количество карточек нам нужно отрендерить

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




