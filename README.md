# 🚌 BusGo – Bus Ticket Booking System

BusGo is a full‑stack web application that simplifies online bus ticket booking across Sri Lanka. Users can search available buses, view real‑time seat availability, securely book seats, make online payments, and download PDF tickets with instant email confirmations.

---

## 📑 Table of Contents

- [📁 Project Structure](#-project-structure)
- [✨ Features](#-features)
- [🚀 Demo](#-demo)
- [⚡ Getting Started](#-getting-started)
- [🛠️ Tech Stack](#-tech-stack)
- [🖼️ Screenshots](#-screenshots)
- [🤝 Contributing](#-contributing)
- [📝 License](#-license)
- [👤 Author](#-author)

---

## 📁 Project Structure

The repository follows a modular structure for improved maintainability and clear separation of concerns:

```
bus-ticket-booking/
│
├── bus-booking-backend/    # Backend code (API, database)
├── bus-booking-frontend/   # Frontend (UI, client logic)
├── .gitignore
├── LICENSE
└── README.md
```
*[See project structure in VSCode:]*  
![Project Structure Screenshot](./project-structure-vscode.png)
<sup>For illustration purposes only — your actual folders may differ.</sup>

---

## ✨ Features

- 🔍 **Search & Discovery**: Find buses between any two cities with route and time filters.
- 🎫 **Real‑Time Seat Booking**: Instantly view seat availability and reserve your seats.
- 💳 **Online Payment**: Securely pay using preferred payment gateways.
- 📩 **E-Ticket & Email Confirmation**: Instantly receive a PDF ticket and email receipt.
- 📜 **Booking History**: View, download, or reprint past tickets.
- 🗺️ **Responsive Design**: Works great on desktop and mobile.

---

## 🚀 Demo

_Coming soon!_  
<!-- Optionally add a link to a live demo or video walkthrough here -->

---

## ⚡ Getting Started

### 🧰 Prerequisites

- [Node.js](https://nodejs.org/) (v14+)
- [npm](https://www.npmjs.com/) or [Yarn](https://yarnpkg.com/)
- (Optional) [MongoDB](https://www.mongodb.com/) or your chosen database for backend

### 🛠️ Installation

1. **Clone the repo**
    ```bash
    git clone https://github.com/Mathu-code/Bus-Ticket-Booking.git
    cd Bus-Ticket-Booking
    ```

2. **Install dependencies**

    - Backend:
        ```bash
        cd bus-booking-backend
        npm install
        # or yarn install
        ```
    - Frontend:
        ```bash
        cd ../bus-booking-frontend
        npm install
        # or yarn install
        ```
        
3. **Configure environment variables**
   
   - Copy `.env.example` to `.env` in both backend & frontend, and set required keys.

4. **Run the app**

    - Backend:
        ```bash
        npm run dev
        ```
    - Frontend:
        ```bash
        npm run dev
        ```
    - Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🛠️ Tech Stack

- **Frontend**: JavaScript (React / Next.js)
- **Backend**: JavaScript (Node.js, Express)
- **Database**: MongoDB or compatible
- **Payments**: Stripe / PayPal (optional integration)
- **Other**: PDF generation, Email (Nodemailer)

---

## 🖼️ Screenshots

*(Sample file explorer from VS Code showing project structure below)*

![VSCode Project Screenshot](https://user-images.githubusercontent.com/your-upload-path/project-structure-vscode.png)
<sup>Add your real or illustrative screenshots here.</sup>

---

## 🤝 Contributing

Contributions are welcome!  
Feel free to [open issues](https://github.com/Mathu-code/Bus-Ticket-Booking/issues) or submit pull requests. Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👤 Author

- [Mathu-code](https://github.com/Mathu-code)