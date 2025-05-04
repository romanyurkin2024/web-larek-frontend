import { IOrderForm } from "../../types";
import { IEvents } from "../base/events";
import { Form } from "../base/Form";


interface OrderFormAction {
  onClick: (event: MouseEvent) => void;
}

export class OrderForm extends Form<IOrderForm> {
  protected _addressInput: HTMLInputElement;
  protected _cardPaymentButton: HTMLButtonElement;
  protected _cashPaymentButton: HTMLButtonElement;
  protected _buttons: HTMLElement[];

  constructor(protected _container: HTMLFormElement, protected _events: IEvents, actions?: OrderFormAction) {
    super(_container, _events);

    this._buttons = Array.from(this._container.querySelectorAll('.button_alt'));
    this._cardPaymentButton = this._container.querySelector('button[name="card"]');
    this._cashPaymentButton = this._container.querySelector('button[name="cash"]');
    this._addressInput = this._container.elements.namedItem('address') as HTMLInputElement;

    if (this._cardPaymentButton) {
      this._cardPaymentButton.addEventListener('click', (e: MouseEvent) => {
        this.setPaymentType('card');
        actions?.onClick(e);
      })
    }

    if (this._cashPaymentButton) {
      this._cashPaymentButton.addEventListener('click', (e: MouseEvent) => {
        this.setPaymentType('cash');
        actions?.onClick(e);
      })
    }

		this.container.addEventListener('submit', (e: Event) => {
			e.preventDefault();
			this.events.emit(`${this.container.name}:submit`);
		});
  }

  set addressInput(value: string) {
    this._addressInput.value = value;
  }


  setPaymentType(value: string) {
    this._buttons.forEach((item: HTMLButtonElement) => {
      if (item.name === value) {
        item.classList.add('button_alt-active');
      } else {
        item.classList.remove('button_alt-active');
      }
    });
  }
}