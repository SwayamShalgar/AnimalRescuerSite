# 🚀 Next.js Project

This is a web application built using [Next.js](https://nextjs.org/), a React framework that enables server-side rendering and generating static websites for React-based web applications.

## 📂 Project Structure

/project-root
├── app/ # App directory for routing (if using App Router)
├── lib/ # Utility functions and modules
├── public/ # Static files (images, fonts, etc.)
├── api/ # Contains Routes and database connection.
├── auth/ # Contains authentication signup,login pages logic
├── Home/ # Contains Home page logic and design
├── StaffHome/ # Contains StaffHome page logic and design
├── middleware.ts # Middleware for route protection
├── .env.local # Environment variables (not committed)
├── next.config.js # Next.js configuration
├── package.json
└── README.md

## ⚙️ Features

- ✅ Server-side rendering (SSR) and static site generation (SSG)
- 🔐 JWT-based authentication system with cookies
- 📦 API Routes using `app/api` or `pages/api`
- 🔄 Route protection via middleware
- 🖼️ Image uploading and database integration (e.g., NeonDB or PostgreSQL)
- 💅 Styled with Tailwind CSS or global CSS
- 🌐 SEO-friendly and fast

## 🛠️ Technologies Used

- Next.js
- React
- Tailwind CSS
- NeonDB
- JWT
- Bcrypt (for password hashing)
- NodeMailer (for sending email)

## 🔧 Installation

1. Clone the repository:

```bash
git clone https://github.com/SwayamShalgar/AnimalRescuerSite.git
cd AnimalRescuerSite

npm install
# or
yarn install

DATABASE_URL=your_database_url
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
EMAIL_USER=your_email_id
EMAIL_PASS=your_email_pass

npm run dev
# or
yarn dev

npm run dev       # Start development server
npm run build     # Build for production
npm run start     # Start production server
npm run lint      # Run ESLint
