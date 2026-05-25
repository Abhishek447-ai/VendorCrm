# Frontend (React + Vite)

Run frontend:

```bash
cd "D:\New vendor project\frontend"
npm install
npm run dev
```

By default the frontend will call `http://localhost:3000/api` for the backend. To change, set `VITE_API_BASE` in your environment or edit `frontend/.env`.

Example `.env` (already present):

```
VITE_API_BASE=http://localhost:3000/api
```
