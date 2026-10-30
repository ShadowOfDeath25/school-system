# School Management System

The School Management System is a comprehensive platform for administering academic institutions. It provides end-to-end management of academic years, student enrollment, dynamic grade components, examination workflows, automated promotion batches, financial ledgers, and institutional asset tracking.

This documentation is for developers and administrators installing, developing, and deploying the platform. For in-depth architectural details, see [Architecture Guide](docs/architecture.md). For HTTP endpoint specifications, see [API Reference](docs/api-reference.md). For testing and contributor workflows, see [Development Guide](docs/development-guide.md).

---

## System Architecture and Technology Stack

The platform uses a decoupled client-server architecture:

- **Backend API:** Built on [Laravel](https://laravel.com) 13 with PHP 8.3+, accelerated by [Laravel Octane](https://laravel.com/docs/octane) and FrankenPHP.
- **Authentication & Authorization:** Stateful API token authentication via [Laravel Sanctum](https://laravel.com/docs/sanctum) with granular role-based access control via [Spatie Laravel Permission](https://spatie.be/docs/laravel-permission).
- **Frontend SPA:** Built on [React](https://react.dev) 19 and [Vite](https://vite.dev), using [Material UI (MUI)](https://mui.com) 7, Emotion, TanStack React Query, and React Router 7.
- **Reporting & Document Generation:** Automated PDF generation, letters, and student ID cards powered by Spatie Browsershot, Puppeteer, Spatie Laravel PDF, and Maatwebsite Excel.
- **Database & Cache:** Relational database support via MySQL or PostgreSQL, using Redis or database drivers for sessions and cache.

---

## Prerequisites

Before installing the application, verify that your local environment contains the following dependencies:

- **PHP:** Version 8.3 or higher with extensions `bcmath`, `curl`, `mbstring`, `openssl`, `pdo_mysql`, `tokenizer`, and `xml`.
- **Node.js:** Version 20.x or higher with npm.
- **Composer:** Version 2.x or higher.
- **Database Server:** MySQL 8.0+ or PostgreSQL 15+.
- **Browser Automation (for PDF generation):** Chrome or Chromium installed on the host system (required by Puppeteer and Browsershot).

---

## Quick Start

Follow these steps to configure and start both the backend API and the frontend client.

### 1. Clone and Install Dependencies

1. Clone the repository and navigate into the project directory:

   ```bash
   git clone REPOSITORY_URL school-system
   cd school-system
   ```

   Replace `REPOSITORY_URL` with your Git repository clone address.

2. Install backend PHP dependencies:

   ```bash
   composer install
   ```

3. Install root Node dependencies (required for build tools and Puppeteer):

   ```bash
   npm install
   ```

4. Install frontend React application dependencies:

   ```bash
   cd frontend
   npm install
   cd ..
   ```

### 2. Configure Environment Variables

1. Create the backend `.env` configuration file:

   ```bash
   cp .env.example .env
   ```

2. Generate the application encryption key:

   ```bash
   php artisan key:generate
   ```

3. Open `.env` and set your database credentials:

   ```ini
   DB_CONNECTION=mysql
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_DATABASE=school_system
   DB_USERNAME=DB_USER
   DB_PASSWORD=DB_PASSWORD
   ```

   Replace `DB_USER` and `DB_PASSWORD` with your local database credentials.

4. Create the frontend `.env` configuration file:

   ```bash
   cp frontend/.env.example frontend/.env
   ```

5. Confirm that `frontend/.env` points to the Laravel API URL (default is `http://localhost:8000/api`).

### 3. Run Database Migrations and Seeders

1. Run database migrations to create all application tables:

   ```bash
   php artisan migrate
   ```

2. Seed initial data, roles, and test models:

   ```bash
   php artisan db:seed
   ```

### 4. Start the Application

To start the backend API server and frontend development server simultaneously, run the following command from the root directory:

```bash
composer run dev
```

This runs:
- **Laravel API Server:** `http://localhost:8000`
- **Frontend SPA (Vite):** `http://localhost:5173`

### 5. Verify Installation

1. Open your browser and navigate to `http://localhost:5173`.
2. Confirm that the application login screen loads without network errors.
3. Sign in using your seeded administrative credentials.

---

## Core Modules

The platform is organized into the following domain modules:

| Domain | Scope and Responsibilities | Key API Prefix |
| :--- | :--- | :--- |
| **Authentication & RBAC** | User login, token revocation, roles, permissions, and emergency killswitch. | `/api/login`, `/api/roles`, `/api/permissions` |
| **Academic Structure** | Academic year activation, grade age rules, classrooms, subjects, and dynamic grading components. | `/api/academic-years`, `/api/grades`, `/api/classrooms` |
| **Student Management** | Student admissions, guardian relationships, student enrollments, transfers, and ID cards. | `/api/students`, `/api/parents`, `/api/transfers` |
| **Exams & Grading** | Exam scheduling, dynamic components, seat/secret number allocation, mark entry, and certificates. | `/api/exams`, `/api/marks`, `/api/seat-numbers` |
| **Student Promotion** | Year-end batch evaluation, eligibility rules, supplementary exams, and rollback support. | `/api/promotion` |
| **Financial Ledger** | Incomes, expenses, fee structures, payment installments, extra dues, exemptions, and arrears. | `/api/payments`, `/api/incomes`, `/api/expenses` |
| **Institutional Logistics** | Building layouts, floors, exam halls, bus transport routes, stations, uniforms, and book sales. | `/api/buses`, `/api/uniforms`, `/api/books` |
| **Reporting & Auditing** | Class rosters, arrears notices, behavior registers, mark statistical analysis, and audit logs. | `/api/reports`, `/api/activity-logs` |

---

## Testing and Code Quality

To execute the backend test suite using Pest, run the following command:

```bash
composer run test
```

To run static analysis and code styling checks:

- Format PHP code with Laravel Pint:

  ```bash
  ./vendor/bin/pint
  ```

- Lint frontend JavaScript and React code:

  ```bash
  cd frontend
  npm run lint
  ```

---

## Documentation Index

Explore the topic guides in the `docs` folder for detailed specifications:

- [System Architecture](docs/architecture.md): Database design, domain boundaries, security model, and background workers.
- [API Reference](docs/api-reference.md): Endpoints, request schemas, authentication tokens, query filters, and response formats.
- [Development Guide](docs/development-guide.md): Environment customization, seeder execution, testing patterns, and deployment.
- [Dynamic Grading Impact Analysis](docs/dynamic-grading-impact-analysis.md): Mark component JSON structures and backward compatibility strategies.
- [Promotion System Plan](docs/promotion-system-plan.md): Batch processing rules, criteria matrices, and supplementary exam flows.

---

## License

This software is distributed under the [MIT License](LICENSE).
