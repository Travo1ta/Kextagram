const noUiSlider = window.noUiSlider;

// Константы
const SCALE_STEP = 25;
const MIN_SCALE = 25;
const MAX_SCALE = 100;
const DEFAULT_SCALE = 100;

// DOM элементы
const imgPreview = document.querySelector('.img-upload__preview img');
const scaleControlSmaller = document.querySelector('.scale__control--smaller');
const scaleControlBigger = document.querySelector('.scale__control--bigger');
const scaleControlValue = document.querySelector('.scale__control--value');
const effectLevelSlider = document.querySelector('.effect-level__slider');
const effectLevelValue = document.querySelector('.effect-level__value');
const effectsList = document.querySelector('.effects__list');

// Текущие настройки
let currentEffect = 'none';

// Инициализация слайдера
const initSlider = () => {
  if (!effectLevelSlider) return;

  noUiSlider.create(effectLevelSlider, {
    range: {
      min: 0,
      max: 1
    },
    start: 1,
    step: 0.1,
    connect: 'lower'
  });

  effectLevelSlider.noUiSlider.on('update', (_, handle, unencoded) => {
    effectLevelValue.value = unencoded[handle];
    applyEffect(unencoded[handle]);
  });
};

// Применение эффекта
const applyEffect = (value) => {
  let filterStyle = '';

  switch (currentEffect) {
    case 'chrome':
      filterStyle = `grayscale(${value})`;
      break;
    case 'sepia':
      filterStyle = `sepia(${value})`;
      break;
    case 'marvin':
      filterStyle = `invert(${value * 100}%)`;
      break;
    case 'phobos':
      filterStyle = `blur(${value * 3}px)`;
      break;
    case 'heat':
      filterStyle = `brightness(${1 + value * 2})`;
      break;
    default:
      filterStyle = 'none';
  }

  imgPreview.style.filter = filterStyle;
};

// Сброс эффектов
const resetEffects = () => {
  currentEffect = 'none';
  imgPreview.style.filter = 'none';
  effectLevelValue.value = '';
  if (effectLevelSlider.noUiSlider) {
    effectLevelSlider.noUiSlider.destroy();
  }
};

// Обновление масштаба
const updateScale = (value) => {
  scaleControlValue.value = `${value}%`;
  imgPreview.style.transform = `scale(${value / 100})`;
};

// Инициализация масштабирования
const initScale = () => {
  scaleControlSmaller.addEventListener('click', () => {
    const currentValue = parseInt(scaleControlValue.value, 10);
    const newValue = Math.max(currentValue - SCALE_STEP, MIN_SCALE);
    updateScale(newValue);
  });

  scaleControlBigger.addEventListener('click', () => {
    const currentValue = parseInt(scaleControlValue.value, 10);
    const newValue = Math.min(currentValue + SCALE_STEP, MAX_SCALE);
    updateScale(newValue);
  });
};

// Инициализация эффектов
const initEffects = () => {
  if (!effectsList) return;

  effectsList.addEventListener('change', (evt) => {
    if (!evt.target.matches('input[type="radio"]')) return;

    currentEffect = evt.target.value;

    if (currentEffect === 'none') {
      resetEffects();
    } else {
      if (!effectLevelSlider.noUiSlider) {
        initSlider();
      }
      effectLevelSlider.noUiSlider.updateOptions({
        range: { min: 0, max: 1 },
        start: 1,
        step: 0.1
      });
    }
  });
};

export {
  initScale,
  initEffects,
  resetEffects,
  updateScale,
  DEFAULT_SCALE,
  initSlider
};
