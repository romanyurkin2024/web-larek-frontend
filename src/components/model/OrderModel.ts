import { IContactsForm, IOrderData, IOrderForm, IProduct } from "../../types";
import { addressRegex, emailRegex, phoneRegex } from "../../utils/constants";
import { IEvents } from "../base/events";

interface IOrderModel extends IOrderData {
  total: number;
  products: IProduct[];
  setOrderData: (field: keyof IOrderModel, value: string) => void;
  setProducts: (items: IProduct[]) => void;
  checkOrderValidation: () => void;
  checkContactsValidation: () => void;
}

export class OrderModel implements IOrderModel {
  address: string;
  paymentType: string;
  email: string;
  phone: string;
  total: number;
  products: IProduct[];
  error: Partial<Record<keyof IOrderData, string>>;

  constructor(protected _events: IEvents) {
    this.address = '';
    this.paymentType = '';
    this.email = '';
    this.phone = '';
    this.total = 0;
    this.products = [];
    this.error = {};
  }

  setOrderData(field: keyof IOrderData, value: string) {
    this[field] = value;
  }

  setProducts(items: IProduct[]) {
    this.products = items;
  }

  checkOrderValidation() {
    const errors: Partial<Record<keyof IOrderForm, string>> = {};

    if (!this.address || !addressRegex.test(this.address)) {
      errors.address = 'Необходимо указать корректный адрес';
    }
    if (!this.paymentType) {
      errors.paymentType = 'Необходимо выбрать вид оплаты';
    }
    this._events.emit('order:validation', errors);
    return Object.keys(errors).length === 0;
  }

  checkContactsValidation() {
    const errors: Partial<Record<keyof IContactsForm, string>> = {};

    if (!this.phone || !phoneRegex.test(this.phone)) {
      errors.phone = 'Необходимо указать корректный номер телефона';
    }
    if (!this.email || !emailRegex.test(this.email)) {
      errors.email = 'Почтовый адрес введен некорректно';
    }

    this._events.emit('contacts:validation', errors);
    return Object.keys(errors).length === 0;
  }

  clearOrdeData() {
    this.address = '';
    this.paymentType = '';
    this.email = '';
    this.phone = '';
    this.total = 0;
    this.products = [];
    this.error = {};
  }
}