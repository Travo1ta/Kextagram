import { initSlider, updateSlider, resetSlider, EFFECTS, DEFAULT_EFFECT } from './slider.js';

// Константы
const SCALE_STEP = 25;
const MIN_SCALE = 25;
const MAX_SCALE = 100;
const DEFAULT_SCALE = 100;

// DOM элементы
const image = document.querySelector('.img-upload__preview img');
const scaleInput = document.querySelector('.scale__control--value');
const smallerButton = document.querySelector('.scale__control--smaller');
const biggerButton = document.querySelector('.scale__control--bigger');
const effectsContainer = document.querySelector('.img-upload__effects');

// Масштабирование изображения
const scaleImage = (value) => {
  const scaleValue = Math.max(MIN_SCALE, Math.min(MAX_SCALE, value));
  image.style.transform = `scale(${scaleValue / 100})`;
  scaleInput.value = `${scaleValue}%`;
};

const onScaleButtonClick = (direction) => {
  const currentValue = parseInt(scaleInput.value, 10);
  const newValue = direction === 'increase'
    ? currentValue + SCALE_STEP
    : currentValue - SCALE_STEP;
  scaleImage(newValue);
};

// Обработчик изменения эффекта
const onEffectChange = (evt) => {
  if (evt.target.classList.contains('effects__radio')) {
    const selectedEffect = EFFECTS.find((effect) => effect.name === evt.target.value);
    image.className = `effects__preview--${selectedEffect.name}`;
    updateSlider(selectedEffect);
  }
};

// Сброс всех эффектов
const resetEffects = () => {
  scaleImage(DEFAULT_SCALE);
  image.className = '';
  image.style.filter = 'none';
  resetSlider();
};

// Инициализация модуля
const initEffects = () => {
  initSlider();
  resetEffects();

  smallerButton.addEventListener('click', () => onScaleButtonClick('decrease'));
  biggerButton.addEventListener('click', () => onScaleButtonClick('increase'));
  effectsContainer.addEventListener('change', onEffectChange);
};

export { initEffects, resetEffects };
