import { isEscapeKey } from './utils.js';

const COMMENTS_PER_LOAD = 5;
const bigPictureElement = document.querySelector('.big-picture');
const bodyElement = document.body;
const closeButtonElement = bigPictureElement.querySelector('.big-picture__cancel');
const bigPictureImgElement = bigPictureElement.querySelector('.big-picture__img img');
const likesCountElement = bigPictureElement.querySelector('.likes-count');
const commentsCountElement = bigPictureElement.querySelector('.comments-count');
const socialCaptionElement = bigPictureElement.querySelector('.social__caption');
const socialCommentsElement = bigPictureElement.querySelector('.social__comments');
const commentCountElement = bigPictureElement.querySelector('.social__comment-count');
const commentsLoaderElement = bigPictureElement.querySelector('.comments-loader');

let currentComments = [];
let visibleCommentsCount = 0;

const hideBigPicture = () => {
  bigPictureElement.classList.add('hidden');
  bodyElement.classList.remove('modal-open');
  document.removeEventListener('keydown', onDocumentKeydown);
  commentsLoaderElement.removeEventListener('click', onCommentsLoaderClick);
};

const createCommentElement = ({ avatar, name, message }) => {
  const comment = document.createElement('li');
  comment.classList.add('social__comment');
  comment.innerHTML = `
    <img class="social__picture" src="${avatar}" alt="${name}" width="35" height="35">
    <p class="social__text">${message}</p>
  `;
  return comment;
};

const renderCommentsPortion = () => {
  const commentsPortion = currentComments.slice(
    visibleCommentsCount,
    visibleCommentsCount + COMMENTS_PER_LOAD
  );

  const fragment = document.createDocumentFragment();
  commentsPortion.forEach((comment) => {
    fragment.appendChild(createCommentElement(comment));
  });

  socialCommentsElement.appendChild(fragment);
  visibleCommentsCount += commentsPortion.length;

  commentCountElement.textContent = `${visibleCommentsCount} из ${currentComments.length} комментариев`;

  if (visibleCommentsCount >= currentComments.length) {
    commentsLoaderElement.classList.add('hidden');
  }
};

const onCommentsLoaderClick = () => {
  renderCommentsPortion();
};

const renderPictureDetails = ({ url, likes, comments, description }) => {
  bigPictureImgElement.src = url;
  bigPictureImgElement.alt = description;
  likesCountElement.textContent = likes;
  commentsCountElement.textContent = comments.length;
  socialCaptionElement.textContent = description;
};

const onDocumentKeydown = (evt) => {
  if (isEscapeKey(evt)) {
    evt.preventDefault();
    hideBigPicture();
  }
};

const showBigPicture = (pictureData) => {
  // Инициализация данных
  currentComments = pictureData.comments;
  visibleCommentsCount = 0;
  socialCommentsElement.innerHTML = '';

  // Отображение основных данных
  renderPictureDetails(pictureData);

  // Показываем элементы управления комментариями
  commentCountElement.classList.remove('hidden');
  commentsLoaderElement.classList.remove('hidden');

  // Первая порция комментариев
  renderCommentsPortion();

  // Показываем модальное окно
  bigPictureElement.classList.remove('hidden');
  bodyElement.classList.add('modal-open');

  // Подписываемся на события
  document.addEventListener('keydown', onDocumentKeydown);
  closeButtonElement.addEventListener('click', hideBigPicture);
  commentsLoaderElement.addEventListener('click', onCommentsLoaderClick);
};

export { showBigPicture };
