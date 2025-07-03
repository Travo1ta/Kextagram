const noUiSlider = window.noUiSlider;

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

// DOM элементы
const sliderContainer = document.querySelector('.img-upload__effect-level');
const sliderElement = document.querySelector('.effect-level__slider');
const effectLevelInput = document.querySelector('.effect-level__value');
const image = document.querySelector('.img-upload__preview img');

let currentEffect = DEFAULT_EFFECT;

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
const updateSlider = (effect) => {
  currentEffect = effect;

  if (effect.name === 'none') {
    sliderContainer.classList.add('hidden');
    image.style.filter = 'none';
  } else {
    sliderContainer.classList.remove('hidden');
    sliderElement.noUiSlider.updateOptions({
      range: {
        min: effect.min,
        max: effect.max
      },
      step: effect.step,
      start: effect.max
    });
  }
};

// Сброс слайдера
const resetSlider = () => {
  currentEffect = DEFAULT_EFFECT;
  updateSlider(DEFAULT_EFFECT);
};

export { initSlider, updateSlider, resetSlider, EFFECTS, DEFAULT_EFFECT };
