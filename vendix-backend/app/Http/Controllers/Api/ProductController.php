<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\SaveProductRequest;
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

    public function saveProduct(SaveProductRequest $request): JsonResponse
    {
        $product = Product::create([
            'product_name'        => $request->product_name,
            'unit_price'          => $request->unit_price,
            'product_category_id' => $request->product_category_id
        ]);

        return response()->json([
            'message' => 'Product created successfully',
            'data' => $product
        ], JsonResponse::HTTP_CREATED);
    }
}
