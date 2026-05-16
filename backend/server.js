// import express from 'express';
import express from 'express';
import cors from 'cors';
import dotenv from "dotenv";
import path from 'path'
import { fileURLToPath } from 'url';


import notesRoute from './routes/notesRoute.js';
import { connectDB } from './config/db.js';
import ratelimiter from './middleware/rateLimiter.js';
import authRoutes from './routes/authRoutes.js';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, ".env") });




const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());//middleware allows to parse JSON bodies

if (process.env.NODE_ENV !== "production") {

  app.use(cors({
    origin: (origin, callback) => {
      if (!origin) {
        return callback(null, true);
      }

      try {
        const { hostname } = new URL(origin);
        const allowedHosts = ["localhost", "127.0.0.1"];

        if (allowedHosts.includes(hostname)) {
          return callback(null, true);
        }
      } catch (error) {
        return callback(error);
      }

      return callback(new Error(`CORS blocked origin: ${origin}`));
    },
    credentials: true,
  }));
}

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);   // simple custom middleware
  next();
})

//  app.use('/api' , ratelimiter); // Apply the rate limiter middleware to all routes

app.use('/api/auth', authRoutes);
app.use('/api/notes', notesRoute);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")))

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  });
}



connectDB().then(() => {

  app.listen(PORT, () => {
    console.log('Server is running on port 3000');
  });
});





// 
