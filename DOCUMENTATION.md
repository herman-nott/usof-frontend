# USOF Frontend — DOCUMENTATION.md

1. [Short Description](#short-description)
2. [Current Status and Progress per CBL Stages](#current-status-and-progress-per-cbl-stages)
   - Engage
   - Investigate
   - Act
3. [Project Architecture and Algorithm](#project-architecture-and-algorithm)
4. [Main Components and Routes](#main-components-and-routes)
5. [Installation and Running](#installation-and-running)
6. [Environment Variables](#environment-variables)
7. [API Integration](#api-integration)
8. [Example User Flows](#example-user-flows)
9. [Future Improvements](#future-improvements)

---

## Short Description

USOF Frontend is a client-side web application built with **React.js (Vite)** that provides an interface for interacting with the USOF REST API.  
It includes user authentication, posts browsing, filtering, commenting, profile management, and an admin access system.

**Key features:**
- User registration and login
- Persistent sessions (via cookies)
- Viewing and filtering posts by category or date
- Adding comments, replies, and likes
- User profiles with avatars and ratings
- Admin functionality (delete users/posts)
- Responsive UI for desktop and mobile

---

## Current Status and Progress per CBL Stages

### Engage
**Goal:** Define the purpose and scope of the frontend.
**Done:**
- Defined frontend features and API interaction endpoints.
- Created the initial layout and routing structure.
- Established connection with the backend API.

**Result:** A structured React app capable of communicating with the USOF backend.

---

### Investigate
**Goal:** Choose technologies, design components, and define data flow.
**Done:**
- Chosen **React + Vite** for frontend.
- Styling via **CSS Modules**.
- State management using **React hooks** (`useState`, `useEffect`, `useContext`).
- Routing with **react-router-dom**.
- Fetch-based API abstraction layer implemented.
- Basic UI components for posts, comments, and users built.

**Result:** Modular and maintainable frontend structure, connected to the REST API.

---

### Act
**Goal:** Implement all features and refine UI/UX.
**Done:**
- Implemented authentication pages (login, registration, logout).
- Created main feed with post previews and filters.
- Implemented comments section with nested replies.
- Added profile editing and avatar uploading.
- Integrated rating system and likes for posts/comments.
- Responsive design adjustments.

**Remaining:**
- Dark/light theme toggle
- Better error boundary components
- End-to-end testing

---

## Project Architecture and Algorithm

### Folder Structure
```
root/
├─ API/                   # API
├─ public/                # public files
├─ src/                   
│  ├─ assets/
│  ├─ components/         # reusable UI components
│  │  ├─ AdminFeatures
│  │  ├─ AllCategories
│  │  ├─ AllUsers
│  │  ├─ BodyClassController
│  │  ├─ CategoryPosts
│  │  ├─ CommentsSection
│  │  ├─ Content
│  │  ├─ CreateCategory
│  │  ├─ CreatePost
│  │  ├─ EditPost
│  │  ├─ EditProfile
│  │  ├─ LeftSidebar
│  │  ├─ Login
│  │  ├─ Navigation
│  │  ├─ ParticleBackground
│  │  ├─ PasswordReset
│  │  ├─ PostDetail
│  │  ├─ PostPreview
│  │  ├─ Profile
│  │  ├─ Register
│  │  ├─ RightSidebar
│  │  ├─ SearchResults
|  |  └─ VerifyEmail
│  ├─ App.css
│  ├─ App.jsx
│  ├─ App.jsx
│  ├─ index.css
│  └─ main.jsx/
├─ index.html             
└─ .env
```


### Data Flow Example (Login)
1. User submits credentials on `/login`.
2. The component calls `api/auth/login`.
3. If successful, session cookie is set and user info is stored in `AuthContext`.
4. `isSignedIn` and `userId` are propagated to components.
5. Navigation redirects to `/profile`.

### Comment Loading Flow
1. Post page mounts → fetches `/api/posts/:id/comments`.
2. Comments are stored in state.
3. Each comment may include nested replies.
4. When new comment submitted → POST → list updates locally.

---

## Main Components and Routes

| Route | Component | Description |
|--------|------------|-------------|
| `/` | `Content` | Home page with posts feed |
| `/login` | `LoginForm` | User login page |
| `/register` | `RegisterForm` | Registration form |
| `/profile/:id` | `Profile` | User profile view |
| `/post/:id` | `PostDetails` | Single post with comments |
| `/categories` | `CategoriesList` | List of categories |
| `/category/:id` | `CategoryPosts` | Posts filtered by category |
| `/dashboard` | `AdminDashboard` | Admin panel (optional) |

---

## Installation and Running

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

## Environment Variables
```.env
# Backend API URL
VITE_API_URL=http://localhost:3000/api
```

## API Integration

Frontend interacts directly with the backend defined at `VITE_API_URL`.

### Example requests:
- GET /api/posts → get all posts
- GET /api/posts?sort=date&order=desc
- POST /api/auth/login → user login
- GET /api/users/:id → fetch profile info
- PATCH /api/users/avatar → update avatar


All requests include `{ credentials: "include" }` for session cookies.

---

## Example User Flows

### Registration
1. User opens `/register`.
2. Enters info and submits form.
3. Backend sends verification email.
4. After confirmation, user can log in and see personalized feed.

### Commenting
1. User opens a post page.
2. Scrolls to comment section.
3. Writes comment → API `POST /api/posts/:id/comments`.
4. UI updates automatically.

---

## Future Improvements

- Add dark/light theme toggle  
- Real-time updates with WebSockets  
- Add user badges and notifications  
- Add tests (Jest + React Testing Library)

---

## Conclusion

This document provides a full overview of the **USOF Frontend** project: its structure, architecture, and interaction with the backend API.  
The frontend is modular, responsive, and tightly integrated with the server, supporting all major features of the forum system.

--- 

*Author: Herman Pohosian*