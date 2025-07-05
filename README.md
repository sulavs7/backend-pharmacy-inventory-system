# 💊 PharmaTrack – Pharmacy Inventory Management Backend

PharmaTrack is a backend system designed to manage pharmacy inventory, medicine details, user authentication, and medicine updates. It aims to simplify operations for pharmacies by providing a clean, secure, and extendable REST API.

---

## ⚙️ Tech Stack

- Node.js
- Express.js
- MongoDB + Mongoose
- JWT
- bcrypt
- morgan

---

## 📦 Features

- 🔐 User authentication with access and refresh tokens
- ➕ Add, update, delete medicines
- 📋 Get a list of all available medicines
- 🔎 Search for a medicine by name or ID
- 📆 Track expiry dates and stock

---

## Getting Started

```bash
# 1. Clone the repository
git clone https://github.com/sulavs7/backend-pharmacy-inventory-system.git
cd backend-pharmacy-inventory-system

# 2. Install dependencies
npm install express mongoose bcrypt jsonwebtoken morgan dotenv nodemon 

# 3. Create environment file
# Create a .env file in the root folder and add the following:

echo "PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=SECRET-KEY

# 4. Run the development server
npm run dev

# Server will start at:
# http://localhost:5000
```

