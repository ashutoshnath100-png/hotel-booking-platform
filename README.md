🏨 Hotel Booking Platform

A full-stack Hotel Booking Platform built using the MERN Stack (MongoDB, Express.js, React.js, Node.js).
This application allows users to browse hotels, book rooms, and enables admins to manage listings and bookings.

---

🚀 Features

🔐 Authentication & Security

- JWT (JSON Web Token) based authentication
- Secure login & registration system
- Role-Based Access Control (Admin/User)

🏨 Hotel Management

- Add, update, and delete hotels (Admin)
- View hotel listings with details
- Search and filter hotels

📅 Booking System

- Book hotel rooms with date selection
- Manage bookings (User)
- Track booking status

👨‍💼 Admin Dashboard

- Manage users and bookings
- Monitor platform activity
- Perform CRUD operations

---

🛠️ Tech Stack

Backend:

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication

Frontend:

- React.js
- Tailwind CSS
- JavaScript (ES6+)

---

📁 Project Structure

hotel-booking-platform/
│── backend/
│   ├── routes/
│   ├── models/
│   ├── controllers/
│   ├── middleware/
│   └── server.js
│
│── frontend/
│   ├── src/
│   └── components/
│
│── .gitignore
│── README.md

---

⚙️ Installation & Setup

1️⃣ Clone the repository

git clone https://github.com/ashutoshnath100-png/hotel-booking-platform.git
cd hotel-booking-platform

---

2️⃣ Install dependencies

cd backend
npm install

cd ../frontend
npm install

---

3️⃣ Setup environment variables

Create a ".env" file in backend:

PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key

---

4️⃣ Run the project

cd backend
npm run dev

cd frontend
npm start

---

📌 Future Enhancements

- Payment Integration (Stripe/Razorpay)
- Email Notifications
- Advanced Search Filters
- Booking History & Analytics

---

👨‍💻 Author

Ashutosh Nath
MERN Stack Developer

---

⭐ Show Your Support

If you like this project, give it a ⭐ on GitHub!
