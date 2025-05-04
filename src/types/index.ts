export type ApiListResponse<Type> = {
  total: number,
  items: Type[]
};
export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

// Продукт
export interface IProduct {
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

// Интерфейс каталога продуктов
export interface IProductCatalogModel {
  products: IProduct[];
}

// Enum список по цветам категорий
export enum CategoryColors {
  'другое' = 'other',
  'софт-скил' = 'soft',
  'дополнительное' = 'additional',
  'кнопка' = 'button',
  'хард-скил' = 'hard',
}

// Интерфейс формы о заказе пользователя: адрес и оплата.
export interface IOrderForm {
  address: string,
  payment: string;
}

// Интерфейс формы о контактах пользователя: почта и телефон.
export interface IContactsForm {
  email: string,
  phone: string;
}

// Интерфейс о всей информации по заказу клиента.
export type IOrderData = IOrderForm & IContactsForm;

// Тип отправляемого заказа 
export type IOrder = IOrderData & {
  total: number;
  items: string[];
}

export interface IOrderResult {
  id: string;
  total: number;
}