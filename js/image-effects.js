// Используем глобальный noUiSlider (подключен через vendor)
const noUiSlider = window.noUiSlider;

// Константы масштабирования
const SCALE_STEP = 25;
const MIN_SCALE = 25;
const MAX_SCALE = 100;
const DEFAULT_SCALE = 100;

// Настройки эффектов
const EFFECTS = [
  {
    name: 'none',
    style: 'none',
    min: 0,
    max: 100,
    step: 1,
    unit: ''
  },
  {
    name: 'chrome',
    style: 'grayscale',
    min: 0,
    max: 1,
    step: 0.1,
    unit: ''
  },
  {
    name: 'sepia',
    style: 'sepia',
    min: 0,
    max: 1,
    step: 0.1,
    unit: ''
  },
  {
    name: 'marvin',
    style: 'invert',
    min: 0,
    max: 100,
    step: 1,
    unit: '%'
  },
  {
    name: 'phobos',
    style: 'blur',
    min: 0,
    max: 3,
    step: 0.1,
    unit: 'px'
  },
  {
    name: 'heat',
    style: 'brightness',
    min: 1,
    max: 3,
    step: 0.1,
    unit: ''
  }
];

const DEFAULT_EFFECT = EFFECTS[0];

// DOM-элементы
const image = document.querySelector('.img-upload__preview img');
const scaleInput = document.querySelector('.scale__control--value');
const smallerButton = document.querySelector('.scale__control--smaller');
const biggerButton = document.querySelector('.scale__control--bigger');
const effectsContainer = document.querySelector('.img-upload__effects');
const sliderContainer = document.querySelector('.img-upload__effect-level');
const sliderElement = document.querySelector('.effect-level__slider');
const effectLevelInput = document.querySelector('.effect-level__value');

let currentEffect = DEFAULT_EFFECT;

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

// Инициализация слайдера
const initSlider = () => {
  noUiSlider.create(sliderElement, {
    range: {
      min: DEFAULT_EFFECT.min,
      max: DEFAULT_EFFECT.max
    },
    start: DEFAULT_EFFECT.max,
    step: DEFAULT_EFFECT.step,
    connect: 'lower'
  });

  sliderElement.noUiSlider.on('update', () => {
    const sliderValue = sliderElement.noUiSlider.get();
    effectLevelInput.value = sliderValue;

    if (currentEffect.style !== 'none') {
      image.style.filter = `${currentEffect.style}(${sliderValue}${currentEffect.unit})`;
    }
  });
};

// Обновление слайдера при смене эффекта
const updateSlider = () => {
  if (currentEffect.name === 'none') {
    sliderContainer.classList.add('hidden');
    image.style.filter = 'none';
  } else {
    sliderContainer.classList.remove('hidden');
    sliderElement.noUiSlider.updateOptions({
      range: {
        min: currentEffect.min,
        max: currentEffect.max
      },
      step: currentEffect.step,
      start: currentEffect.max
    });
  }
};

// Обработчик изменения эффекта
const onEffectChange = (evt) => {
  if (evt.target.classList.contains('effects__radio')) {
    currentEffect = EFFECTS.find((effect) => effect.name === evt.target.value);
    image.className = `effects__preview--${currentEffect.name}`;
    updateSlider();
  }
};

// Сброс всех настроек
const resetEffects = () => {
  currentEffect = DEFAULT_EFFECT;
  scaleImage(DEFAULT_SCALE);
  image.className = '';
  image.style.filter = 'none';
  updateSlider();
};

// Инициализация модуля
const initEffects = () => {
  initSlider();
  updateSlider();

  smallerButton.addEventListener('click', () => onScaleButtonClick('decrease'));
  biggerButton.addEventListener('click', () => onScaleButtonClick('increase'));
  effectsContainer.addEventListener('change', onEffectChange);
};

export { initEffects, resetEffects };
