# Bond Yield Calculator

A full-stack application for calculating bond yields, yield to maturity (YTM), current yield, total interest, and cash flow schedules. Built with **NestJS** (backend) and **React + TypeScript** (frontend).

---

## Table of contents

- [Features](#features)
- [Tech stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Repository structure](#repository-structure)
- [Installation](#installation)
- [Running the application](#running-the-application)
- [API documentation](#api-documentation)
- [Environment variables](#environment-variables)
- [Bond metrics explained](#bond-metrics-explained)
- [Project structure](#project-structure)
- [Testing](#testing)
- [Scripts reference](#scripts-reference)

---

## Features

### Backend
- **POST `/bond/calculate`** – Single endpoint that accepts bond parameters and returns all metrics.
- **Yield to Maturity (YTM)** – Computed via the bisection method; supports annual and semi-annual coupon frequency.
- **Current yield** – Annual coupon divided by market price (returned as a percentage).
- **Total interest** – Total coupon payments over the life of the bond.
- **Premium / discount / par** – Indicates whether the bond trades above, below, or at face value.
- **Cash flow schedule** – Period-by-period coupon payments, cumulative interest, and remaining principal.
- **Validation** – Request body validated with `class-validator` (whitelist, forbid non-whitelisted, type transformation).
- **CORS** – Configured for the frontend origin (default: `http://localhost:3000`).
- **Unit tests** – Jest tests for bond service helpers and YTM utility.

### Frontend
- **Bond form** – Face value, annual coupon rate (%), market price, years to maturity, coupon frequency (annual / semi-annual) with inline validation (react-hook-form).
- **Results display** – Cards for current yield, YTM, total interest, and premium/discount status.
- **Cash flow table** – Sortable schedule with period, payment date, coupon payment, cumulative interest, remaining principal (dates in DD/MM/YYYY; amounts in AED).
- **Export** – Export cash flow schedule to **CSV** or **PDF** (jsPDF + jspdf-autotable).
- **Theme** – Dark / light mode toggle with preference stored in `localStorage`.
- **Error handling** – API and validation errors shown in the UI; loading state and disabled submit during requests.
- **Responsive layout** – Material-UI (MUI) for forms, cards, and tables that work on mobile and desktop.

---

## Tech stack

| Layer      | Technologies |
|-----------|---------------|
| Backend   | NestJS 11, TypeScript, class-validator, class-transformer |
| Frontend  | React 19, TypeScript, Material-UI (MUI) 7, react-hook-form, Axios, dayjs, jsPDF |
| Testing   | Jest (backend + frontend), NestJS testing utilities |

---

## Prerequisites

- **Node.js** 18+ (LTS recommended)
- **npm** 9+ (or yarn / pnpm)

---

## Repository structure

```
Bond-Yield/
├── README.md                 # This file
├── .gitignore
├── bond-yield-backend/       # NestJS API
│   ├── src/
│   │   ├── bond/             # Bond module (controller, service, DTOs, utils)
│   │   ├── app.module.ts
│   │   └── main.ts
│   ├── package.json
│   └── ...
└── bond-yield-frontend/      # React app
    ├── public/
    ├── src/
    │   ├── components/       # BondForm, BondResults, CashFlowTable, ThemeToggle
    │   ├── services/         # bondApi (Axios)
    │   ├── theme/            # MUI theme + localStorage
    │   ├── types/            # bond.ts (DTO & response types)
    │   └── utils/            # currency, cashFlowExport (CSV/PDF)
    ├── package.json
    └── ...
```

---

## Installation

Clone the repository and install dependencies for both projects:

```bash
git clone https://github.com/genroar/Bond-Yield.git
cd Bond-Yield
```

### Backend

```bash
cd bond-yield-backend
npm install
```

### Frontend

```bash
cd bond-yield-frontend
npm install
```

---

## Running the application

Run the backend and frontend in two separate terminals.

### 1. Start the backend (API)

From the repo root:

```bash
cd bond-yield-backend
npm run dev
```

The API will be available at **http://localhost:3001**. The root route returns a simple message; the bond calculator endpoint is **POST http://localhost:3001/bond/calculate**.

### 2. Start the frontend (UI)

From the repo root:

```bash
cd bond-yield-frontend
npm start
```

The app will open at **http://localhost:3000**. It is configured to call the API at `http://localhost:3001` by default.

### 3. Use the calculator

1. Open **http://localhost:3000** in your browser.
2. Enter face value, annual coupon rate (%), market price, years to maturity, and coupon frequency.
3. Click **Calculate** to see current yield, YTM, total interest, premium/discount, and the cash flow schedule.
4. Use **Export to CSV** or **Export to PDF** to download the schedule. Use the theme toggle for dark/light mode.

---

## API documentation

### POST `/bond/calculate`

Calculates bond metrics and returns current yield, YTM, total interest, premium/discount, and cash flow schedule.

#### Request body

| Field              | Type     | Required | Validation                          | Description |
|--------------------|----------|----------|-------------------------------------|-------------|
| `faceValue`        | number   | Yes      | > 0                                 | Par value of the bond. |
| `annualCouponRate` | number   | Yes      | ≥ 0                                 | Annual coupon rate as a percentage (e.g. 5 for 5%). |
| `marketPrice`      | number   | Yes      | > 0                                 | Current market price of the bond. |
| `yearsToMaturity`  | number   | Yes      | > 0                                 | Years until maturity. |
| `couponFrequency`  | string   | Yes      | `"ANNUAL"` or `"SEMI_ANNUAL"`       | Coupon payment frequency. |

**Example request:**

```json
{
  "faceValue": 1000,
  "annualCouponRate": 5,
  "marketPrice": 950,
  "yearsToMaturity": 5,
  "couponFrequency": "ANNUAL"
}
```

#### Response (200 OK)

| Field                | Type     | Description |
|----------------------|----------|-------------|
| `currentYield`       | number   | Current yield as a percentage (e.g. 5.26). |
| `ytm`                | number   | Yield to maturity as a percentage (e.g. 6.12). |
| `totalInterest`      | number   | Total coupon interest over the life of the bond. |
| `premiumOrDiscount`  | string   | `"PREMIUM"`, `"DISCOUNT"`, or `"PAR"`. |
| `cashFlowSchedule`   | array    | One entry per period (see below). |

**Cash flow schedule entry:**

| Field                 | Type   | Description |
|-----------------------|--------|-------------|
| `period`              | number | Period number (1, 2, …). |
| `paymentDate`         | string | ISO 8601 date of the payment. |
| `couponPayment`       | number | Coupon amount for that period. |
| `cumulativeInterest`  | number | Running total of coupon interest. |
| `remainingPrincipal`  | number | Face value until last period; 0 at maturity. |

**Example response:**

```json
{
  "currentYield": 5.26,
  "ytm": 6.12,
  "totalInterest": 250,
  "premiumOrDiscount": "DISCOUNT",
  "cashFlowSchedule": [
    {
      "period": 1,
      "paymentDate": "2026-08-26T00:00:00.000Z",
      "couponPayment": 50,
      "cumulativeInterest": 50,
      "remainingPrincipal": 1000
    }
  ]
}
```

#### Validation errors (400)

If the request body fails validation, the API returns `400` with a `message` field (string or array of strings) describing the errors. Extra properties are forbidden when using the default NestJS ValidationPipe settings.

#### Other errors

- **500** – Server error (e.g. YTM numerical convergence failure). The response may include a message.

---

## Environment variables

### Backend (`bond-yield-backend`)

| Variable     | Default           | Description |
|-------------|-------------------|-------------|
| `PORT`      | `3001`            | Port the API listens on. |
| `CORS_ORIGIN` | `http://localhost:3000` | Allowed origin for CORS. |

### Frontend (`bond-yield-frontend`)

| Variable            | Default             | Description |
|---------------------|---------------------|-------------|
| `REACT_APP_API_URL` | `http://localhost:3001` | Base URL of the backend API. |

Create a `.env` file in the respective project folder to override (do not commit `.env`).

---

## Bond metrics explained

- **Current yield** = (Annual coupon payment) ÷ (Market price), expressed as a percentage. Measures income relative to price.
- **Yield to maturity (YTM)** = Internal rate of return if the bond is held to maturity, assuming coupons are reinvested at the same rate. Solved numerically (bisection) from the bond pricing equation. Returned as an annual percentage.
- **Total interest** = Sum of all coupon payments over the bond’s life (Annual coupon × Years to maturity for fixed annual coupons).
- **Premium / discount / par** – Bond trades at a **premium** if market price > face value, at a **discount** if market price < face value, and **par** if market price = face value.

---

## Project structure

### Backend (`bond-yield-backend/src`)

- **`main.ts`** – Bootstrap, global ValidationPipe, CORS, port.
- **`app.module.ts`** – Imports BondModule.
- **`bond/`**
  - **`bond.controller.ts`** – POST `/bond/calculate`, delegates to service.
  - **`bond.service.ts`** – Orchestrates calculations (annual coupon, current yield, total interest, premium/discount, YTM, cash flow schedule); applies rounding for response.
  - **`dto/calculate-bond.dto.ts`** – Request DTO with class-validator rules.
  - **`dto/coupon-frequency.enum.ts`** – `ANNUAL` | `SEMI_ANNUAL`.
  - **`interfaces/bond-response.interface.ts`** – Response shape.
  - **`interfaces/cash-flow-schedule.interface.ts`** – Cash flow entry shape.
  - **`utils/ytm.util.ts`** – YTM via bisection; internal bond price helper.

### Frontend (`bond-yield-frontend/src`)

- **`App.tsx`** – ThemeProvider, theme mode state, layout (title, ThemeToggle, BondForm, BondResults, CashFlowTable).
- **`components/BondForm.tsx`** – Form with react-hook-form, calls API on submit, loading and error state.
- **`components/BondResults.tsx`** – Displays current yield, YTM, total interest, premium/discount in cards.
- **`components/CashFlowTable.tsx`** – Renders cash flow schedule; Export to CSV/PDF buttons.
- **`components/ThemeToggle.tsx`** – Dark/light mode icon button.
- **`services/bondApi.ts`** – `calculateBond(dto)` (Axios POST), `getBondApiErrorMessage(error)`.
- **`theme/theme.ts`** – `createAppTheme(mode)` for MUI light/dark.
- **`theme/storage.ts`** – Read/write theme mode to/from localStorage.
- **`types/bond.ts`** – `CalculateBondDto`, `CashFlow`, `BondResponse`.
- **`utils/currency.ts`** – `formatCurrency(value)` (AED, 2 decimals).
- **`utils/cashFlowExport.ts`** – `exportCashFlowToCsv`, `exportCashFlowToPdf`, shared row builder.

---

## Testing

### Backend

```bash
cd bond-yield-backend
npm test
```

Runs unit tests (e.g. bond service helpers, YTM utility). For a specific file:

```bash
npm test -- bond.service.spec
npm test -- ytm.util.spec
```

### Frontend

```bash
cd bond-yield-frontend
npm test
```

Runs the React test suite (Create React App / Jest).

---

## Scripts reference

### Backend (`bond-yield-backend`)

| Script        | Command              | Description |
|---------------|----------------------|-------------|
| `npm run dev` | `nest start --watch` | Start API in watch mode (port 3001). |
| `npm start`   | `nest start`         | Start API once. |
| `npm run build` | `nest build`       | Compile TypeScript to `dist/`. |
| `npm run start:prod` | `node dist/main` | Run compiled app. |
| `npm test`    | `jest`               | Run unit tests. |
| `npm run lint`| `eslint ...`         | Lint and fix. |

### Frontend (`bond-yield-frontend`)

| Script        | Command             | Description |
|---------------|---------------------|-------------|
| `npm start`   | `react-scripts start`| Dev server (port 3000). |
| `npm run build` | `react-scripts build` | Production build in `build/`. |
| `npm test`    | `react-scripts test` | Run tests. |

---

## License

Unlicensed (see repository and project `package.json` for details).
