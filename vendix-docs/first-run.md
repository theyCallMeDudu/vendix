# First Run Setup Guide

This is a step-by-step guide for developers cloning and running the Vendix project for the first time.

---

## Prerequisites Checklist

Before you begin, ensure you have the following installed:

- [ ] **PHP 8.1+** - Check with: `php --version`
- [ ] **Composer** - Check with: `composer --version`
- [ ] **MySQL 8.0+** or **MariaDB 10.3+** - Check with: `mysql --version`
- [ ] **Node.js 18+** and **npm** - Check with: `node --version` and `npm --version`
- [ ] **Git** - Check with: `git --version`

If any are missing, install them before proceeding.

---

## Quick Setup (Copy & Paste)

### For Windows (PowerShell)

```powershell
# 1. Clone the repository (if not already cloned)
# git clone <repository-url> C:\Sistemas\vendix
# cd C:\Sistemas\vendix

# 2. Setup Backend
cd vendix-backend
Copy-Item .env.example .env

# 3. Install backend dependencies
composer install

# 4. Generate application key
php artisan key:generate

# 5. Create MySQL database (run mysql commands separately)
# mysql -u root -p
# CREATE DATABASE vendix_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
# EXIT;

# 6. After creating database, edit .env file with your MySQL credentials
# Then run migrations
php artisan migrate

# 7. Seed database with sample data
php artisan db:seed

# 8. Start backend server
php artisan serve

# 9. In a new terminal, setup frontend
cd ..\vendix-frontend
npm install
npm start
```

### For Linux/Mac (Bash)

```bash
# 1. Clone the repository (if not already cloned)
# git clone <repository-url> ~/vendix
# cd ~/vendix

# 2. Setup Backend
cd vendix-backend
cp .env.example .env

# 3. Install backend dependencies
composer install

# 4. Generate application key
php artisan key:generate

# 5. Create MySQL database (run mysql commands separately)
# mysql -u root -p
# CREATE DATABASE vendix_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
# EXIT;

# 6. After creating database, edit .env file with your MySQL credentials
# Then run migrations
php artisan migrate

# 7. (Optional) Seed database with sample data
# php artisan db:seed

# 8. Start backend server
php artisan serve

# 9. In a new terminal, setup frontend
cd ../vendix-frontend
npm install
npm start
```

---

## Detailed Step-by-Step Instructions

### Windows Setup (PowerShell)

Follow these steps in order:

#### ✅ Step 1: Verify Prerequisites

Open PowerShell and check your installations:

```powershell
# Check PHP version (should be 8.1+)
php --version

# Check Composer
composer --version

# Check MySQL
mysql --version

# Check Node.js and npm
node --version
npm --version
```

If any command fails, install the missing software first.

#### ✅ Step 2: Clone the Repository (if not already done)

```powershell
# Navigate to your projects directory
cd C:\Sistemas

# Clone the repository (replace with your actual repository URL)
git clone <repository-url> vendix

# Navigate into the project
cd vendix
```

**Note:** If you already have the project cloned, skip this step.

#### ✅ Step 3: Enable Required PHP Extensions

```powershell
# Find your php.ini file location
php --ini
```

Open the `php.ini` file shown in the output as an **Administrator** in your text editor.

Find and uncomment (remove the `;` at the beginning) these lines:
```ini
extension=fileinfo
extension=mbstring
extension=pdo_mysql
extension=mysqli
extension=openssl
```

Save the file and **restart your terminal** for changes to take effect.

Verify extensions are loaded:
```powershell
php -m | Select-String -Pattern "pdo_mysql"
php -m | Select-String -Pattern "mbstring"
```

#### ✅ Step 4: Create MySQL Database

Connect to MySQL:
```powershell
mysql -u root -p
# Enter your MySQL root password when prompted
```

In the MySQL console, run:
```sql
CREATE DATABASE vendix_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
EXIT;
```

**Alternative:** You can create the database using **DBeaver**, **MySQL Workbench**, or **phpMyAdmin** if you prefer a GUI.

#### ✅ Step 5: Setup Backend Environment

Navigate to the backend directory:
```powershell
cd C:\Sistemas\vendix\vendix-backend
```

Copy the example environment file:
```powershell
Copy-Item .env.example .env
```

#### ✅ Step 6: Configure Database Connection

Open the `.env` file in your text editor and update these lines:

```ini
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=vendix_db
DB_USERNAME=root
DB_PASSWORD=your_mysql_password_here
```

**⚠️ Important:** Replace `your_mysql_password_here` with your actual MySQL root password.

**Tip:** If you don't have a MySQL root password (fresh installation), you may need to set one first.

#### ✅ Step 7: Install Backend Dependencies

```powershell
composer install
```

This will download all PHP packages required by Laravel. It may take a few minutes.

#### ✅ Step 8: Generate Application Key

```powershell
php artisan key:generate
```

This creates a unique encryption key for your application and updates your `.env` file.

#### ✅ Step 9: Run Database Migrations

```powershell
php artisan migrate
```

This creates all necessary tables in your database:
- ✓ users
- ✓ cache
- ✓ jobs
- ✓ password_reset_tokens
- ✓ sessions
- ✓ etc.

When prompted "Do you really wish to run this command? (yes/no)", type `yes` and press Enter.

#### ✅ Step 10: (Optional) Seed Database with Test Data

```powershell
php artisan db:seed
```

This populates the database with sample data for testing. Skip this if you want to start fresh.

#### ✅ Step 11: Start Backend Development Server

```powershell
php artisan serve
```

✅ **Backend is now running at:** http://127.0.0.1:8000

**Keep this terminal open!** The server needs to stay running.

#### ✅ Step 12: Setup Frontend (New Terminal)

Open a **new PowerShell terminal** (keep the backend running) and navigate to frontend:

```powershell
cd C:\Sistemas\vendix\vendix-frontend
```

Install frontend dependencies:
```powershell
npm install
```

This will download all Node.js packages. It may take several minutes.

#### ✅ Step 13: Start Frontend Development Server

```powershell
npm start
```

✅ **Frontend is now running at:** http://localhost:4200 (or the port shown in terminal)

Your browser should automatically open. If not, navigate to the URL shown in the terminal.

---

### 🎉 Success! Your Project is Running

You should now have:
- ✅ Backend API running on http://127.0.0.1:8000
- ✅ Frontend app running on http://localhost:4200
- ✅ MySQL database configured and migrated

**Next Steps:**
- See `sanctum-login-guide.md` for authentication setup
- See `frontend-setup-guide.md` for frontend configuration details

---

## Linux/Mac Setup (Bash)

Follow these steps in order:

#### ✅ Step 1: Verify Prerequisites

Open Terminal and check your installations:

```bash
# Check PHP version (should be 8.1+)
php --version

# Check Composer
composer --version

# Check MySQL
mysql --version

# Check Node.js and npm
node --version
npm --version
```

If any command fails, install the missing software first.

#### ✅ Step 2: Clone the Repository (if not already done)

```bash
# Navigate to your projects directory
cd ~

# Clone the repository (replace with your actual repository URL)
git clone <repository-url> vendix

# Navigate into the project
cd vendix
```

**Note:** If you already have the project cloned, skip this step.

#### ✅ Step 3: Install Required PHP Extensions

For **Ubuntu/Debian**:
```bash
sudo apt update
sudo apt install php-mysql php-mbstring php-xml php-curl php-zip
```

For **Fedora/RHEL/CentOS**:
```bash
sudo dnf install php-mysqlnd php-mbstring php-xml php-curl php-zip
```

For **macOS** (using Homebrew):
```bash
brew install php
# PHP extensions are usually included
```

Restart PHP-FPM (if using):
```bash
sudo systemctl restart php-fpm
```

Verify extensions are loaded:
```bash
php -m | grep pdo_mysql
php -m | grep mbstring
```

#### ✅ Step 4: Create MySQL Database

Connect to MySQL:
```bash
mysql -u root -p
# Enter your MySQL root password when prompted
```

In the MySQL console, run:
```sql
CREATE DATABASE vendix_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
EXIT;
```

**Alternative:** You can create the database using **DBeaver**, **MySQL Workbench**, or **phpMyAdmin** if you prefer a GUI.

#### ✅ Step 5: Setup Backend Environment

Navigate to the backend directory:
```bash
cd ~/vendix/vendix-backend
```

Copy the example environment file:
```bash
cp .env.example .env
```

#### ✅ Step 6: Configure Database Connection

Open the `.env` file in your text editor:
```bash
nano .env
# or use: vim .env, code .env, etc.
```

Update these lines:
```ini
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=vendix_db
DB_USERNAME=root
DB_PASSWORD=your_mysql_password_here
```

**⚠️ Important:** Replace `your_mysql_password_here` with your actual MySQL root password.

Save and exit (in nano: `Ctrl+X`, then `Y`, then `Enter`).

#### ✅ Step 7: Install Backend Dependencies

```bash
composer install
```

This will download all PHP packages required by Laravel. It may take a few minutes.

#### ✅ Step 8: Generate Application Key

```bash
php artisan key:generate
```

This creates a unique encryption key for your application and updates your `.env` file.

#### ✅ Step 9: Run Database Migrations

```bash
php artisan migrate
```

This creates all necessary tables in your database:
- ✓ users
- ✓ cache
- ✓ jobs
- ✓ password_reset_tokens
- ✓ sessions
- ✓ etc.

When prompted "Do you really wish to run this command? (yes/no)", type `yes` and press Enter.

#### ✅ Step 10: (Optional) Seed Database with Test Data

```bash
php artisan db:seed
```

This populates the database with sample data for testing. Skip this if you want to start fresh.

#### ✅ Step 11: Set Proper Permissions

```bash
chmod -R 775 storage bootstrap/cache
chown -R $USER:www-data storage bootstrap/cache
```

This ensures Laravel can write to necessary directories.

#### ✅ Step 12: Start Backend Development Server

```bash
php artisan serve
```

✅ **Backend is now running at:** http://127.0.0.1:8000

**Keep this terminal open!** The server needs to stay running.

#### ✅ Step 13: Setup Frontend (New Terminal)

Open a **new terminal** (keep the backend running) and navigate to frontend:

```bash
cd ~/vendix/vendix-frontend
```

Install frontend dependencies:
```bash
npm install
```

This will download all Node.js packages. It may take several minutes.

#### ✅ Step 14: Start Frontend Development Server

```bash
npm start
```

✅ **Frontend is now running at:** http://localhost:4200 (or the port shown in terminal)

Your browser should automatically open. If not, navigate to the URL shown in the terminal.

---

### 🎉 Success! Your Project is Running

You should now have:
- ✅ Backend API running on http://127.0.0.1:8000
- ✅ Frontend app running on http://localhost:4200
- ✅ MySQL database configured and migrated

**Next Steps:**
- See `sanctum-login-guide.md` for authentication setup
- See `frontend-setup-guide.md` for frontend configuration details

---

## Optional: Connecting with DBeaver (Database GUI Tool)

If you want to visually manage your database, you can use DBeaver:

#### Step 1: Download and Install DBeaver

Download from: https://dbeaver.io/download/

#### Step 2: Create MySQL Connection

1. **Open DBeaver** and click "New Database Connection" (or press `Ctrl+Shift+N`)

2. **Select MySQL** from the database list and click "Next"

3. **Configure connection settings**:
   ```
   Host:              127.0.0.1
   Port:              3306
   Database:          vendix_db
   Username:          root
   Password:          [your MySQL password]
   Connection name:   Vendix Local MySQL
   ```

4. **Click "Test Connection"** 
   - DBeaver will download MySQL drivers automatically if needed
   - You should see "Connected" message

5. **Click "Finish"** to save the connection

#### Step 3: Browse Your Database

- Expand the connection in the Database Navigator
- You'll see your `vendix_db` database with all tables created by migrations
- You can browse data, run SQL queries, and manage your database visually

---

## Common Issues and Solutions

### ❌ Problem: PHP extensions not loading

**Solution:**
1. Restart your terminal after editing `php.ini`
2. Verify extensions are enabled:
   ```powershell
   # Windows
   php -m | Select-String -Pattern "pdo_mysql"
   
   # Linux/Mac
   php -m | grep pdo_mysql
   ```
3. If still not working, check that you edited the correct `php.ini` file (use `php --ini` to find it)

---

### ❌ Problem: MySQL connection refused or access denied

**Solution:**
1. Check if MySQL is running:
   ```powershell
   # Windows
   Get-Service MySQL*
   
   # Linux/Mac
   sudo systemctl status mysql
   ```
2. Start MySQL if it's not running:
   ```powershell
   # Windows
   Start-Service MySQL80  # or your MySQL service name
   
   # Linux/Mac
   sudo systemctl start mysql
   ```
3. Verify your credentials in `.env` file match your MySQL username/password
4. Test MySQL connection manually: `mysql -u root -p`

---

### ❌ Problem: Database doesn't exist error

**Solution:**
Make sure you created the database:
```sql
mysql -u root -p
CREATE DATABASE vendix_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
EXIT;
```

---

### ❌ Problem: Migration fails with "Table already exists"

**Solution:**
If you want to start fresh (⚠️ **This deletes all data!**):
```bash
php artisan migrate:fresh
```

Or drop specific tables manually in DBeaver/MySQL console.

---

### ❌ Problem: Port 8000 already in use

**Solution:**
Use a different port:
```bash
php artisan serve --port=8080
```

Then update your frontend API URL to point to port 8080.

---

### ❌ Problem: Composer install fails

**Solution:**
1. Make sure you're connected to the internet
2. Clear Composer cache:
   ```bash
   composer clear-cache
   composer install
   ```
3. If still failing, try:
   ```bash
   composer install --ignore-platform-reqs
   ```

---

### ❌ Problem: npm install fails

**Solution:**
1. Clear npm cache:
   ```bash
   npm cache clean --force
   npm install
   ```
2. Delete `node_modules` and try again:
   ```bash
   # Windows
   Remove-Item -Recurse -Force node_modules
   Remove-Item package-lock.json
   npm install
   
   # Linux/Mac
   rm -rf node_modules package-lock.json
   npm install
   ```

---

### ❌ Problem: Storage permission errors (Linux/Mac)

**Solution:**
```bash
sudo chmod -R 775 storage bootstrap/cache
sudo chown -R $USER:www-data storage bootstrap/cache
```

---

### ✅ Verify Everything is Working

Run these commands to check your setup:

```bash
# Test database connection and see migration status
php artisan migrate:status

# Check Laravel configuration
php artisan about

# Clear all caches (useful when things behave strangely)
php artisan optimize:clear

# Test if backend API responds
curl http://127.0.0.1:8000/api
```

---

## Daily Development Workflow

After the first setup, here's how to start the project each day:

### Windows (PowerShell)

```powershell
# Terminal 1: Start Backend
cd C:\Sistemas\vendix\vendix-backend
php artisan serve

# Terminal 2: Start Frontend
cd C:\Sistemas\vendix\vendix-frontend
npm start
```

### Linux/Mac (Bash)

```bash
# Terminal 1: Start Backend
cd ~/vendix/vendix-backend
php artisan serve

# Terminal 2: Start Frontend
cd ~/vendix/vendix-frontend
npm start
```

---

## Useful Artisan Commands

```bash
# Database
php artisan migrate              # Run migrations
php artisan migrate:rollback     # Rollback last migration
php artisan migrate:fresh        # Drop all tables and re-migrate (⚠️ deletes data!)
php artisan migrate:fresh --seed # Same as above + seed data
php artisan db:seed              # Run database seeders

# Cache
php artisan cache:clear          # Clear application cache
php artisan config:clear         # Clear config cache
php artisan route:clear          # Clear route cache
php artisan optimize:clear       # Clear all caches

# Info
php artisan migrate:status       # Check migration status
php artisan route:list           # List all routes
php artisan about                # Display app information
```

---

## Additional Resources

- **Frontend Setup**: `frontend-setup-guide.md` - Detailed frontend configuration
- **Authentication**: `sanctum-login-guide.md` - Laravel Sanctum setup for login/auth
- **Laravel Docs**: https://laravel.com/docs
- **Angular Docs**: https://angular.dev

---

## Need Help?

If you encounter issues not covered here:

1. Check Laravel logs: `vendix-backend/storage/logs/laravel.log`
2. Check browser console for frontend errors (F12)
3. Run `php artisan about` to see system information
4. Contact the development team with error details

