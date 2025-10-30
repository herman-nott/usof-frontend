# USOF Project – Forum Frontend (React)

## 📌 Short Description
This project is the **frontend** part of the **USOF Forum System**, built with **React.js**.  
It provides a dynamic and responsive **single-page application (SPA)** that connects to the backend API located in the `/api` folder.  

Users can:
- Register, verify their email, log in, and reset passwords  
- Create, edit, and delete posts and comments  
- Browse posts by categories  
- Like posts and comments  
- Manage their profiles and avatars  
- Access admin-level features (if authorized)  

The interface includes:
- **Particle-based animated background** for authentication pages  
- **Navigation bar**, **sidebars**, and **adaptive content area**  
- Full **route management** via React state (no external router used)  

---

## ⚙️ Requirements and Dependencies

### Requirements
- [Node.js](https://nodejs.org/) (>= 18.x)
- npm (>= 9.x)
- Backend server running (see `/api` folder)

### Dependencies
Main npm packages used in the frontend:
- **react** – Core library for building UI  
- **react-dom** – DOM bindings for React  
- **vite** – Development server and build tool  
- **@vitejs/plugin-react** – Vite plugin for React  
- **axios** – For making API requests  
- **classnames**, **react-icons**, etc. – UI utilities  

---

## 🚀 How to Run the Project

1. **Clone the repository**
   ```bash
   git clone [https://github.com/herman-nott/usof-frontend.git](https://github.com/herman-nott/usof-frontend.git)
   ```
   ```bash
   cd usof-backend
   ```

2. **Install dependencies**
    ```bash
    npm install
    ```

3. **Configure environment variables**  
Create a .env file in the root folder with your database and session credentials:
    ```.env
    VITE_API_URL=http://localhost:3000/api
    ```

4. **Run the server**
[View Backend README](../api/README.md)

5. **Start the app**
    ```bash
    npm run dev
    ```
    The app will run on:  
    ```bash
    http://localhost:5173
    ```