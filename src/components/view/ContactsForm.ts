import { IContactsForm } from "../../types";
import { IEvents } from "../base/events";
import { Form } from "../base/Form";


export class ContactsForm extends Form<IContactsForm> {
  protected _emailInput: HTMLInputElement;
  protected _phoneInput: HTMLInputElement;

  constructor(protected _container: HTMLFormElement, protected _events: IEvents) {
    super(_container, _events);

    this._emailInput = this._container.elements.namedItem('email') as HTMLInputElement;
    this._phoneInput = this._container.elements.namedItem('phone') as HTMLInputElement;
  }

  set email(value: string) {
    this._emailInput.value = value;
  }

  set phone(value: string) {
    this._phoneInput.value = value;
  }
}