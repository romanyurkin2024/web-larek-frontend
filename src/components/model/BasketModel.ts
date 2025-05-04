import { IProduct } from "../../types";
import { IEvents } from "../base/events";

interface IBasketModel {
  items: IProduct[];
  addItem: (item: IProduct) => void;
  removeItem: (id: string) => void;
  getSumAllItems: () => number;
  getCounter: () => number;
  emptyBasket: () => void;
}

export class BasketModel implements IBasketModel {
  protected _items: IProduct[];

  constructor(protected _events: IEvents) {
    this._items = [];
  }

  get items(): IProduct[] {
    return this._items;
  }

  get itemsId(): string[] {
    return this._items.map(item => item.id);
  }

  checkItemInBasket(item: IProduct): boolean{
    return this._items.some(product => item.id === product.id);
  }

  addItem(item: IProduct) {
    if(!this.checkItemInBasket(item)){
      this._items.push(item);
    }
    this._events.emit('basket:changed');
  }

  removeItem(id: string) {
    const itemIndex = this._items.findIndex(p => p.id === id);
    this._items.splice(itemIndex, 1);
    this._events.emit('basket:changed');
  }

  getSumAllItems(): number {
    return this._items.reduce((sum, item) => sum + item.price, 0);
  }

  emptyBasket(){
    this._items = [];
    this._events.emit('basket:changed');
  }

  getCounter(): number {
    return this._items.length;
  }
}