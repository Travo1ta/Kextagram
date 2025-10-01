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
const SCALE_STEP = 25;
const MIN_SCALE = 25;
const MAX_SCALE = 100;

// DOM элементы
const uploadForm = document.querySelector('#upload-select-image');
const uploadInput = document.querySelector('#upload-file');
const textHashtags = document.querySelector('.text__hashtags');
const textDescription = document.querySelector('.text__description');
const imgPreview = document.querySelector('.img-upload__preview img');
const effectsPreviews = document.querySelectorAll('.effects__preview');
const scaleInput = document.querySelector('.scale__control--value');
const smallerButton = document.querySelector('.scale__control--smaller');
const biggerButton = document.querySelector('.scale__control--bigger');

// Масштабирование изображения
const scaleImage = (value) => {
  const scaleValue = Math.max(MIN_SCALE, Math.min(MAX_SCALE, value));
  imgPreview.style.transform = `scale(${scaleValue / 100})`;
  scaleInput.value = `${scaleValue}%`;
};

const onScaleButtonClick = (direction) => {
  const currentValue = parseInt(scaleInput.value, 10);
  const newValue = direction === 'increase'
    ? currentValue + SCALE_STEP
    : currentValue - SCALE_STEP;
  scaleImage(newValue);
};

// Инициализация масштабирования
const initScale = () => {
  scaleImage(DEFAULT_SCALE);
  smallerButton.addEventListener('click', () => onScaleButtonClick('decrease'));
  biggerButton.addEventListener('click', () => onScaleButtonClick('increase'));
};

// Сброс формы к исходному состоянию
const resetForm = () => {
  // Сброс полей формы
  uploadForm.reset();

  // Сброс масштаба к 100%
  scaleImage(DEFAULT_SCALE);

  // Сброс эффекта на "Оригинал"
  resetEffects();

  // Сбрасываем стили
  imgPreview.style.transform = '';
  imgPreview.style.filter = '';

  // ✅ ИСПРАВЛЕНИЕ: Сбрасываем на котика ТОЛЬКО если это не загруженная фото пользователя
  const hasUserPhoto = imgPreview.src &&
                       !imgPreview.src.includes('upload-default-image') &&
                       !imgPreview.src.includes(window.location.origin);

  if (!hasUserPhoto) {
    imgPreview.src = 'img/upload-default-image.jpg';
  }

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
  scaleImage(DEFAULT_SCALE);

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
        // Устанавливаем загруженное изображение
        imgPreview.src = reader.result;

        // Установка фона для превью эффектов
        effectsPreviews.forEach((preview) => {
          preview.style.backgroundImage = `url(${reader.result})`;
        });

        // ✅ ОТКРЫВАЕМ ФОРМУ ПОСЛЕ ЗАГРУЗКИ ИЗОБРАЖЕНИЯ!
        openUploadForm();
      });

      reader.addEventListener('error', () => {
        console.error('Ошибка загрузки файла');
      });

      reader.readAsDataURL(file);
    } else {
      alert('Пожалуйста, выберите файл в формате JPG, JPEG или PNG');
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
