import { isEscapeKey } from './utils.js';

// Константы
const FILE_TYPES = ['jpg', 'jpeg', 'png'];
const MAX_HASHTAGS = 5;
const MAX_HASHTAG_LENGTH = 20;
const HASHTAG_REGEX = /^#[a-zа-яё0-9]{1,19}$/i;
const MAX_DESCRIPTION_LENGTH = 140;
const SCALE_STEP = 25;
const MIN_SCALE = 25;
const MAX_SCALE = 100;
const DEFAULT_SCALE = 55;

// DOM элементы
const uploadForm = document.querySelector('#upload-select-image');
const uploadInput = document.querySelector('#upload-file');
const uploadOverlay = document.querySelector('.img-upload__overlay');
const uploadCancel = document.querySelector('#upload-cancel');
const textHashtags = document.querySelector('.text__hashtags');
const textDescription = document.querySelector('.text__description');
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

// Инициализация Pristine
const pristine = new Pristine(uploadForm, {
  classTo: 'img-upload__field-wrapper',
  errorTextParent: 'img-upload__field-wrapper',
  errorTextClass: 'text-help',
  errorTextTag: 'div'
});

// ===== ФУНКЦИИ ===== //

// Проверка фокуса в полях ввода
const isTextFieldFocused = () => {
  return document.activeElement === textHashtags ||
         document.activeElement === textDescription;
};

// Обработчик Esc
const onDocumentKeydown = (evt) => {
  if (isEscapeKey(evt)) {
    if (!isTextFieldFocused()) {
      evt.preventDefault();
      closeUploadForm();
    }
    // Если фокус в поле ввода - не закрываем форму
  }
};

// Блокировка Esc в полях ввода
const blockEscInFields = (evt) => {
  if (isEscapeKey(evt)) {
    evt.stopPropagation();
  }
};

// Сброс эффектов
const resetEffects = () => {
  effectLevel.classList.add('hidden');
  imgPreview.style.filter = 'none';
  imgPreview.className = '';
  imgPreview.classList.add('effects__preview--none');
  currentEffect = 'none';
  document.querySelector('#effect-none').checked = true;
};

// Закрытие формы
const closeUploadForm = () => {
  uploadOverlay.classList.add('hidden');
  document.body.classList.remove('modal-open');
  uploadForm.reset();
  uploadInput.value = '';
  pristine.reset();
  resetEffects();
  updateScale(DEFAULT_SCALE);
  document.removeEventListener('keydown', onDocumentKeydown);
};

// Открытие формы
const openUploadForm = () => {
  uploadOverlay.classList.remove('hidden');
  document.body.classList.add('modal-open');
  document.addEventListener('keydown', onDocumentKeydown);
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

// Валидация хэштегов
const validateHashtags = (value) => {
  const input = value.trim();
  if (input === '') return true;

  const hashtags = input.split(/\s+/);
  if (hashtags.length > MAX_HASHTAGS) return false;

  const seen = new Set();
  for (const tag of hashtags) {
    if (!HASHTAG_REGEX.test(tag)) return false;
    const lowerTag = tag.toLowerCase();
    if (seen.has(lowerTag)) return false;
    seen.add(lowerTag);
  }
  return true;
};

// Валидация комментария
const validateDescription = (value) => value.length <= MAX_DESCRIPTION_LENGTH;

// Обновление масштаба
const updateScale = (value) => {
  currentScale = value;
  scaleControlValue.value = `${value}%`;
  imgPreview.style.transform = `scale(${value / 100})`;
};

// ===== ИНИЦИАЛИЗАЦИЯ ВАЛИДАТОРОВ ===== //
pristine.addValidator(
  textHashtags,
  validateHashtags,
  'Хэштег должен начинаться с #, содержать только буквы и цифры (макс. 20 символов)'
);

pristine.addValidator(
  textDescription,
  validateDescription,
  `Комментарий не может быть длиннее ${MAX_DESCRIPTION_LENGTH} символов`
);

// ===== ОБРАБОТЧИКИ СОБЫТИЙ ===== //

// Масштабирование
scaleControlSmaller.addEventListener('click', () => {
  updateScale(Math.max(currentScale - SCALE_STEP, MIN_SCALE));
});

scaleControlBigger.addEventListener('click', () => {
  updateScale(Math.min(currentScale + SCALE_STEP, MAX_SCALE));
});

// Эффекты
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

// Слайдер эффектов
effectLevelSlider.noUiSlider.on('update', (_, handle, unencoded) => {
  effectLevelValue.value = unencoded[handle];
  effects[currentEffect](unencoded[handle]);
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

// Закрытие формы
uploadCancel.addEventListener('click', closeUploadForm);

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

// Блокировка Esc в полях ввода
textHashtags.addEventListener('keydown', blockEscInFields);
textDescription.addEventListener('keydown', blockEscInFields);

// Live-валидация
textHashtags.addEventListener('input', () => {
  pristine.validate(textHashtags);
});

textDescription.addEventListener('input', () => {
  pristine.validate(textDescription);
});

// ===== ИНИЦИАЛИЗАЦИЯ СЛАЙДЕРА ===== //
noUiSlider.create(effectLevelSlider, {
  range: { min: 0, max: 1 },
  start: 1,
  step: 0.1,
  connect: 'lower',
});

// Начальное состояние
resetEffects();
updateScale(DEFAULT_SCALE);
