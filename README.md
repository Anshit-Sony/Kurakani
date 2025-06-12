# 💬 Kurakani - Real-Time Chat Application

Kurakani is a full-stack real-time chat application built using the **MERN stack** (MongoDB, Express.js, React, Node.js). It features secure authentication, group chat functionalities, and real-time messaging with notifications. Designed with a responsive and modern UI using **Material UI**, and powered by **Socket.IO** for live interactions.

---

## 🚀 Features

* 🔐 **Authentication**

  * Sign Up & Login with **JWT-based** authentication

* 💬 **Real-Time Messaging**

  * One-to-one chat and **group chat** functionality
  * **Instant notifications** using **Socket.IO**

* 👥 **Group Chat Features**

  * Create group chats
  * Add/remove users
  * Rename groups
  * Leave group option

* 🌐 **Fully Responsive UI**

  * Works seamlessly across mobile, tablet, and desktop

* 🎨 **Material UI Design**

  * Styled using **Material UI (Joy UI)** for a Messenger-like experience

* ☁️ **Cloudinary Integration**

  * Upload and manage profile pictures or images

* 🧑‍💻 **Deployed on Render**

  * Live backend and frontend deployed using **Render**

---

## 🌍 Live Demo

Kurakani: ## 🌍 Live Demo

Frontend: [https://kurakani-frontend.onrender.com/]

---

---

## 🧰 Tech Stack

* **Frontend**: React, Context API, Socket.IO-client, Material UI
* **Backend**: Node.js, Express.js, MongoDB, Mongoose, JWT, Socket.IO
* **File Storage**: Cloudinary
* **Hosting**: Render

---

## 💍 Local Setup

### 1. Clone the repository

```bash
git clone https://github.com/your-username/kurakani.git
cd kurakani
```

### 2. Setup the backend

```bash
cd backend
npm install
```

* Create a `.env` file inside `backend` directory:

```env
PORT=5000
MONGO_URI=your_mongo_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

* Run backend server:

```bash
npm run dev
```

### 3. Setup the frontend

```bash
cd ../frontend
npm install
```

* Create a `.env` file in `frontend` if needed (e.g., for base URLs)

* Run frontend:

```bash
npm start
```

---

## 📦 Folder Structure

```
kurakani/
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   └── ...
└── frontend/
    ├── src/
    ├── components/
    ├── context/
    └── ...
```

---

## 👌 Acknowledgements

* [React](https://reactjs.org/)
* [Express.js](https://expressjs.com/)
* [MongoDB](https://www.mongodb.com/)
* [Socket.IO](https://socket.io/)
* [Cloudinary](https://cloudinary.com/)
* [Material UI](https://mui.com/)

---

## 📢 Contact

Feel free to reach out or connect with me on:

* GitHub: [@Anshit-Sony](https://github.com/your-username)
* LinkedIn: [Anshit Sony](https://www.linkedin.com/in/anshit-sony-454880250/)

---

