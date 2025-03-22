
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

//Функция для проверки максимальной длины строки.

//const isLengthLimit = (string, maxLength) =>  string.length <= maxLength;

//isLengthLimit();


export {
  getRandomNum,
  getRandomArrayElement,
};
