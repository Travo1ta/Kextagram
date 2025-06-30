import { renderPictures } from './picture-render.js';
import { getPictures } from './data.js';
import { initFormValidation } from './form-validation.js';
import { initEffects, resetEffects } from './image-effects.js';
import { showBigPicture } from './big-picture.js';

const initApp = () => {
  // 1. Получаем элементы с учетом их реальных классов
  const uploadCancel = document.querySelector('.img-upload__cancel'); // Используем класс
  const picturesContainer = document.querySelector('.pictures');

  // 2. Проверка существования элементов
  if (!uploadCancel) {
    console.error('Не найдена кнопка закрытия! Ищем:', '.img-upload__cancel');
  }
  if (!picturesContainer) {
    console.error('Не найден контейнер фотографий!');
  }

  // 3. Загрузка данных и инициализация
  const picturesData = getPictures();
  //renderPictures(picturesData);
  initEffects();
  initFormValidation();

  // 4. Обработчики событий (только если элементы найдены)
  if (picturesContainer) {
    picturesContainer.addEventListener('click', (evt) => {
      const picture = evt.target.closest('.picture');
      if (picture) {
        const pictureData = picturesData.find(item => item.id === parseInt(picture.dataset.id, 10));
        pictureData && showBigPicture(pictureData);
      }
    });
  }

  if (uploadCancel) {
    uploadCancel.addEventListener('click', resetEffects);
  }
};

// Альтернативный запуск для надежности
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}
