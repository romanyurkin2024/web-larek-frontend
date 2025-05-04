# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```
## Сборка

```
npm run build
```

или

```
yarn build
```


## Базовые компоненты

### Класс Api
Класс `Api` - базовый класс для работы с API. Он позволяет отправлять GET и POST запросы к API проекта.

**Поля**
- `baseUrl: string` - базовый URL для запросов к серверу
- `options: RequestInit` - объект с дополнительными опциями для запросов

**Конструктор**
Конструктор класса принимает в качестве аргументов базовый URL для API и объект c дополнительными опциями для запросов.

**Методы**
- `handleResponse(response: Response): Promise<object> `- метод, который принимает и обрабатывает ответ сервера.
- `get(uri: string)` - метод, который отправляет GET запрос к определенному URI, далее результат от сервера обрабатывается при помощи метода handleResponse и возвращается результат типа Promise.
- `post(uri: string, data: object, method: ApiPostMethods = 'POST')` - метод, принимает URI и данные, которые необходимо отдать на сервер; ответ запроса обрабатывается при помощи метода handleResponse и возвращается результат типа Promise

**Типы и интерфейсы**
- `type ApiListResponse<Type>` - типизация ответа от сервера. Содержит общее число элементов, полученных с сервера, а также массив данных элементов заданного типа.
- `type ApiPostMethods` - типизация различных методов POST запросов.



### Класс WebLarekAPI
Класс `WebLarekAPI` предоставляет методы для взаимодействия с серверным API интернет-магазина и загрузки данных о товарах и заказах. Наследуется от базового класса Api.

**Конструктор**
```new WebLarekAPI(cdn: string, baseUrl: string)```
- `cdn: string` - URL до CDN, который используется для загрузки изображений товаров
- `baseUrl: string` - базовый URL для запросов к серверу

**Методы**
- `getProductList(): Promise<IProduct[]>` - получает список всех товаров. Добавляет к каждому товару корректную ссылку на изображение через CDN.
- `getProductById(id: string): Promise<IProduct>` - получает данные одного товара по его id. Также обогащает объект товара ссылкой на изображение.
- `postOrder(order: IOrder): Promise<IOrderResult>` - отправляет заказ на сервер. Возвращает объект с результатами оформления заказа типа Promise




### Класс Component
Класс `Component` - базовый абстрактный класс, от которого наследуются все визуальные компоненты. Содержит утилитарные методы для работы с DOM.

**Конструктор**
Конструктор класса принимает в качестве аргументов HTML элемент родительского элемента.
```constructor(protected readonly container: HTMLElement)```

**Методы**
- `toggleClass(element: HTMLElement, className: string, force?: boolean): void` - добавляет или удаляет CSS-класс у элемента.
- `setText(element: HTMLElement, value: unknown): void` - устанавливает текстовое содержимое element.
- `setDisabled(element: HTMLElement, state: boolean): void` - устанавливает или снимает атрибут disabled у элемента формы.
- `setHidden(element: HTMLElement): void` - cкрывает элемент (через display: none).
- `setVisible(element: HTMLElement): void` - Показывает элемент (удаляет display: none).
- `setImage(element: HTMLImageElement, src: string, alt?: string): void` - Устанавливает src и (опционально) alt для изображения.
- `render(data?: Partial<T>): HTMLElement` - Основной метод отрисовки. Обновляет данные компонента и возвращает DOM-элемент container.





## Типы и интерфейсы
**Ответ от API со списком элементов**
- type ApiListResponse<Type> = {
  total: number;
  items: Type[];
}

**Допустимые HTTP-методы для изменения данных**
type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

**Продукт**
interface IProduct {
  id: string;
  category: string;
  title: string;
  image: string;
  price: number | null;
  description: string;
  color: string | null;
  inBasket: boolean;
  indexInBasket: number;
}

**Каталог продуктов**
interface IProductCatalogModel {
  products: IProduct[];
}

**Цвета категорий**
enum CategoryColors {
  'другое' = 'other',
  'софт-скил' = 'soft',
  'дополнительное' = 'additional',
  'кнопка' = 'button',
  'хард-скил' = 'hard',
}

**Форма заказа (адрес и оплата)**
interface IOrderForm {
  address: string;
  payment: string;
}

**Контактная форма (почта и телефон)**
interface IContactsForm {
  email: string;
  phone: string;
}

**Общие данные заказа**
type IOrderData = IOrderForm & IContactsForm;

**Заказ для отправки**
type IOrder = IOrderData & {
  total: number;
  items: string[];
};

**Ответ после оформления заказа**
 interface IOrderResult {
  id: string;
  total: number;
}
