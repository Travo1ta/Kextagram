import { initSlider, updateSlider, resetSlider, EFFECTS, DEFAULT_EFFECT } from './slider.js';

// Константы
const DEFAULT_SCALE = 100;

// DOM элементы
const image = document.querySelector('.img-upload__preview img');
const effectsContainer = document.querySelector('.img-upload__effects');

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
  image.className = '';
  image.style.filter = 'none';
  resetSlider();

  // Сбрасываем выбор эффекта на "Оригинал"
  const originalEffect = effectsContainer.querySelector('#effect-none');
  if (originalEffect) {
    originalEffect.checked = true;
  }
};

// Инициализация модуля
const initEffects = () => {
  initSlider();
  resetEffects();
  effectsContainer.addEventListener('change', onEffectChange);
};

export { initEffects, resetEffects, DEFAULT_SCALE };
