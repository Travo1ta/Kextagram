//import './upload-photo.js';


//Функция, возвращающая случайное целое число из переданного диапазона включительно
function getRandomInt(from, to) {
  // Проверяем, что значения корректные
  if (from > to) {
    throw new Error('Значение "от" не может быть больше значения "до".');
  }

  // Генерируем случайное целое число в диапазоне от "from" до "to" включительно
  return Math.floor(Math.random() * (to - from + 1)) + from;
}

getRandomInt();


//Функция для проверки максимальной длины строки.

function checkStringLength(inputString, maxLength) {
  return inputString.length <= maxLength;
}

checkStringLength();

