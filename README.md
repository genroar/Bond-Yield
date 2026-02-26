# Bond Yield Calculator

NestJS backend and React frontend for calculating bond yields, YTM, cash flow schedules, and related metrics.

## Repository structure

- **`bond-yield-backend/`** – NestJS API (TypeScript), bond calculation logic, YTM (bisection), validation
- **`bond-yield-frontend/`** – React + TypeScript app (Material-UI), form, results, cash flow table, CSV/PDF export, dark/light theme

## Quick start

### Backend (API on port 3001)

```bash
cd bond-yield-backend
npm install
npm run dev
```

### Frontend (UI on port 3000)

```bash
cd bond-yield-frontend
npm install
npm start
```

Open **http://localhost:3000** for the calculator. The frontend calls **http://localhost:3001/bond/calculate** for calculations.

## Features

- **Backend:** POST `/bond/calculate` with face value, coupon rate, market price, years to maturity, frequency (annual/semi-annual). Returns current yield, YTM, total interest, premium/discount, and cash flow schedule.
- **Frontend:** Form validation (react-hook-form), results cards, cash flow table, CSV/PDF export, theme toggle (dark/light), CORS enabled for local dev.
