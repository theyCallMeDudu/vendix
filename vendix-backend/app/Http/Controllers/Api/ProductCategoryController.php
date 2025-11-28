<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ProductCategory;
use Illuminate\Http\JsonResponse;

class ProductCategoryController extends Controller
{
    public function getCategories(): JsonResponse
    {
        $categories = ProductCategory::with('productType')->get()
            ->map(function ($category) {
                return [
                    'product_category_id'   =>  $category->product_category_id,
                    'product_category_name' =>  $category->product_category_name,
                    'product_type_name'     =>  $category->productType->product_type_name,
                ];
            });

        return response()->json([
            'data' => $categories
        ]);
    }
}
