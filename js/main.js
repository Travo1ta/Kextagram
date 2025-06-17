

// Получаем массив фотографий
const pictures = getPictures();
//console.log(pictures);

// Отрисовываем фотографии
renderPictures(pictures);


import { renderPictures } from './picture-render.js';
import { getPictures } from './data.js';
import { initUploadForm, closeUploadForm } from './form-validation.js';
import { initEffects, initScale, resetEffects, DEFAULT_SCALE } from './image-effects.js';
import { showBigPicture } from './big-picture.js';

// Инициализация приложения
const initApp = () => {
  // 1. Загрузка и отрисовка моковых данных
  const picturesData = getPictures();
  renderPictures(picturesData);

  // 2. Инициализация формы загрузки изображения
  initUploadForm();

  // 3. Инициализация эффектов и масштабирования
  initScale();
  initEffects();
  resetEffects();
  updateScale(DEFAULT_SCALE); // Из image-effects.js

  // 4. Дополнительные обработчики (если нужно)
  document.addEventListener('keydown', (evt) => {
    if (isEscapeKey(evt)) {
      closeUploadForm();
    }
  });
};

// Запуск приложения после загрузки DOM
document.addEventListener('DOMContentLoaded', initApp);

// Экспорт для тестов (если требуется)
export { initApp };
