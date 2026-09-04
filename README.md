# Padhle Ladle — Second Year Engineering Academic Portal

A modern, responsive web application built with **React**, **Vite**, **Tailwind CSS**, and **Lucide React** designed for organizing second-year engineering class lecture notes (PDFs, PPTs) and tutorial practice sheets.

---

## Features

- **Apple-Style Aesthetics**: Minimalist design with SF Pro typography, light `#f5f5f7` background, frosted glassmorphic cards (`backdrop-blur`), and responsive layout.
- **Multi-Branch Navigation**:
  - **Electronics Instrumentation & Control (EIC)** (Active)
  - Computer Science & Engineering (CSE) (*Coming Soon*)
  - Electronics & Communication (ECE) (*Coming Soon*)
  - Mechanical Engineering (MECH) (*Coming Soon*)
  - Civil Engineering (CIVIL) (*Coming Soon*)
- **EIC Curriculum Directory**:
  - Left dock navigation with smooth `origin-left` micro-interactions.
  - Sub-menu tabs for **Class PPTs & Notes** and **Tutorial Sheets**.
- **Real-Time In-Subject Search**: Instant filtering across notes, presentations, and tutorials by keywords and topic descriptions.
- **In-Browser Document Preview Modal**: Preview lecture files and tutorial sheets directly in-browser before downloading.
- **Secret Admin Portal**:
  - Unlocked via shortcut `Ctrl + Shift + A` (or `Cmd + Shift + A`) or header Shield icon.
  - Password protected authentication.
  - Form to upload and publish new resources directly to the curriculum with metadata (instructor, description, external URL, file size).

---

## Tech Stack

- **Framework**: [React 19](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Data Source**: Local JSON configuration (`src/data/subjects.json`)

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+)
- npm or yarn

### Installation

1. Clone repository:
   ```bash
   git clone https://github.com/Shivorior/StudyHub.git
   cd StudyHub
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run development server:
   ```bash
   npm run dev
   ```

4. Build for production:
   ```bash
   npm run build
   ```
