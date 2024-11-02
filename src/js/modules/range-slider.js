import noUiSlider from 'nouislider';
import 'nouislider/dist/nouislider.css';

function createSlider(sliderId, idInpMin, idInpMax, startMin, startMax, step, rangeMin, rangeMax) {


    const slider = document.getElementById(sliderId);

    if (slider) {
        noUiSlider.create(slider, {
            start: [startMin, startMax],
            connect: true,
            step: step,
            range: {
                'min': [rangeMin],
                'max': [rangeMax]
            }
        });

        const inputMin = document.getElementById(idInpMin);
        const inputMax = document.getElementById(idInpMax);
        const inputs = [inputMin, inputMax];


        slider.noUiSlider.on('update', function (values, handle) {
            console.log(values)
            inputs[handle].value = Math.round(values[handle]);
        });

        const setRangeSlider = (i, value) => {
            let arr = [null, null];
            arr[i] = value;

            console.log(arr);

            slider.noUiSlider.set(arr);
        };

        inputs.forEach((el, index) => {
            el.addEventListener('change', (e) => {
                console.log(index);
                setRangeSlider(index, e.currentTarget.value);
            });
        });
    }
}

createSlider('price-slider', 'input-price-min', 'input-price-max', 4000000, 12000000, 500, 4000000, 12000000 );
createSlider('square-slider', 'input-square-min', 'input-square-max', 40, 120, 10, 40, 120 );

