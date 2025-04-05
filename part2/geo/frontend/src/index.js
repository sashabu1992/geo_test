import './css/main.css';
import './css/main.css';
import 'ol/ol.css';
import { Map, View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import { Circle, Fill, Stroke, Style } from 'ol/style';
import { fromLonLat } from 'ol/proj';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import { generateGeoData, saveToDatabase } from './data/generator';

class GeoApp {
  constructor() {
    // Настройки пагинации
    this.itemsPerPage = 10;
    this.randomCurrentPage = 1;
    this.apiCurrentPage = 1;
    
    // Данные
    this.randomObjects = generateGeoData(500);
    this.filteredRandomObjects = [...this.randomObjects];
    this.apiObjects = [];
    this.filteredApiObjects = [];
    
    // Инициализация
    this.initRandomMap();
    this.initApiMap();
    this.initControls();
    this.renderRandomTable();
    this.loadApiData();
  }

  // Инициализация карты для случайных объектов
  initRandomMap() {
    this.randomMap = new Map({
      target: 'random-map',
      layers: [
        new TileLayer({ source: new OSM() })
      ],
      view: new View({
        center: fromLonLat([37.6178, 55.7517]),
        zoom: 4
      })
    });

    this.randomVectorLayer = new VectorLayer({
      source: new VectorSource()
    });
    this.randomMap.addLayer(this.randomVectorLayer);
    this.updateRandomMap();
  }

  // Инициализация карты для объектов из API
  initApiMap() {
    this.apiMap = new Map({
      target: 'api-map',
      layers: [
        new TileLayer({ source: new OSM() })
      ],
      view: new View({
        center: fromLonLat([37.6178, 55.7517]),
        zoom: 4
      })
    });

    this.apiVectorLayer = new VectorLayer({
      source: new VectorSource()
    });
    this.apiMap.addLayer(this.apiVectorLayer);
  }

  // Загрузка данных из API
  async loadApiData() {
    try {
      const response = await fetch('/api/objects/');
      if (response.ok) {
        this.apiObjects = await response.json();
        this.filteredApiObjects = [...this.apiObjects];
        this.renderApiTable();
        this.updateApiMap();
      }
    } catch (error) {
      console.error('Ошибка загрузки данных:', error);
    }
  }

  // Обновление карты случайных объектов
  updateRandomMap() {
    const features = this.filteredRandomObjects.map(obj => this.createFeature(obj));
    this.randomVectorLayer.getSource().clear();
    this.randomVectorLayer.getSource().addFeatures(features);
  }

  // Обновление карты API объектов
  updateApiMap() {
    const features = this.filteredApiObjects.map(obj => this.createFeature(obj));
    this.apiVectorLayer.getSource().clear();
    this.apiVectorLayer.getSource().addFeatures(features);
  }

  // Создание фичи для карты
  createFeature(obj) {
    const feature = new Feature({
      geometry: new Point(fromLonLat([obj.longitude, obj.latitude])),
      ...obj
    });

    feature.setStyle(new Style({
      image: new Circle({
        radius: 6,
        fill: new Fill({ color: obj.status ? '#4CAF50' : '#F44336' }),
        stroke: new Stroke({ color: '#fff', width: 2 })
      })
    }));

    return feature;
  }

  // Инициализация элементов управления
  initControls() {
    // Кнопка сохранения в базу
    document.getElementById('save-to-db').addEventListener('click', async () => {
      try {
        await saveToDatabase(this.randomObjects);
        alert('Данные успешно сохранены в базу!');
        this.loadApiData();
      } catch (error) {
        alert('Ошибка сохранения: ' + error.message);
      }
    });

    // Поиск по случайным объектам
    document.getElementById('random-search').addEventListener('input', (e) => {
      const term = e.target.value.toLowerCase();
      this.filteredRandomObjects = this.randomObjects.filter(obj => 
        obj.name.toLowerCase().includes(term)
      );
      this.randomCurrentPage = 1;
      this.renderRandomTable();
      this.updateRandomMap();
    });

    // Пагинация случайных объектов
    document.getElementById('random-prev').addEventListener('click', () => {
      if (this.randomCurrentPage > 1) {
        this.randomCurrentPage--;
        this.renderRandomTable();
      }
    });

    document.getElementById('random-next').addEventListener('click', () => {
      if (this.randomCurrentPage * this.itemsPerPage < this.filteredRandomObjects.length) {
        this.randomCurrentPage++;
        this.renderRandomTable();
      }
    });

    // Поиск по API объектам
    document.getElementById('api-search').addEventListener('input', (e) => {
      const term = e.target.value.toLowerCase();
      this.filteredApiObjects = this.apiObjects.filter(obj => 
        obj.name.toLowerCase().includes(term)
      );
      this.apiCurrentPage = 1;
      this.renderApiTable();
      this.updateApiMap();
    });

    // Пагинация API объектов
    document.getElementById('api-prev').addEventListener('click', () => {
      if (this.apiCurrentPage > 1) {
        this.apiCurrentPage--;
        this.renderApiTable();
      }
    });

    document.getElementById('api-next').addEventListener('click', () => {
      if (this.apiCurrentPage * this.itemsPerPage < this.filteredApiObjects.length) {
        this.apiCurrentPage++;
        this.renderApiTable();
      }
    });

    // Обработчики кликов на карте
    this.randomMap.on('click', (evt) => {
      const feature = this.randomMap.forEachFeatureAtPixel(evt.pixel, (f) => f);
      if (feature) {
        this.showDetails(feature.getProperties(), 'random');
      }
    });

    this.apiMap.on('click', (evt) => {
      const feature = this.apiMap.forEachFeatureAtPixel(evt.pixel, (f) => f);
      if (feature) {
        this.showDetails(feature.getProperties(), 'api');
      }
    });
  }

  // Отображение таблицы случайных объектов с пагинацией
  renderRandomTable() {
    const start = (this.randomCurrentPage - 1) * this.itemsPerPage;
    const paginated = this.filteredRandomObjects.slice(start, start + this.itemsPerPage);
    
    document.getElementById('random-table').innerHTML = paginated
      .map(obj => this.createTableRow(obj, 'random'))
      .join('');

    this.updatePaginationInfo('random', this.filteredRandomObjects.length);
  }

  // Отображение таблицы API объектов с пагинацией
  renderApiTable() {
    const start = (this.apiCurrentPage - 1) * this.itemsPerPage;
    const paginated = this.filteredApiObjects.slice(start, start + this.itemsPerPage);
    
    document.getElementById('api-table').innerHTML = paginated
      .map(obj => this.createTableRow(obj, 'api'))
      .join('');

    this.updatePaginationInfo('api', this.filteredApiObjects.length);
  }

  // Обновление информации о пагинации
  updatePaginationInfo(type, totalItems) {
    const start = ((this[`${type}CurrentPage`] - 1) * this.itemsPerPage) + 1;
    const end = Math.min(this[`${type}CurrentPage`] * this.itemsPerPage, totalItems);
    
    document.getElementById(`${type}-pagination`).textContent = 
      `Показано ${start}-${end} из ${totalItems} записей`;
  }

  // Создание строки таблицы
  createTableRow(obj, type) {
    return `
      <tr class="object-row" data-id="${obj.id}" data-type="${type}">
        <td>${obj.id}</td>
        <td>${obj.name}</td>
        <td>${obj.type}</td>
        <td>${obj.status ? 'Да' : 'Нет'}</td>
      </tr>
    `;
  }

  // Показ деталей объекта
  showDetails(obj, type) {
    const details = `
      <h4>${obj.name}</h4>
      <p><strong>ID:</strong> ${obj.id}</p>
      <p><strong>Координаты:</strong> ${obj.longitude.toFixed(4)}, ${obj.latitude.toFixed(4)}</p>
      <p><strong>Площадь:</strong> ${obj.area}</p>
      <p><strong>Статус:</strong> ${obj.status ? 'Активный' : 'Неактивный'}</p>
      <p><strong>Дата создания:</strong> ${obj.date_create}</p>
      <p><strong>Тип:</strong> ${obj.type}</p>
    `;
    
    document.getElementById(`${type}-details`).innerHTML = details;
  }
}

// Запуск приложения
document.addEventListener('DOMContentLoaded', () => {
  new GeoApp();
});