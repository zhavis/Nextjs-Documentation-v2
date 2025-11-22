# Next.js Documentation App

This is a Next.js-powered documentation platform designed to make creating and sharing technical content simple, collaborative. Whether you’re a developer looking to build your own docs site, contribute guides, this project gives you a solid foundation and practical examples With a great interface, collaborative features, and responsive design, this app is perfect for building community-driven documentation platforms.

# Key Features

- Create & Manage Documentation: Easily add, edit, and organize documentation .

- Collaborative Contributions: improving community knowledge.

- Responsive UI: Tailwind CSS ensures a clean and user-friendly interface.

- Client-Side Navigation: Smooth SPA-like navigation.

- Search & Categorization: Quickly find and filter documentation content.

- Versioning & Updates: Track changes and maintain organized documentation.

- Secure User Access: Optional authentication for managing contributions.

- User Authentication & Progress Tracking: Register, login, logout, update profile, and mark documentation pages as read.

- Swagger API Documentation: Easily explore and test all API endpoints via Swagger UI.

- Data Storage: MongoDB securely stores all your data.

# API Endpoints & Swagger

- Authentication
```bash
POST /api/users/register – Register a new user

POST /api/users/login – Login with email & password

GET /api/users/logout – Logout the user
```
- Profile
```bash
GET /api/users/me – Get current user profile

PUT /api/users/me – Update current user profile
```

- Progress
```bash
GET /api/users/progress – Get completed pages

POST /api/users/progress – Mark a page as completed
```
# Swagger UI

Make sure the Swagger JSON is saved in your public folder:
```bash
public/swagger/swagger.json
```

Open your Swagger UI page (/swagger) in your browser:
```bash
http://localhost:3000/swagger
```

You can explore and test all endpoints directly in the Swagger UI, including authentication, profile updates, and progress tracking, also Protected endpoints such as (/me, /progress) require the authentication cookie from login. When logged in, Swagger will use it automatically to test these endpoints.

# Getting Started

- Clone the repo
```bash
git clone https://github.com/RAVIGANESHMBHAT/NextJS-Authentication.git
```
- Go to the project folder
```bash
cd NextJS-Authentication
```
- Install NPM packages
```bash
npm install
```
or
```bash
yarn install
```
- Create .env file and enter valid data (Refer to .env.sample)

# Tech Stack

- Next.js 13 – Server-side rendering & SPA features

- MongoDB – For database

- Tailwind CSS 3 – responsive UI

- Axios – API requests

- bcryptjs

- Nodemailer – Email verification

- Swagger UI – API documentation and testing

# 🤝 Join the Community

This project thrives on collaboration! Fork it, contribute, improve documentation, add features, or fix bugs, your input helps thousands of developers access better, more organized information.

✨ Whether you’re a seasoned dev or just starting out, every contribution counts.
