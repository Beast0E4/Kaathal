# 🧩 KAATHAL

A modern full-stack web application built with:

- ⚡ **Vite** + **React** (frontend)
- 🌿 **MongoDB** + **Express** + **Node.js** (backend)

---

## 🚀 Features

- 📱 Responsive UI with modern React hooks & components  
- 🧱 Clean architecture with separate client & server folders  

---

## 🏗 Tech Stack

**Frontend**

- [Vite](https://vitejs.dev/) + [React](https://react.dev/)
- React Router
- Axios for HTTP
- State management (Redux)
- CSS framework (Tailwind CSS)

**Backend**

- Node.js
- Express
- MongoDB + Mongoose
- JSON Web Tokens (JWT) for auth
- dotenv for configuration
- cloudinary for Cloud storage

---

## 📂 Project Structure

```bash
PROJECT_NAME/
├── client/                  # Vite + React frontend
│   ├── index.html
│   ├── vite.config.ts
│   ├── src/
│   │   ├── main.jsx         # React entry point
│   │   ├── App.jsx
│   │   ├── components/
│   │   ├── pages/
│   │   ├── hooks/
│   │   ├── context/
│   │   ├── services/        # API calls
│   │   └── styles/
│   └── public/
│
├── server/                  # Express + Node backend
│   ├── src/
│   │   ├── index.ts         # Server entry
│   │   ├── config/          # DB & app config
│   │   ├── models/          # Mongoose models
│   │   ├── routes/          # Route definitions
│   │   ├── controllers/     # Route handlers
│   │   ├── middleware/
|   
│   │   ├── utils/
│   │   └── tests/
│   └── package.json
│
├── .env.example
├── package.json             # Root scripts
├── README.md
└── ...other configs
