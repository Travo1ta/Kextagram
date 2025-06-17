
import { pristine, blockEscInFields, closeUploadForm, openUploadForm } from './form-validation.js';
import { resetEffects, updateScale, initScale, initEffects, initSlider, DEFAULT_SCALE } from './image-effects.js';

// Константы
const FILE_TYPES = ['jpg', 'jpeg', 'png'];

// DOM элементы
const uploadForm = document.querySelector('#upload-select-image');
const uploadInput = document.querySelector('#upload-file');
const textHashtags = document.querySelector('.text__hashtags');
const textDescription = document.querySelector('.text__description');

// Инициализация
const initUploadForm = () => {
  // Инициализация эффектов и масштабирования
  initSlider();
  initEffects();
  initScale();
  resetEffects();
  updateScale(DEFAULT_SCALE);

  // Обработчики полей ввода
  textHashtags.addEventListener('keydown', blockEscInFields);
  textDescription.addEventListener('keydown', blockEscInFields);

  // Live-валидация
  textHashtags.addEventListener('input', () => {
    pristine.validate(textHashtags);
  });

  textDescription.addEventListener('input', () => {
    pristine.validate(textDescription);
  });

  // Загрузка файла
  uploadInput.addEventListener('change', () => {
    const file = uploadInput.files[0];
    if (!file) return;

    const fileName = file.name.toLowerCase();
    const matches = FILE_TYPES.some((ext) => fileName.endsWith(ext));

    if (matches) {
      const reader = new FileReader();
      reader.addEventListener('load', () => {
        imgPreview.src = reader.result;
        openUploadForm();
      });
      reader.readAsDataURL(file);
    }
  });

  // Отправка формы
  uploadForm.addEventListener('submit', (evt) => {
    evt.preventDefault();

    if (pristine.validate()) {
      const formData = new FormData(uploadForm);
      fetch(uploadForm.action, {
        method: uploadForm.method,
        body: formData
      })
        .then((response) => {
          if (response.ok) {
            closeUploadForm();
          }
        })
        .catch(() => {
          // Обработка ошибки
        });
    }
  });
};

export { initUploadForm };
