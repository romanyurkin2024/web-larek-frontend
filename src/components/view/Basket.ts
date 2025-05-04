import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/events";

interface IBasket {
  items: HTMLElement[];
  price: number;
  isDisabled: boolean;
}

interface IBasketActions {
  onClick: (e: MouseEvent) => void;
}

export class Basket extends Component<IBasket> {
  protected _list: HTMLUListElement;
  protected _button: HTMLButtonElement;
  protected _total: HTMLSpanElement;

  constructor(protected _container: HTMLElement, protected _events: IEvents, actions?: IBasketActions) {
    super(_container);
    this._list = ensureElement<HTMLUListElement>('.basket__list', this._container);
    this._button = ensureElement<HTMLButtonElement>('.basket__button', this._container);
    this._total = ensureElement<HTMLButtonElement>('.basket__price', this._container);
    
    if (this._button) {
      if (actions?.onClick) {
        this._button.addEventListener('click', (e: MouseEvent) => {
          actions.onClick(e);
        });
      }
    }
  }

  set items(items: HTMLElement[]) {
    if (items) this._list.replaceChildren(...items);
  }

  set price(value: number) {
    this.setText(this._total, `${value} синапсов`);
  }

  set isDisabled(value: boolean) {
    super.setDisabled(this._button, value);
  }
} 
