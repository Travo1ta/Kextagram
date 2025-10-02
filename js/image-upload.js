import {
  pristine,
  blockEscInFields,
  hideModal as closeUploadForm,
  showModal as openUploadForm
} from './form-validation.js';
import { resetEffects, initEffects, DEFAULT_SCALE } from './image-effects.js';
import { initSlider } from './slider.js';

// Константы
const FILE_TYPES = ['jpg', 'jpeg', 'png'];

// DOM элементы
const uploadForm = document.querySelector('#upload-select-image');
const uploadInput = document.querySelector('#upload-file');
const textHashtags = document.querySelector('.text__hashtags');
const textDescription = document.querySelector('.text__description');
const imgPreview = document.querySelector('.img-upload__preview img');
const effectsPreviews = document.querySelectorAll('.effects__preview');

// Сброс формы к исходному состоянию
const resetForm = () => {
  // Сброс полей формы
  uploadForm.reset();

  // Сброс масштаба к 100%
  updateScale(DEFAULT_SCALE);

  // Сброс эффекта на "Оригинал"
  resetEffects();

  // Очистка превью изображения
  imgPreview.src = '';
  imgPreview.style.transform = '';
  imgPreview.style.filter = '';

  // Очистка превью эффектов
  effectsPreviews.forEach((preview) => {
    preview.style.backgroundImage = '';
  });

  // Сброс валидации
  pristine.reset();
};

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

        // Установка фона для превью эффектов
        effectsPreviews.forEach((preview) => {
          preview.style.backgroundImage = `url(${reader.result})`;
        });

        openUploadForm();
      });
      reader.readAsDataURL(file);
    }
  });

  // Обработчик кнопки отмены
  const cancelButton = document.querySelector('#upload-cancel');
  cancelButton.addEventListener('click', () => {
    closeUploadForm();
    resetForm();
  });
};

export { initUploadForm, resetForm };
