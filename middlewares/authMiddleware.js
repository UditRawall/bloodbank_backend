import jwt from "jsonwebtoken";

// we can use this middleware to any route to check whether the user is authenticated(has token) and then verifying the token
export const authMiddleware = (req, res, next) => {
  try {
    const token = req.headers["authorization"]?.split(" ")[1];

    // decode contains the original data /payload
    jwt.verify(token, process.env.JWT_SECRET, (err, decode) => {
      if (err) {
        return res.status(401).send({
          success: false,
          message: "Auth failed(error in token)",
        });
      } else {
        req.body.decodeID = decode.userId;
        next();
      }
    });
  } catch (err) {
    console.log(err);
    return res.status(401).send({
      success: false,
      err,
      message:
        "Auth failed(not a verified user or might be some error in authentication)",
    });
  }
};
