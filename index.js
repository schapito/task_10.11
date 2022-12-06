// элементы в DOM можно получить при помощи функции querySelector
const fruitsList = document.querySelector('.fruits__list'); // список карточек
const shuffleButton = document.querySelector('.shuffle__btn'); // кнопка перемешивания
const filterButton = document.querySelector('.filter__btn'); // кнопка фильтрации
const sortKindLabel = document.querySelector('.sort__kind'); // поле с названием сортировки
const sortTimeLabel = document.querySelector('.sort__time'); // поле с временем сортировки
const sortChangeButton = document.querySelector('.sort__change__btn'); // кнопка смены сортировки
const sortActionButton = document.querySelector('.sort__action__btn'); // кнопка сортировки
const kindInput = document.querySelector('.kind__input'); // поле с названием вида
const colorInput = document.querySelector('.color__input'); // поле с названием цвета
const weightInput = document.querySelector('.weight__input'); // поле с весом
const addActionButton = document.querySelector('.add__action__btn'); // кнопка добавления
const minWeight = document.querySelector('.minweight__input'); // поле минимального веса
const maxWeight = document.querySelector('.maxweight__input'); // поле махсимального веса


// список фруктов в JSON формате
let fruitsJSON = `[
  {"kind": "Мангустин", "color": "фиолетовый", "weight": 13},
  {"kind": "Дуриан", "color": "зеленый", "weight": 35},
  {"kind": "Личи", "color": "розово-красный", "weight": 17},
  {"kind": "Карамбола", "color": "желтый", "weight": 28},
  {"kind": "Тамаринд", "color": "светло-коричневый", "weight": 22}
]`;

// преобразование JSON в объект JavaScript
let fruits = JSON.parse(fruitsJSON);

/*** ОТОБРАЖЕНИЕ ***/

// отрисовка карточек
const display = () => {
  // очищаем fruitsList от вложенных элементов,
  // чтобы заполнить актуальными данными из fruits
  fruitsList.innerHTML = null;

  for (let i = 0; i < fruits.length; i++) {
    // формируем новый элемент <li> при помощи document.createElement,
    // и добавляем в конец списка fruitsList при помощи document.appendChild

    let liFruit = document.createElement('li'); //создаем элемент li

    //назначаем ему классы в зависимости от названия фрукта:
    switch (fruits[i].kind) {
      case 'Мангустин':
        liFruit.className = 'fruit__item fruit_violet';
        break
      case 'Дуриан':
        liFruit.className = 'fruit__item fruit_green';
        break
      case 'Личи':
        liFruit.className = 'fruit__item fruit_carmazin';
        break
      case 'Карамбола':
        liFruit.className = 'fruit__item fruit_yellow';
        break
      case 'Тамаринд':
        liFruit.className = 'fruit__item fruit_lightbrown';
        break
      default:
        liFruit.className = 'fruit__item fruit_red';
    }

    let divFruit = document.createElement('div'); //создаем div для описания одного фрукта
    divFruit.className = 'fruit__info'; //назначаем ему класс
    liFruit.appendChild(divFruit); //вставляем его после li

    //создаем дивы для свойств фрукта:
    let divIndex = document.createElement('div');
    let divKind = document.createElement('div');
    let divColor = document.createElement('div');
    let divWeight = document.createElement('div');

    //вставляем эти дивы в родительский див:
    divFruit.appendChild(divIndex);
    divFruit.appendChild(divKind);
    divFruit.appendChild(divColor);
    divFruit.appendChild(divWeight);

    //назначаем дивам текст:
    divIndex.textContent = 'Номер: ' + i;
    divKind.textContent = 'Название: ' + fruits[i].kind;
    divColor.textContent = 'Цвет: ' + fruits[i].color;
    divWeight.textContent = 'Вес (кг): ' + fruits[i].weight;

    fruitsList.appendChild(liFruit); // и вставляем li в ul
  }
};

// первая отрисовка карточек
display();

/*** ПЕРЕМЕШИВАНИЕ ***/

function shuffleFruits() {
  let fruitsForShuffle = fruits.slice(); //копируем массив
  //перемешиваем:
  for (let y = fruitsForShuffle.length - 1; y > 0; y--) {
    let z = Math.floor(Math.random() * (y + 1));
    [fruitsForShuffle[y], fruitsForShuffle[z]] = [fruitsForShuffle[z], fruitsForShuffle[y]];
  }
  //сравниваем и, если новый массив совпадает со старым, то просим перемешать еще раз:
  if (JSON.stringify(fruits) === JSON.stringify(fruitsForShuffle)) {
    alert('Перемешайте еще раз');
  }
  //возвращаем результат:
  fruits = fruitsForShuffle;
  return fruits;
}

//работает кнопка перемешивания
shuffleButton.addEventListener('click', () => {
  shuffleFruits();
  display();
});

/*** ФИЛЬТРАЦИЯ ***/

function filterFruits() {
  //проверка корректности значений и сообщение в случае некорректных значений:
  let min = minWeight.value;
  let max = maxWeight.value;

  if (parseInt(min) <= 0 || isNaN(parseInt(min)) || parseInt(max.value) <= 0 || isNaN(parseInt(max)) || min > max) {
    alert('Введите корректные значения');
  }
  //фильтр:
  else {
    const fruitsFilter = fruits.filter(element => {
      return element.weight <= max && element.weight >= min;
    });
    fruits = fruitsFilter;
  }
  // очищаем значения в полях ввода
  minWeight.value = null;
  maxWeight.value = null;
  // возврат массива
  return fruits;
};

filterButton.addEventListener('click', () => {
  filterFruits();
  display();
});

/*** СОРТИРОВКА ***/ // по длине строки в названии цвета

let sortKind = 'bubbleSort'; // инициализация состояния вида сортировки
// инициализация полей
sortKindLabel.textContent = sortKind;
sortTimeLabel.textContent = '-';

const comparationColor = (index1, index2) => {
  // сравнение двух элементов по длине строки в названии цвета
  return fruits[index1].color.length > fruits[index2].color.length;
};

const bubbleSort = (arr, comparation) => {
  const n = arr.length;
  // внешняя итерация по элементам
  for (let i = 0; i < n - 1; i++) {
    // внутренняя итерация для перестановки элемента в конец массива
    for (let j = 0; j < n - 1 - i; j++) {
      // сравниваем элементы
      if (comparation(j, j + 1)) {
        // делаем обмен элементов
        let temp = arr[j + 1];
        arr[j + 1] = arr[j];
        arr[j] = temp;
      }
    }
  }
};

function partition(arr, start, end) {
  // последний элемент берем за стержень
  const pivotValue = arr[end].color.length;
  let pivotIndex = start;
  for (let i = start; i < end; i++) {
    if (arr[i].color.length < pivotValue) {
      // меняем элементы местами
      [arr[i], arr[pivotIndex]] = [arr[pivotIndex], arr[i]];
      // берем следующий элемент
      pivotIndex++;
    }
  }
  // перемещаем стержень в середину
  [arr[pivotIndex], arr[end]] = [arr[end], arr[pivotIndex]]
  return pivotIndex;
};

function quickSortRecursive(arr, start, end) {
  // выход из рекурсии
  if (start >= end) {
    return;
  }

  // возвращение индекса стержня
  let index = partition(arr, start, end);

  // та же функция для правого и левого подмассивов
  quickSortRecursive(arr, start, index - 1);
  quickSortRecursive(arr, index + 1, end);
};

sortChangeButton.addEventListener('click', () => {
  //переключать значение sortKind между 'bubbleSort' / 'quickSort'
  sortKindLabel.textContent == 'bubbleSort' ? sortKindLabel.textContent = 'quickSort' : sortKindLabel.textContent = 'bubbleSort';
});

sortActionButton.addEventListener('click', () => {
  const start = new Date().getTime();
  sortKindLabel.textContent == 'bubbleSort' ? bubbleSort(fruits, comparationColor) : quickSortRecursive(fruits, 0, fruits.length - 1);
  const end = new Date().getTime();
  display();
  sortTimeLabel.textContent = `${end - start} ms`;
});


/*** ДОБАВИТЬ ФРУКТ ***/

addActionButton.addEventListener('click', () => {
  // создание и добавление нового фрукта в массив fruits
  // необходимые значения берем из kindInput, colorInput, weightInput
  //выводим предупреждение, если значения некорретны
  if (kindInput.value === '' || colorInput.value === '' || weightInput.value === '' || parseInt(weightInput.value) <= 0 || isNaN(parseInt(weightInput.value))) {
    alert('Введите корректные значения');
  } else {
    //создаем новый объект-фрукт:
    let newFruit = {
      kind: kindInput.value,
      color: colorInput.value,
      weight: weightInput.value
    };
    // добавляем его к массиву фруктов и показываем на экране:
    fruits.push(newFruit);
    display();
  }
  //очищаем значения в полях ввода:
  kindInput.value = null;
  colorInput.value = null;
  weightInput.value = null;
});