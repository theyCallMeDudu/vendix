import { ChangeDetectionStrategy, Component, inject, Input, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IProduct } from '../../IProduct';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { Router, RouterLink } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { IProductCategory } from '../../IProductCategory';
import { ProductCategoryService } from '../../services/product-category.service';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-product',
  imports: [
    CommonModule,
    MatButtonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatSnackBarModule,
    MatInputModule,
    ReactiveFormsModule,
    RouterLink
  ],
  standalone: true,
  templateUrl: './product.component.html',
  styleUrl: './product.component.scss',
})
export class Product {
  @Input() cancelRoute: string = '';

  product = input<IProduct>();

  isSubmitting:boolean = false;
  serverErrors: Record<string, string[]> = {};
  successMessage = '';

  productsList: IProduct[] = [];
  productCategoriesList: IProductCategory[] = [];

  productService: ProductService = inject(ProductService);
  productCategoryService: ProductCategoryService = inject(ProductCategoryService);

  productForm!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    //   .getProductById();

    this.loadProductCategories();

    this.productForm = this.formBuilder.group({
      product_name: ['', [Validators.required, Validators.maxLength(255)]],
      unit_price: [null, [Validators.required, Validators.min(0)]],
      product_category_id: [null, [Validators.required]]
    });
  }

  onSubmit(): void {
    this.serverErrors = {};
    this.successMessage = '';

    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.productService.createProduct(this.productForm.value).subscribe({
      next: (response) => {
        this.isSubmitting = false;

        // usa a rota de cancelamento como "voltar pra listagem"
        const target = this.cancelRoute || '/products';
        this.router.navigate([target], {
          state: {
            toast: {
              type: 'success',
              message: response.message ?? 'Produto criado com sucesso.',
            },
          },
        });
      },
      error: (error) => {
        this.isSubmitting = false;

        if (error.status === 422 && error.error?.errors) {
          this.serverErrors = error.error.errors;
        } else {
          this.serverErrors = {
            general: ['Ocorreu um erro ao salvar o produto.'],
          };

          this.snackBar.open(
            'Erro ao salvar o produto. Tente novamente.',
            'Fechar',
            {
              duration: 3000,
              horizontalPosition: 'right',
              verticalPosition: 'top',
              panelClass: ['toast-error'],
            }
          );
        }
      },
    });
  }

  get f() {
    return this.productForm.controls;
  }

  async loadProductCategories() {
    try {
      const productCategories = await this.productCategoryService.getAllProductCategories();

      this.productCategoriesList = productCategories;
    } catch (error) {
      console.error('Erro ao carregar categorias: ', error);
    }
  }
}
