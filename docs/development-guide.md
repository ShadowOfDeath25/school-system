# Development Guide

This guide describes local development setup, testing practices, database management, and code standards for the School Management System.

This documentation is for developers contributing to the codebase. It provides procedures for running the application, seeding test fixtures, executing automated tests, and adhering to project styling guidelines.

---

## Local Development Workflow

### Starting Development Servers

To run the local development servers with hot-reloading for both backend and frontend, run the following command from the project root:

```bash
composer run dev
```

This starts:

1. **`server`**: Laravel built-in web server serving API routes at `http://localhost:8000`.
2. **`vite`**: Vite dev server serving the React frontend with fast refresh at `http://localhost:5173`.

### Running FrankenPHP with Octane

For production-identical benchmarking or Octane-specific feature development:

1. Confirm that the `frankenphp` binary exists in the project root.
2. Start Octane with FrankenPHP:

   ```bash
   php artisan octane:start --server=frankenphp --port=8000
   ```

3. To reload worker instances after editing PHP files:

   ```bash
   php artisan octane:reload
   ```

---

## Database Management and Seeders

### Running Migrations

To apply pending migrations, run:

```bash
php artisan migrate
```

To reset the database and re-run all migrations from scratch:

```bash
php artisan migrate:fresh
```

> [!CAUTION]
> Running `migrate:fresh` drops all tables and permanently destroys existing data. Use this command only in local development or staging environments.

### Populating Seed Data

To seed default roles, permissions, and initial reference data:

```bash
php artisan db:seed
```

### Specialized Test Seeders

The project includes purpose-built seeders for complex lifecycle scenarios:

- **Comprehensive Promotion Test Seeder:** Populates multiple academic years, student cohorts across Grades 1–11, exam components, and mixed mark distributions (passing, failing, and edge-case boundaries).

  ```bash
  php artisan db:seed --class=ComprehensivePromotionTestSeeder
  ```

- **Promotion Test Seeder:** Populates a minimal dataset for validating batch promotion execution and rollback:

  ```bash
  php artisan db:seed --class=PromotionTestSeeder
  ```

---

## Testing Practices

The backend test suite uses [Pest PHP](https://pestphp.com).

### Running Backend Tests

To run the full backend test suite:

```bash
composer run test
```

Or invoke Artisan directly:

```bash
php artisan test
```

### Filtering Specific Tests

To execute a single test file:

```bash
php artisan test tests/Feature/PromotionEngineTest.php
```

To run tests matching a specific description or method:

```bash
php artisan test --filter=PromotionEligibility
```

### Writing Feature Tests

When adding new API endpoints, write feature tests in `tests/Feature/`. Ensure your test:
1. Authenticates using Sanctum (`$this->actingAs($user, 'sanctum')`).
2. Assigns required permissions to the test user (`$user->givePermissionTo('view grades')`).
3. Validates HTTP response status and JSON structure using assertions.

---

## Code Quality and Style Guidelines

### Backend PHP Standards

The backend follows PSR-12 and Laravel standard conventions enforced by **Laravel Pint**:

1. Run Pint to inspect and format code automatically before committing changes:

   ```bash
   ./vendor/bin/pint
   ```

2. Pint checks against defined style rules in `pint.json` and fixes formatting issues across `app`, `config`, `database`, `routes`, and `tests`.

### Frontend React Standards

The frontend enforces ESLint and React hooks best practices:

1. Navigate to the `frontend` directory:

   ```bash
   cd frontend
   ```

2. Run the linter:

   ```bash
   npm run lint
   ```

---

## Code Architecture Patterns

When extending backend functionality, follow the established design patterns:

### 1. Form Requests for Validation

Avoid inline validation in controllers. Place input validation rules inside dedicated request classes in `app/Http/Requests/`:

```php
namespace App\Http\Requests\Exam;

use Illuminate\Foundation\Http\FormRequest;

class StoreExamRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('create exams');
    }

    public function rules(): array
    {
        return [
            'academic_year_id' => ['required', 'exists:academic_years,id'],
            'grade_id' => ['required', 'exists:grades,id'],
            'subject_id' => ['required', 'exists:subjects,id'],
            'component_id' => ['required', 'string'],
        ];
    }
}
```

### 2. Service Layer for Business Logic

Controllers must remain thin, delegating complex calculations and transactions to service classes in `app/Services/`:
- `GradingComponentService`: Normalizes and validates dynamic mark components.
- `PromotionEligibilityService`: Evaluates student promotion criteria against academic policies.
- `SeatAssignmentService`: Handles exam hall seating layout and collision-free assignment.

### 3. API Resources for Response Formatting

Do not return raw Eloquent models from controller actions. Transform data using API resources in `app/Http/Resources/` to encapsulate JSON representation and prevent unintended data leakage.
