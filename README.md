# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

---

## Connecting the frontend to the backend (quick guide)

1. Ensure the backend is running (by default at http://127.0.0.1:8000).

2. Set the API base URL for the frontend — in development place it in `frontend/.env`:

```
VITE_API_BASE_URL=http://127.0.0.1:8000/api/v1/
```

3. Start the frontend dev server:

```bash
cd frontend
yarn
yarn dev
```

4. Development helpers: the repository previously contained an `OrdersTester` dev-only helper used to validate orders endpoints from the frontend. That helper has been removed — use the services under `src/services/` directly when needed, or add dev helpers behind a feature flag.
