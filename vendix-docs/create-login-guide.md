---

## Database Setup

### Step 1: Update User Model

Open `vendix-backend/app/Models/User.php` and ensure it looks like this:

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }
}
```

**Key additions:**
- `HasApiTokens`: Enables Sanctum token functionality
- `protected $hidden`: Ensures password is never sent in API responses
- `password => 'hashed'`: Automatically hashes passwords

### Step 2: Run Migrations

Laravel comes with user migrations by default. Let's run them:

```powershell
php artisan migrate
```

This creates these tables:
- `users` - Stores user accounts
- `password_reset_tokens` - For password reset functionality
- `sessions` - For session management
- `cache` - For application cache
- `jobs` - For background jobs
- `personal_access_tokens` - For Sanctum API tokens

**Already migrated?** If you see "Nothing to migrate", you're good!

### Step 3: Create a User Seeder

Let's create some test users so you can log in immediately:

```powershell
php artisan make:seeder UserSeeder
```

Open `vendix-backend/database/seeders/UserSeeder.php` and add:

```php
<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create a test admin user
        User::create([
            'name' => 'Admin User',
            'email' => 'admin@vendix.com',
            'password' => Hash::make('password123'),
            'email_verified_at' => now(),
        ]);

        // Create a test regular user
        User::create([
            'name' => 'John Doe',
            'email' => 'john@vendix.com',
            'password' => Hash::make('password123'),
            'email_verified_at' => now(),
        ]);

        // Create additional test users using factory
        User::factory(5)->create();
    }
}
```

### Step 4: Update Database Seeder

Open `vendix-backend/database/seeders/DatabaseSeeder.php` and update it:

```php
<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            UserSeeder::class,
        ]);
    }
}
```