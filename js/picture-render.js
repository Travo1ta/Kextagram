import { showBigPicture } from './big-picture.js';

const picturesContainer = document.querySelector('.pictures');

//Функция для создания DOM-элемента одной фотографии
const createPictureElement = ({ url, likes, comments, description }) => {

  //Находим template
  const pictureTemplate = document.querySelector('#picture')
    .content
    .querySelector('.picture');

  const pictureElement = pictureTemplate.cloneNode(true);

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

//функция модуля для отрисовки всех фотографий
// Принимает массив объектов-фотографий

const renderPictures = (pictures) => {

  const fragment = document.createDocumentFragment();

  pictures.forEach((picture) => {

    //cоздаем DOM-элемент для каждой фотографии
    const pictureElement = createPictureElement(picture);

    fragment.appendChild(pictureElement);
  });


  // Безопасная очистка контейнера
  while (picturesContainer.firstChild) {
    picturesContainer.removeChild(picturesContainer.firstChild);
  }

  picturesContainer.appendChild(fragment);
};

export { renderPictures };
