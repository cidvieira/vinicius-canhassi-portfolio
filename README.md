# Portfolio & Admin Dashboard - Vinicius Canhassi

[![Vercel Deployment](https://img.shields.io/github/deployments/cidvieira/vinicius-canhassi-portfolio/production?label=Vercel&logo=vercel&style=for-the-badge)](https://www.viniciuscanhassi.com.br/)

This repository contains the source code for the personal portfolio of Vinicius Canhassi, a professional graphic designer. The project is a full-stack application built with the Next.js App Router, featuring a public-facing portfolio and a secure, private administrative dashboard for content management.

The entire system is designed to be dynamic, allowing the administrator to manage all public content—including art projects, videos, and the "About Me" section—through a user-friendly interface.

**Live Site:** [**www.viniciuscanhassi.com.br**](https://www.viniciuscanhassi.com.br/)  
**Admin Panel:** [**viniciuscanhassi.com.br/admin**](https://www.viniciuscanhassi.com.br/admin)

---

## 🚀 Key Features

The project is divided into two main parts: the public portfolio and the administrative dashboard.

### Public-Facing Portfolio
- **Fully Responsive Design:** Optimized for all devices, from mobile to desktop.
- **Dynamic Content:** All projects and text are fetched directly from a database, powered by the admin dashboard.
- **Server-Side Rendering (SSR) & Static Site Generation (SSG):** Built with Next.js App Router for optimal performance, SEO, and fast load times.
- **On-Demand Revalidation:** The portfolio instantly reflects content changes made in the dashboard without needing a new deployment, thanks to Next.js's On-demand ISR.

### Administrative Dashboard (`/admin`)
- **Secure Authentication:** The dashboard is protected by NextAuth.js, allowing only authenticated admin users to log in.
- **Full CRUD Functionality:** Administrators can **C**reate, **R**ead, **U**pdate, and **D**elete all content.
- **Art Projects Management:**
  - Create new art projects with a title, subtitle, and multiple images.
  - Upload images directly from the browser to cloud storage.
  - Edit project details and manage/reorder images on a dedicated page.
  - Reorder the entire project gallery via a drag-and-drop interface.
- **Video Projects Management:**
  - Similar CRUD functionality for video projects, including video file and thumbnail uploads.
  - Edit project details directly within a dialog for a streamlined workflow.
  - Drag-and-drop reordering for the video gallery.
- **"About Me" Section Management:** A simple interface to update the biographical text on the main site.
- **User-Friendly Feedback:** The interface provides instant feedback for all actions using toasts and UI skeletons for a smooth user experience.

---

## 🛠️ Tech Stack

This project was built using a modern, full-stack TypeScript architecture.

| Category                | Technology                                                                                                                              |
| ----------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| **Framework**           | ![Next.js](https://img.shields.io/badge/-Next.js-000000?style=for-the-badge&logo=next.js) (App Router)                                     |
| **Language**            | ![TypeScript](https://img.shields.io/badge/TypeScript-3178C6.svg?style=for-the-badge&logo=TypeScript&logoColor=white)                                       |
| **Styling**             | ![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-06B6D4.svg?style=for-the-badge&logo=Tailwind-CSS&logoColor=white) & ![shadcn/ui](https://img.shields.io/badge/shadcn/ui-000000.svg?style=for-the-badge&logo=shadcn/ui&logoColor=white) |
| **Database**            | ![Vercel Postgres](https://img.shields.io/badge/-Vercel_Postgres-000000?style=for-the-badge&logo=postgresql) (Powered by Neon)              |
| **ORM**                 | ![Prisma](https://img.shields.io/badge/-Prisma-2D3748?style=for-the-badge&logo=prisma)                                                   |
| **Authentication**      | ![NextAuth.js](https://img.shields.io/badge/-NextAuth.js-000000?style=for-the-badge&logo=next-auth)                                       |
| **File Storage**        | ![Vercel Blob](https://img.shields.io/badge/-Vercel_Blob-000000?style=for-the-badge&logo=vercel)                                           |
| **Deployment**          | ![Vercel](https://img.shields.io/badge/-Vercel-000000?style=for-the-badge&logo=vercel)                                                   |

---

## 🔧 Getting Started

To run this project locally, follow these steps:

**1. Clone the repository:**
```bash
git clone https://github.com/cidvieira/vinicius-canhassi-portfolio.git
cd vinicius-canhassi-portfolio
```
**2. Install dependencies:**

```bash
npm install
```
**3. Set up environment variables:**
- Create a `.env` file in the root of the project by copying the `.env.example` file (if one exists).
- You will need to set up your own Vercel Postgres database and Vercel Blob storage to get the required connection strings and tokens.
- Add the following variables to your `.env` file:

```
# Vercel Postgres

POSTGRES_URL="..."
POSTGRES_URL_NON_POOLING="..."
     
# Vercel Blob
BLOB_READ_WRITE_TOKEN="..."
     
# NextAuth.js
NEXTAUTH_SECRET="..." # Generate a secret with `openssl rand -base64 32`
NEXTAUTH_URL="http://localhost:3000"
```
**4. Synchronize the database:**
   - This command will push the schema defined in `prisma/schema.prisma` to your database.
```bash
npx prisma db push
```

**5. Seed the database with the admin user:**

- Open the prisma/seed.ts file.
- Change the placeholder credentials to your desired admin email and a strong password.
- Run the seed script:
```bash
npm install prisma:seed
```
- **Important:** After running the seed, remove the plaintext password from the seed.ts file for security.

**6. Run the development server:**
```bash
npm run dev
```

The application will be available at http://localhost:3000.
The admin dashboard will be available at http://localhost:3000/admin.