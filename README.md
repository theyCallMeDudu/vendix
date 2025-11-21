# Vendix - Full-Stack Application

A modern full-stack application with Laravel backend and Angular frontend.

## 🛠️ Tech Stack

### Backend
- **Framework:** Laravel 12.x
- **Language:** PHP 8.2+
- **Database:** MySQL 8.0
- **Authentication:** Laravel Sanctum
- **API:** RESTful JSON API

### Frontend
- **Framework:** Angular 20.x
- **Language:** TypeScript 5.9+
- **UI:** Modern responsive design
- **HTTP:** Angular HttpClient with RxJS

### DevOps
- **Containerization:** Docker & Docker Compose
- **Web Server:** PHP built-in server (development)
- **Database Management:** phpMyAdmin

---

## 🚀 Quick Start

**Prerequisites:** Docker Desktop installed and running

# Run the following commands to set up vendix in your local environment

```powershell
# Windows PowerShell

1. git clone https://github.com/theyCallMeDudu/vendix.git
2. cd \path\to\vendix, e.g: C:\vendix
3. .\start-dev.ps1
```

```bash
# Linux/Mac
1. git clone https://github.com/theyCallMeDudu/vendix.git
2. cd cd \path\to\vendix, e.g: C:\vendix
3. chmod +x start-dev.sh
4. ./start-dev.sh
```

**Access the application:**
- Frontend: http://localhost:4200
- Backend API: http://localhost:8000/api
- phpMyAdmin: http://localhost:8080

## Utils

# Enter the backend container shell
`docker-compose exec backend bash`

# Once inside, you can run Laravel commands directly, such as:
`php artisan migrate`
`php artisan route:list`
`composer install`
`exit`  # to leave

# Frontend container
`docker-compose exec frontend sh`

# MySQL container
`docker-compose exec mysql bash`
# Or directly access MySQL CLI:
`docker-compose exec mysql mysql -uroot -proot vendix_db`

# phpMyAdmin (web only, access at http://localhost:8080)

# View logs
`docker-compose logs -f backend`
`docker-compose logs -f frontend`

## 📝 License

[Your License Here]

---

