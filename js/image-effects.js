// Константы
const SCALE_STEP = 25;
const MIN_SCALE = 25;
const MAX_SCALE = 100;
const DEFAULT_SCALE = 55;

// DOM элементы
const imgPreview = document.querySelector('.img-upload__preview img');
const scaleControlSmaller = document.querySelector('.scale__control--smaller');
const scaleControlBigger = document.querySelector('.scale__control--bigger');
const scaleControlValue = document.querySelector('.scale__control--value');
const effectLevel = document.querySelector('.effect-level');
const effectLevelSlider = document.querySelector('.effect-level__slider');
const effectLevelValue = document.querySelector('.effect-level__value');
const effectsList = document.querySelector('.effects__list');

// Состояние
let currentScale = DEFAULT_SCALE;
let currentEffect = 'none';

// Сброс эффектов
const resetEffects = () => {
  effectLevel.classList.add('hidden');
  imgPreview.style.filter = 'none';
  imgPreview.className = '';
  imgPreview.classList.add('effects__preview--none');
  currentEffect = 'none';
  document.querySelector('#effect-none').checked = true;
};

// Эффекты изображения
const effects = {
  none: () => {
    effectLevel.classList.add('hidden');
    imgPreview.style.filter = 'none';
    imgPreview.className = '';
    imgPreview.classList.add('effects__preview--none');
  },
  chrome: (value) => {
    imgPreview.style.filter = `grayscale(${value})`;
    imgPreview.className = '';
    imgPreview.classList.add('effects__preview--chrome');
  },
  sepia: (value) => {
    imgPreview.style.filter = `sepia(${value})`;
    imgPreview.className = '';
    imgPreview.classList.add('effects__preview--sepia');
  },
  marvin: (value) => {
    imgPreview.style.filter = `invert(${value * 100}%)`;
    imgPreview.className = '';
    imgPreview.classList.add('effects__preview--marvin');
  },
  phobos: (value) => {
    imgPreview.style.filter = `blur(${value * 3}px)`;
    imgPreview.className = '';
    imgPreview.classList.add('effects__preview--phobos');
  },
  heat: (value) => {
    imgPreview.style.filter = `brightness(${value * 3})`;
    imgPreview.className = '';
    imgPreview.classList.add('effects__preview--heat');
  }
};

// Обновление масштаба
const updateScale = (value) => {
  currentScale = value;
  scaleControlValue.value = `${value}%`;
  imgPreview.style.transform = `scale(${value / 100})`;
};

// Инициализация масштабирования
const initScale = () => {
  scaleControlSmaller.addEventListener('click', () => {
    updateScale(Math.max(currentScale - SCALE_STEP, MIN_SCALE));
  });

  scaleControlBigger.addEventListener('click', () => {
    updateScale(Math.min(currentScale + SCALE_STEP, MAX_SCALE));
  });
};

// Инициализация эффектов
const initEffects = () => {
  effectsList.addEventListener('change', (evt) => {
    if (evt.target.matches('input[type="radio"]')) {
      currentEffect = evt.target.value;
      if (currentEffect === 'none') {
        effects.none();
      } else {
        effectLevel.classList.remove('hidden');
        effectLevelSlider.noUiSlider.updateOptions({
          range: { min: 0, max: 1 },
          start: 1,
          step: 0.1,
        });
        effects[currentEffect](1);
      }
    }
  });

  effectLevelSlider.noUiSlider.on('update', (_, handle, unencoded) => {
    effectLevelValue.value = unencoded[handle];
    effects[currentEffect](unencoded[handle]);
  });
};

// Инициализация слайдера
const initSlider = () => {
  noUiSlider.create(effectLevelSlider, {
    range: { min: 0, max: 1 },
    start: 1,
    step: 0.1,
    connect: 'lower',
  });
};

// Экспорт функций
export {
  resetEffects,
  updateScale,
  initScale,
  initEffects,
  initSlider,
  DEFAULT_SCALE
};
