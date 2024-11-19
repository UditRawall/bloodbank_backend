import userModel from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const registerController = async (req, res) => {
  try {
    const existingUser = await userModel.findOne({
      email: req.body.email,
    });

    // validation
    if (existingUser) {
      return res.status(200).send({
        success: false,
        message: "User already exists",
      });
    }

    // creating salt for hash pwd
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(req.body.password, salt);
    req.body.password = hashPassword;

    // rest data
    const user = new userModel(req.body);
    await user.save();
    return res.status(201).send({
      success: true,
      message: "User registered successfully",
      user,
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      success: false,
      message: "Error in Register API",
      err,
    });
  }
};

export const loginController = async (req, res) => {
  try {
    const existingUser = await userModel.findOne({ email: req.body.email });

    if (!existingUser) {
      return res.status(500).send({
        success: false,
        message: "Invalid Credentials (Email not found)",
      });
    }

    if (existingUser.role !== req.body.role) {
      return res.status(500).send({
        success: false,
        message: "Invalid Credentials (Role don't match)",
      });
    }

    const pwd = await bcrypt.compare(req.body.password, existingUser.password);
    if (!pwd) {
      res.status(500).send({
        success: false,
        message: "Invalid Credentials (Password don't match)",
      });
    }

    // generating token
    const token = jwt.sign(
      { userId: existingUser._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );
    res.status(200).send({
      success: true,
      message: "Login Successfully",
      token,
      existingUser,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).send({
      success: false,
      message: "Error in login API",
      err,
    });
  }
};

export const currentUserController = async (req, res) => {
  try {
    const user = await userModel.findOne({ _id: req.body.decodeID });
    return res.status(200).send({
      success: true,
      message: "User fetched successfully(authenticated user)",
      user,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).send({
      success: false,
      message: "Unable to get current user.",
      err,
    });
  }
};
