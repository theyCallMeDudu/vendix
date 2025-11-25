<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ProductTypeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('product_type')->insert([
            'product_type_name' => 'Doce'
        ]);

        DB::table('product_type')->insert([
            'product_type_name' => 'Salgado'
        ]);
    }
}
