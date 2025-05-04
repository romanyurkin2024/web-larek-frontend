import { ApiListResponse, IOrder, IOrderData, IOrderResult } from "../types";
import { IProduct } from "../types";
import { Api } from "./base/api";

export class WebLarekAPI extends Api {
  readonly cdn: string;

  constructor(cdn: string, baseUrl: string) {
    super(baseUrl);
    this.cdn = cdn;
  }

  getProductList(): Promise<IProduct[]> {
    return this.get<ApiListResponse<IProduct>>('/product')
      .then((res: ApiListResponse<IProduct>) => {
        return res.items.map(item => ({
          ...item,
          image: this.cdn + item.image
        }));
      });
  }

  getProductById(id: string): Promise<IProduct>{
    return this.get(`/product/${id}`).then((res: IProduct) => ({...res, image: this.cdn + res.image}));
  }

  postOrder(order: IOrder): Promise<IOrderResult> {
    return this.post(`/order`, order).then((data: IOrderResult) => data);
  }
}