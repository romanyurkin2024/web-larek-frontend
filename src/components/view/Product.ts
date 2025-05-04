import { IProduct } from "../../types/index";
import { Component } from "../base/Component";
import { IEvents } from "../base/events";

interface IProductAction {
  onClick: (event: MouseEvent) => void;
}

export class Product extends Component<IProduct> {

  protected _id: string;
  protected _productButton: HTMLButtonElement;
  protected _title: HTMLElement;
  protected _category: HTMLElement;
  protected _price: HTMLElement;
  protected _image: HTMLImageElement;
  protected _cardButton?: HTMLButtonElement;
  protected _description?: HTMLElement;

  constructor(container: HTMLElement, protected _events: IEvents, actions?: IProductAction) {
    super(container);

    this._productButton = this.container as HTMLButtonElement;
    this._title = this.container.querySelector('.card__title') as HTMLElement;
    this._image = this.container.querySelector('.card__image') as HTMLImageElement;
    this._category = this.container.querySelector('.card__category') as HTMLElement;
    this._price = this.container.querySelector('.card__price') as HTMLElement;
    this._description = this.container.querySelector('.card__text') as HTMLElement;
    this._cardButton = this.container.querySelector('.card__button') as HTMLButtonElement;
    this._id = "";

    if (actions?.onClick) {
      if (this._cardButton) this._productButton.addEventListener('click', actions.onClick)
      if (this._productButton) this._productButton.addEventListener('click', actions.onClick)
    }
  }

  set color(value: string | null) {
    if (value) this._category.classList.add(`card__category_${value}`);
  }

  set title(value: string) {
    this._title.textContent = value;
  }

  get title(): string {
    return this._title.textContent || '';
  }

  set id(value: string) {
    this._id = value;
  }

  get id(): string {
    return this._id || '';
  }

  set image(value: string) {
    this._image.src = value;
  }

  get image(): string {
    return this._image.src || '';
  }

  set category(value: string) {
    this._category.textContent = value;
  }

  get category(): string {
    return this._category.textContent || '';
  }

  set price(value: number | null) {
    this._price.textContent = value != null ? `${value} синапсов` : "Бесценно";
  }

  set description(value: string) {
    if (this._description) this._description.textContent = value;
  }

  get description(): string {
    return this._description.textContent || '';
  }

  get price(): number | null {
    return parseInt(this._price.textContent) || null;
  }

  set inBasket(value: boolean) {
    if (value) {
      this.setText(this._cardButton, 'Убрать из корзины');
    } else {
      this.setText(this._cardButton, 'Добавить в корзину');
    }
  }
}