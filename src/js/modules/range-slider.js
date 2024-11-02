import noUiSlider from 'nouislider';
import 'nouislider/dist/nouislider.css';

const priceSlider = document.getElementById('price-slider');

if (priceSlider) {
  noUiSlider.create(priceSlider, {
    start: [4000000, 120000000],
    connect: true,
    step: 500,
    range: {
      'min': [4000000],
      'max': [120000000]
    }
  });

  const inputPriceMin = document.getElementById('input-price-min');
  const inputPriceMax = document.getElementById('input-price-max');
  const inputs = [inputPriceMin, inputPriceMax];


  priceSlider.noUiSlider.on('update', function(values, handle){
    console.log(values)
    inputs[handle].value = Math.round(values[handle]);
  });

  const setRangeSlider = (i, value) => {
    let arr = [null, null];
    arr[i] = value;

    console.log(arr);

    priceSlider.noUiSlider.set(arr);
  };

  inputs.forEach((el, index) => {
    el.addEventListener('change', (e) => {
      console.log(index);
      setRangeSlider(index, e.currentTarget.value);
    });
  });
}

const squareSlider = document.getElementById('square-slider');

if (squareSlider) {
  noUiSlider.create(squareSlider, {
    start: [40, 120],
    connect: true,
    step: 10,
    range: {
      'min': [40],
      'max': [120]
    }
  });

  const inputSquareMin = document.getElementById('input-square-min');
  const inputSquareMax = document.getElementById('input-square-max');
  const inputs = [inputSquareMin, inputSquareMax];


  squareSlider.noUiSlider.on('update', function(values, handle){
    console.log(values)
    inputs[handle].value = Math.round(values[handle]);
  });

  const setRangeSlider = (i, value) => {
    let arr = [null, null];
    arr[i] = value;

    console.log(arr);

    squareSlider.noUiSlider.set(arr);
  };

  inputs.forEach((el, index) => {
    el.addEventListener('change', (e) => {
      console.log(index);
      setRangeSlider(index, e.currentTarget.value);
    });
  });
}