import { renderPictures } from './picture-render.js';
import { getData } from './api.js';
import { initFormValidation } from './form-validation.js';
import { initEffects, resetEffects } from './image-effects.js';
import { showBigPicture } from './big-picture.js';
import { showErrorMessage } from './utils.js';

const initApp = async () => {
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

  // 3. Загрузка данных с сервера и инициализация
  try {
    const picturesData = await getData();
    renderPictures(picturesData);

    // Обработчики событий (только если элементы найдены)
    if (picturesContainer) {
      picturesContainer.addEventListener('click', (evt) => {
        const picture = evt.target.closest('.picture');
        if (picture) {
          const pictureData = picturesData.find(item => item.id === parseInt(picture.dataset.id, 10));
          pictureData && showBigPicture(pictureData);
        }
      });
    }
  } catch (error) {
    showErrorMessage('Ошибка загрузки данных с сервера');
  }

  initEffects();
  initFormValidation();

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
