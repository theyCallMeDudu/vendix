<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ProductCategory;
use Illuminate\Http\JsonResponse;

class ProductCategoryController extends Controller
{
    public function getCategories(): JsonResponse
    {
        $categories = ProductCategory::all()->with('productType');
        return response()->json([
            'data' => $categories
        ]);
    }
}
