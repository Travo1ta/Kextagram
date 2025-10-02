import { showModal } from './form-validation.js';

const FILE_TYPES = ['jpg', 'jpeg', 'png'];
const SCALE_STEP = 25;
const MIN_SCALE = 25;
const MAX_SCALE = 100;

const uploadInput = document.querySelector('#upload-file');
const photoPreview = document.querySelector('.img-upload__preview img');
const effectsPreviews = document.querySelectorAll('.effects__preview');
const scaleInput = document.querySelector('.scale__control--value');
const smallerButton = document.querySelector('.scale__control--smaller');
const biggerButton = document.querySelector('.scale__control--bigger');

// Масштабирование изображения
const scaleImage = (value) => {
  const scaleValue = Math.max(MIN_SCALE, Math.min(MAX_SCALE, value));
  photoPreview.style.transform = `scale(${scaleValue / 100})`;
  scaleInput.value = `${scaleValue}%`;
};

const onScaleButtonClick = (direction) => {
  const currentValue = parseInt(scaleInput.value, 10);
  const newValue = direction === 'increase'
    ? currentValue + SCALE_STEP
    : currentValue - SCALE_STEP;
  scaleImage(newValue);
};

const initScale = () => {
  scaleImage(MAX_SCALE);
  smallerButton.addEventListener('click', () => onScaleButtonClick('decrease'));
  biggerButton.addEventListener('click', () => onScaleButtonClick('increase'));
};

// Загрузка файла
const isValidType = (file) => {
  const fileName = file.name.toLowerCase();
  return FILE_TYPES.some((it) => fileName.endsWith(it));
};

const onFileInputChange = () => {
  const file = uploadInput.files[0];

  if (file && isValidType(file)) {
    photoPreview.src = URL.createObjectURL(file);

    effectsPreviews.forEach((preview) => {
      preview.style.backgroundImage = `url('${photoPreview.src}')`;
    });
  }
  showModal();
};

const initUploadForm = () => {
  initScale();
  uploadInput.addEventListener('change', onFileInputChange);
};

export { initUploadForm, scaleImage };
