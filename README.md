# Tony's Finance App

A personal finance dashboard built to demonstrate **vibe coding** – fast, iterative, AI-assisted development.

![Dashboard](https://github.com/user-attachments/assets/88e87c15-cb1c-4c0a-b04c-ecd863e0b253)

## Features

- 📊 **Dashboard** – live summary cards for total balance, monthly income, expenses, and savings
- 📈 **Income vs Expenses chart** – 6-month area chart powered by Recharts
- 🎯 **Budget Tracker** – per-category progress bars (turns red when over budget)
- 💳 **Transactions list** – filterable by All / Income / Expense with one-click delete
- ➕ **Add Transaction modal** – add income or expense with category, amount, and date

## Tech Stack

- [React](https://react.dev/) + [Vite](https://vite.dev/)
- [Tailwind CSS](https://tailwindcss.com/) (via `@tailwindcss/vite`)
- [Recharts](https://recharts.org/) for charts
- [Lucide React](https://lucide.dev/) for icons

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Build

```bash
npm run build
```

## Deploy to GitHub Pages

The app is automatically deployed to **[https://DasLama69.github.io/Tonyfinanceapp/](https://DasLama69.github.io/Tonyfinanceapp/)** on every push to `main` via GitHub Actions.

### How it works

1. The workflow in `.github/workflows/deploy.yml` runs `npm ci && npm run build`.
2. The built `dist/` folder is published using the official `actions/deploy-pages` action.
3. `vite.config.js` sets `base: '/Tonyfinanceapp/'` so all asset URLs are correct on GitHub Pages.

### First-time setup (repository settings)

1. Go to **Settings → Pages** in this repository.
2. Under **Build and deployment → Source**, select **GitHub Actions**.
3. Push any commit to `main` (or trigger the workflow manually from the **Actions** tab) to publish the site.

