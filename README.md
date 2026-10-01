# Shiftly - Shift Management Application 📅

A modern web application for regular workers and administrators to track work shifts, calculate earnings, and view comprehensive statistics. 

This project is built with **Angular (Standalone Components)** to provide a scalable, component-based Single Page Application (SPA). It simulates backend persistence using `LocalStorage` while preparing for Node.js REST API integration.

## ✨ Key Features
* **User Authentication:** Secure register, login, and session management with expiration control.
* **Role-Based Modes:**
  * **Regular Worker Mode:** Track personal shifts, add/edit shifts, view personal statistics (upcoming shifts, past week's shifts, highest-earning month), and manage profile settings.
  * **Administrator Mode:** Manage all workers and their shifts, view summary statistics (worker of the month, all workers' past shifts, highest company payout), filter individual worker shifts, and delete workers.
* **Dashboard Statistics:** Dynamic earnings and work analytics based on real-time data calculations (including overnight shift handling).
* **Search & Filter:** Advanced filtering options by worker name, workplace, and date ranges.

## 🛠 Tech Stack
* **Framework:** Angular (Standalone Components)
* **Language:** TypeScript, HTML5, CSS3
* **State/Data:** LocalStorage (Mock DB supporting full CRUD operations)
* **Design:** Custom "Mint & Charcoal" UI theme with responsive mobile support.

## 🔐 Administrator Access
To register and test as an **Administrator**, use the following secret code on the registration page:
* **Admin Secret Code:** `shiftly_admin_2026`

## 🚀 Getting Started

1. Clone the repository:
   git clone <your-repository-url>

2. Navigate to the project directory:
   cd shiftly-angular

3. Install dependencies:
   npm install

4. Run the development server:
   ng serve -o

5. The application will automatically open in your browser at http://localhost:4200/