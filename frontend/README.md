# HireFlow frontend

The frontend is a React application built with Vite and React Router. During
development, Vite proxies `/api` requests to the backend on port `5001`.

## Development

Install dependencies and start Vite:

```sh
npm install
npm run dev
```

Run the backend in a second terminal so authenticated pages can load data.

## Production build

```sh
npm run build
```

The compiled files are written to `dist`. In production, the Express backend
serves this directory and the frontend uses relative `/api` requests on the
same Render origin. See [`../DEPLOYMENT.md`](../DEPLOYMENT.md) for the full
deployment setup.
