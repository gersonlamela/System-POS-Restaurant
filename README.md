<p align="center">
  This project was developed as part of my final undergraduate Multimedia Engineering thesis, where I achieved a final grade of 19/20.
</p>

<p align="center">
  <a href="#-technologies">Technologies</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#-layout">Layout</a>
</p>

<br>

## 🚀 Technologies

This project was built using the following technologies:

- REACT ![React](https://img.shields.io/badge/-React-61DAFB?logo=react&logoColor=white&style=flat)
- Shadcn/ui ![Shadcn](https://img.shields.io/badge/-Shadcn_UI-764ABC?style=flat)
- TailwindCSS ![TailwindCSS](https://img.shields.io/badge/-TailwindCSS-06B6D4?logo=tailwind-css&logoColor=white&style=flat)
- NextJs ![Next.js](https://img.shields.io/badge/-NextJs-000000?logo=next.js&logoColor=white&style=flat)
- Prisma ![Prisma](https://img.shields.io/badge/-Prisma-2D3748?logo=prisma&logoColor=white&style=flat)
- PostgreSQL ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
- TypeScript ![TypeScript](https://img.shields.io/badge/-TypeScript-3178C6?logo=typescript&logoColor=white&style=flat)
- Insomnia ![Insomnia](https://img.shields.io/badge/-Insomnia-5849BE?logo=insomnia&logoColor=white&style=flat)
- Git and GitHub ![Git](https://img.shields.io/badge/-Git-F05032?logo=git&logoColor=white&style=flat) ![GitHub](https://img.shields.io/badge/-GitHub-181717?logo=github&logoColor=white&style=flat)

---

## 🚀 Getting Started

To set up and run the project locally:

1. Clone the repository to your local machine.
2. Install the necessary dependencies `npm i`.
3. Set up the environment variables (see [Environment Variables](#-environment-variables)).
4. Run database migrations `npx prisma migrate dev`.
5. Start the development server.
6. Open your browser and navigate to `http://localhost:3000`.

---

## ⚡ Environment Variables

The project requires the following environment variables to function properly. Create a `.env` file in the root of the project and add:

DATABASE_URL=your-database-url  
JWT_SECRET=your-jwt-secret

```env
# Connection string for your database
DATABASE_URL=postgresql://<username>:<password>@localhost:5432/<database_name>

# NextAuth configuration
NEXTAUTH_SECRET=<your-next-auth-secret>
NEXTAUTH_URL=<your-next-url>

# Base URL for your application
NEXT_PUBLIC_BASE_URL=<your-next-public-base-url>
```

---




## 🔖 Layout

You can view the project layout through this [LINK](https://www.figma.com/design/EGS2CEbKfbHJ47kAzgW7Ht/System-POS?m=auto&t=d0oACyj3K5ZUMxM5-6).
