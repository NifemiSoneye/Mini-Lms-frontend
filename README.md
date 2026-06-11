# Coursa LMS — Frontend

A modern Learning Management System frontend built with React, TypeScript, and Tailwind CSS.

🔗 **Live Demo:** [https://mini-lms-bice.vercel.app](https://mini-lms-bice.vercel.app)

---

## Tech Stack

- **React** + **TypeScript**
- **Tailwind CSS** for styling
- **shadcn/ui** for UI components
- **Redux Toolkit** + **RTK Query** for state management and data fetching
- **React Router DOM** for client-side routing
- **Lucide React** for icons
- **JWT** authentication via `jwt-decode`

---

## Features

### Student
- Landing page with hero, features, and CTA sections
- Browse all available courses with category filtering and pagination
- Enroll in courses
- Track enrolled course progress
- Watch YouTube-embedded video lessons
- Mark lessons as complete
- Locked/unlocked lesson navigation based on completion
- Course progress bar

### Admin
- Admin dashboard with overview stats (total courses, lessons, enrollments)
- Create, edit, and delete courses via a reusable modal
- Toggle course publish/draft status
- Recent courses list with pagination

### General
- JWT-based authentication (login / register)
- Protected routes with role-based access
- Responsive design — mobile, tablet, and desktop
- Skeleton loaders throughout
- Toast notifications for all actions
- Persistent sidebar with mobile overlay

---

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/              # shadcn/ui components
│   ├── CourseCard.tsx
│   ├── EnrolledCourseCard.tsx
│   ├── CourseModal.tsx
│   ├── AdminCourses.tsx
│   ├── AdminOverview.tsx
│   ├── Header.tsx
│   ├── SideBar.tsx
│   └── LandingNav.tsx
├── features/
│   ├── auth/            # Auth slice + hooks
│   ├── courses/         # Course API slice
│   ├── progress/        # Progress API slice
│   └── ui/              # UI slice (sidebar state)
├── pages/
│   ├── Landing.tsx
│   ├── HomePage.tsx
│   ├── CoursePage.tsx
│   ├── VideoLessonPage.tsx
│   └── AdminDashboard.tsx
├── lib/
│   └── types.ts
└── hooks/
    └── use-toast.ts
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/coursa-frontend.git
cd coursa-frontend

# Install dependencies
npm install

# Create environment file
cp .env.example .env
```

### Environment Variables

```env
VITE_API_BASE_URL=https://mini-lms-backend-pkgt.onrender.com
```

### Running Locally

```bash
npm run dev
```

The app will be available at `http://localhost:5173`.

### Building for Production

```bash
npm run build
```

---

## Authentication

Authentication is handled via JWT tokens stored in Redux state. The `useAuth` hook decodes the token to expose:

```ts
const { id, email, name, role, isAdmin } = useAuth();
```

Protected routes redirect unauthenticated users to the login page. Admin-only routes show an access denied toast for non-admin users.

---

## Deployment

The frontend is deployed on **Vercel**. Any push to the main branch triggers an automatic deployment.

Make sure `VITE_API_BASE_URL` is set in your Vercel environment variables.
