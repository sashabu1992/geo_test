function RandomGeo(numberOfFeatures) {

  function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function getRandomFloat(min, max, decimals = 3) {
    return parseFloat((Math.random() * (max - min) + min).toFixed(decimals));
  }

  function getRandomDate(start, end) {
    const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
    return date.toLocaleDateString('ru-RU');
  }

  function getRandomName(id) {
    const names = ['Точка'];
    return `${names[getRandomInt(0, names.length - 1)]} №${id}`;
  }

  // Создаем коллекцию объектов
  const features = [];
  
  for (let i = 1; i <= numberOfFeatures; i++) {
    // Генерация случайных координат (примерно в пределах России)
    const longitude = getRandomFloat(30, 180);
    const latitude = getRandomFloat(40, 80);
    
    // Генерация атрибутов
    const feature = {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [longitude, latitude]
      },
      properties: {
        name: getRandomName(i),
      }
    };
    
    features.push(feature);
  }


  const featureCollection = {
    type: "FeatureCollection",
    features: features
  };

  return featureCollection;
}

// Пример использования: создаем 5 объектов
const geoJSON = RandomGeo(500);
console.log(JSON.stringify(geoJSON, null, 2));