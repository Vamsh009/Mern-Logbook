import ratelimit from "../config/upstash.js";

const ratelimiter = async (req, res, next) => {
  try {
    const identifier= req.ip +Date.now(); // Use IP address as the key for rate limiting
    const { sucess } = await ratelimit.limit(identifier)
    if (!sucess) {
      return res.status(429).json({ message: "Too many requests, please try again later" });
    }
    next();
  } catch (error) {
    console.error("Error in rate limiter middleware:", error);
    next(error); // Pass the error to the next middleware 
  }
}
export default ratelimiter;

