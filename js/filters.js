
const Filter = {
  DEFAULT: 'filter-default',
  RANDOM: 'filter-random',
  DISCUSSED: 'filter-discussed',
};

const PICTURES_COUNT = 10;

const filtersElement = document.querySelector('.img-filters');
const filtersForm = filtersElement.querySelector('.img-filters__form');

let currentFilter = Filter.DEFAULT;
let pictures = [];

// Функции сортировки
const randomSort = () => Math.random() - 0.5;

const discussedSort = (pictureA, pictureB) =>
  pictureB.comments.length - pictureA.comments.length;

// Функция фильтрации изображений
const filterPictures = () => {
  switch (currentFilter) {
    case Filter.RANDOM:
      return [...pictures].sort(randomSort).slice(0, PICTURES_COUNT);
    case Filter.DISCUSSED:
      return [...pictures].sort(discussedSort);
    default:
      return [...pictures];
  }
};

// Включение фильтров после загрузки данных
const turnFilterOn = (loadedPictures, renderPicturesCallback) => {
  filtersElement.classList.remove('img-filters--inactive');
  pictures = [...loadedPictures];
  currentFilter = Filter.DEFAULT;

  // Устанавливаем активную кнопку по умолчанию
  const defaultButton = filtersForm.querySelector(`#${Filter.DEFAULT}`);
  if (defaultButton) {
    defaultButton.classList.add('img-filters__button--active');
  }

  // Обработчик клика на кнопки фильтров
  filtersForm.addEventListener('click', (evt) => {
    if (!evt.target.classList.contains('img-filters__button')) {
      return;
    }

    const clickedButton = evt.target;

    // Если кликнули на активный фильтр - ничего не делаем
    if (clickedButton.id === currentFilter) {
      return;
    }

    // Снимаем активный класс с текущей кнопки
    const activeButton = filtersForm.querySelector('.img-filters__button--active');
    if (activeButton) {
      activeButton.classList.remove('img-filters__button--active');
    }

    // Добавляем активный класс на новую кнопку
    clickedButton.classList.add('img-filters__button--active');
    currentFilter = clickedButton.id;

    // Отрисовываем фотографии с устранением дребезга
    renderPicturesCallback(filterPictures());
  });
};

export { turnFilterOn, filterPictures, Filter };
