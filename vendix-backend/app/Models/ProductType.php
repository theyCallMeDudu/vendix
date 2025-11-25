<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProductType extends Model
{
    protected $table = 'product_type';
    protected $primaryKey = 'product_type_id';
    protected $fillable = ['product_type_id', 'product_type_name'];
}
