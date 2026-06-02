# 🚀 Life In Numbers

Transform your digital life into meaningful insights.

Life In Numbers is a privacy-focused productivity analytics platform that tracks browser activity, keyboard usage, focus patterns, and digital habits through a Chrome Extension and visualizes them in a modern analytics dashboard.

## 🌟 Features

### 🔐 Authentication

* Clerk Authentication
* Email & Password Login
* Google Sign-In
* Secure Session Management

### 📊 Analytics Dashboard

* Daily Activity Statistics
* Keyboard Activity Tracking
* Tab Usage Analytics
* Productivity Metrics
* Usage Trends & Insights

### 🧠 Smart Insights

* Rule-Based Insight Engine
* Productivity Recommendations
* Focus Pattern Detection
* Usage Trend Analysis

### 🌐 Chrome Extension

* Keyboard Tracking
* Tab Tracking
* Session Monitoring
* Browser Activity Collection
* Automatic Data Sync

### 👤 User Profile Management

* Profile Information
* Account Settings
* Preferences Management

### 📤 Shareable Statistics

* Share Analytics Cards
* Temporary Public Sharing
* Social Media Ready

---

## 🏗️ Architecture

```text
Chrome Extension
       │
       ▼
Browser Activity
       │
       ▼
Next.js Frontend
       │
       ▼
Clerk Authentication
       │
       ▼
Webhook Sync
       │
       ▼
Supabase Backend
       │
       ▼
PostgreSQL Database
       │
       ▼
Insights Engine
```

---

## 🛠️ Tech Stack

### Frontend

* Next.js 16
* React 19
* TypeScript
* Tailwind CSS v4
* Framer Motion

### Authentication

* Clerk

### Database & Backend

* Supabase
* PostgreSQL

### State Management

* Zustand

### Browser Extension

* Chrome Extension Manifest V3

### Deployment

* Vercel

---

## 📁 Project Structure

```text
life-in-numbers/

├── app/
├── components/
├── features/
├── hooks/
├── lib/
├── services/
├── store/
├── types/
├── utils/
├── extension/
├── public/
└── docs/
```

---

## ⚙️ Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
CLERK_WEBHOOK_SECRET=

NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## 🚀 Getting Started

### Clone Repository

```bash
git clone https://github.com/pushkar-jaju/Life-In-Numbers.git
cd Life-In-Numbers
```

### Install Dependencies

```bash
npm install
```

### Run Development Server

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

---

## 🔄 Webhook Flow

```text
User Signup
      │
      ▼
Clerk
      │
      ▼
Webhook Trigger
      │
      ▼
Supabase User Creation
      │
      ▼
Default Settings Creation
```

---

## 📈 Future Enhancements

* AI-Powered Productivity Insights
* Weekly Productivity Reports
* Goal Tracking
* Team Analytics
* Mobile Application
* Cross-Device Synchronization
* Advanced Focus Scoring

---

## 🔒 Privacy First

Life In Numbers is designed with privacy in mind.

* No keystroke content is stored
* Only activity metrics are tracked
* User data remains secure
* Authentication handled by Clerk
* Data stored securely in Supabase

---

## 👨‍💻 Author

**Pushkar Jaju**

MCA Student | Full Stack Developer

GitHub: https://github.com/pushkar-jaju

---

## 📄 License

This project is licensed under the MIT License.

---

⭐ If you found this project interesting, consider giving it a star on GitHub.
