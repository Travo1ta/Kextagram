// picture-render.js

//Находим контейнер для фотографий в DOM
const picturesContainer = document.querySelector('.pictures');

//Функция для создания DOM-элемента одной фотографии
const createPictureElement = ({ url, likes, comments, description }) => {
  //Находим template
  const pictureTemplate = document.querySelector('#picture')
    .content
    .querySelector('.picture');
  //создаём глубокую копию
  const pictureElement = pictureTemplate.cloneNode(true);

  //Находим элемент изображения внутри клонированного шаблона
  const pictureImage = pictureElement.querySelector('.picture__img');
  pictureImage.src = url;
  pictureImage.alt = description;

  //Находим блок с лайками
  pictureElement.querySelector('.picture__likes').textContent = likes;

  // Находим блок с комментариями и устанавливаем их количество
  pictureElement.querySelector('.picture__comments').textContent = comments.length;

  //Возвращаем готовый DOM-элемент
  return pictureElement;
};

const renderPictures = (pictures) => {
  const fragment = document.createDocumentFragment();

  pictures.forEach((picture) => {
    const pictureElement = createPictureElement(picture);
    fragment.appendChild(pictureElement);
  });

  picturesContainer.innerHTML = '';
  picturesContainer.appendChild(fragment);
};

export { renderPictures };
