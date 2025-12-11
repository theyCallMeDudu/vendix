<?php

declare(strict_types=1);

namespace App\Http\Helpers;

use Illuminate\Http\JsonResponse;
use Illuminate\Pagination\LengthAwarePaginator;

class PaginationHelper
{
    /**
     * Format a paginated response with consistent structure
     *
     * @param LengthAwarePaginator $paginator
     * @return JsonResponse
     */
    public static function formatPaginatedResponse(LengthAwarePaginator $paginator): JsonResponse
    {
        return response()->json([
            'data' => $paginator->items(),
            'meta' => [
                'current_page' => $paginator->currentPage(),
                'per_page' => $paginator->perPage(),
                'total' => $paginator->total(),
                'last_page' => $paginator->lastPage(),
                'from' => $paginator->firstItem(),
                'to' => $paginator->lastItem(),
            ],
            'links' => [
                'first' => $paginator->url(1),
                'last' => $paginator->url($paginator->lastPage()),
                'prev' => $paginator->previousPageUrl(),
                'next' => $paginator->nextPageUrl(),
            ],
        ]);
    }

    /**
     * Get pagination parameters from request with defaults
     *
     * @param \Illuminate\Http\Request $request
     * @param int $defaultPerPage
     * @param int $maxPerPage
     * @return array{page: int, per_page: int}
     */
    public static function getPaginationParams(
        \Illuminate\Http\Request $request,
        int $defaultPerPage = 15,
        int $maxPerPage = 100
    ): array {
        $page = max(1, (int) $request->query('page', 1));
        $perPage = max(1, min($maxPerPage, (int) $request->query('per_page', $defaultPerPage)));

        return [
            'page' => $page,
            'per_page' => $perPage,
        ];
    }
}

