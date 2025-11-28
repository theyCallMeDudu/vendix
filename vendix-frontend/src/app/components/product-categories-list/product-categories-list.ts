import { Component, inject } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { IProductCategory } from '../../IProductCategory';
import { ProductCategoryService } from '../../services/product-category.service';

@Component({
  selector: 'app-product-categories-list',
  imports: [MatTableModule],
  templateUrl: './product-categories-list.html',
  styleUrl: './product-categories-list.scss',
})
export class ProductCategoriesList {
  displayedColumns: string[] = ['product_category_name', 'actions'];
  productCategoriesList: IProductCategory[] = [];
  filteredProductCategoriesList: IProductCategory[] = [];

  productCategoriesService: ProductCategoryService = inject(ProductCategoryService);

  constructor() {
    this.loadProductCategories();
  }

  async loadProductCategories() {
    try {
      const productCategories = await this.productCategoriesService.getAllProductCategories();

      this.productCategoriesList = productCategories;
    } catch (error) {
      console.error('Erro ao carregar categorias: ', error);
    }
  }
}
