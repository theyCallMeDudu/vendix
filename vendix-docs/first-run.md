# First Run Setup Guide

This guide will help you set up the Vendix backend for the first time.

---

## Windows Setup

### Step 1: Enable PHP Extensions

1. Locate your `php.ini` file:
```cmd
php --ini
```

2. Open the `php.ini` file in a text editor (as Administrator)

3. Find and uncomment (remove the `;` at the beginning) these lines:
```ini
extension=fileinfo
extension=mbstring
extension=pdo_sqlite
extension=sqlite3
```

4. Save the file

### Step 2: Create Environment File

Navigate to the backend directory:
```cmd
cd C:\path\to\vendix\vendix-backend
```

Copy the example environment file:
```cmd
copy .env.example .env
```

### Step 3: Generate Application Key

```cmd
php artisan key:generate
```

### Step 4: Create SQLite Database

```cmd
type nul > database\database.sqlite
```

### Step 5: Run Database Migrations

```cmd
php artisan migrate
```

### Step 6: Start the Development Server

```cmd
php artisan serve
```

Your application should now be running at http://127.0.0.1:8000

---

## Linux Setup

### Step 1: Enable PHP Extensions

1. Locate your `php.ini` file:
```bash
php --ini
```

2. Open the `php.ini` file in a text editor (with sudo if needed)

3. Find and uncomment (remove the `;` at the beginning) these lines:
```ini
extension=fileinfo
extension=mbstring
extension=pdo_sqlite
extension=sqlite3
```

4. Save the file

### Step 2: Create Environment File

Navigate to the backend directory:
```bash
cd /path/to/vendix/vendix-backend
```

Copy the example environment file:
```bash
cp .env.example .env
```

### Step 3: Generate Application Key

```bash
php artisan key:generate
```

### Step 4: Create SQLite Database

```bash
touch database/database.sqlite
```

### Step 5: Run Database Migrations

```bash
php artisan migrate
```

### Step 6: Start the Development Server

```bash
php artisan serve
```

Your application should now be running at http://127.0.0.1:8000

---

## Troubleshooting

- **Extensions not loading**: Restart your terminal/command prompt after editing `php.ini`
- **Permission errors on Linux**: You may need to set proper permissions on the database file:
  ```bash
  chmod 664 database/database.sqlite
  chmod 775 database/
  ```
- **Port 8000 already in use**: You can specify a different port:
  ```bash
  php artisan serve --port=8080
  ```

