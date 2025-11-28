<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;

class ProductCategory extends Model
{
    protected $table = 'product_category';
    protected $primaryKey = 'product_category_id';
    protected $fillable = ['product_category_id', 'product_type_id', 'product_category_name'];

    public function productType(): BelongsTo
    {
        return $this->belongsTo(ProductType::class, 'product_type_id', 'product_type_id');
    }
}
