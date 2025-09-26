import { showBigPicture } from './big-picture.js';

const picturesContainer = document.querySelector('.pictures');

// Функция для создания DOM-элемента одной фотографии
const createPictureElement = ({ id, url, likes, comments, description }) => {
  const pictureTemplate = document.querySelector('#picture')
    .content
    .querySelector('.picture');

  const pictureElement = pictureTemplate.cloneNode(true);

  // Добавляем data-id
  pictureElement.dataset.id = id; // Эта строка критически важна!

  const pictureImage = pictureElement.querySelector('.picture__img');
  pictureImage.src = url;
  pictureImage.alt = description;

  pictureElement.querySelector('.picture__likes').textContent = likes;
  pictureElement.querySelector('.picture__comments').textContent = comments.length;

  // Добавляем обработчик клика по миниатюре
  pictureElement.addEventListener('click', () => {
    showBigPicture({ url, likes, comments, description });
  });

  return pictureElement;
};

// Функция очистки контейнера с фотографиями
const clearPictures = () => {
  // Безопасная очистка контейнера
  while (picturesContainer.firstChild) {
    picturesContainer.removeChild(picturesContainer.firstChild);
  }
};

// Функция модуля для отрисовки всех фотографий
// Принимает массив объектов-фотографий
const renderPictures = (pictures) => {
  // Очищаем существующие фотографии перед отрисовкой новых
  clearPictures();

  const fragment = document.createDocumentFragment();

  pictures.forEach((picture) => {
    // Создаем DOM-элемент для каждой фотографии
    const pictureElement = createPictureElement(picture);
    fragment.appendChild(pictureElement);
  });

  picturesContainer.appendChild(fragment);
};

export { renderPictures, clearPictures };
