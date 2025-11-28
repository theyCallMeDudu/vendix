<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Product extends Model
{
    protected $table = 'product';
    protected $primaryKey = 'product_id';
    protected $fillable = ['product_id', 'product_category_id', 'product_name', 'unit_price'];

    public function productCategory(): BelongsTo
    {
        return $this->belongsTo(ProductCategory::class, 'product_category_id', 'product_category_id');
    }
}
