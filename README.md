# Mini LinkedIn-like Platform

## 🚀 Stack Used
- Frontend: React.js + Tailwind CSS
- Backend: Node.js + Express.js
- Database: MongoDB Atlas
- Auth: JWT & bcrypt
- Hosting: Vercel (frontend), Render (backend)

## ⚙️ Setup Instructions
1. Clone the repo
2. In `/server` folder:
   - Create `.env` file with:
     ```
     MONGO_URI=<Your MongoDB URI>
     JWT_SECRET=<Secret>
     ```
   - Run:
     ```
     npm install
     npm start
     ```
3. In `/client` folder:
   - Run:
     ```
     npm install
     npm run dev
     ```

## 👤 Demo Login
- Email: demo@user.com
- Password: 12345678

## ✨ Extra Features (Optional)
- Profile image upload (Multer or Cloudinary)
- Edit profile
- Like posts
