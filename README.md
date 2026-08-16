# 🚀 OpenSource Pilot

> **The Open Source Discovery, Learning & Contribution Command Center**

OpenSource Pilot bridges the gap between *wanting to contribute to open source* and *landing your first merged pull request*. It provides real-time GitHub issue discovery calibrated for beginners, deep issue viability triage, interactive git workflow automation, standardized PR generation, an interactive learning academy, and a personal contribution Kanban board.

---

## 🌟 Key Features

### 1. 🎯 Live Issue & Project Explorer
- **Real-Time GitHub Search API**: Search millions of open issues across GitHub with custom qualifiers.
- **Curated Starter Channels**:
  - 🌱 **Good First Issues** (`good first issue`, `beginner`, `easy-fix`)
  - 📚 **Documentation & Guides** (`documentation`, `docs`, `typo`)
  - 🐛 **Bug Triage & Quick Wins** (`bug`, `help wanted`)
  - 🤖 **AI & LLM Tools** (`topic:ai`, `topic:llm`)
  - ⚡ **CLI & DevTools** (`topic:cli`, `topic:developer-tools`)
- **Algorithmic Viability Score (0-100%)**: Automatically analyzes issue competition, comment velocity, maintainer guidance, and assignment status to rate contributor readiness.
- **Offline / Graceful Fallback**: High-yield curated dataset so you can explore even without internet or when unauthenticated rate limits occur.

### 2. 🔍 Visual Query Builder / Dork Studio
- Construct complex GitHub search strings visually with sliders, label combiners, and activity constraints.
- 1-click execution in OpenSource Pilot or directly on GitHub.com.
- Preset templates: *Zero-Comment Goldmines*, *Documentation Quick Wins*, *Responsive Mid-Size Repos*.

### 3. 🛠️ Interactive Git Playbook & PR Generator
- Generates tailored, copy-paste ready Git command chains:
  1. `git clone` & fork setup
  2. `git remote add upstream` synchronization
  3. `git checkout -b` atomic branch creation
  4. Conventional commit formatting (`fix:`, `feat:`, `docs:`)
  5. `git rebase upstream/main` conflict-free workflow
  6. `git push -u origin`
- Formatted PR description builder with automatic `Closes #<id>` issue linking.
- Courteous maintainer claim comment generator.

### 4. 🎓 Mastering Open Source Academy
Deep-dive conceptual and practical modules for deep understanding:
- **Module 1**: *How to Read & Navigate Massive Codebases* (Top-down entry points, tests as specifications, symbol search)
- **Module 2**: *The Git Contribution Engine: Upstream Sync & Rebase* (Two-remote topology, rebase vs merge, conflict resolution)
- **Module 3**: *Maintainer Psychology & PR Acceptance Secrets* (Review bandwidth, 5 PR rejection causes, open source licenses)
- **Module 4**: *Conquering Tests & CI/CD Pipelines* (Test pyramid, pre-commit linters, debugging GitHub Actions matrix failures)
- Includes interactive knowledge verification checks per module.

### 5. 📊 Personal Contribution Workspace (Kanban Board)
- 5-stage contribution pipeline:
  - 📌 **Bookmarked**
  - 🧭 **Exploring Codebase**
  - 💻 **In Progress / Writing Code**
  - 🚀 **PR Submitted**
  - 🏆 **Merged!** (with celebratory confetti!)
- Add notes, branch names, and custom external issues.
- All progress is preserved locally in browser storage.

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Launch Development Server
```bash
npm run dev
```
Open your browser at `http://localhost:5173`.

### 3. Build for Production
```bash
npm run build
```

---

## 🔑 GitHub Personal Access Token (Optional)
By default, the unauthenticated GitHub REST API allows **60 requests per hour**. 
You can click **"Set PAT"** in the navigation bar to add a GitHub Personal Access Token:
- Increases rate limit to **5,000 requests per hour**.
- Stored **strictly in your local browser `localStorage`**.
- No scopes or permissions required (public read-only).

---

## 🛠️ Tech Stack
- **Framework**: React 18 + Vite
- **Styling**: Tailwind CSS + Custom Cosmic Design System
- **Icons**: Lucide React
- **Animations & Effects**: Canvas Confetti, Glassmorphism, Tailwind Glows
- **Storage**: Browser LocalStorage API
