# Shiftly - Shift Management Application 📅

A modern web application for regular workers to track work shifts, calculate earnings, and view monthly statistics. 

This project is currently being migrated from Vanilla JavaScript to **Angular** to build a more scalable, component-based Single Page Application (SPA). It will eventually be connected to a Node.js REST API.

## ✨ Key Features
* **User Authentication:** Secure register, login, and session management.
* **Dashboard Statistics:** View upcoming shifts, past week's shifts, and the highest-earning month.
* **Shift Management:** Create, read, and update work shifts with hourly wages.
* **Smart Workplace Input:** Easily select from previously saved workplaces or type a new one to auto-save.
* **Search & Filter:** Filter shifts by specific workplaces and date ranges.
* **Profile Management:** Update personal user details.

## 🛠 Tech Stack
* **Framework:** Angular (Standalone Components)
* **Language:** TypeScript, HTML5, CSS3
* **State/Data:** LocalStorage (Currently serving as a mock DB, preparing for Node.js REST API integration)
* **Design:** Custom "Mint & Charcoal" UI theme.

## 🚀 Getting Started

1. Clone the repository:
   ```bash
   git clone <your-repository-url>
   ```

2. Navigate to the project directory:
   ```bash
   cd shiftly-angular
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Run the development server:
   ```bash
   ng serve -o
   ```

5. The application will automatically open in your browser at `http://localhost:4200/`.