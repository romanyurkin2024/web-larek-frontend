import { IContactsForm, IOrder, IOrderData, IOrderForm, IProduct } from "../../types";
import { addressRegex, emailRegex, phoneRegex } from "../../utils/constants";
import { IEvents } from "../base/events";


interface IOrderModel extends IOrderData {
  setOrderData: (field: keyof IOrderModel, value: string) => void;
  checkOrderValidation: () => void;
  checkContactsValidation: () => void;
}

export class OrderModel implements IOrderModel {
  address: string;
  payment: string;
  email: string;
  phone: string;
  error: Partial<Record<keyof IOrderData, string>>;

  constructor(protected _events: IEvents) {
    this.address = '';
    this.payment = '';
    this.email = '';
    this.phone = '';
    this.error = {};
  }

  setOrderData(field: keyof IOrderData, value: string) {
    this[field] = value;
  }

  checkOrderValidation() {
    const errors: Partial<Record<keyof IOrderForm, string>> = {};

    if (!this.address || !addressRegex.test(this.address)) {
      errors.address = 'Необходимо указать корректный адрес';
    }
    if (!this.payment) {
      errors.payment = 'Необходимо выбрать вид оплаты';
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

  getOrderData() {
    const payment = this.payment === 'cash' ? 'offline' : 'online';

    return {
      payment: payment,
      email: this.email,
      phone: this.phone,
      address: this.address
    }
  }

  clearOrderData() {
    this.address = '';
    this.payment = '';
    this.email = '';
    this.phone = '';
    this.error = {};
  }
}