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

//DROPDOWN FILTER
// var inputsDrop1 = document.querySelectorAll('.form1 .input_field input')
// var inputsDrop2 = document.querySelectorAll('.form2 .input_field input'),
//     allSelect1 = document.querySelector('.form1 .selectAll input'),
//     allSelect2 = document.querySelector('.form2 .selectAll input'),
//     // quantity = document.querySelector('.quantity'),
//     skills1 = document.querySelector('.skills1'),
//     skills2 = document.querySelector('.skills2'),
//     // quantityText = "<span>Number of Skills: </span>",
//     skillText = "<span>Name of Skills: </span>"


// let listArray1 = []

// inputsDrop1.forEach(input => {

//     allSelect1.addEventListener('click', ()=> {
//         if(allSelect1.checked){
//             input.checked = true
//             input.classList.add("checked")
//         }
//         else{
//             input.checked = false
//             input.classList.remove("checked")
//         }

//         if(input.checked){
//             listArray1.push(input.value)
//         }
//         else{
//             listArray1 = listArray1.filter(val => val !== input.value)
//         }

//         let newUniqueArr = [...new Set(listArray1)] // Set always contains unique values. It is an ES6 methods.
//         skills1.innerHTML = skillText + newUniqueArr.join(', ')
//     })

//     input.addEventListener('click', ()=> {
//         input.classList.toggle("checked")

//         if(input.checked){
//             listArray1.push(input.value)
//         }
//         else{
//             listArray1 = listArray1.filter(val => val !== input.value)
//             allSelect1.checked = false
//         }
//         let newUniqueArr = [...new Set(listArray1)] // Set always contains unique values. It is an ES6 methods.
//         skills1.innerHTML = skillText + newUniqueArr.join(', ')
//     })
// })

// let listArray2 = []

// inputsDrop2.forEach(input => {

//     allSelect2.addEventListener('click', ()=> {
//         if(allSelect2.checked){
//             input.checked = true
//             input.classList.add("checked")
//         }
//         else{
//             input.checked = false
//             input.classList.remove("checked")
//         }




//         if(input.checked){
//             listArray2.push(input.value)
//         }
//         else{
//             listArray2 = listArray2.filter(val => val !== input.value)
//         }

//         let newUniqueArr = [...new Set(listArray2)] // Set always contains unique values. It is an ES6 methods.
//         skills2.innerHTML = skillText + newUniqueArr.join(', ')
//     })

//     input.addEventListener('click', ()=> {
//         input.classList.toggle("checked")
//         if(input.checked){
//             listArray2.push(input.value)
//         }
//         else{
//             listArray2 = listArray2.filter(val => val !== input.value)
//             allSelect2.checked = false
//         }
//         let newUniqueArr = [...new Set(listArray2)] // Set always contains unique values. It is an ES6 methods.
//         skills2.innerHTML = skillText + newUniqueArr.join(', ')
//     })
// })

// function manageCheckBox(formSelector, selectAllSelector, skillsSelector, skillText) {
//     const inputs = document.querySelectorAll(`${formSelector} .input_field input`);
//     const selectAll = document.querySelector(`${formSelector} ${selectAllSelector}`);
//     const skills = document.querySelector(skillsSelector);
//     let listArray = [];

//     const updateSkills = () => {
//         const uniqueSkills = [...new Set(listArray)];
//         skills.innerHTML = skillText + uniqueSkills.join(', ');
//     };

//     const toggleSelectAll = () => {
//         inputs.forEach(input => {
//             input.checked = selectAll.checked;
//             input.classList.toggle("checked", selectAll.checked);
//         });
//         listArray = selectAll.checked ? Array.from(inputs).map(input => input.value) : [];
//         updateSkills();
//     };

//     const toggleInput = (input) => {
//         input.classList.toggle("checked");

//         if (input.checked) {
//             listArray.push(input.value);
//         } else {
//             listArray = listArray.filter(val => val !== input.value);
//             selectAll.checked = false;
//         }
//         updateSkills();
//     };

//     selectAll.addEventListener('click', toggleSelectAll);

//     inputs.forEach(input => {
//         input.addEventListener('click', () => toggleInput(input));
//     });
// }

// // Используйте функцию для каждой формы
// manageCheckBox('.form1', '.selectAll input', '.skills1', "<span>Name of Skills: </span>");
// manageCheckBox('.form2', '.selectAll input', '.skills2', "<span>Name of Skills: </span>");


function manageCheckBox(formSelector, selectAllSelector, skillsSelector) {
    const inputs = document.querySelectorAll(`${formSelector} .input_field input`);
    const selectAll = document.querySelector(`${formSelector} ${selectAllSelector}`);
    const skills = document.querySelector(skillsSelector);
    let listArray = [];

    skills.textContent = "ГОРОД"; // Изначальный текст

    const updateSkills = () => {
        const uniqueSkills = [...new Set(listArray)];
        skills.textContent = uniqueSkills.length > 0 ? uniqueSkills.join(', ') : "ГОРОД";
    };

    const toggleSelectAll = () => {
        inputs.forEach(input => {
            input.checked = selectAll.checked;
            input.classList.toggle("checked", selectAll.checked);
        });
        listArray = selectAll.checked ? Array.from(inputs).map(input => input.value) : [];
        updateSkills();
    };

    const toggleInput = (input) => {
        input.classList.toggle("checked");

        if (input.checked) {
            listArray.push(input.value);
        } else {
            listArray = listArray.filter(val => val !== input.value);
            selectAll.checked = false;
        }
        updateSkills();
    };

    selectAll.addEventListener('click', toggleSelectAll);

    inputs.forEach(input => {
        input.addEventListener('click', () => toggleInput(input));
    });
}

// Используйте функцию для каждой формы
manageCheckBox('.form1', '.selectAll input', '.skills1');
manageCheckBox('.form2', '.selectAll input', '.skills2');

