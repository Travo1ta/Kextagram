import { isEscapeKey } from './utils.js';
import { sendData } from './api.js';
import { showSuccessMessage, showErrorMessage } from './utils.js';
import { resetForm } from './image-upload.js';

// Константы
const MAX_HASHTAGS = 5;
const MAX_HASHTAG_LENGTH = 20;
const MAX_DESCRIPTION_LENGTH = 140;
const HASHTAG_REGEX = /^#[a-zа-яё0-9]{1,19}$/i;

// DOM элементы
const form = document.querySelector('.img-upload__form');
const fileInput = document.querySelector('#upload-file');
const cancelButton = document.querySelector('#upload-cancel');
const overlay = document.querySelector('.img-upload__overlay');
const hashtagInput = form.querySelector('.text__hashtags');
const descriptionInput = form.querySelector('.text__description');
const submitButton = form.querySelector('.img-upload__submit');

// Инициализация Pristine с кастомными классами
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
const validateHashtag = (tag) => {
  if (tag === '#') return false; // Не может состоять только из решетки
  if (tag.length > MAX_HASHTAG_LENGTH) return false; // Макс. длина 20 символов
  return HASHTAG_REGEX.test(tag); // Соответствие регулярному выражению
};

const validateHashtags = (value) => {
  const input = value.trim();
  if (!input) return true; // Хэштеги не обязательны

  const hashtags = input.split(/\s+/);

  // Проверка количества
  if (hashtags.length > MAX_HASHTAGS) {
    return false;
  }

  // Проверка уникальности (нечувствительность к регистру)
  const normalizedTags = hashtags.map((tag) => tag.toLowerCase());
  const uniqueTags = new Set(normalizedTags);

  if (uniqueTags.size !== hashtags.length) {
    return false;
  }

  // Проверка каждого хэштега
  return hashtags.every(validateHashtag);
};

const getHashtagErrorMessage = () => `
  До ${MAX_HASHTAGS} уникальных хэштегов, разделенных пробелами.
  Хэштег должен:
  - Начинаться с #
  - Содержать только буквы и цифры
  - Не содержать спецсимволы и пробелы
  - Иметь длину от 1 до 19 символов после #
  - Быть уникальным (регистр не учитывается)
`;

// Валидация описания
const validateDescription = (value) =>
  value.length <= MAX_DESCRIPTION_LENGTH;

// Добавление валидаторов
pristine.addValidator(
  hashtagInput,
  validateHashtags,
  getHashtagErrorMessage
);

pristine.addValidator(
  descriptionInput,
  validateDescription,
  `Комментарий не может быть длиннее ${MAX_DESCRIPTION_LENGTH} символов`
);

// Блокировка Esc в полях ввода
const blockEscInFields = (evt) => {
  if (isEscapeKey(evt)) {
    evt.stopPropagation();
  }
};

// Управление состоянием кнопки отправки
const setSubmitButtonState = (isEnabled) => {
  submitButton.disabled = !isEnabled;
  submitButton.textContent = isEnabled ? 'Опубликовать' : 'Публикую...';
};

// Обработчик отправки формы
const onFormSubmit = async (evt) => {
  evt.preventDefault();

  const isValid = pristine.validate();
  hashtagInput.classList.toggle('img-upload__input--error', !isValid);

  if (!isValid) {
    return;
  }

  setSubmitButtonState(false);

  try {
    const formData = new FormData(form);
    await sendData(formData);

    showSuccessMessage('Фото успешно опубликовано!');
    closeUploadForm();
    resetForm();
  } catch (error) {
    showErrorMessage('Не удалось отправить форму. Попробуйте ещё раз');
  } finally {
    setSubmitButtonState(true);
  }
};

// Инициализация формы
const initFormValidation = () => {
  fileInput.addEventListener('change', () => {
    const file = fileInput.files[0];
    if (file) {
      const fileName = file.name.toLowerCase();
      const matches = ['jpg', 'jpeg', 'png'].some((ext) => fileName.endsWith(ext));
      if (matches) {
        showModal();
      }
    }
  });

  cancelButton.addEventListener('click', () => {
    hideModal();
    resetForm();
  });

  hashtagInput.addEventListener('keydown', blockEscInFields);
  descriptionInput.addEventListener('keydown', blockEscInFields);

  // Live-валидация
  hashtagInput.addEventListener('input', () => {
    pristine.validate(hashtagInput);
  });

  form.addEventListener('submit', onFormSubmit);
};

export {
  initFormValidation,
  hideModal,
  blockEscInFields,
  showModal,
  pristine
};
