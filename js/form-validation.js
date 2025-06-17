import { isEscapeKey } from './utils.js';

// Константы для валидации
const MAX_HASHTAGS = 5;
const MAX_HASHTAG_LENGTH = 20;
const HASHTAG_REGEX = /^#[a-zа-яё0-9]{1,19}$/i;
const MAX_DESCRIPTION_LENGTH = 140;

// Получаем все необходимые DOM-элементы
const uploadForm = document.querySelector('.img-upload__form');
const uploadInput = document.querySelector('#upload-file');
const uploadOverlay = document.querySelector('.img-upload__overlay');
const uploadCancel = document.querySelector('#upload-cancel');
const textHashtags = uploadForm.querySelector('.text__hashtags');
const textDescription = uploadForm.querySelector('.text__description');
const uploadSubmit = uploadForm.querySelector('.img-upload__submit');

// Инициализация Pristine
const pristine = new Pristine(uploadForm, {
  classTo: 'img-upload__field-wrapper',
  errorTextParent: 'img-upload__field-wrapper',
  errorTextClass: 'text-help',
  errorTextTag: 'div'
});

// Проверка фокуса в полях ввода
const isTextFieldFocused = () =>
  document.activeElement === textHashtags ||
  document.activeElement === textDescription;

// Функция закрытия формы
const closeUploadForm = () => {
  uploadOverlay.classList.add('hidden');
  document.body.classList.remove('modal-open');
  document.removeEventListener('keydown', onDocumentKeydown);
  uploadForm.reset();
  pristine.reset();
};

// Обработчик Esc
const onDocumentKeydown = (evt) => {
  if (isEscapeKey(evt) && !isTextFieldFocused()) {
    evt.preventDefault();
    closeUploadForm();
  }
};

// Блокировка Esc в полях ввода
const blockEscInFields = (evt) =>
  isEscapeKey(evt) && evt.stopPropagation();

// Валидация хэштегов
const validateHashtags = (value) => {
  const input = value.trim().toLowerCase();
  if (input === '') return true;

  const hashtags = input.split(/\s+/);

  if (hashtags.length > MAX_HASHTAGS) {
    return false;
  }

  const uniqueTags = new Set();

  for (const tag of hashtags) {
    if (!HASHTAG_REGEX.test(tag)) {
      return false;
    }

    if (uniqueTags.has(tag)) {
      return false;
    }
    uniqueTags.add(tag);
  }

  return true;
};

// Валидация описания
const validateDescription = (value) => {
  return value.length <= MAX_DESCRIPTION_LENGTH;
};

// Добавляем валидаторы
pristine.addValidator(
  textHashtags,
  validateHashtags,
  `Допустимо до ${MAX_HASHTAGS} уникальных хэштегов, начинающихся с # (макс. ${MAX_HASHTAG_LENGTH} символов)`
);

pristine.addValidator(
  textDescription,
  validateDescription,
  `Комментарий не может быть длиннее ${MAX_DESCRIPTION_LENGTH} символов`
);

// Блокировка кнопки при отправке
const toggleSubmitButton = (isDisabled) => {
  uploadSubmit.disabled = isDisabled;
  uploadSubmit.textContent = isDisabled ? 'Публикация...' : 'Опубликовать';
};

// Функция открытия формы
const openUploadForm = () => {
  uploadOverlay.classList.remove('hidden');
  document.body.classList.add('modal-open');
  document.addEventListener('keydown', onDocumentKeydown);
};

// Обработчики событий
uploadInput.addEventListener('change', openUploadForm);
uploadCancel.addEventListener('click', closeUploadForm);
textHashtags.addEventListener('keydown', blockEscInFields);
textDescription.addEventListener('keydown', blockEscInFields);

// Обработчик отправки формы
uploadForm.addEventListener('submit', (evt) => {
  evt.preventDefault();

  const isValid = pristine.validate();

  if (isValid) {
    toggleSubmitButton(true);
    // Здесь будет код отправки формы
    setTimeout(() => {
      toggleSubmitButton(false);
      closeUploadForm();
    }, 2000);
  }
});

// Экспорт
export {
  pristine,
  closeUploadForm,
  openUploadForm
};
