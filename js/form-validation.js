import { isEscapeKey } from './utils.js';

// Константы
const MAX_HASHTAGS = 5;
const HASHTAG_REGEX = /^#[a-zа-яё0-9]{1,19}$/i;
const MAX_DESCRIPTION_LENGTH = 140;

// DOM элементы
const form = document.querySelector('.img-upload__form');
const fileInput = document.querySelector('#upload-file');
const cancelButton = document.querySelector('#upload-cancel');
const overlay = document.querySelector('.img-upload__overlay');
const hashtagInput = form.querySelector('.text__hashtags');
const descriptionInput = form.querySelector('.text__description');
const submitButton = form.querySelector('.img-upload__submit');

// Инициализация Pristine
const pristine = new Pristine(form, {
  classTo: 'img-upload__field-wrapper',
  errorTextParent: 'img-upload__field-wrapper',
  errorTextClass: 'img-upload__error-text',
  errorTextTag: 'div'
});

// Функции управления формой
const showModal = () => {
  overlay.classList.remove('hidden');
  document.body.classList.add('modal-open');
  document.addEventListener('keydown', onDocumentKeydown);
};

const hideModal = () => {
  form.reset();
  pristine.reset();
  overlay.classList.add('hidden');
  document.body.classList.remove('modal-open');
  document.removeEventListener('keydown', onDocumentKeydown);
};

const isTextFieldFocused = () =>
  document.activeElement === hashtagInput ||
  document.activeElement === descriptionInput;

const onDocumentKeydown = (evt) => {
  if (isEscapeKey(evt) && !isTextFieldFocused()) {
    evt.preventDefault();
    hideModal();
  }
};

// Валидация хэштегов
const validateHashtags = (value) => {
  const hashtags = value.trim() ? value.toLowerCase().split(/\s+/) : [];

  if (hashtags.length > MAX_HASHTAGS) return false;

  const uniqueTags = new Set(hashtags);
  if (uniqueTags.size !== hashtags.length) return false;

  return hashtags.every((tag) => HASHTAG_REGEX.test(tag));
};

// Валидация описания
const validateDescription = (value) =>
  value.length <= MAX_DESCRIPTION_LENGTH;

// Добавление валидаторов
pristine.addValidator(
  hashtagInput,
  validateHashtags,
  `До ${MAX_HASHTAGS} уникальных хэштегов, разделенных пробелами`
);

pristine.addValidator(
  descriptionInput,
  validateDescription,
  `Максимум ${MAX_DESCRIPTION_LENGTH} символов`
);

// Блокировка Esc в полях ввода
const blockEscInFields = (evt) => {
  if (isEscapeKey(evt)) {
    evt.stopPropagation();
  }
};

// Инициализация формы
const initFormValidation = () => {
  fileInput.addEventListener('change', () => {
    showModal();
  });

  cancelButton.addEventListener('click', hideModal);

  hashtagInput.addEventListener('keydown', blockEscInFields);
  descriptionInput.addEventListener('keydown', blockEscInFields);

  form.addEventListener('submit', (evt) => {
    if (!pristine.validate()) {
      evt.preventDefault();
      hashtagInput.classList.add('img-upload__input--error');
    } else {
      submitButton.disabled = true;
    }
  });
};

export { initFormValidation, hideModal };
