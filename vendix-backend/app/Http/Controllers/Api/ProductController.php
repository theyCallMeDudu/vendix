<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function getProducts(): JsonResponse
    {
        $products = Product::with('productCategory')->get()
            ->map(function ($product) {
                return [
                    'product_id'            => $product->product_id,
                    'product_name'          => $product->product_name,
                    'unit_price'            => $product->unit_price,
                    'product_category_name' => $product->productCategory->product_category_name
                ];
            });

        return response()->json([
            'data' => $products
        ]);
    }
}
