// const jwt = require('jsonwebtoken')

// const verifyToken = (req, res, next) => {
//     let token;
//     let authHeader = req.headers.authorization

//     if (authHeader && authHeader.startsWith("Bearer"))
//         token = authHeader.split(" ")[1]

//     if (!token)
//         return res.status(401).json({ message: "No token , authorization failed" })
//     try {
//         const decode = jwt.verify(token, process.env.JWT_SECRET)
//         req.user = decode;
//         console.log("the decoded user is :", req.user)
//         next();

//     } catch (error) {
//         next(error)
//     }


// }

// module.exports = verifyToken


const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  console.log('Authorization header:', authHeader);

  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
      console.log('Decoded token payload:', decoded);
      next();
    } catch (err) {
      console.error('JWT verification failed:', err.message);
      return res.status(401).json({ message: 'Invalid token' });
    }
  } else {
    console.log('No token found in Authorization header');
    return res.status(401).json({ message: 'No token, authorization failed' });
  }
};

module.exports = verifyToken;
