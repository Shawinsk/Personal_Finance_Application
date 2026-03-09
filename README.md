# FundFlow - Personal Finance Application

A clean, elegant, and highly scalable personal finance web application built using **HTML, Vanilla JavaScript, Tailwind CSS**, and a **Supabase** backend. This project takes an absolute modern approach without relying on bulky Node.js build tools (like Vite or Webpack) by leveraging Native Web Components and native ES modules for a lightweight, blazingly fast development experience.

## ✨ Key Features

1. **Authentication:**
   - Secure Login & Sign Up powered by Supabase Auth (Email/Password).
   - Route guarding blocking unsolicited access to internal dashboard pages without an active session.

2. **Dashboard & Analytics:**
   - Real-time aggregation of your total balance, monthly incomes, and monthly expenses.
   - Quick overview of recent transactions mapping cleanly to categorized icons.

3. **Accounts Management (`accounts.html`):**
   - Create and track multiple wallets or accounts (e.g. Checking, Savings, Credit Cards, Cash).
   - See running balances per account.

4. **Transactions System (`transactions.html`):**
   - Record ad-hoc Income and Expense statements.
   - Tie transactions to dedicated accounts and categories.
   - Elegant list UI handling varying category color themes and representations.

5. **Budget Control (`budgets.html`):**
   - Setup monthly or yearly expense limits to keep your spending in check.
   - Progress bar rendering the amount logic to visualize if a limit is nearing or exceeded.

6. **Financial Goals (`goals.html`):**
   - Save up towards larger scale objectives like a 'Vacation' or a 'New Car'.
   - Tracks relative progress and completion via rich animated components.

## 🛠 Tech Stack

- **Frontend core:** Clean HTML5, Vanilla JavaScript.
- **Component Reusability:** HTML Native Web Components (`<app-header>`, `<app-sidebar>`, `<app-footer>`) eliminating duplicated code across pages.
- **Styling:** Tailwind CSS (via CDN) paired with localized CSS override (`style.css`) using the 'Inter' Font for a highly elegant minimalistic black-and-white theme.
- **Backend & Database:** Supabase (PostgreSQL).
- **Icons:** FontAwesome v6.

## 📁 Repository Structure

```
/
├── index.html           # Landing boundary routing logged-in users to Dashboard and others to Login.
├── login.html           # Authentication Interface (Sign in).
├── signup.html          # Authentication Interface (Sign up).
├── dashboard.html       # Primary portal analyzing user's financial overview.
├── accounts.html        # Manage Cash/Bank/Credit-Card logic.
├── transactions.html    # Add, Filter, and Read Transactions.
├── budgets.html         # Add, Filter, and Read Spending Limits.
├── goals.html           # Add, Filter, and Read Long-term Objectives.
├── css/
│   └── style.css        # Core custom overrides, font imports & animations.
└── js/
    ├── supabase.js      # Global initialized instantiation linking Supabase CDN libraries.
    ├── auth.js          # Encapsulated Auth Logic (Signup/Sign in/Sign out & Route Guarding).
    ├── db.js            # General abstraction layer performing generic queries to Supabase.
    ├── db_extras.js     # Secondary layer performing grouped extra mathematical queries.
    ├── dashboard.js     # Page specific bindings.
    ├── accounts.js      # Page specific bindings.
    ├── transactions.js  # Page specific bindings.
    ├── budgets.js       # Page specific bindings.
    ├── goals.js         # Page specific bindings.
    └── components/
        ├── app-header.js   # Reusable Header Component.
        ├── app-footer.js   # Reusable Footer Component.
        └── app-sidebar.js  # Reusable Dashboard Sidenav Component.
```

## 🗄 Supabase Database Architecture

The backend utilizes strict relational architecture enforced utilizing `auth.users(id)` and PostgreSQL constraints.

- **`profiles`**: Auto-populated mapped via triggers on auth signup.
- **`categories`**: General Income/Expense tags initialized default per user.
- **`accounts`**: User bank entities storing running balance strings (Up to `NUMERIC(20,2)`).
- **`transactions`**: Granular income/expense actions mapping both a `category_id` & `account_id`.
- **`budgets`**: Maximum monetary limits assigned to specific expense `category_id`.
- **`goals`**: Independent monetary target entities.
- **`debts`**: _(Schema pre-defined for future buildouts)_ Tracks borrowed/lent capital logic.

> **Security Note**: All tables explicitly enforce RLS (Row Level Security), assuring that operations like `select`/`insert`/`update`/`delete` intrinsically resolve only against records matching the user's uniquely secure session token ID `(auth.uid() = user_id)`.

## 🚀 Running the Project

Given the usage of native ES Modules (`import/export` syntax within `.js` scripts) and Fetch mechanics:

1. You **cannot** run this by blindly double-clicking the `index.html` file into the browser (Due to CORS strict-origin policies).
2. Start up a Local HTTP Server inside the `project02` directory.
   - Use VS Code plugin: **Live Server**.
   - Or alternatively with python: `python -m http.server 5500`.
3. Open `http://127.0.0.1:5500` or `http://localhost:5500`.
4. Sign up with an arbitrary secure email, and confirm email on the Supabase Backend to enter. All operations are dynamically fetched!
