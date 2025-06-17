import {isEscapeKey} from './utils.js';

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

// Объявляем переменные в начале модуля
let escKeyDownHandler = null;
let cancelButtonHandler = null;


const hideBigPicture = () => {
  bigPictureElement.classList.add('hidden');
  bodyElement.classList.remove('modal-open');

  document.removeEventListener('keydown', escKeyDownHandler);
  closeButtonElement.removeEventListener('click', cancelButtonHandler);

  escKeyDownHandler = null;
  cancelButtonHandler = null;
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

const renderComments = (comments) => {
  socialCommentsElement.innerHTML = '';
  comments.forEach((comment) => {
    socialCommentsElement.appendChild(createCommentElement(comment));
  });
};

const renderPictureDetails = ({ url, likes, comments, description }) => {
  bigPictureImgElement.src = url;
  bigPictureImgElement.alt = description;
  likesCountElement.textContent = likes;
  commentsCountElement.textContent = comments.length;
  socialCaptionElement.textContent = description;
};

const showBigPicture = (pictureData) => {
  renderPictureDetails(pictureData);
  renderComments(pictureData.comments);

  commentCountElement.classList.add('hidden');
  commentsLoaderElement.classList.add('hidden');

  bigPictureElement.classList.remove('hidden');
  bodyElement.classList.add('modal-open');

  escKeyDownHandler = (evt) => {
    if (isEscapeKey(evt)) {
      evt.preventDefault();
      hideBigPicture();
    }
  };

  cancelButtonHandler = hideBigPicture;

  document.addEventListener('keydown', escKeyDownHandler);
  closeButtonElement.addEventListener('click', cancelButtonHandler);
};

export { showBigPicture };
