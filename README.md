# PiAxis Mini Detail Library

A minimalist architectural detail library built with **Next.js 15**, **Tailwind CSS**, and **Supabase (Postgres)**, featuring an AI-powered suggestion engine and a simulated Row Level Security (RLS) Vault.

## Getting Started

### 1. Prerequisites
Ensure you have the following installed:
- Node.js 18+
- npm

### 2. Installation
Clone the repository and install dependencies:

```bash
npm install
```

### 3. Environment Setup
Create a `.env` file in the root directory and add your PostgreSQL connection string:

```bash
DATABASE_URL="postgresql://user:password@localhost:5432/your_database"
```

### 4. Database Initialization
This project uses a simulated RLS environment. You must run the setup SQL to create the necessary tables, users, and policies.

1.  Connect to your Postgres database using your preferred client (e.g., pgAdmin, DBeaver, or psql).
2.  Run the contents of **`supabase_setup.sql`** located in the root directory.
    *   This script creates the `users` and `details` tables.
    *   It inserts seed data for testing.
    *   It defines the RLS policies and role constraints.

### 5. Run the Application
Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

---

## Architecture & Features

### 📂 Library (`/library`)
A public collection of standard architectural details. Users can browse and search through the database.
*   **Tech**: Server Components with `force-dynamic` rendering.
*   **Design**: Minimalist cards with category pills and tag metadata.

### ✨ Suggest (`/suggest`)
An intelligent recommendation engine.
*   **Logic**: Users select a Host Element and an Adjacent Element.
*   **Output**: The system queries the `detail_usage_rules` table to find the perfect technical solution.

### 🔐 Pro Vault (`/secure`)
A robust simulation of **Row Level Security (RLS)** using **Application-Layer Filtering**.

#### How RLS works in this app:
The application demonstrates how different user roles access the same database table (`details`) but see different rows based on their clearance level.

*   **Authentication**: Simulated via email entry (no password required for demo).
*   **Authorization**: The API (`/api/secure/details`) checks the user's role and enforces strict SQL filtering.

#### User Roles & Access:

| Role | Email | Access Permissions |
| :--- | :--- | :--- |
| **Super Admin** | `admin@example.com` | **Full Access**: Sees ALL public and private records. |
| **Architect** | `alice@example.com` | **Restricted**: Sees Standard details + *Her own* Private projects. |
| **Intern** | `bob@example.com` | **Public Only**: Sees ONLY Standard details. Cannot see Private data. |

### 🔄 Switching Users
To test different roles without clearing your browser cache:
1.  **Unlock** the vault with a user (e.g., `alice@example.com`).
2.  Click the **End Session** button (Log Out icon) in the Pro Toolbar.
3.  Enter a different email (e.g., `bob@example.com`) to instantly switch contexts and verify policy enforcement.
