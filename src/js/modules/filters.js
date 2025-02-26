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
            inputs[handle].value = Math.round(values[handle]);
        });

        const setRangeSlider = (i, value) => {
            let arr = [null, null];
            arr[i] = value;
            slider.noUiSlider.set(arr);
        };

        inputs.forEach((el, index) => {
            el.addEventListener('change', (e) => {
                setRangeSlider(index, e.currentTarget.value);
            });
        });
    }
}

createSlider('price-slider', 'input-price-min', 'input-price-max', 4000000, 12000000, 500, 4000000, 12000000 );
createSlider('square-slider', 'input-square-min', 'input-square-max', 40, 120, 10, 40, 120 );
createSlider('floor-slider', 'input-floor-min', 'input-floor-max', 2, 16, 1, 2, 16 );

//DROPDOWN FILTER
document.addEventListener('DOMContentLoaded', function () {
  const dropdowns = document.querySelectorAll('.filter__dropdown');

  dropdowns.forEach((dropdown) => {
    const dropdownBtn = dropdown.querySelector('.filter__dropdown-menu-btn');
    const dropdownContent = dropdown.querySelector('.filter__dropdown-content');
    const inputFields = dropdownContent.querySelectorAll('.input_field');
    const allInputField = dropdownContent.querySelector('.input_field.all-input-field');

    const initialText = dropdownBtn.textContent;

    // Открытие/закрытие меню по клику на кнопку
    dropdownBtn.addEventListener('click', function (event) {
      event.stopPropagation(); // Останавливаем всплытие

      // Закрываем все открытые меню, кроме текущего
      dropdowns.forEach((otherDropdown) => {
        if (otherDropdown !== dropdown) {
          otherDropdown.querySelector('.filter__dropdown-content').classList.remove('active');
        }
      });

      // Открываем/закрываем текущее меню
      dropdownContent.classList.toggle('active');
    });

    // Закрытие меню по клику вне его области
    document.addEventListener('click', function (event) {
      if (!dropdownContent.contains(event.target)) {
        dropdownContent.classList.remove('active');
      }
    });

    // Функция для обновления текста кнопки
    const updateButtonText = () => {
      const selectedValues = Array.from(inputFields)
        .filter((field) => field.classList.contains('checked'))
        .map((field) => field.querySelector('label').textContent)
        .join(', ');

      dropdownBtn.textContent = selectedValues || initialText;
    };

    // Функция для проверки и автоматического выбора "allInput"
    const checkAndSelectAllInputField = () => {
      const isAnyChecked = Array.from(inputFields).some(
        (field) => field !== allInputField && field.classList.contains('checked')
      );

      // Если ни один чекбокс не выбран, выбираем "allInput"
      if (!isAnyChecked && allInputField) {
        allInputField.classList.add('checked');
        allInputField.querySelector('.custom-checkbox').classList.add('checked');
      }
    };

    // Логика для "allInput"
    if (allInputField) {
      allInputField.addEventListener('click', function () {
        // Переключаем состояние "allInput"
        allInputField.classList.toggle('checked');
        allInputField.querySelector('.custom-checkbox').classList.toggle('checked');

        // Если "allInput" активно, сбрасываем все остальные элементы
        if (allInputField.classList.contains('checked')) {
          inputFields.forEach((field) => {
            if (field !== allInputField) {
              field.classList.remove('checked');
              field.querySelector('.custom-checkbox').classList.remove('checked');
            }
          });
        }

        // Обновляем текст кнопки
        updateButtonText();
      });
    }

    // Логика для остальных элементов
    inputFields.forEach((inputField) => {
      if (inputField !== allInputField) {
        inputField.addEventListener('click', function () {
          // Переключаем состояние текущего элемента
          inputField.classList.toggle('checked');
          inputField.querySelector('.custom-checkbox').classList.toggle('checked');

          // Если выбран любой другой элемент, снимаем выделение с "allInput"
          if (inputField.classList.contains('checked') && allInputField) {
            allInputField.classList.remove('checked');
            allInputField.querySelector('.custom-checkbox').classList.remove('checked');
          }

          // Проверяем, нужно ли выбрать "allInput"
          checkAndSelectAllInputField();

          // Обновляем текст кнопки
          updateButtonText();
        });
      }
    });

    // Инициализация текста кнопки по умолчанию
    if (allInputField && allInputField.classList.contains('checked')) {
      dropdownBtn.textContent = allInputField.querySelector('label').textContent;
    } else {
      dropdownBtn.textContent = initialText;
    }

    // По умолчанию выбираем "Все даты", если ничего не выбрано
    const hasChecked = Array.from(inputFields).some((field) => field.classList.contains('checked'));
    if (!hasChecked && allInputField) {
      allInputField.classList.add('checked');
      allInputField.querySelector('.custom-checkbox').classList.add('checked');
      dropdownBtn.textContent = allInputField.querySelector('label').textContent;
    }
  });
});


//Конпки фильтра "Комнаты"
  document.addEventListener('DOMContentLoaded', function () {
    const buttons = document.querySelectorAll('.filter__el-btns');
  
    buttons.forEach(button => {
      button.addEventListener('click', function () {
        // Если кнопка уже активна, снимаем активность
        if (this.classList.contains('active')) {
          this.classList.remove('active');
        } else {
          // Иначе добавляем активность только для этой кнопки
          this.classList.add('active');
        }
      });
    });
  });
