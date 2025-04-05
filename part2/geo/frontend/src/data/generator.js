export function generateGeoData(numberOfFeatures) {
  const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
  const getRandomFloat = (min, max, decimals = 3) => parseFloat((Math.random() * (max - min) + min).toFixed(decimals));
  
  const getRandomDate = (start, end) => {
    const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
    return date.toLocaleDateString('ru-RU');
  };

  const getRandomName = (id) => {
    const names = ['Точка', 'Объект', 'Позиция', 'Метка'];
    return `${names[getRandomInt(0, names.length - 1)]} №${id}`;
  };

  const features = [];
  
  for (let i = 1; i <= numberOfFeatures; i++) {
    features.push({
      id: i,
      name: getRandomName(i),
      longitude: getRandomFloat(30, 180),
      latitude: getRandomFloat(40, 80),
      area: getRandomFloat(0.1, 1000),
      status: Math.random() > 0.5,
      date_create: getRandomDate(new Date(2020, 0, 1), new Date()),
      type: getRandomInt(1, 10)
    });
  }

  return features;
}

export async function saveToDatabase(objects) {
  try {
    const response = await fetch('/api/objects/objects_create/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': getCookie('csrftoken'),
      },
      body: JSON.stringify({ objects })
    });
    
    if (!response.ok) throw new Error('Ошибка сохранения');
    return await response.json();
  } catch (error) {
    console.error('Save error:', error);
    throw error;
  }
}

function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== '') {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.substring(0, name.length + 1) === (name + '=')) {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}