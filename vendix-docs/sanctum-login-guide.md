# Laravel Sanctum Authentication with Angular Frontend

Hey there! Let's set up a complete authentication system for your Vendix project using Laravel Sanctum.
This guide will walk you through building a secure login/logout system that connects your Angular frontend to your Laravel backend.

---

## Table of Contents
1. [What is Laravel Sanctum?](#what-is-laravel-sanctum)
2. [Prerequisites](#prerequisites)
3. [Backend Setup - Laravel Sanctum](#backend-setup---laravel-sanctum)
4. [Database Setup](#database-setup)
5. [Creating Authentication Endpoints](#creating-authentication-endpoints)
6. [Testing the API with Postman](#testing-the-api-with-postman)
7. [Frontend Setup - Angular](#frontend-setup---angular)
8. [Creating the Auth Service](#creating-the-auth-service)
9. [Building the Login Component](#building-the-login-component)
10. [Building the Register Component](#building-the-register-component)
11. [Protected Routes and Auth Guards](#protected-routes-and-auth-guards)
12. [Adding a Dashboard](#adding-a-dashboard)
13. [HTTP Interceptors](#http-interceptors)
14. [Testing the Complete Flow](#testing-the-complete-flow)
15. [Common Issues and Solutions](#common-issues-and-solutions)
16. [Next Steps](#next-steps)

---

## What is Laravel Sanctum?

**Laravel Sanctum** is Laravel's official authentication system for SPAs (Single Page Applications) and mobile apps. It provides:

- **Token-based authentication**: Perfect for Angular apps
- **Simple setup**: Much easier than Passport
- **Secure**: Industry-standard security practices
- **Cookie-based sessions**: Optional for same-domain SPAs

**Why Sanctum over Passport?**
- Passport is for OAuth2 (when you need "Login with Google" style features)
- Sanctum is simpler and perfect for your own frontend talking to your own backend

---

## Prerequisites

Before we start, make sure you have:

- ✅ Laravel backend running on `http://127.0.0.1:8000`
- ✅ Angular frontend running on `http://localhost:4200`
- ✅ CORS configured (from the frontend setup guide)
- ✅ Database connection configured in `.env`
- ✅ Basic understanding of HTTP requests

---

## Backend Setup - Laravel Sanctum

### Step 1: Install Laravel Sanctum

Navigate to your backend directory:

```powershell
cd C:\Sistemas\vendix\vendix-backend
```

Install Laravel Sanctum via Composer:

```powershell
composer require laravel/sanctum
```

This will install Sanctum and add it to your `composer.json`. Wait for the installation to complete (should take 30-60 seconds).

**What you'll see:**
```
Using version ^4.x for laravel/sanctum
./composer.json has been updated
...
Package manifest generated successfully.
```

**Optional:** If you want to customize Sanctum's configuration, you can publish the config file:

```powershell
php artisan config:publish sanctum
```

However, for this guide, **the default configuration works perfectly** - no need to create or modify the config file unless you want to customize token expiration or other advanced settings.

### Step 2: Understanding Sanctum Configuration

Laravel 12's default Sanctum configuration includes:

**Default Settings:**
- ✅ **Token-based authentication** enabled (perfect for Angular)
- ✅ **No expiration** on tokens (tokens last until manually revoked)
- ✅ **Stateful domains** include localhost (for cookie-based auth if needed)
- ✅ **Multiple tokens per user** allowed (user can login from multiple devices)

**You don't need to create a config file** unless you want to customize these settings. The defaults work great for development and production!

**Optional Customizations** (only if needed):
- Set token expiration time
- Customize stateful domains for cookie-based auth
- Change token prefix for security scanning tools

For this guide, **we'll use the defaults** - they're perfectly suited for a token-based Angular + Laravel setup.

### Step 3: Update Environment Variables

Open `vendix-backend/.env` and verify/update these settings:

```env
APP_URL=http://127.0.0.1:8000

# Optional - only needed if using cookie-based authentication
# For token-based auth (which we're using), these aren't required
# SANCTUM_STATEFUL_DOMAINS=localhost:4200,localhost

SESSION_DRIVER=database
```

**Why these settings?**
- `APP_URL`: Your Laravel backend URL (used for generating links)
- `SESSION_DRIVER=database`: Stores sessions in the database (we'll create this table)

**Note:** We're using **token-based authentication** (Bearer tokens), not cookie-based authentication, so we don't need to configure `SANCTUM_STATEFUL_DOMAINS` or `SESSION_DOMAIN`.

### Step 4: Update CORS Configuration

Open `vendix-backend/config/cors.php` and update it to support credentials:

```php
<?php

return [
    'paths' => ['api/*', 'sanctum/csrf-cookie'],

    'allowed_methods' => ['*'],

    'allowed_origins' => ['http://localhost:4200'],

    'allowed_origins_patterns' => [],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 0,

    'supports_credentials' => true,  // IMPORTANT: Changed to true
];
```

**Critical:** `supports_credentials` must be `true` for Sanctum to work properly, and `allowed_origins` should be specific (not `*`) when using credentials.

## Creating Authentication Endpoints

### Step 1: Create Auth Controller

```powershell
php artisan make:controller Api/AuthController
```

Open `vendix-backend/app/Http/Controllers/Api/AuthController.php` and add:

```php
<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    /**
     * Register a new user
     */
    public function register(Request $request): JsonResponse
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        $token = $user->createToken('auth-token')->plainTextToken;

        return response()->json([
            'success' => true,
            'message' => 'User registered successfully',
            'data' => [
                'user' => $user,
                'token' => $token,
            ],
        ], 201);
    }

    /**
     * Login user and create token
     */
    public function login(Request $request): JsonResponse
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['The provided credentials are incorrect.'],
            ]);
        }

        // Delete old tokens (optional - ensures user has only one active session)
        $user->tokens()->delete();

        $token = $user->createToken('auth-token')->plainTextToken;

        return response()->json([
            'success' => true,
            'message' => 'Login successful',
            'data' => [
                'user' => $user,
                'token' => $token,
            ],
        ]);
    }

    /**
     * Get authenticated user info
     */
    public function me(Request $request): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data' => $request->user(),
        ]);
    }

    /**
     * Logout user (revoke token)
     */
    public function logout(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'success' => true,
            'message' => 'Logged out successfully',
        ]);
    }
}
```

**What each method does:**
- `register()`: Creates a new user account and returns a token
- `login()`: Validates credentials and returns a token
- `me()`: Returns the currently authenticated user's info
- `logout()`: Deletes the current token (logs out)

### Step 2: Add Authentication Routes

Open `vendix-backend/routes/api.php` and update it:

```php
<?php

use App\Http\Controllers\Api\AuthController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Public routes (no authentication required)
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Test route
Route::get('/test', function () {
    return response()->json([
        'message' => 'Hello from Laravel!',
        'timestamp' => now()->toDateTimeString(),
    ]);
});

// Protected routes (authentication required)
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);
    
    // Example of a protected route
    Route::get('/user', function (Request $request) {
        return $request->user();
    });
});
```

**Route structure:**
- Public routes: Anyone can access (register, login)
- Protected routes: Require a valid token (me, logout)

### Step 3: Test Your Routes

Check that all routes are registered:

```powershell
php artisan route:list --path=api
```

You should see:
```
POST    api/register
POST    api/login
GET     api/me (protected)
POST    api/logout (protected)
GET     api/user (protected)
GET     api/test
```

---

## Testing the API with Postman

Before building the frontend, let's test the API to make sure everything works.

### Step 1: Test Registration

**Request:**
- Method: `POST`
- URL: `http://127.0.0.1:8000/api/register`
- Headers: `Content-Type: application/json`
- Body (JSON):
```json
{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123",
    "password_confirmation": "password123"
}
```

**Expected Response:**
```json
{
    "success": true,
    "message": "User registered successfully",
    "data": {
        "user": {
            "id": 8,
            "name": "Test User",
            "email": "test@example.com",
            "created_at": "2024-11-21T10:30:00.000000Z",
            "updated_at": "2024-11-21T10:30:00.000000Z"
        },
        "token": "1|a8s7d6f5g4h3j2k1..."
    }
}
```

### Step 2: Test Login

**Request:**
- Method: `POST`
- URL: `http://127.0.0.1:8000/api/login`
- Headers: `Content-Type: application/json`
- Body (JSON):
```json
{
    "email": "admin@vendix.com",
    "password": "password123"
}
```

**Expected Response:**
```json
{
    "success": true,
    "message": "Login successful",
    "data": {
        "user": {
            "id": 1,
            "name": "Admin User",
            "email": "admin@vendix.com",
            ...
        },
        "token": "2|b9c8d7e6f5g4h3j2..."
    }
}
```

**Copy the token!** You'll need it for the next steps.

### Step 3: Test Protected Route

**Request:**
- Method: `GET`
- URL: `http://127.0.0.1:8000/api/me`
- Headers:
  - `Content-Type: application/json`
  - `Authorization: Bearer YOUR_TOKEN_HERE` (paste the token from login)

**Expected Response:**
```json
{
    "success": true,
    "data": {
        "id": 1,
        "name": "Admin User",
        "email": "admin@vendix.com",
        ...
    }
}
```

### Step 4: Test Logout

**Request:**
- Method: `POST`
- URL: `http://127.0.0.1:8000/api/logout`
- Headers:
  - `Content-Type: application/json`
  - `Authorization: Bearer YOUR_TOKEN_HERE`

**Expected Response:**
```json
{
    "success": true,
    "message": "Logged out successfully"
}
```

**Verify:** Try using the same token again for `/api/me` - you should get a 401 Unauthorized error.

---

## Frontend Setup - Angular

Now that the backend is working, let's build the Angular authentication system.

### Step 1: Create Models

Create a file for user and authentication models:

```powershell
cd C:\Sistemas\vendix\vendix-frontend
```

Create `src/app/models/auth.model.ts`:

```typescript
export interface User {
  id: number;
  name: string;
  email: string;
  email_verified_at?: string;
  created_at: string;
  updated_at: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    token: string;
  };
}

export interface UserResponse {
  success: boolean;
  data: User;
}

export interface LogoutResponse {
  success: boolean;
  message: string;
}
```

---

## Creating the Auth Service

### Step 1: Generate the Service

```powershell
ng generate service services/auth
```

### Step 2: Implement the Auth Service

Open `src/app/services/auth.service.ts`:

```typescript
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject, tap } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import {
  User,
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  UserResponse,
  LogoutResponse
} from '../models/auth.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl;
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    // Check if user is already logged in on service initialization
    this.loadUserFromStorage();
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  /**
   * Get current user value
   */
  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  /**
   * Register a new user
   */
  register(data: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, data)
      .pipe(
        tap(response => this.handleAuthResponse(response))
      );
  }

  /**
   * Login user
   */
  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials)
      .pipe(
        tap(response => this.handleAuthResponse(response))
      );
  }

  /**
   * Get current user info from API
   */
  me(): Observable<UserResponse> {
    return this.http.get<UserResponse>(`${this.apiUrl}/me`)
      .pipe(
        tap(response => {
          if (response.success && response.data) {
            this.currentUserSubject.next(response.data);
            this.saveUserToStorage(response.data);
          }
        })
      );
  }

  /**
   * Logout user
   */
  logout(): Observable<LogoutResponse> {
    return this.http.post<LogoutResponse>(`${this.apiUrl}/logout`, {})
      .pipe(
        tap(() => this.handleLogout())
      );
  }

  /**
   * Logout without API call (for errors/forced logout)
   */
  forceLogout(): void {
    this.handleLogout();
  }

  /**
   * Get auth token from localStorage
   */
  getToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  /**
   * Save token to localStorage
   */
  private saveToken(token: string): void {
    localStorage.setItem('auth_token', token);
  }

  /**
   * Remove token from localStorage
   */
  private removeToken(): void {
    localStorage.removeItem('auth_token');
  }

  /**
   * Save user to localStorage
   */
  private saveUserToStorage(user: User): void {
    localStorage.setItem('current_user', JSON.stringify(user));
  }

  /**
   * Load user from localStorage
   */
  private loadUserFromStorage(): void {
    const userJson = localStorage.getItem('current_user');
    if (userJson) {
      try {
        const user = JSON.parse(userJson);
        this.currentUserSubject.next(user);
      } catch (e) {
        console.error('Failed to parse user from storage', e);
        this.removeUserFromStorage();
      }
    }
  }

  /**
   * Remove user from localStorage
   */
  private removeUserFromStorage(): void {
    localStorage.removeItem('current_user');
  }

  /**
   * Handle authentication response (login/register)
   */
  private handleAuthResponse(response: AuthResponse): void {
    if (response.success && response.data) {
      this.saveToken(response.data.token);
      this.saveUserToStorage(response.data.user);
      this.currentUserSubject.next(response.data.user);
    }
  }

  /**
   * Handle logout
   */
  private handleLogout(): void {
    this.removeToken();
    this.removeUserFromStorage();
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }
}
```

**Key features:**
- `BehaviorSubject`: Allows components to subscribe to user changes
- `localStorage`: Persists authentication across browser refreshes
- `tap()`: RxJS operator to perform side effects (like saving tokens)
- `Router`: Navigates user after login/logout

---

## Building the Login Component

### Step 1: Generate the Component

```powershell
ng generate component components/login
```

### Step 2: Create the Login Form

Open `src/app/components/login/login.component.ts`:

```typescript
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  loginForm: FormGroup;
  loading = false;
  error: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    });
  }

  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.error = null;

    this.authService.login(this.loginForm.value).subscribe({
      next: (response) => {
        console.log('Login successful:', response);
        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        console.error('Login error:', error);
        this.loading = false;
        
        if (error.error?.message) {
          this.error = error.error.message;
        } else if (error.error?.errors?.email) {
          this.error = error.error.errors.email[0];
        } else {
          this.error = 'Login failed. Please try again.';
        }
      },
      complete: () => {
        this.loading = false;
      }
    });
  }
}
```

### Step 3: Create the Login Template

Open `src/app/components/login/login.component.html`:

```html
<div class="login-container">
  <div class="login-card">
    <div class="login-header">
      <h1>Welcome to Vendix</h1>
      <p>Sign in to your account</p>
    </div>

    <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="login-form">
      <!-- Error Alert -->
      <div *ngIf="error" class="alert alert-error">
        {{ error }}
      </div>

      <!-- Email Field -->
      <div class="form-group">
        <label for="email">Email Address</label>
        <input
          type="email"
          id="email"
          formControlName="email"
          placeholder="admin@vendix.com"
          [class.invalid]="email?.invalid && email?.touched"
        />
        <div *ngIf="email?.invalid && email?.touched" class="error-message">
          <span *ngIf="email?.errors?.['required']">Email is required</span>
          <span *ngIf="email?.errors?.['email']">Please enter a valid email</span>
        </div>
      </div>

      <!-- Password Field -->
      <div class="form-group">
        <label for="password">Password</label>
        <input
          type="password"
          id="password"
          formControlName="password"
          placeholder="Enter your password"
          [class.invalid]="password?.invalid && password?.touched"
        />
        <div *ngIf="password?.invalid && password?.touched" class="error-message">
          <span *ngIf="password?.errors?.['required']">Password is required</span>
          <span *ngIf="password?.errors?.['minlength']">Password must be at least 8 characters</span>
        </div>
      </div>

      <!-- Submit Button -->
      <button
        type="submit"
        class="btn-primary"
        [disabled]="loading"
      >
        <span *ngIf="!loading">Sign In</span>
        <span *ngIf="loading">Signing in...</span>
      </button>

      <!-- Register Link -->
      <div class="form-footer">
        <p>Don't have an account? <a routerLink="/register">Register here</a></p>
      </div>
    </form>

    <!-- Test Credentials -->
    <div class="test-credentials">
      <p><strong>Test Credentials:</strong></p>
      <p>Email: admin@vendix.com</p>
      <p>Password: password123</p>
    </div>
  </div>
</div>
```

### Step 4: Style the Login Component

Open `src/app/components/login/login.component.scss`:

```scss
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 2rem;
}

.login-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  padding: 3rem;
  width: 100%;
  max-width: 450px;
}

.login-header {
  text-align: center;
  margin-bottom: 2rem;

  h1 {
    margin: 0 0 0.5rem 0;
    color: #2c3e50;
    font-size: 2rem;
  }

  p {
    margin: 0;
    color: #7f8c8d;
    font-size: 1rem;
  }
}

.login-form {
  .form-group {
    margin-bottom: 1.5rem;

    label {
      display: block;
      margin-bottom: 0.5rem;
      color: #34495e;
      font-weight: 500;
      font-size: 0.95rem;
    }

    input {
      width: 100%;
      padding: 0.75rem;
      border: 2px solid #e0e0e0;
      border-radius: 8px;
      font-size: 1rem;
      transition: all 0.3s ease;

      &:focus {
        outline: none;
        border-color: #667eea;
        box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
      }

      &.invalid {
        border-color: #e74c3c;
      }

      &::placeholder {
        color: #bdc3c7;
      }
    }

    .error-message {
      margin-top: 0.5rem;
      color: #e74c3c;
      font-size: 0.875rem;
    }
  }

  .btn-primary {
    width: 100%;
    padding: 0.875rem;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: transform 0.2s, box-shadow 0.2s;

    &:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
    }

    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
  }

  .form-footer {
    margin-top: 1.5rem;
    text-align: center;

    p {
      margin: 0;
      color: #7f8c8d;
      font-size: 0.9rem;

      a {
        color: #667eea;
        text-decoration: none;
        font-weight: 600;

        &:hover {
          text-decoration: underline;
        }
      }
    }
  }
}

.alert {
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
  font-size: 0.9rem;

  &.alert-error {
    background-color: #fee;
    border: 1px solid #fcc;
    color: #c33;
  }
}

.test-credentials {
  margin-top: 2rem;
  padding: 1rem;
  background-color: #f8f9fa;
  border-radius: 8px;
  text-align: center;

  p {
    margin: 0.25rem 0;
    font-size: 0.85rem;
    color: #6c757d;

    strong {
      color: #495057;
    }
  }
}
```

---

## Building the Register Component

### Step 1: Generate the Component

```powershell
ng generate component components/register
```

### Step 2: Create the Register Form

Open `src/app/components/register/register.component.ts`:

```typescript
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  registerForm: FormGroup;
  loading = false;
  error: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      password_confirmation: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password');
    const confirmPassword = form.get('password_confirmation');
    
    if (password && confirmPassword && password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }
    
    return null;
  }

  get name() {
    return this.registerForm.get('name');
  }

  get email() {
    return this.registerForm.get('email');
  }

  get password() {
    return this.registerForm.get('password');
  }

  get password_confirmation() {
    return this.registerForm.get('password_confirmation');
  }

  onSubmit(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.error = null;

    this.authService.register(this.registerForm.value).subscribe({
      next: (response) => {
        console.log('Registration successful:', response);
        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        console.error('Registration error:', error);
        this.loading = false;
        
        if (error.error?.message) {
          this.error = error.error.message;
        } else if (error.error?.errors) {
          // Laravel validation errors
          const errors = error.error.errors;
          const errorMessages = Object.keys(errors).map(key => errors[key][0]);
          this.error = errorMessages.join(', ');
        } else {
          this.error = 'Registration failed. Please try again.';
        }
      },
      complete: () => {
        this.loading = false;
      }
    });
  }
}
```

### Step 3: Create the Register Template

Open `src/app/components/register/register.component.html`:

```html
<div class="register-container">
  <div class="register-card">
    <div class="register-header">
      <h1>Join Vendix</h1>
      <p>Create your account</p>
    </div>

    <form [formGroup]="registerForm" (ngSubmit)="onSubmit()" class="register-form">
      <!-- Error Alert -->
      <div *ngIf="error" class="alert alert-error">
        {{ error }}
      </div>

      <!-- Name Field -->
      <div class="form-group">
        <label for="name">Full Name</label>
        <input
          type="text"
          id="name"
          formControlName="name"
          placeholder="John Doe"
          [class.invalid]="name?.invalid && name?.touched"
        />
        <div *ngIf="name?.invalid && name?.touched" class="error-message">
          <span *ngIf="name?.errors?.['required']">Name is required</span>
          <span *ngIf="name?.errors?.['minlength']">Name must be at least 3 characters</span>
        </div>
      </div>

      <!-- Email Field -->
      <div class="form-group">
        <label for="email">Email Address</label>
        <input
          type="email"
          id="email"
          formControlName="email"
          placeholder="john@example.com"
          [class.invalid]="email?.invalid && email?.touched"
        />
        <div *ngIf="email?.invalid && email?.touched" class="error-message">
          <span *ngIf="email?.errors?.['required']">Email is required</span>
          <span *ngIf="email?.errors?.['email']">Please enter a valid email</span>
        </div>
      </div>

      <!-- Password Field -->
      <div class="form-group">
        <label for="password">Password</label>
        <input
          type="password"
          id="password"
          formControlName="password"
          placeholder="At least 8 characters"
          [class.invalid]="password?.invalid && password?.touched"
        />
        <div *ngIf="password?.invalid && password?.touched" class="error-message">
          <span *ngIf="password?.errors?.['required']">Password is required</span>
          <span *ngIf="password?.errors?.['minlength']">Password must be at least 8 characters</span>
        </div>
      </div>

      <!-- Confirm Password Field -->
      <div class="form-group">
        <label for="password_confirmation">Confirm Password</label>
        <input
          type="password"
          id="password_confirmation"
          formControlName="password_confirmation"
          placeholder="Re-enter your password"
          [class.invalid]="password_confirmation?.invalid && password_confirmation?.touched"
        />
        <div *ngIf="password_confirmation?.invalid && password_confirmation?.touched" class="error-message">
          <span *ngIf="password_confirmation?.errors?.['required']">Please confirm your password</span>
          <span *ngIf="password_confirmation?.errors?.['passwordMismatch']">Passwords do not match</span>
        </div>
      </div>

      <!-- Submit Button -->
      <button
        type="submit"
        class="btn-primary"
        [disabled]="loading"
      >
        <span *ngIf="!loading">Create Account</span>
        <span *ngIf="loading">Creating account...</span>
      </button>

      <!-- Login Link -->
      <div class="form-footer">
        <p>Already have an account? <a routerLink="/login">Sign in here</a></p>
      </div>
    </form>
  </div>
</div>
```

### Step 4: Style the Register Component

Open `src/app/components/register/register.component.scss`:

```scss
.register-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 2rem;
}

.register-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  padding: 3rem;
  width: 100%;
  max-width: 450px;
}

.register-header {
  text-align: center;
  margin-bottom: 2rem;

  h1 {
    margin: 0 0 0.5rem 0;
    color: #2c3e50;
    font-size: 2rem;
  }

  p {
    margin: 0;
    color: #7f8c8d;
    font-size: 1rem;
  }
}

.register-form {
  .form-group {
    margin-bottom: 1.5rem;

    label {
      display: block;
      margin-bottom: 0.5rem;
      color: #34495e;
      font-weight: 500;
      font-size: 0.95rem;
    }

    input {
      width: 100%;
      padding: 0.75rem;
      border: 2px solid #e0e0e0;
      border-radius: 8px;
      font-size: 1rem;
      transition: all 0.3s ease;

      &:focus {
        outline: none;
        border-color: #667eea;
        box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
      }

      &.invalid {
        border-color: #e74c3c;
      }

      &::placeholder {
        color: #bdc3c7;
      }
    }

    .error-message {
      margin-top: 0.5rem;
      color: #e74c3c;
      font-size: 0.875rem;
    }
  }

  .btn-primary {
    width: 100%;
    padding: 0.875rem;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: transform 0.2s, box-shadow 0.2s;

    &:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
    }

    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
  }

  .form-footer {
    margin-top: 1.5rem;
    text-align: center;

    p {
      margin: 0;
      color: #7f8c8d;
      font-size: 0.9rem;

      a {
        color: #667eea;
        text-decoration: none;
        font-weight: 600;

        &:hover {
          text-decoration: underline;
        }
      }
    }
  }
}

.alert {
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
  font-size: 0.9rem;

  &.alert-error {
    background-color: #fee;
    border: 1px solid #fcc;
    color: #c33;
  }
}
```

---

## Protected Routes and Auth Guards

### Step 1: Create an Auth Guard

```powershell
ng generate guard guards/auth
```

When prompted, select: `CanActivate`

Open `src/app/guards/auth.guard.ts`:

```typescript
import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    return true;
  }

  // Redirect to login with return URL
  router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
  return false;
};
```

### Step 2: Create a Guest Guard (for login/register pages)

```powershell
ng generate guard guards/guest
```

Open `src/app/guards/guest.guard.ts`:

```typescript
import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const guestGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isAuthenticated()) {
    return true;
  }

  // If already logged in, redirect to dashboard
  router.navigate(['/dashboard']);
  return false;
};
```

---

## Adding a Dashboard

### Step 1: Create Dashboard Component

```powershell
ng generate component components/dashboard
```

### Step 2: Implement Dashboard Logic

Open `src/app/components/dashboard/dashboard.component.ts`:

```typescript
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/auth.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  currentUser: User | null = null;
  loading = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Subscribe to current user
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });

    // Fetch fresh user data from API
    this.loadUserData();
  }

  loadUserData(): void {
    this.loading = true;
    this.authService.me().subscribe({
      next: () => {
        this.loading = false;
      },
      error: (error) => {
        console.error('Failed to load user data:', error);
        this.loading = false;
        // If token is invalid, force logout
        this.authService.forceLogout();
      }
    });
  }

  logout(): void {
    if (confirm('Are you sure you want to logout?')) {
      this.authService.logout().subscribe({
        next: () => {
          console.log('Logged out successfully');
        },
        error: (error) => {
          console.error('Logout error:', error);
          // Force logout even if API call fails
          this.authService.forceLogout();
        }
      });
    }
  }
}
```

### Step 3: Create Dashboard Template

Open `src/app/components/dashboard/dashboard.component.html`:

```html
<div class="dashboard-container">
  <header class="dashboard-header">
    <div class="container">
      <div class="header-content">
        <h1>🏢 Vendix Dashboard</h1>
        <div class="user-menu">
          <span class="user-name">{{ currentUser?.name }}</span>
          <button (click)="logout()" class="btn-logout">Logout</button>
        </div>
      </div>
    </div>
  </header>

  <main class="dashboard-main">
    <div class="container">
      <div *ngIf="loading" class="loading">
        <p>Loading user data...</p>
      </div>

      <div *ngIf="!loading && currentUser" class="dashboard-content">
        <!-- Welcome Card -->
        <div class="card welcome-card">
          <h2>Welcome back, {{ currentUser.name }}! 👋</h2>
          <p>You're successfully logged in to your Vendix account.</p>
        </div>

        <!-- User Info Card -->
        <div class="card user-info-card">
          <h3>Account Information</h3>
          <div class="info-grid">
            <div class="info-item">
              <label>User ID:</label>
              <span>{{ currentUser.id }}</span>
            </div>
            <div class="info-item">
              <label>Name:</label>
              <span>{{ currentUser.name }}</span>
            </div>
            <div class="info-item">
              <label>Email:</label>
              <span>{{ currentUser.email }}</span>
            </div>
            <div class="info-item">
              <label>Email Verified:</label>
              <span>
                <span *ngIf="currentUser.email_verified_at" class="badge badge-success">Verified</span>
                <span *ngIf="!currentUser.email_verified_at" class="badge badge-warning">Not Verified</span>
              </span>
            </div>
            <div class="info-item">
              <label>Member Since:</label>
              <span>{{ currentUser.created_at | date:'medium' }}</span>
            </div>
            <div class="info-item">
              <label>Last Updated:</label>
              <span>{{ currentUser.updated_at | date:'medium' }}</span>
            </div>
          </div>
        </div>

        <!-- Quick Actions -->
        <div class="card actions-card">
          <h3>Quick Actions</h3>
          <div class="actions-grid">
            <button class="action-btn">
              <span class="icon">📊</span>
              <span class="text">View Reports</span>
            </button>
            <button class="action-btn">
              <span class="icon">⚙️</span>
              <span class="text">Settings</span>
            </button>
            <button class="action-btn">
              <span class="icon">👥</span>
              <span class="text">Team</span>
            </button>
            <button class="action-btn">
              <span class="icon">📈</span>
              <span class="text">Analytics</span>
            </button>
          </div>
        </div>

        <!-- Status Card -->
        <div class="card status-card">
          <h3>System Status</h3>
          <div class="status-items">
            <div class="status-item">
              <span class="status-dot status-success"></span>
              <span>API Connection: Active</span>
            </div>
            <div class="status-item">
              <span class="status-dot status-success"></span>
              <span>Authentication: Valid</span>
            </div>
            <div class="status-item">
              <span class="status-dot status-success"></span>
              <span>Database: Connected</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>

  <footer class="dashboard-footer">
    <div class="container">
      <p>Vendix &copy; 2024 | Powered by Laravel Sanctum + Angular</p>
    </div>
  </footer>
</div>
```

### Step 4: Style the Dashboard

Open `src/app/components/dashboard/dashboard.component.scss`:

```scss
.dashboard-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #f5f7fa;
}

.dashboard-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 1.5rem 0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 2rem;
  }

  .header-content {
    display: flex;
    justify-content: space-between;
    align-items: center;

    h1 {
      margin: 0;
      font-size: 1.75rem;
    }

    .user-menu {
      display: flex;
      align-items: center;
      gap: 1rem;

      .user-name {
        font-weight: 500;
      }

      .btn-logout {
        padding: 0.5rem 1rem;
        background-color: rgba(255, 255, 255, 0.2);
        border: 2px solid white;
        border-radius: 6px;
        color: white;
        cursor: pointer;
        transition: all 0.3s ease;

        &:hover {
          background-color: white;
          color: #667eea;
        }
      }
    }
  }
}

.dashboard-main {
  flex: 1;
  padding: 2rem 0;

  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 2rem;
  }
}

.loading {
  text-align: center;
  padding: 3rem;
  color: #666;
  font-size: 1.2rem;
}

.dashboard-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
}

.card {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: transform 0.2s, box-shadow 0.2s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
  }

  h2, h3 {
    margin: 0 0 1rem 0;
    color: #2c3e50;
  }

  p {
    margin: 0;
    color: #7f8c8d;
    line-height: 1.6;
  }
}

.welcome-card {
  grid-column: 1 / -1;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;

  h2 {
    color: white;
    font-size: 1.75rem;
  }

  p {
    color: rgba(255, 255, 255, 0.9);
    font-size: 1.1rem;
  }
}

.user-info-card {
  grid-column: 1 / -1;

  .info-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1.5rem;
  }

  .info-item {
    label {
      display: block;
      font-weight: 600;
      color: #34495e;
      margin-bottom: 0.25rem;
      font-size: 0.9rem;
    }

    span {
      color: #7f8c8d;
      font-size: 1rem;
    }
  }

  .badge {
    padding: 0.25rem 0.75rem;
    border-radius: 12px;
    font-size: 0.85rem;
    font-weight: 600;

    &.badge-success {
      background-color: #d4edda;
      color: #155724;
    }

    &.badge-warning {
      background-color: #fff3cd;
      color: #856404;
    }
  }
}

.actions-card {
  .actions-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
  }

  .action-btn {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    padding: 1.5rem;
    background-color: #f8f9fa;
    border: 2px solid #e9ecef;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s ease;

    .icon {
      font-size: 2rem;
    }

    .text {
      font-weight: 500;
      color: #495057;
    }

    &:hover {
      background-color: #667eea;
      border-color: #667eea;
      transform: translateY(-2px);

      .text {
        color: white;
      }
    }
  }
}

.status-card {
  .status-items {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .status-item {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    font-size: 0.95rem;
    color: #495057;
  }

  .status-dot {
    width: 12px;
    height: 12px;
    border-radius: 50%;

    &.status-success {
      background-color: #28a745;
      box-shadow: 0 0 0 3px rgba(40, 167, 69, 0.2);
    }

    &.status-warning {
      background-color: #ffc107;
      box-shadow: 0 0 0 3px rgba(255, 193, 7, 0.2);
    }

    &.status-error {
      background-color: #dc3545;
      box-shadow: 0 0 0 3px rgba(220, 53, 69, 0.2);
    }
  }
}

.dashboard-footer {
  background-color: #2c3e50;
  color: white;
  padding: 1.5rem 0;
  margin-top: auto;

  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 2rem;
    text-align: center;
  }

  p {
    margin: 0;
    font-size: 0.9rem;
    opacity: 0.8;
  }
}

@media (max-width: 768px) {
  .dashboard-header .header-content {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }

  .actions-card .actions-grid {
    grid-template-columns: 1fr;
  }
}
```

---

## HTTP Interceptors

Interceptors automatically add the auth token to all requests and handle errors globally.

### Step 1: Create Auth Interceptor

```powershell
ng generate interceptor interceptors/auth
```

Open `src/app/interceptors/auth.interceptor.ts`:

```typescript
import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.getToken();

  // Clone the request and add authorization header if token exists
  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  return next(req);
};
```

### Step 2: Create Error Interceptor

```powershell
ng generate interceptor interceptors/error
```

Open `src/app/interceptors/error.interceptor.ts`:

```typescript
import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        // Unauthorized - token is invalid or expired
        console.error('Unauthorized - logging out');
        authService.forceLogout();
      } else if (error.status === 403) {
        // Forbidden
        console.error('Forbidden - you do not have permission');
      } else if (error.status === 500) {
        // Server error
        console.error('Server error - please try again later');
      }

      return throwError(() => error);
    })
  );
};
```

### Step 3: Register Interceptors

Open `src/app/app.config.ts` and update it:

```typescript
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';

import { routes } from './app.routes';
import { authInterceptor } from './interceptors/auth.interceptor';
import { errorInterceptor } from './interceptors/error.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(
      withFetch(),
      withInterceptors([authInterceptor, errorInterceptor])
    )
  ]
};
```

---

## Setup Routes

### Update App Routes

Open `src/app/app.routes.ts`:

```typescript
import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { authGuard } from './guards/auth.guard';
import { guestGuard } from './guards/guest.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent, canActivate: [guestGuard] },
  { path: 'register', component: RegisterComponent, canActivate: [guestGuard] },
  { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] },
  { path: '**', redirectTo: '/login' }
];
```

**Route protection:**
- `login` and `register` use `guestGuard` (redirect to dashboard if already logged in)
- `dashboard` uses `authGuard` (redirect to login if not authenticated)

---

## Testing the Complete Flow

### Step 1: Start Both Servers

**Backend (PowerShell window 1):**
```powershell
cd C:\Sistemas\vendix\vendix-backend
php artisan serve
```

**Frontend (PowerShell window 2):**
```powershell
cd C:\Sistemas\vendix\vendix-frontend
ng serve
```

### Step 2: Test Registration Flow

1. Open `http://localhost:4200`
2. You should be redirected to `/login`
3. Click "Register here"
4. Fill in the registration form:
   - Name: Test User
   - Email: test@vendix.com
   - Password: password123
   - Confirm Password: password123
5. Click "Create Account"
6. You should be redirected to the dashboard
7. You should see your user information displayed

### Step 3: Test Logout

1. On the dashboard, click "Logout"
2. Confirm the logout
3. You should be redirected to `/login`

### Step 4: Test Login Flow

1. On the login page, use these credentials:
   - Email: admin@vendix.com
   - Password: password123
2. Click "Sign In"
3. You should be redirected to the dashboard
4. You should see "Admin User" as the name

### Step 5: Test Protected Routes

1. While logged in, copy the dashboard URL
2. Click Logout
3. Try to paste and access the dashboard URL
4. You should be redirected to `/login`

### Step 6: Test Token Persistence

1. Log in successfully
2. Refresh the page (F5)
3. You should remain logged in
4. Check browser DevTools → Application → Local Storage
5. You should see `auth_token` and `current_user` stored

### Step 7: Test Browser Console

Open DevTools (F12) and check:
- **Console**: Should show "Login successful" or "Registration successful"
- **Network**: Check the API calls
  - Login request should return 200 with token
  - Subsequent requests should have `Authorization: Bearer ...` header
- **Application** → Local Storage: Should store token and user data

---

## Common Issues and Solutions

### Issue: CORS Error

**Error:** "Access to XMLHttpRequest... has been blocked by CORS policy"

**Solution:**
1. Check `vendix-backend/config/cors.php`:
   - `supports_credentials` should be `true`
   - `allowed_origins` should include `http://localhost:4200`
2. Clear Laravel config:
   ```powershell
   php artisan config:clear
   php artisan cache:clear
   ```
3. Restart Laravel server

### Issue: 401 Unauthorized on Protected Routes

**Error:** API returns 401 even with valid token

**Solution:**
1. Check that token is being sent:
   - Open DevTools → Network
   - Click on a protected route request
   - Check Request Headers for `Authorization: Bearer ...`
2. Verify interceptor is registered in `app.config.ts`
3. Check token in localStorage hasn't expired or been corrupted

### Issue: Token Not Persisting

**Problem:** User gets logged out on page refresh

**Solution:**
1. Check browser console for errors
2. Verify `AuthService` `loadUserFromStorage()` is being called
3. Check localStorage in DevTools → Application
4. Make sure you're not in incognito/private mode

### Issue: Login Successful but No Redirect

**Problem:** Login works but stays on login page

**Solution:**
1. Check browser console for navigation errors
2. Verify routes are set up correctly in `app.routes.ts`
3. Check if `guestGuard` is preventing navigation
4. Add console.log in login component to debug

### Issue: Password Validation Errors

**Error:** "The password confirmation does not match"

**Solution:**
1. Ensure field name is exactly `password_confirmation` (with underscore)
2. Check Laravel validation rules in `AuthController`
3. Verify Angular form has both fields

### Issue: Database Connection Error

**Error:** "SQLSTATE[HY000] [1045] Access denied"

**Solution:**
1. Check `.env` database credentials:
   ```env
   DB_CONNECTION=mysql
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_DATABASE=vendix
   DB_USERNAME=root
   DB_PASSWORD=your_password
   ```
2. Make sure database exists:
   ```powershell
   php artisan db:show
   ```
3. Run migrations again:
   ```powershell
   php artisan migrate:fresh --seed
   ```

---

## Next Steps

Congratulations! You now have a complete authentication system. Here's what to do next:

### 1. Add Email Verification

Implement email verification for new users:

```powershell
# Backend
php artisan make:notification VerifyEmailNotification
```

Update User model to implement `MustVerifyEmail` interface.

### 2. Add Password Reset

Implement "Forgot Password" functionality:

```powershell
# Backend
php artisan make:controller Api/PasswordResetController
```

Create password reset form in Angular.

### 3. Add User Profile Editing

Allow users to update their profile:

```powershell
# Backend
php artisan make:controller Api/ProfileController

# Frontend
ng generate component components/profile
```

### 4. Add Role-Based Permissions

Implement roles and permissions:

```powershell
# Install Spatie Permission package
composer require spatie/laravel-permission
php artisan vendor:publish --provider="Spatie\Permission\PermissionServiceProvider"
php artisan migrate
```

### 5. Add Two-Factor Authentication (2FA)

Add extra security with 2FA:

```powershell
composer require pragmarx/google2fa-laravel
```

### 6. Add Remember Me Functionality

Allow users to stay logged in longer:

- Add "Remember Me" checkbox to login form
- Extend token expiration in Sanctum config
- Store preference in localStorage

### 7. Add Social Login

Implement "Login with Google/Facebook":

```powershell
composer require laravel/socialite
```

### 8. Add User Activity Logging

Track user login history and activities:

```powershell
php artisan make:migration create_user_activities_table
```

### 9. Improve Security

- Add rate limiting to auth routes
- Implement CSRF protection
- Add password strength requirements
- Implement account lockout after failed attempts

### 10. Add Loading Indicators

Create a global loading service and interceptor for better UX.

---

## Security Best Practices

### Backend Security

1. **Environment Variables**: Never commit `.env` to version control
2. **Token Expiration**: Set appropriate token expiration times
3. **Rate Limiting**: Protect login endpoints from brute force
4. **HTTPS Only**: Always use HTTPS in production
5. **Input Validation**: Validate all user input server-side

### Frontend Security

1. **Never Store Sensitive Data**: Don't store passwords in localStorage
2. **XSS Protection**: Angular sanitizes by default, don't disable it
3. **CSRF Tokens**: Use for cookie-based authentication
4. **Secure Cookie Flags**: Set `httpOnly`, `secure`, `sameSite` flags
5. **Token Refresh**: Implement token refresh mechanism

### General Security

1. **Keep Dependencies Updated**: Regularly update Laravel and Angular
2. **Use Strong Passwords**: Enforce minimum 8 characters
3. **Monitor Failed Logins**: Log and alert on suspicious activity
4. **Regular Backups**: Backup database regularly
5. **Security Headers**: Set proper security headers (CSP, X-Frame-Options, etc.)

---

## Testing Checklist

Use this checklist to verify everything works:

- [ ] Backend migrations run successfully
- [ ] Database seeders create test users
- [ ] Can register a new user via Postman
- [ ] Can login via Postman and receive token
- [ ] Protected routes return 401 without token
- [ ] Protected routes work with valid token
- [ ] Angular login form displays correctly
- [ ] Can login via Angular app
- [ ] Token is stored in localStorage
- [ ] Dashboard displays user information
- [ ] Can navigate to protected routes when logged in
- [ ] Cannot access protected routes when logged out
- [ ] Logout removes token and redirects to login
- [ ] Page refresh preserves authentication state
- [ ] Register form validation works
- [ ] Login form validation works
- [ ] Password confirmation validation works
- [ ] API errors display properly in UI
- [ ] Auth interceptor adds Bearer token to requests
- [ ] Error interceptor handles 401 errors

---

## Summary

You've successfully implemented:

✅ Laravel Sanctum API authentication  
✅ User registration and login endpoints  
✅ Protected API routes  
✅ Angular authentication service  
✅ Login and registration components  
✅ Route guards for protected pages  
✅ HTTP interceptors for tokens and errors  
✅ Dashboard for authenticated users  
✅ Token persistence across page refreshes  
✅ Proper error handling  
✅ Database migrations and seeders  

**You now have a production-ready authentication system!**

---

## Resources

### Documentation
- [Laravel Sanctum](https://laravel.com/docs/sanctum)
- [Angular HTTP Client](https://angular.dev/guide/http)
- [Angular Guards](https://angular.dev/guide/routing/common-router-tasks#preventing-unauthorized-access)
- [RxJS Observables](https://rxjs.dev/guide/observable)

### Tools
- [Postman](https://www.postman.com/) - API testing
- [TablePlus](https://tableplus.com/) - Database management
- [JWT Decoder](https://jwt.io/) - Decode JWT tokens

### Community
- [Laravel Discord](https://discord.gg/laravel)
- [Angular Discord](https://discord.gg/angular)
- [Stack Overflow](https://stackoverflow.com/)

---

Great job! You've built a secure, modern authentication system. Remember: security is an ongoing process. Keep your dependencies updated, monitor for vulnerabilities, and always follow security best practices.

Happy coding! 🚀🔐

