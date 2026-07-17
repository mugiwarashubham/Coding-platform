<div align="center">

# 🧠 CodeMaster

**A full-stack online coding practice platform — built from scratch.**

Solve DSA problems, write code in multiple languages, get instant judged results, and get unstuck with an AI tutor — all in one place.

[![Live Demo](https://img.shields.io/badge/demo-live-brightgreen)](https://coding-platform-ull7.vercel.app)
[![React](https://img.shields.io/badge/Frontend-React_19-61DAFB?logo=react&logoColor=white)](https://react.dev)
[![Node.js](https://img.shields.io/badge/Backend-Node.js%20%2F%20Express-339933?logo=node.js&logoColor=white)](https://nodejs.org)
[![MongoDB](https://img.shields.io/badge/Database-MongoDB-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com)
[![License](https://img.shields.io/badge/license-ISC-blue)](#license)

[Live Demo](https://coding-platform-ull7.vercel.app) · [Report Bug](https://github.com/mugiwarashubham/Coding-platform/issues) · [Request Feature](https://github.com/mugiwarashubham/Coding-platform/issues)

</div>

---

## 📖 About

**CodeMaster** is a LeetCode-inspired coding practice platform where users can browse DSA problems, write and run code directly in the browser, get their submissions judged in real time, and chat with an AI tutor for hints — without giving the solution away. Admins get a full panel to create, update, and delete problems.

Built end-to-end — schema design, auth, code execution pipeline, and deployment — as a way to deeply understand how real coding-judge platforms work under the hood.

---

## ✨ Features

- 🔐 **Authentication & Authorization** — JWT-based auth with HTTP-only cookies, role-based access control (`user` / `admin`)
- 🧩 **Problem Catalog** — Filter problems by difficulty (Easy / Medium / Hard) and tags (Array, Linked List, Tree, Graph, DP, Sorting, Math)
- 💻 **In-Browser Code Editor** — Powered by Monaco Editor, supports **C++**, **Java**, and **JavaScript**
- ⚡ **Real-Time Code Execution & Judging** — Submissions are compiled and run against hidden test cases via the **Judge0** API
- 🤖 **AI Chat Tutor** — Powered by Google Gemini; gives contextual hints and code reviews based on the problem and the user's current code, without revealing the full solution
- 📊 **Submission History & Progress Tracking** — Tracks each user's solved problems and past submissions
- 🛠️ **Admin Panel** — Create, update, and delete problems with full test-case and multi-language starter-code management
- 🎨 **Clean, Responsive UI** — Built with Tailwind CSS + DaisyUI

---

## 🖼️ Screenshots

| Login | Admin Panel |
|---|---|
| ![Login](./screenshots/login.png) | ![Admin Panel](./screenshots/admin-panel.png) |

| Problem List | Code Editor + AI Tutor |
|---|---|
| ![Problem List](./screenshots/problem-list.png) | ![Code Editor](./screenshots/code-editor.png) |

> Add your own screenshots to a `/screenshots` folder in the repo root and update the paths above.

---

## 🏗️ Tech Stack

**Frontend**
- React 19 + Vite
- Redux Toolkit (state management)
- React Router
- Tailwind CSS + DaisyUI
- React Hook Form + Zod (form validation)
- Monaco Editor (code editor)
- Axios

**Backend**
- Node.js + Express 5
- MongoDB + Mongoose
- Redis (token blocklist for logout)
- JWT (jsonwebtoken) + bcrypt
- Judge0 API (code execution & judging)
- Google Gemini API (AI chat tutor)

**Deployment**
- Frontend → [Vercel](https://vercel.com)
- Backend → [Render](https://render.com)

---

## 🗂️ Project Structure

```
Coding-platform/
├── backend/
│   ├── src/
│   │   ├── config/          # DB & Redis connection
│   │   ├── controllers/     # Route handlers (auth, problems, submissions, AI chat)
│   │   ├── middleware/      # Auth guards (user / admin)
│   │   ├── models/          # Mongoose schemas (User, Problem, Submission)
│   │   ├── routes/          # Express routers
│   │   ├── utils/           # Judge0 helpers, validators
│   │   └── index.js         # App entry point
│   └── package.json
└── frontend/
    ├── src/
    │   ├── components/      # Reusable UI (Admin panel, submission history, ChatAI)
    │   ├── pages/            # Route-level pages (Home, Login, Signup, Problem, Admin)
    │   ├── store/             # Redux store
    │   ├── utils/            # Axios client
    │   └── authSlice.js      # Auth state (login/register/checkAuth/logout)
    └── package.json
```

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org) v18+
- A [MongoDB](https://www.mongodb.com/atlas) database (Atlas or local)
- A [Redis](https://redis.io) instance (e.g. Redis Cloud)
- A [Judge0](https://judge0.com) API endpoint (self-hosted or public instance)
- A [Google Gemini API key](https://ai.google.dev) for the AI tutor

### 1. Clone the repository

```bash
git clone https://github.com/mugiwarashubham/Coding-platform.git
cd Coding-platform
```

### 2. Backend setup

```bash
cd backend
npm install
```

Create a `.env` file inside `backend/`:

```env
PORT=3000
DB_CONNECT_STRING=your_mongodb_connection_string
JWT_KEY=your_jwt_secret
REDIS_PASS=your_redis_password
GEMINI_KEY=your_google_gemini_api_key
```

Run the backend:

```bash
node src/index.js
```

### 3. Frontend setup

```bash
cd ../frontend
npm install
```

Update the backend base URL in `frontend/src/utils/axiosClient.js` to point to your running backend, then:

```bash
npm run dev
```

The app will be available at `http://localhost:5173`.

---

## 🔑 Environment Variables Reference

| Variable | Description |
|---|---|
| `PORT` | Port the backend server listens on |
| `DB_CONNECT_STRING` | MongoDB connection URI |
| `JWT_KEY` | Secret used to sign JWT auth tokens |
| `REDIS_PASS` | Password for the Redis instance (used for logout token blocklist) |
| `GEMINI_KEY` | Google Gemini API key for the AI chat tutor |

> ⚠️ Never commit your `.env` file. Make sure it's listed in `.gitignore`.

---

## 📡 API Overview

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| `POST` | `/user/register` | Register a new user | Public |
| `POST` | `/user/login` | Log in | Public |
| `POST` | `/user/logout` | Log out | User |
| `GET` | `/user/check` | Verify current session | User |
| `POST` | `/problem/create` | Create a new problem | Admin |
| `PUT` | `/problem/update/:id` | Update a problem | Admin |
| `DELETE` | `/problem/delete/:id` | Delete a problem | Admin |
| `GET` | `/problem/getAllProblem` | List all problems | User |
| `GET` | `/problem/problemById/:id` | Get a single problem | User |
| `GET` | `/problem/problemSolvedByUser` | Get problems solved by current user | User |
| `POST` | `/submission/submit/:id` | Submit code for judging | User |
| `POST` | `/ai/chat` | Chat with the AI tutor | User |

---

## 🧗 Challenges & Learnings

Building the features was one part of the journey — shipping it taught even more:

- **Cross-origin auth** — Frontend (Vercel) and backend (Render) live on different domains, which meant auth cookies needed `SameSite=None; Secure` to survive cross-site requests.
- **CORS configuration** — Locking down `Access-Control-Allow-Origin` to the exact deployed frontend URL (and keeping it in sync across redeploys).
- **Free-tier cold starts** — Handling the delay when the Render backend spins down after inactivity.
- **Judge0 integration** — Structuring starter code and test cases so raw stdin/stdout execution works consistently across C++, Java, and JavaScript.

---

## 🗺️ Roadmap

- [ ] More problems across all difficulty levels
- [ ] Python support in the code editor
- [ ] Leaderboard & user profiles
- [ ] Discussion/comments section per problem
- [ ] Dark mode

---

## 🤝 Contributing

Contributions are welcome!

1. Fork the repo
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

Distributed under the ISC License.

---

## 👤 Author

**Shubham Singh** ([@mugiwarashubham](https://github.com/mugiwarashubham))

⭐ If you found this project interesting, consider giving it a star!
