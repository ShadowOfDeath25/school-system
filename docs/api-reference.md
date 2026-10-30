# API Reference

This document provides technical reference specifications for the School Management System REST API.

This reference is for developers integrating with the backend API or building client applications. It covers request formats, authentication headers, error handling, query filtering conventions, and endpoint schemas.

---

## Conventions and Headers

### Base URL

All API routes are served under the `/api` prefix:

```
http://HOSTNAME:PORT/api
```

Replace `HOSTNAME` and `PORT` with your host address and port number.

### Standard Request Headers

Send the following headers with every request:

```http
Accept: application/json
Content-Type: application/json
Authorization: Bearer AUTH_TOKEN
```

Replace `AUTH_TOKEN` with the personal access token received from `/api/login`. Unauthenticated endpoints (such as login) do not require the `Authorization` header.

### Standard Error Responses

The API returns standard HTTP status codes:

| HTTP Status | Description | Sample Response Body |
| :--- | :--- | :--- |
| **`401 Unauthorized`** | Missing, invalid, or expired Bearer token. | `{"message": "Unauthenticated."}` |
| **`403 Forbidden`** | User lacks required role or permission. | `{"message": "User does not have the right permissions."}` |
| **`404 Not Found`** | Requested model ID or endpoint does not exist. | `{"message": "Resource not found."}` |
| **`422 Unprocessable Entity`** | Request validation failed. | `{"message": "The given data was invalid.", "errors": {"field": ["Validation error message"]}}` |

### Query Filtering, Sorting, and Pagination

Endpoints using the `.withFilters()` macro accept standard query parameters:

- **Pagination:** `?page=PAGE_NUMBER&per_page=PAGE_SIZE` (default page size is 15).
- **Search:** `?search=SEARCH_TERM` searches across configured model columns (such as student names, national IDs, or invoice numbers).
- **Sorting:** `?sort_by=COLUMN_NAME&sort_direction={asc|desc}`.

---

## Authentication Endpoints

### Sign In

Authenticates a user and generates a Sanctum personal access token.

- **Method:** `POST`
- **Path:** `/api/login`
- **Authentication:** None

**Request Body:**

```json
{
  "email": "user@school.example",
  "password": "PASSWORD"
}
```

Replace `user@school.example` and `PASSWORD` with the user credentials.

**Response (`200 OK`):**

```json
{
  "token": "1|abc123def456ghi789...",
  "user": {
    "id": 1,
    "name": "School Admin",
    "email": "user@school.example"
  }
}
```

### Sign Out

Revokes the current access token.

- **Method:** `POST`
- **Path:** `/api/logout`
- **Authentication:** Required (`auth:sanctum`)

**Response (`200 OK`):**

```json
{
  "message": "Successfully logged out"
}
```

### Get Authenticated User

Retrieves current profile, roles, and assigned permissions.

- **Method:** `GET`
- **Path:** `/api/user`
- **Authentication:** Required (`auth:sanctum`)

---

## Academic Management

### Academic Years

| Method | Endpoint | Description | Permission |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/academic-years` | List all academic years. | Authenticated |
| `POST` | `/api/academic-years` | Create a new academic year. | Authenticated |
| `PUT`, `PATCH` | `/api/academic-years/{academicYear}/activate` | Set active academic year. | `update academic-years` |

### Grades and Dynamic Grade Subjects

| Method | Endpoint | Description | Permission |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/grades` | List educational grades. | `view grades` |
| `GET` | `/api/grades/{grade}/subjects` | Get subjects assigned to a grade. | `view grade-subjects` |
| `GET` | `/api/grades/{grade}/subjects/available` | List unassigned subjects available to grade. | `view grade-subjects` |
| `POST` | `/api/grades/{grade}/subjects` | Assign subjects with dynamic mark components. | `create grade-subjects` |
| `PUT`, `PATCH` | `/api/grades/{grade}/subjects` | Update subject mark component configuration. | `update grade-subjects` |
| `DELETE` | `/api/grades/{grade}/subjects` | Detach a subject from a grade. | `delete grade-subjects` |

#### Subject Component Payload Schema

When assigning or updating subjects on a grade, pass component definitions as JSON:

```json
{
  "subject_id": 4,
  "components": [
    {
      "id": "coursework",
      "name": "Coursework",
      "marks": 40,
      "is_final_exam": false
    },
    {
      "id": "final_exam",
      "name": "Final Examination",
      "marks": 60,
      "is_final_exam": true
    }
  ]
}
```

### Classrooms

Standard REST resource routes for physical classroom management (`/api/classrooms`):
- `GET /api/classrooms` (`view classrooms`)
- `POST /api/classrooms` (`create classrooms`)
- `GET /api/classrooms/{classroom}` (`view classrooms`)
- `PUT /api/classrooms/{classroom}` (`update classrooms`)
- `DELETE /api/classrooms/{classroom}` (`delete classrooms`)

---

## Student Management

### Students Resource

Full REST CRUD routes are registered under `/api/students` with filtering support:

- `GET /api/students`: Lists students filtered by grade, classroom, enrollment status, and search keywords.
- `POST /api/students`: Registers a new student profile.
- `GET /api/students/{student}`: Returns student details, guardian info, and enrollment history.
- `PUT /api/students/{student}`: Updates student information.
- `DELETE /api/students/{student}`: Deletes or archives a student record.
- `GET /api/students/{student}/exams/required`: Lists pending and required examinations for the student.
- `GET /api/students/{student}/payments`: Lists fee payment records for this student.

### Transfers

| Method | Endpoint | Description | Permission |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/transfers/outgoing` | Record outgoing student transfer to another school. | `transfer students` |
| `GET` | `/api/transfers/history` | View historical record of transfers. | `transfer students` |
| `GET` | `/api/transfers/filters` | Get filter criteria for transfer records. | `transfer students` |

---

## Examinations and Marks

### Exams and Assignments

- **Exams (`/api/exams`):** Full CRUD for defining exam instances tied to an academic year, subject, and `component_id`.
- **Seat Numbers (`/api/seat-numbers`):**
  - `POST /api/seat-numbers/assign`: Automatically generates or assigns student examination seat numbers.
  - `GET /api/seat-numbers/assignments`: Returns table of seat assignments.
- **Secret Numbers (`/api/secret-numbers`):**
  - `POST /api/secret-numbers/assign`: Blinded number allocation for anonymous grading.

### Marks Entry

| Method | Endpoint | Description | Permission |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/marks` | List recorded marks with filters. | `view marks` |
| `POST` | `/api/marks` | Record or bulk save marks. | `create marks` |
| `GET` | `/api/marks/students-by-name` | Fast mark entry grid sorted by student name. | `record-by-name marks` |
| `GET` | `/api/marks/student/{student}/exams` | List exams and marks for an individual student. | `view marks` |
| `GET` | `/api/marks/secret-assignments` | Mark entry grid indexed by secret examination number. | `view marks` |
| `GET` | `/api/marks/second-round/students` | List students with failing marks eligible for second round. | `view marks` |
| `POST` | `/api/marks/second-round/{student}/promote` | Record supplementary marks and apply promotion. | `update promotion` |

---

## Promotion Engine

| Method | Endpoint | Description | Permission |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/promotion/preview` | Preview promotion outcome before applying changes. | `view promotion` |
| `POST` | `/api/promotion/execute` | Execute promotion batch and assign students to next grades. | `create promotion` |
| `GET` | `/api/promotion/batches` | List completed promotion batches. | `view promotion` |
| `GET` | `/api/promotion/batches/{batch}` | Inspect batch details and individual student decisions. | `view promotion` |
| `POST` | `/api/promotion/batches/{batch}/finalize` | Lock and finalize promotion batch. | `create promotion` |
| `POST` | `/api/promotion/batches/{batch}/rollback` | Revert batch transitions and restore previous enrollments. | `delete promotion` |
| `POST` | `/api/promotion/supplementary-exam/resolve` | Resolve supplementary exams for second-round students. | `update promotion` |

---

## Financial Ledger and Payments

| Resource Endpoint | Description |
| :--- | :--- |
| `/api/payments` | Student tuition payments and receipt generation. |
| `/api/incomes` | General school revenue entries. |
| `/api/expenses` | Operational institutional expenditures. |
| `/api/bank-accounts` | Bank accounts and financial balances. |
| `/api/payment-values` | Grade-level fee and tuition rate templates. |
| `/api/extra-dues` | Incidentals and one-off extra fees. |
| `/api/exemptions` | Fee discount and waiver assignments. |

---

## Reports and Document Exports

All report routes reside under `/api/reports`:

### Student and Academic Reports

- `GET /api/reports/students/summary`: Aggregated student demographic and enrollment summary.
- `GET /api/reports/students/roster`: Classroom student rosters.
- `GET /api/reports/students/marks/class`: Mark sheets by classroom.
- `GET /api/reports/students/marks/final-exam`: Final exam evaluation summaries.
- `GET /api/reports/students/certificates`: Printable student graduation and academic certificates.
- `GET /api/reports/students/exam-candidates`: Candidates list for upcoming exams with seat numbers.
- `GET /api/reports/students/id-cards`: Bulk student identification card generation.
- `GET /api/reports/students/behavior-register`: Behavioral and disciplinary ledger.

### Financial Reports

- `GET /api/reports/financial/summary`: Consolidated balance sheet and cash flow summary.
- `GET /api/reports/financial/monthly`: Monthly revenue and expense breakdown.
- `GET /api/reports/financial/bank-accounts`: Bank reconciliation summary.
- `GET /api/reports/students/payments/arrears`: Outstanding student tuition arrears list.
