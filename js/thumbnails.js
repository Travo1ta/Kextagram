import { showBigPicture } from './big-picture.js';

const picturesContainer = document.querySelector('.pictures');
const thumbnailTemplate = document.querySelector('#picture').content.querySelector('.picture');

// Создание одной миниатюры
const createThumbnail = ({url, likes, comments, description}) => {
  const thumbnail = thumbnailTemplate.cloneNode(true);
  const imageElement = thumbnail.querySelector('.picture__img');

  imageElement.src = url;
  imageElement.alt = description;
  thumbnail.querySelector('.picture__likes').textContent = likes;
  thumbnail.querySelector('.picture__comments').textContent = comments.length;

  // Обработчик клика
  thumbnail.addEventListener('click', (evt) => {
    evt.preventDefault();
    showBigPicture({url, likes, comments, description});
  });

  return thumbnail;
};

// Отрисовка всех миниатюр
const renderThumbnails = (pictures) => {
  const fragment = document.createDocumentFragment();

  pictures.forEach((picture) => {
    fragment.appendChild(createThumbnail(picture));
  });

  // Очистка контейнера перед добавлением новых элементов
  while (picturesContainer.firstChild) {
    picturesContainer.removeChild(picturesContainer.firstChild);
  }

  picturesContainer.appendChild(fragment);
};

export { renderThumbnails };
