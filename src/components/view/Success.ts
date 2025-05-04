import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/events";

interface ISuccess {
  total: number;
}
interface ISuccessActions {
  onClick: (e: MouseEvent) => void;
}

export class Success extends Component<ISuccess> {
  protected _priceElement: HTMLParagraphElement;
  protected _button: HTMLButtonElement;

  constructor(protected container: HTMLElement, protected _events: IEvents, actions?: ISuccessActions) {
    super(container);

    this._priceElement = ensureElement<HTMLParagraphElement>('.order-success__description', this.container);
    this._button = ensureElement<HTMLButtonElement>('.order-success__close', this.container);

    if (this._button) {
      if (actions?.onClick) this._button.addEventListener('click', (e: MouseEvent) => {
        actions.onClick(e);
      })
    }
  }

  set total(value: number) {
    this.setText(this._priceElement, `Списано ${value} синапсов`);
  }
}