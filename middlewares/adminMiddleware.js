// middleware just to check whether the user is admin or not
import userModel from "../models/userModel.js";
export const adminMiddleware = async (req, res, next) => {
  try {
    const user = await userModel.findById(req.body.decodeID);

    // check admin
    if (user?.role !== "Admin") {
      return res.status(401).send({
        success: false,
        message: "Auth failed, user is not admin",
      });
    } else {
      next();
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Auth failed, there is some error in admin middleware function",
      error,
    });
  }
};
