import { isEscapeKey, showSuccessMessage, showErrorMessage } from './utils.js';
import { sendData } from './api.js';

const MAX_HASHTAGS = 5;
const MAX_HASHTAG_LENGTH = 20;
const MAX_DESCRIPTION_LENGTH = 140;
const HASHTAG_REGEX = /^#[a-zа-яё0-9]{1,19}$/i;
const FILE_TYPES = ['jpg', 'jpeg', 'png'];
const SCALE_STEP = 25;
const MIN_SCALE = 25;
const MAX_SCALE = 100;

const form = document.querySelector('.img-upload__form');
const fileInput = document.querySelector('#upload-file');
const cancelButton = document.querySelector('#upload-cancel');
const overlay = document.querySelector('.img-upload__overlay');
const hashtagInput = form.querySelector('.text__hashtags');
const descriptionInput = form.querySelector('.text__description');
const submitButton = form.querySelector('.img-upload__submit');
const photoPreview = document.querySelector('.img-upload__preview img');
const effectsPreviews = document.querySelectorAll('.effects__preview');
const scaleInput = document.querySelector('.scale__control--value');
const smallerButton = document.querySelector('.scale__control--smaller');
const biggerButton = document.querySelector('.scale__control--bigger');

const pristine = new Pristine(form, {
  classTo: 'img-upload__field-wrapper',
  errorTextParent: 'img-upload__field-wrapper',
  errorTextClass: 'img-upload__error-text',
  errorTextTag: 'div'
});

// Функции масштабирования
const scaleImage = (value) => {
  const scaleValue = Math.max(MIN_SCALE, Math.min(MAX_SCALE, value));
  photoPreview.style.transform = `scale(${scaleValue / 100})`;
  scaleInput.value = `${scaleValue}%`;
};

const onScaleButtonClick = (direction) => {
  const currentValue = parseInt(scaleInput.value, 10);
  const newValue = direction === 'increase'
    ? currentValue + SCALE_STEP
    : currentValue - SCALE_STEP;
  scaleImage(newValue);
};

const initScale = () => {
  scaleImage(MAX_SCALE);
  smallerButton.addEventListener('click', () => onScaleButtonClick('decrease'));
  biggerButton.addEventListener('keydown', (evt) => {
    if (evt.key === 'Enter' || evt.key === ' ') {
      onScaleButtonClick('increase');
    }
  });
  biggerButton.addEventListener('click', () => onScaleButtonClick('increase'));
};

const showModal = () => {
  overlay.classList.remove('hidden');
  document.body.classList.add('modal-open');
  document.addEventListener('keydown', onDocumentKeydown);
};

const hideModal = () => {
  form.reset();
  pristine.reset();
  scaleImage(MAX_SCALE); // Сбрасываем масштаб при закрытии
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

const validateHashtag = (tag) => {
  if (tag === '#') return false;
  if (tag.length > MAX_HASHTAG_LENGTH) return false;
  return HASHTAG_REGEX.test(tag);
};

const validateHashtags = (value) => {
  const input = value.trim();
  if (!input) return true;

  const hashtags = input.split(/\s+/);

  if (hashtags.length > MAX_HASHTAGS) {
    return false;
  }

  const normalizedTags = hashtags.map((tag) => tag.toLowerCase());
  const uniqueTags = new Set(normalizedTags);

  if (uniqueTags.size !== hashtags.length) {
    return false;
  }

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

const validateDescription = (value) =>
  value.length <= MAX_DESCRIPTION_LENGTH;

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

const blockEscInFields = (evt) => {
  if (isEscapeKey(evt)) {
    evt.stopPropagation();
  }
};

const setSubmitButtonState = (isEnabled) => {
  submitButton.disabled = !isEnabled;
  submitButton.textContent = isEnabled ? 'Опубликовать' : 'Публикую...';
};

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
    hideModal();
  } catch (error) {
    showErrorMessage('Не удалось отправить форму. Попробуйте ещё раз');
  } finally {
    setSubmitButtonState(true);
  }
};

const isValidType = (file) => {
  const fileName = file.name.toLowerCase();
  return FILE_TYPES.some((it) => fileName.endsWith(it));
};

const onFileInputChange = () => {
  const file = fileInput.files[0];

  if (file && isValidType(file)) {
    photoPreview.src = URL.createObjectURL(file);

    effectsPreviews.forEach((preview) => {
      preview.style.backgroundImage = `url('${photoPreview.src}')`;
    });
  }
  showModal();
};

const initFormValidation = () => {
  initScale(); // Инициализируем масштабирование

  fileInput.addEventListener('change', onFileInputChange);

  cancelButton.addEventListener('click', () => {
    hideModal();
  });

  hashtagInput.addEventListener('keydown', blockEscInFields);
  descriptionInput.addEventListener('keydown', blockEscInFields);

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
