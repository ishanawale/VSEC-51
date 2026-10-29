# StockMate - Smart Inventory Management System

A full-stack mini project: **React (Vite) + Express + MongoDB**. Manage products, record stock in/out transactions, watch low-stock alerts, track inventory tasks, and use a few tools (calculators, canvas drawing pad, CSS animation).

## Features
- **Dashboard**: live totals (products, units, low stock, out of stock, inventory value), recent movements, low-stock alerts, category breakdown, quick actions. All values are calculated by the backend from stored data.
- **Products**: add / view / edit / delete, search (ID or name), filter (category, status), sort (name, quantity, price), pagination, validation, confirmation before delete.
- **Stock Management**: Stock In and Stock Out. Stock Out can never make stock negative (enforced atomically in the database query).
- **Stock History**: every transaction is saved (previous and new quantity), newest first, search / type / date filters.
- **Low-stock monitoring**: Out of Stock = quantity 0; Low Stock = quantity > 0 and <= minimum stock; In Stock = above minimum. In-app only (no email/SMS).
- **Inventory Tasks**: persistent to-do list (add, edit, delete, complete, filter, counts).
- **Tools**: Inventory Value Calculator (INR), Stock Calculator, Canvas drawing pad (mouse/touch/pen, colour, brush size, eraser, clear), CSS traffic-light + truck animation (respects reduced-motion).

## Technology
React 18, Vite, React Router, Fetch API, Lucide icons, HTML5 Canvas, CSS3 | Node.js, Express, Mongoose | MongoDB (database `inventoryDB`).

## Folder structure
```
StockMate/
  backend/  models/ routes/ controllers/ middleware/ scripts/seed.js server.js .env.example
  frontend/ public/ src/{components,pages,services,hooks,styles} App.jsx main.jsx .env.example
  README.md  .gitignore  package.json
```

## Prerequisites
Node.js 18+ and npm, Git, VS Code, and either a local MongoDB (Community Server) or a free MongoDB Atlas cluster.

## MongoDB setup (choose one)
**Local:** install MongoDB Community Server and make sure it is running. Use `MONGODB_URI=mongodb://127.0.0.1:27017/inventoryDB`.

**Atlas:** create a free cluster, create a database user, under Network Access allow your IP, then click Connect > Drivers and copy the connection string. Add `/inventoryDB` before the `?`:
`mongodb+srv://<user>:<password>@<cluster>.mongodb.net/inventoryDB?retryWrites=true&w=majority`

## Install and configure
```bash
# 1. Backend
cd backend
npm install
cp .env.example .env        # Windows: copy .env.example .env
# edit backend/.env and set MONGODB_URI

# 2. Frontend (new terminal)
cd frontend
npm install
cp .env.example .env        # Windows: copy .env.example .env
```
Environment variables: backend `PORT=5000`, `MONGODB_URI`, `CLIENT_URL=http://localhost:5173`; frontend `VITE_API_URL=http://localhost:5000/api`. Never commit `.env`.

## Run
Two terminals:
```bash
cd backend  && npm run dev     # API:  http://localhost:5000
cd frontend && npm run dev     # App:  http://localhost:5173
```
Or from the project root (after `npm install` in root and in both folders): `npm run install:all` then `npm run dev`.

## Optional sample data
```bash
cd backend
npm run seed
```
Inserts 8 sample products (normal, low and out of stock) and 5 tasks, marked "Sample" in the UI. Safe to run repeatedly: existing records are never duplicated, changed or deleted. The app also works with an empty database.

## API endpoints
| Method | URL | Purpose |
|---|---|---|
| GET | /api/health | Server + database status |
| POST | /api/products | Create product |
| GET | /api/products | List (query: search, category, status=in/low/out/attention, sortBy=name/quantity/price, order, page, limit) |
| GET | /api/products/search/:query | Search by ID or name (URL-encode the text) |
| GET | /api/products/:id | One product (MongoDB `_id`) |
| PUT | /api/products/:id | Update (quantity is changed only via stock endpoints) |
| DELETE | /api/products/:id | Delete (stock history is kept) |
| POST | /api/stock/in | `{product, quantity, reason, notes}` |
| POST | /api/stock/out | same body; rejected if quantity > available |
| GET | /api/stock | History (query: search, type=IN/OUT, date=YYYY-MM-DD, page, limit) |
| GET | /api/stock/:id | One movement |
| POST/GET | /api/tasks | Create / list (query: status=pending/completed, priority) |
| PUT/DELETE | /api/tasks/:id | Update (also toggles `completed`) / delete |
| GET | /api/dashboard | Computed statistics + recent activity |

Example (Postman or curl):
```bash
curl -X POST http://localhost:5000/api/products -H "Content-Type: application/json" \
  -d '{"name":"Stapler","category":"Stationery","price":120,"quantity":10,"minimumStock":3}'
```

## Design notes (useful for viva)
- **No negative stock:** Stock Out uses one atomic `findOneAndUpdate` with filter `quantity >= requested`. If saving the history record fails, the quantity change is reversed. This works on standalone MongoDB (no replica set needed).
- **Route order:** `/search/:query` is declared before `/:id` in Express.
- **Validation:** done on the server (frontend checks are only for convenience). Query text is escaped before regex use; request values must be plain strings.
- **Status is calculated** (Mongoose virtual), never stored.
- **Deleting a product** keeps its stock history; each movement stores product ID and name snapshots.

## Manual test checklist
1. `GET http://localhost:5000/api/health` shows `status: ok`, `database: connected`.
2. Add a product; refresh the browser; it is still there. Restart the backend; still there.
3. Add another product with the same ID: you get a duplicate-ID error.
4. Search, filter and sort in Products; edit; delete (confirm dialog).
5. Stock In increases quantity; Stock Out decreases; Stock Out above available is rejected.
6. Stock History shows each transaction; filters work.
7. Reduce a product to its minimum (low) and to 0 (out): badges and dashboard counts change.
8. Tasks: add, complete, edit, filter, delete.
9. Tools: calculators, drawing (colour/brush/eraser/clear), animation; resize the window to check responsiveness.
10. Stop MongoDB or the backend: the app shows a friendly error message instead of a fake success.

## Git and GitHub
```bash
cd StockMate
git init
git add .
git commit -m "Initial commit: StockMate inventory management system"
git branch -M main
# create an empty repository on github.com first, then:
git remote add origin https://github.com/<your-username>/StockMate.git
git push -u origin main
```
Check `git status` first: `.env` and `node_modules` must not be listed.
