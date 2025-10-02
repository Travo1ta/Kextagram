import { isEscapeKey, showSuccessMessage, showErrorMessage } from './utils.js';
import { sendData } from './api.js';
import { resetEffects } from './image-effects.js';

const MAX_HASHTAGS = 5;
const MAX_HASHTAG_LENGTH = 20;
const MAX_DESCRIPTION_LENGTH = 140;
const HASHTAG_REGEX = /^#[a-zа-яё0-9]{1,19}$/i;

const form = document.querySelector('.img-upload__form');
const cancelButton = document.querySelector('#upload-cancel');
const overlay = document.querySelector('.img-upload__overlay');
const hashtagInput = form.querySelector('.text__hashtags');
const descriptionInput = form.querySelector('.text__description');
const submitButton = form.querySelector('.img-upload__submit');

const pristine = new Pristine(form, {
  classTo: 'img-upload__field-wrapper',
  errorTextParent: 'img-upload__field-wrapper',
  errorTextClass: 'img-upload__error-text',
  errorTextTag: 'div'
});

const showModal = () => {
  overlay.classList.remove('hidden');
  document.body.classList.add('modal-open');
  document.addEventListener('keydown', onDocumentKeydown);
};

const hideModal = () => {
  form.reset();
  pristine.reset();
  resetEffects();
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

const initFormValidation = () => {
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
