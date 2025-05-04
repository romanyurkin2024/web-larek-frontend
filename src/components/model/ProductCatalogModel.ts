import { IProduct, IProductCatalogModel } from "../../types";
import { IEvents } from "../base/events";

export class ProductCatalogModel implements IProductCatalogModel {
  protected _products: IProduct[] = [];

  constructor(protected _events: IEvents) { }

  get products(): IProduct[] {
    return this._products;
  }

  set products(data: IProduct[]) {
    this._products = data;
    this._events.emit('products:changed')
  }

}