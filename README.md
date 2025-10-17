# Sports Inventory Management System (MERN Stack)

A complete inventory management system for sports equipment built with MongoDB, Express.js, React.js, and Node.js.

## Features

- User Authentication (Register/Login)
- Dashboard with inventory statistics
- Add, Edit, Delete sports items
- Sports Categories & Items organization
- Inventory status tracking (In Stock, Out of Stock, Low Stock)
- Responsive design

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

## Installation & Setup

### 1. Clone and Navigate
```bash
cd sports-inventory-mern
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Create `.env` file in backend folder:
```
MONGODB_URI=mongodb://localhost:27017/sports_inventory
JWT_SECRET=your_jwt_secret_key_here
PORT=5000
```

Seed categories (optional):
```bash
npm run seed-categories
```

Start backend server:
```bash
npm run dev
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install
npm start
```

## Usage

1. Open http://localhost:3000
2. Register a new account or login
3. Access Dashboard to view inventory statistics
4. Go to Inventory page to manage sports items
5. Add, edit, or delete items as needed

## Project Structure

```
sports-inventory-mern/
├── backend/
│   ├── models/          # MongoDB schemas
│   ├── routes/          # API routes
│   ├── middleware/      # Authentication middleware
│   └── server.js        # Express server
└── frontend/
    ├── src/
    │   ├── components/  # React components
    │   ├── pages/       # Page components
    │   ├── context/     # React context
    │   └── App.js       # Main app component
    └── public/
```

## API Endpoints

### Authentication
- POST `/api/auth/register` - Register user
- POST `/api/auth/login` - Login user

### Inventory
- GET `/api/inventory` - Get all items
- POST `/api/inventory` - Add new item
- PUT `/api/inventory/:id` - Update item
- DELETE `/api/inventory/:id` - Delete item

### Categories
- GET `/api/categories` - Get all categories
- GET `/api/categories/:categoryName/items` - Get items by category
- POST `/api/categories` - Add new category

### Issues
- GET `/api/issues` - Get all issues
- POST `/api/issues` - Issue item to player
- PUT `/api/issues/:id/return` - Return item

## Technologies Used

- **Frontend**: React.js, React Router, Axios
- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcryptjs