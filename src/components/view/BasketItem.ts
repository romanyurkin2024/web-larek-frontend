import { IProduct } from "../../types";
import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/events";

interface IBasketItemActions {
	onClick: (e: MouseEvent) => void
}

export class BasketItem extends Component<IProduct> {
	protected _index: HTMLSpanElement;
	protected _title: HTMLSpanElement;
	protected _price: HTMLSpanElement;
	protected _removeButton: HTMLButtonElement;
	protected _id?: string | null = null;

	constructor(protected _container: HTMLElement, protected _events: IEvents, actions?: IBasketItemActions) {
		super(_container);

		this._index = ensureElement<HTMLSpanElement>('.basket__item-index', this._container);
		this._title = ensureElement<HTMLSpanElement>('.card__title', this._container);
		this._price = ensureElement<HTMLSpanElement>('.card__price', this._container);
		this._removeButton = ensureElement<HTMLButtonElement>('.basket__item-delete', this._container);

		if(this._removeButton){
			if(actions?.onClick){
				this._removeButton.addEventListener('click', (e: MouseEvent) => {
					actions.onClick(e);
				});
			}
		}
	}

	set id(id: string) {
		this._id = id;
	}

	set indexInBasket(value: number){
		this.setText(this._index, value);
	}

	set title(value: string){
		this.setText(this._title, value);
	}

	set price(value: string){
		this.setText(this._price, value ?? 0);
	}
}