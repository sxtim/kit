const accSingleTriggers = document.querySelectorAll('.js-acc-single-trigger');

accSingleTriggers.forEach(trigger => trigger.addEventListener('click', toggleAccordion));

function toggleAccordion() {
  const items = document.querySelectorAll('.js-acc-item');
  const thisItem = this.parentNode;

  items.forEach(item => {
    if (thisItem == item) {
      thisItem.classList.toggle('is-open');
      return;
    }
    item.classList.remove('is-open');
  });
}