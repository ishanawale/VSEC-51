# StockMate — Inventory Management System

A beginner-friendly full-stack academic mini-project built with React + Vite, Node.js, Express, MongoDB and Mongoose. It includes product CRUD, stock-in/out transactions, persistent movement history, live dashboard calculations, inventory tasks, calculators, a Canvas drawing pad and a CSS loading-zone animation.

## Features

- Dashboard metrics are calculated from stored product records; category values, recent movements and low-stock items are API-backed.
- Product creation, details, editing, deletion, search, category/status filtering and sorting.
- Server-side validation for product prices, integer stock values, required fields and unique product IDs.
- Stock in/out with reasons and notes. Stock-out cannot exceed available inventory. Movements store quantity snapshots and timestamps.
- Stock history with search, transaction type and date filters.
- Persistent tasks with priority, due date, completion state, editing and deletion.
- Inventory value and stock calculators; warehouse sketch pad using the Canvas API; traffic light / truck animation using CSS keyframes.
- Responsive sidebar, table layouts, empty/loading/error states and confirmation dialogs.

## Technology stack

- Frontend: HTML5, CSS3, JavaScript, React 18, Vite, React Router, Fetch API, Lucide React, React Hooks and Canvas API.
- Backend: Node.js, Express 4, REST endpoints, Mongoose.
- Database: MongoDB local or MongoDB Atlas.

## Prerequisites

- Node.js 20+ and npm.
- MongoDB Community Server running locally **or** a MongoDB Atlas cluster and connection string.
- VS Code (recommended).

## Setup

### 1. Configure MongoDB

**Local MongoDB:** install and start MongoDB Community Server. The default URI is `mongodb://127.0.0.1:27017/inventoryDB`; MongoDB creates the database and collections as records are inserted.

**MongoDB Atlas:** create a cluster, create a database user, allow your current IP in Network Access, and copy the Node.js connection string. Replace the placeholder database URI with a connection string ending in `/inventoryDB` (keep any required query options).

### 2. Configure environment files

From the `StockMate` root:

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

Windows PowerShell alternative:

```powershell
Copy-Item backend/.env.example backend/.env
Copy-Item frontend/.env.example frontend/.env
```

Edit `backend/.env`:

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/inventoryDB
CLIENT_URL=http://localhost:5173
```

For Atlas, replace only `MONGODB_URI` with your private Atlas connection string. Never put the database URI in the frontend `.env` or commit it to Git.

`frontend/.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

### 3. Install dependencies

In the root folder:

```bash
npm install
npm run install:all
```

Or install separately:

```bash
cd backend
npm install
cd ../frontend
npm install
```

### 4. Run the app

From the root, run both services concurrently:

```bash
npm run dev
```

Alternatively, open two VS Code terminals:

Terminal 1:

```bash
cd backend
npm run dev
```

Terminal 2:

```bash
cd frontend
npm run dev
```

- Frontend: http://localhost:5173
- Backend: http://localhost:5000
- Health check: http://localhost:5000/api/health

The API process attempts the MongoDB connection at startup. If MongoDB is not running or configured, it logs the problem; database-backed endpoints cannot work until the database is available.

### 5. Optional sample data

With MongoDB running and `backend/.env` configured:

```bash
npm run seed
```

The seed script inserts eight sample products (normal, low and zero stock) and three tasks. It uses upserts and does not duplicate sample records when run repeatedly. Existing product records are not overwritten.

## REST API

All endpoints use JSON. Base URL: `http://localhost:5000/api`.

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/health` | API/database health state |
| GET | `/products` | List products; supports `search`, `category`, `status` (`in`, `low`, `out`), `sort`, `order`, `page`, `limit` |
| POST | `/products` | Create product |
| GET | `/products/:id` | Get product by MongoDB ID |
| PUT | `/products/:id` | Update product |
| DELETE | `/products/:id` | Delete product; historical movement snapshots are retained |
| GET | `/products/search/:query` | Search product ID/name (URL-encode the query) |
| POST | `/stock/in` | Record stock-in transaction |
| POST | `/stock/out` | Record stock-out transaction |
| GET | `/stock` | Movement history; supports `search`, `type`, `from`, `to` |
| GET | `/stock/:id` | Get one movement |
| GET | `/tasks` | List tasks; supports `status` and `priority` |
| POST | `/tasks` | Create task |
| PUT | `/tasks/:id` | Update task |
| DELETE | `/tasks/:id` | Delete task |
| GET | `/dashboard` | Computed metrics, category breakdown, low-stock list and recent movements |

### Example product JSON

```json
{
  "productId": "P009",
  "name": "USB Hub",
  "category": "Electronics",
  "description": "Four-port USB hub",
  "price": 599,
  "quantity": 10,
  "minimumStock": 3,
  "supplier": "TechSource"
}
```

### Example stock-in JSON

```json
{
  "productId": "<MongoDB product _id>",
  "quantity": 5,
  "reason": "New Purchase",
  "notes": "Invoice INV-001"
}
```

For Postman, set `Content-Type: application/json`. Stock transactions use the MongoDB product `_id` in `productId`; the movement stores a human-readable product ID snapshot separately.

## Business rules

- **Out of stock:** quantity equals 0.
- **Low stock:** quantity is greater than 0 and less than or equal to `minimumStock`.
- **In stock:** quantity is greater than `minimumStock`.
- Stock transaction quantities must be positive integers; product quantity and minimum stock must be non-negative integers.
- Stock-out above available quantity is rejected.
- The backend attempts a MongoDB transaction. If the database is a standalone local instance that does not support transactions, it falls back to a guarded atomic product update and rolls back quantity if creating the movement fails. A replica set / Atlas deployment provides full multi-document transaction support.
- Deleting a product retains history snapshots and nulls its product reference.
- Calculators, drawing pad and animation are demonstration utilities; they do not change inventory records.

## Testing checklist

After MongoDB and both services are running, manually verify:

1. `GET /api/health` returns JSON and `database: "connected"`.
2. Create a product in the UI or via Postman; refresh and confirm it remains.
3. Try creating the same `productId` twice; the second request should return HTTP 409.
4. Search for a product by ID and name; edit and delete it.
5. Stock in increases quantity and adds a movement record.
6. Stock out decreases quantity; attempting to remove more than available returns HTTP 400 and does not make stock negative.
7. Dashboard values and low-stock statuses update after transactions.
8. Create, edit, complete, filter and delete a task.
9. Test calculator inputs, Canvas drawing/color/brush/eraser/clear, and loading-zone pause/resume.
10. Resize the browser to mobile width and refresh the browser to check responsiveness and persistence.

## Git and GitHub

Create an empty repository on GitHub first, then from the project root:

```bash
git init
git add .
git commit -m "Build StockMate inventory management system"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/StockMate.git
git push -u origin main
```

Replace `YOUR_USERNAME` with your GitHub username. Do not commit `.env` files or credentials.

## Project structure

```text
StockMate/
├── backend/
│   ├── controllers/      # Business logic for products, stock, tasks, dashboard
│   ├── middleware/       # Central error handling
│   ├── models/           # Mongoose schemas
│   ├── routes/           # REST route definitions
│   ├── scripts/seed.js   # Optional idempotent sample data
│   ├── .env.example
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── components/   # Forms and shared UI components
│   │   ├── pages/        # Tools, Canvas and animation
│   │   ├── services/api.js
│   │   ├── styles/global.css
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── .env.example
│   ├── index.html
│   └── package.json
├── .gitignore
├── package.json
└── README.md
```
