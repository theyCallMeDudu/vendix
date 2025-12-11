export interface IProduct {
  product_id: number;
  product_category_id?: number;
  product_name: string;
  unit_price: number;
  product_img?: string;
  product_category_name?: string; // Added for list views with joined data
}
