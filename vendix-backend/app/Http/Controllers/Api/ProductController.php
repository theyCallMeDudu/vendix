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
        $products = Product::all();
        return response()->json([
            'data' => $products
        ]);
    }
}
