//import './upload-photo.js';


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


//Функция для проверки максимальной длины строки.

const isLengthLimit = (string, maxLength) =>  string.length <= maxLength;

isLengthLimit();

// функция получения случайного элемента из массива

const getRandomElement = (elements) => elements[getRandomNum(0, elements.length - 1)];

getRandomElement();
