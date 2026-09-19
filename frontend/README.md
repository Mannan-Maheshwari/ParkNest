# ParkNest Frontend

A redesigned React + Vite + Tailwind CSS frontend for the original ParkEase parking-management backend.

## What is reused

The backend is intentionally not included or changed here. This frontend uses the existing API routes:

- `POST /api/auth/register/user`
- `POST /api/auth/register/owner`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `GET /api/user/parking-spaces`
- `POST /api/user/bookings`
- `GET /api/user/bookings`
- `PATCH /api/user/bookings/:id/cancel`
- `GET /api/owner/parking-spaces`
- `POST /api/owner/parking-spaces`
- `PUT /api/owner/parking-spaces/:id`
- `DELETE /api/owner/parking-spaces/:id`
- `PATCH /api/owner/parking-spaces/:id/toggle-active`
- `GET /api/owner/bookings`
- `PATCH /api/owner/bookings/:id/cancel`

Authentication uses the backend's existing `x-auth-token` header.

## Requirements

- Node.js 18+ recommended
- Existing ParkEase backend running
- MongoDB configured for the backend

## Start

### 1. Configure API URL

Copy `.env.example` to `.env`.

Default:

```env
VITE_API_URL=http://localhost:5000/api
```

Change the URL only if your backend uses another host/port.

### 2. Install

```bash
npm install
```

### 3. Run

```bash
npm run dev
```

Open the Vite URL shown in the terminal, normally:

```text
http://localhost:5173
```

## Run with the existing backend

In a separate terminal:

```bash
cd backend
npm install
npm start
```

The original backend defaults to port `5000`.

Then run the frontend in another terminal:

```bash
cd frontend
npm install
npm run dev
```

## Important

The original backend's `/api/user/parking-spaces` endpoint is protected. Therefore, the Home/Find Parking data is available after the user has an authenticated session. This is not a frontend bug; it is the current backend contract.

The checkout shown during booking is deliberately a simulated payment screen. No real payment gateway has been added.

## Production build

```bash
npm run build
```

The output is generated in `dist/`.
