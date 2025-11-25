 const jwt = require("jsonwebtoken");

 const generateToken = (user) => {
   const payload = {
     id: user.userId,
     email: user.email,
     role: user.role,
   };

   const secret = process.env.JWT_SECRET;
   const expiresIn = process.env.JWT_EXPIRES_IN || "7d";

   if (!secret) {
     throw new Error("JWT_SECRET is not defined in environment variables");
   }

   return jwt.sign(payload, secret, { expiresIn });
 };

 module.exports = generateToken;

