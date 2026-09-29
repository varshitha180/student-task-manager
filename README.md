Student Task Manager
A single-page application built to help students manage assignments, exams, and project deadlines.

Tech Stack
Technology	Purpose
Vue 3	Frontend framework (Composition API, SFCs)
Vue Router	Page navigation + auth guards
Pinia	State management (auth + tasks stores)
Tailwind CSS	Utility-first styling, responsive design
Vitest + Vue Test Utils	Unit testing + coverage
Vite	Dev server + production bundler
Docker + Nginx	Containerized production deployment
GitHub Actions	CI/CD pipeline
Features
🔐 Email/password authentication with session persistence
🛡️ Protected dashboard route with Vue Router navigation guards
📋 Full task CRUD — create, edit, delete, cycle status
🔎 Filtering by status, priority, and free-text search
↕️ Sorting by due date, priority, or recency
⏰ Overdue highlighting and stats dashboard
📱 Mobile-responsive: sidebar overlay, card-based layout
💾 Local persistence via localStorage
Project Structure
src/
├── assets/ # Logos, images
├── components/ # Reusable UI: Navbar, Footer, TaskCard, AddTask
├── views/ # Page-level: Login, Register, Dashboard, About, NotFound
├── router/ # Vue Router config + navigation guards
├── stores/ # Pinia stores: auth, tasks
├── composables/ # Reusable composition functions
├── utils/ # Validators, helpers
├── tests/ # Vitest specs
├── layouts/ # AppLayout wrapper
├── App.vue
├── main.js
└── style.css

## Setup

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Production build
npm run build

# Preview production build
npm run preview

# Build image
docker build -t student-task-manager .

# Run container on port 8080
docker run -p 8080:80 student-task-manager

Open http://localhost:8080 in your browser.

CI/CD
GitHub Actions workflow (.github/workflows/ci.yml) runs on every push/PR to main:

Test job — runs Vitest with coverage, uploads the coverage report
Build job — builds production bundle, uploads dist/ as artifact
Documentation
Debugging Checklist (Week 3)
Test Coverage
| File | Statements | Branches | Functions | Lines |
|------|-----------|----------|-----------|-------|
| `src/utils/validators.js` | 97% | 86% | 100% | 97% |
| `src/stores/auth.js` | 83% | 72% | 91% | 83% |
| `src/stores/tasks.js` | 83% | 72% | 91% | 83% |
| **Overall** | **88.54%** | **76%** | **94%** | **88%** |

Run npm run test:coverage to regenerate this report.

License
MIT

## How to replace README.md

1. Open `README.md` in VS Code (it's in your project root — Vite scaffolded it with default content)
2. **Select all** (Ctrl+A)
3. **Delete**
4. **Paste** the content above
5. **Save** (Ctrl+S)

## After saving

Confirm all 5 Week 6 files exist:

1. ✅ `README.md` — just updated
2. ⬜ `Dockerfile` — needs to exist in project root
3. ⬜ `nginx.conf` — needs to exist in project root
4. ⬜ `.dockerignore` — needs to exist in project root
5. ⬜ `.github/workflows/ci.yml` — needs to exist

The contents for `Dockerfile`, `nginx.conf`, `.dockerignore`, and `ci.yml` are in my message two turns ago. Create them too if you haven't yet, then run:

```powershell
docker build -t student-task-manager .