# School Management System — Frontend Client

The frontend application is a single-page application (SPA) providing the administrative web interface for the School Management System.

This documentation is for frontend engineers developing, testing, or building the user interface. For backend API details, see the root [API Reference](../docs/api-reference.md).

---

## Technology Stack

The client application uses the following libraries:

- **Framework:** [React](https://react.dev) 19 with [Vite](https://vite.dev) 6
- **UI Components & Styling:** [Material UI (MUI)](https://mui.com) 7 with Emotion
- **Routing:** [React Router](https://reactrouter.com) 7
- **Server State & Data Fetching:** [TanStack React Query](https://tanstack.com/query) v5 with [Axios](https://axios-http.com)
- **Internationalization (i18n):** [i18next](https://www.i18next.com) and `react-i18next` with RTL support (Arabic / English)
- **Data Visualization & Export:** Recharts, Chart.js, React-to-print, and `@react-pdf/renderer`

---

## Directory Structure

```
frontend/src/
├── assets/          # Static media, icons, and logos
├── components/      # UI components and views
│   ├── pages/       # Route-level page views (Students, Exams, Payments, etc.)
│   ├── reports/     # Printable report views and PDF layouts
│   └── ui/          # Reusable shared components (modals, pickers, tables)
├── context/         # React Context providers (Auth, Theme, Notifications)
├── hooks/           # Custom React hooks
├── services/        # API client instances and network query wrappers
└── utils/           # Helper functions, formatters, and validation rules
```

---

## Quick Start

### 1. Install Dependencies

From the `frontend` directory, run:

```bash
npm install
```

### 2. Configure Environment

1. Copy the example environment file:

   ```bash
   cp .env.example .env
   ```

2. Open `.env` and verify the backend API endpoint URL:

   ```ini
   VITE_API_BASE_URL=http://localhost:8000/api
   ```

### 3. Start Development Server

To launch the local Vite development server with Hot Module Replacement (HMR):

```bash
npm run dev
```

The application runs at `http://localhost:5173`.

---

## Available Scripts

Run the following npm scripts from within the `frontend` directory:

| Script | Command | Purpose |
| :--- | :--- | :--- |
| **Start Dev Server** | `npm run dev` | Starts the Vite development server with HMR. |
| **Production Build** | `npm run build` | Compiles and bundles assets into the `dist/` directory. |
| **Staging Build** | `npm run build:staging` | Compiles assets with staging environment configurations. |
| **Linting** | `npm run lint` | Runs ESLint to check for syntax and style issues. |
| **Preview Build** | `npm run preview` | Locally serves the compiled production build in `dist/`. |
