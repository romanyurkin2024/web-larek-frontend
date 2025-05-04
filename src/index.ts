import './scss/styles.scss';
import { API_URL, CDN_URL } from './utils/constants';
import { WebLarekAPI } from './components/WebLarekAPI';
import { IContactsForm, IOrderForm, IProduct } from './types';
import { Product } from './components/view/Product';
import { ProductCatalogModel } from './components/model/ProductCatalogModel';
import { cloneTemplate, formValidation } from './utils/utils';
import { EventEmitter } from './components/base/events';
import { Page } from './components/view/Page';
import { Modal } from './components/view/Modal';
import { BasketModel } from './components/model/BasketModel';
import { Basket } from './components/view/Basket';
import { BasketItem } from './components/view/BasketItem';
import { CategoryColors } from './types';
import { OrderForm } from './components/view/OrderForm';
import { ContactsForm } from './components/view/ContactsForm';
import { OrderModel } from './components/model/OrderModel';
import { Success } from './components/view/Success';

const events = new EventEmitter();
const webLarekApi = new WebLarekAPI(CDN_URL, API_URL);


// Шаблоны
const cardTemplate = document.querySelector('#card-catalog') as HTMLTemplateElement;
const cardPreviewTemplate = document.querySelector('#card-preview') as HTMLTemplateElement;
const basketTemplate = document.querySelector('#basket') as HTMLTemplateElement;
const basketItemTemplate = document.querySelector('#card-basket') as HTMLTemplateElement;
const orderFormTemplate = document.querySelector('#order') as HTMLTemplateElement;
const contactsFormTemplate = document.querySelector('#contacts') as HTMLTemplateElement;
const successViewTemplate = document.querySelector('#success') as HTMLTemplateElement;

// Отображения (View)
const modalElement = new Modal(document.querySelector('.modal'), events);
const page = new Page(document.querySelector('.page__wrapper') as HTMLElement, events, {
  onClickOpenBasket: (e: MouseEvent) => {
    events.emit('basket:open');
  }
});
const basketView = new Basket(cloneTemplate(basketTemplate), events, {
  onClick: (e: MouseEvent) => {
    events.emit('order:open');
  }
});
const successView = new Success(cloneTemplate(successViewTemplate), events, {
  onClick: (e: MouseEvent) => {
    events.emit('success:close-view')
  }
})
const orderForm = new OrderForm(cloneTemplate(orderFormTemplate), events, {
  onClick: (e: MouseEvent) => {
    const button = e.target as HTMLButtonElement;
    events.emit('order:change-payment', { paymentMethod: button.name });
  }
});
const contactsForm = new ContactsForm(cloneTemplate(contactsFormTemplate), events);

// Модели данных
const productModel = new ProductCatalogModel(events);
const basketModel = new BasketModel(events);
const orderModel = new OrderModel(events);



// Функция для получения данных с API и записи в модель данных
function renderCatalog() {
  webLarekApi
    .getProductList()
    .then(res => productModel.products = res)
    .catch(err => console.log(err));
}
renderCatalog();


// Вывод всех карточек из модели на страницу с каталогом
events.on('products:changed', () => {
  const productsHTMLArray = productModel.products.map(product => {
    const color: CategoryColors = CategoryColors[product.category as keyof typeof CategoryColors];
    return new Product(cloneTemplate(cardTemplate), events, {
      onClick: () => { events.emit('product:preview', { id: product.id }) }
    }).render({ ...product, color: color })
  });
  page.render({
    productsList: productsHTMLArray
  });
});


// Открытие модального окна одного продукта
events.on('product:preview', ({ id }: { id: string }) => {
  webLarekApi
    .getProductById(id)
    .then(item => {
      const color: CategoryColors = CategoryColors[item.category as keyof typeof CategoryColors];
      item.inBasket = basketModel.checkItemInBasket(item);
      if (!item.price) item.isDisabled = true
      modalElement.content = new Product(cloneTemplate(cardPreviewTemplate), events, {
        onClick: (e: MouseEvent) => {
          const targetElement = e.target as HTMLElement;
          if (targetElement.classList.contains('button')) {
            events.emit(item.inBasket ? 'basket:remove-item' : 'basket:add-item', item);
            modalElement.close();
          }
        }
      }).render({ ...item, color: color });
      modalElement.open();
    }).catch(error => {
      console.log(error);
    })
});

// Добавляем продукт в корзину
events.on('basket:add-item', (item: IProduct) => {
  basketModel.addItem(item);
});

// Убираем продукт из корзины
events.on('basket:remove-item', (item: IProduct) => {
  basketModel.removeItem(item.id);
});

// Перерисовываем корзину, если добавился или удалился какой-нибудь из продуктов
events.on('basket:changed', () => {
  const basketItems = basketModel.items.map((item, index) => {
    item.indexInBasket = index + 1;
    return new BasketItem(cloneTemplate(basketItemTemplate), events, {
      onClick: (e: MouseEvent) => {
        events.emit('ui:basket-remove', { id: item.id })
      }
    }).render(item);
  });

  // Отображаем актуальное кол-во товаров в корзине
  page.basketCounter = basketModel.getCounter();

  basketView.render({
    items: basketItems,
    price: basketModel.getSumAllItems(),
    isDisabled: basketModel.getSumAllItems() === 0 || null
  });
});

// Открываем корзину
events.on('basket:open', () => {
  basketView.render({
    isDisabled: basketModel.getSumAllItems() === 0 || null
  });
  modalElement.content = basketView.render();
  modalElement.open();
});

// Удаление продукта из модели данных корзины
events.on('ui:basket-remove', ({ id }: { id: string }) => {
  basketModel.removeItem(id);
});

// Перерисовка на страницу заполнения форм
events.on('order:open', () => {
  modalElement.content = orderForm.render({
    valid: orderModel.checkOrderValidation(),
    errors: [],
    address: orderModel.address || '',
    payment: orderModel.payment || ''
  });
});

// Фиксируем изменение полей методов оплаты и запись данных в модель оформления заказа
events.on('order:change-payment', ({ paymentMethod }: { paymentMethod: string }) => {
  orderModel.payment = paymentMethod;
  orderModel.checkOrderValidation();
});

// Фиксируем изменение поля с адресом и запись данных в модель оформления заказа 
events.on('address:change', (data: { field: keyof IOrderForm; value: string }) => {
  orderModel[data.field] = data.value;
  orderModel.checkOrderValidation();
});

// Проверка на наличие ошибок в форме OrderForm 
events.on('order:validation', (errors: Partial<IOrderForm>) => {
  formValidation(orderForm, errors);
});

// Переход на второй этап заполнения контактов покупателя
events.on('order:submit', () => {
  modalElement.content = contactsForm.render({
    email: orderModel.email || '',
    phone: orderModel.phone || '',
    valid: orderModel.checkContactsValidation(),
    errors: []
  });
})

// Фиксируем изменение поля почты и запись данных в модель оформления заказа 
events.on('email:change', (data: { field: keyof IContactsForm; value: string }) => {
  orderModel[data.field] = data.value;
  orderModel.checkContactsValidation();
});

// Фиксируем изменение поля телефона и запись данных в модель оформления заказа 
events.on('phone:change', (data: { field: keyof IContactsForm; value: string }) => {
  orderModel[data.field] = data.value;
  orderModel.checkContactsValidation();
});

// Проверка на наличие ошибок в форме IContactsForm
events.on('contacts:validation', (errors: Partial<IContactsForm>) => {
  formValidation(contactsForm, errors);
});

// Открытие окно успешной покупки и отражением суммы заказа
events.on('contacts:submit', () => {
  const payload = {
    ...orderModel.getOrderData(),
    total: basketModel.getSumAllItems(),
    items: basketModel.itemsId
  }
  webLarekApi.postOrder(payload).then(result => {
    modalElement.content = successView.render({
      total: result.total
    });
    basketModel.emptyBasket();
    orderModel.clearOrderData();
    modalElement.open();
  })
    .catch(error => {
      console.log(error);
    });
})

// Закрытие модального окна успешной покупки
events.on('success:close-view', () => {
  modalElement.close();
});

// Блокировка прокрутки страницы
events.on('modal:open', () => {
  page.lockWrapper = true;
});

// Разблокировка прокрутки страницы
events.on('modal:close', () => {
  page.lockWrapper = false;
});