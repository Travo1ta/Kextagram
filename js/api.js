const getPictures = async () => {
  try {
    const response = await fetch('https://28.javascript.pages.academy/kekstagram/data');
    if (!response.ok) {
      throw new Error('Не удалось загрузить фотографии');
    }
    return await response.json();
  } catch (error) {
    throw new Error(error.message);
  }
};

export { getPictures };
