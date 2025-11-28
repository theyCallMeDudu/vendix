import { Injectable } from '@angular/core';
import { IProductCategory } from '../IProductCategory';

interface ProducCategoryResponse {
  data: IProductCategory[];
}

@Injectable({
  providedIn: 'root',
})
export class ProductCategoryService {
  productCategoriesURL = 'http://localhost:8000/api/categories';

  async getAllProductCategories(): Promise<IProductCategory[]> {
    const response = await fetch(this.productCategoriesURL, {
      headers: {
        Accept: 'application/json'
      },
    });

    if (!response.ok) {
      throw new Error(`Erro ao buscar categorias: ${response.status}`);
    }

    const json = (await response.json()) as ProducCategoryResponse;
    console.log(json);

    return json.data ?? [];
  }
}
