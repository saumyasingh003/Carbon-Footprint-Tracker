# 🌍 Vashudha - Backend Server

This is the Node.js / Express backend server for the Vashudha Carbon Footprint Tracker.

For full project documentation, features, metropolitan emissions data, and comprehensive setup instructions, please refer to the main [Root README.md](../README.md).

## 🚀 Quick Start

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Configure Environment Variables**
   Create a `.env` file in this directory and add the following keys:
   ```env
   PORT=5000
   MONGO_URI=<your_mongodb_uri>
   JWT_SECRET=<your_jwt_secret>
   GEMINI_API_KEY=<your_gemini_api_key>
   CLOUDINARY_CLOUD_NAME=<your_cloudinary_name>
   CLOUDINARY_API_KEY=<your_cloudinary_key>
   CLOUDINARY_API_SECRET=<your_cloudinary_secret>
   ```

3. **Run the Development Server**
   ```bash
   npm run dev
   ```

## 🛠️ Technology Stack

- **Runtime:** Node.js (Express v5)
- **Database:** MongoDB (via Mongoose)
- **AI Engine:** Google Gemini AI API (`@google/generative-ai`)
- **Real-Time events:** Socket.io
- **Media Uploads:** Cloudinary & Multer
