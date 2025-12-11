<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Helpers\PaginationHelper;
use App\Http\Requests\SaveProductRequest;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;


class ProductController extends Controller
{
    public function getProducts(Request $request): JsonResponse
    {
        $params = PaginationHelper::getPaginationParams($request);

        $products = Product::with('productCategory')
            ->paginate($params['per_page'], ['*'], 'page', $params['page']);

        // Transform the items in the paginated collection
        $products->getCollection()->transform(function ($product) {
            return [
                'product_id'            => $product->product_id,
                'product_name'          => $product->product_name,
                'unit_price'            => $product->unit_price,
                'product_category_name' => $product->productCategory->product_category_name
            ];
        });

        return PaginationHelper::formatPaginatedResponse($products);
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

    public function getProduct(Product $product): JsonResponse
    {
        return response()->json([
            'data' => $product,
        ]);
    }

    public function updateProduct(SaveProductRequest $request, Product $product): JsonResponse
    {
        $product->update([
            'product_name'        => $request->product_name,
            'unit_price'          => $request->unit_price,
            'product_category_id' => $request->product_category_id
        ]);

        return response()->json([
            'message' => 'Product updated successfully',
            'data'    => $product->fresh()
        ], JsonResponse::HTTP_CREATED);
    }

    public function destroy(Product $product): JsonResponse
    {
        $product->delete();

        return response()->json([
            'message' => 'Product deleted successfully',
        ]);
    }
}
