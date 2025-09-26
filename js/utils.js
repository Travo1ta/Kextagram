//Функция, возвращающая случайное целое число из переданного диапазона включительно

const getRandomNum = (start, end) => {
  if (start < 0 || end < 0) {
    throw new TypeError('Допускаются только положительные числа!');
  }

  if (isNaN(start) || isNaN(end)) {
    throw new TypeError('Параметры могут быть только числами!');
  }

  if (start === end) {
    throw new TypeError('Невозможно сформировать разные числа!');
  }

  if (start > end) {
    [start, end] = [end, start];
  }

  start = Math.ceil(start);
  end = Math.floor(end);

  return Math.floor(Math.random() * (end - start + 1)) + start;
};

//функция для получения рандомного элемента массива

const getRandomArrayElement = (array) => array[getRandomNum(0, array.length - 1)];

//функция  проверки нажатой клавиши 'Escape'

const isEscapeKey = (evt) => evt.key === 'Escape';

//Функция для проверки максимальной длины строки.

//const isLengthLimit = (string, maxLength) =>  string.length <= maxLength;

//isLengthLimit();

//Функция для показа сообщения
const showMessage = (templateId, messageText, buttonText = null) => {
  const template = document.querySelector(`#${templateId}`);

  if (!template) {
    console.error(`Шаблон ${templateId} не найден`);
    return;
  }

  const messageFragment = template.content.cloneNode(true);
  const messageElement = messageFragment.querySelector('div');

  if (messageText) {
    const textElement = messageElement.querySelector('.error__text') || messageElement.querySelector('.success__text');
    if (textElement) {
      textElement.textContent = messageText;
    }
  }

  if (buttonText) {
    const buttonElement = messageElement.querySelector('.error__button') || messageElement.querySelector('.success__button');
    if (buttonElement) {
      buttonElement.textContent = buttonText;
    }
  }

  document.body.appendChild(messageElement);
  document.body.classList.add('modal-open');

  const removeMessage = () => {
    messageElement.remove();
    document.body.classList.remove('modal-open');
    document.removeEventListener('keydown', onDocumentKeydown);
    document.removeEventListener('click', onDocumentClick);
  };

  const onDocumentKeydown = (evt) => {
    if (isEscapeKey(evt)) {
      evt.preventDefault();
      removeMessage();
    }
  };

  const onDocumentClick = (evt) => {
    if (!messageElement.contains(evt.target)) {
      removeMessage();
    }
  };

  const onButtonClick = () => {
    removeMessage();
  };

  // Обработчики для всех кнопок в сообщении
  const buttons = messageElement.querySelectorAll('button');
  buttons.forEach(button => {
    button.addEventListener('click', onButtonClick);
  });

  document.addEventListener('keydown', onDocumentKeydown);
  document.addEventListener('click', onDocumentClick);
};

//Функция для показа сообщения об успехе
const showSuccessMessage = (message) => {
  showMessage('success', message);
};

//Функция для показа сообщения об ошибке
const showErrorMessage = (message, buttonText = null) => {
  showMessage('error', message, buttonText);
};

//Функция debounce для устранения дребезга:
const debounce = (callback, timeoutDelay = 500) => {
  let timeoutId;
  return (...rest) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => callback.apply(this, rest), timeoutDelay);
  };
};

// Функция throttle для пропуска кадров:
// Функция взята из интернета и доработана
// Источник - https://github.com/you-dont-need/You-Dont-Need-Lodash-Underscore#_throttle

function throttle (callback, delayBetweenFrames) {
  // Используем замыкания, чтобы время "последнего кадра" навсегда приклеилось
  // к возвращаемой функции с условием, тогда мы его сможем перезаписывать
  let lastTime = 0;

  return (...rest) => {
    // Получаем текущую дату в миллисекундах,
    // чтобы можно было в дальнейшем
    // вычислять разницу между кадрами
    const now = new Date();

    // Если время между кадрами больше задержки,
    // вызываем наш колбэк и перезаписываем lastTime
    // временем "последнего кадра"
    if (now - lastTime >= delayBetweenFrames) {
      callback.apply(this, rest);
      lastTime = now;
    }
  };
}



export {
  getRandomNum,
  getRandomArrayElement,
  isEscapeKey,
  showSuccessMessage,
  showErrorMessage,
  debounce
};
