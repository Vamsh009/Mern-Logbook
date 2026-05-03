// import express from 'express';
import express from 'express';
import cors from 'cors';
import dotenv from "dotenv";


import notesRoute from './routes/notesRoute.js';
import { connectDB } from './config/db.js';
import ratelimiter from './middleware/rateLimiter.js';


dotenv.config();




const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());//middleware allows to parse JSON bodies
app.use(cors({
  origin: 'http://localhost:5173', // Allow requests from this origin
})); // Enable CORS for all routes

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);   // simple custom middleware
  next();
})

//  app.use('/api' , ratelimiter); // Apply the rate limiter middleware to all routes


app.use('/api/notes', notesRoute);



connectDB().then(() => {

  app.listen(PORT, () => {
    console.log('Server is running on port 3000');
  });
});





// 