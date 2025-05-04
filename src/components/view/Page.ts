import { Component } from "../base/Component";
import { IEvents } from "../base/events";
import { ensureElement } from "../../utils/utils";

interface IPage {
    productsList: HTMLElement[];
}

interface IPageActions {
    onClickOpenBasket: (e: MouseEvent) => void;
}

export class Page extends Component<IPage> {
    protected _catalogContainer: HTMLElement;
    protected _modalContainer: HTMLElement;
    protected _basketCounter: HTMLSpanElement;
    protected _basket: HTMLButtonElement;
    protected _pageWrapper: HTMLElement;

    constructor(container: HTMLElement, protected _events: IEvents, actions?: IPageActions) {
        super(container);

        this._catalogContainer = ensureElement<HTMLElement>('.gallery');
        this._modalContainer = ensureElement<HTMLElement>('#modal-container');
        this._basketCounter = ensureElement<HTMLSpanElement>('.header__basket-counter');
        this._pageWrapper = ensureElement<HTMLElement>('.page__wrapper');
        this._basket = ensureElement<HTMLButtonElement>('.header__basket');

        if (this._basket) {
            if(actions?.onClickOpenBasket){
                this._basket.addEventListener('click', (e: MouseEvent) => {
                    actions?.onClickOpenBasket(e);
                });
            }
        }
    }

    set productsList(products: HTMLElement[]) {
        this._catalogContainer.replaceChildren(...products);
    }

    set productPreview(product: HTMLElement) {
        this._modalContainer.replaceChildren(product);
    }

    set basketCounter(value: number) {
        this.setText(this._basketCounter, value);
    }

    set lockWrapper(enable: boolean) {
        if (enable) {
            this._pageWrapper.classList.add('page__wrapper_locked')
        } else {
            this._pageWrapper.classList.remove('page__wrapper_locked')
        }
    }
}