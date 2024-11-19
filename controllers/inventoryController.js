import mongoose from "mongoose";
import inventoryModel from "../models/inventoryModel.js";
import userModel from "../models/userModel.js";

export const createInventoryController = async (req, res) => {
  try {
    const { email } = req.body;
    // validation
    const user = await userModel.findOne({ email });
    // console.log(user);
    if (!user) {
      // throw new Error(
      //   "User not found! Enter a valid Email Address from which you registered"
      // );
      return res.status(201).send({
        success: false,
        message:
          "User not found! Enter a valid Email Address from which you registered",
      });
    }
    if (req.body.inventoryType === "In" && user.role !== "Donor") {
      // throw new Error("Only Donor can add blood");
      return res.status(201).send({
        success: false,
        message:
          "Only Donor can add blood, you have to choose 'In' Inventory Type",
      });
    }
    if (req.body.inventoryType === "Out" && user.role !== "Hospital") {
      // throw new Error("Only Hospital can send blood");
      return res.status(201).send({
        success: false,
        message:
          "Only Hospital can send blood, you have to choose 'In' Inventory Type",
      });
    }

    if (req.body.inventoryType == "Out") {
      const requestedBloodGroup = req.body.bloodGroup;
      const requestedQuanitityOfBlood = req.body.quantity;
      const organization = new mongoose.Types.ObjectId(req.body.decodeID);

      // calculate the available blood group
      const totalAvailableBlood = await inventoryModel.aggregate([
        {
          $match: {
            organization,
            inventoryType: "In",
            bloodGroup: requestedBloodGroup,
          },
        },
        {
          $group: {
            _id: "$bloodGroup",
            total: { $sum: "$quantity" },
          },
        },
      ]);

      const totalIn = totalAvailableBlood[0].total || 0;

      // TOTALOUTOFBLOOD
      const totalOutBlood = await inventoryModel.aggregate([
        {
          $match: {
            organization,
            inventoryType: "Out",
            bloodGroup: requestedBloodGroup,
          },
        },
        {
          $group: {
            _id: "$bloodGroup",
            total: { $sum: "$quantity" },
          },
        },
      ]);
      const totalOut = totalOutBlood[0]?.total || 0;

      // calculating the available blood after giving it to other hospitals
      const availableBlood = totalIn - totalOut;

      if (availableBlood < requestedQuanitityOfBlood) {
        return res.status(201).send({
          success: false,
          message: `Only ${availableBlood} ml of ${requestedBloodGroup} blood is available`,
        });
      }
      req.body.hospital = user._id;
    } else {
      req.body.donor = user._id;
    }

    // save the inventory data
    const inventory = new inventoryModel(req.body);
    await inventory.save();

    return res.status(200).send({
      success: true,
      message: "New Blood Record Added",
      inventory,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).send({
      success: false,
      message: "Error in create inventory API",
      err,
    });
  }
};

export const getInventoryController = async (req, res) => {
  try {
    // console.log(req.body.decodeID);
    const inventory = await inventoryModel
      .find({ organization: req.body.decodeID })
      .populate("donor")
      .populate("hospital")
      .populate("organization")
      .sort({ createdAt: -1 });

    // console.log(inventory);
    return res.status(200).send({
      success: true,
      message: "Successfully get all inventories",
      inventory,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).send({
      success: false,
      message: "Error in get inventory API",
      err,
    });
  }
};

export const getInventoryHospitalController = async (req, res) => {
  try {
    const inventory = await inventoryModel
      .find(req.body.filters)
      .populate("donor")
      .populate("hospital")
      .populate("organization")
      .sort({ createdAt: -1 });

    // console.log(inventory);
    return res.status(200).send({
      success: true,
      message: "Successfully get all consumers records for hospital",
      inventory,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).send({
      success: false,
      message: "Error in getting consumer recorrsd for hospital",
      err,
    });
  }
};

// GET DONOR RECORDS
export const getDonarsController = async (req, res) => {
  try {
    const organization = req.body.decodeID;

    //find donor id
    const donorId = await inventoryModel.distinct("donor", { organization });
    // console.log(donorId);
    const donors = await userModel.find({ _id: { $in: donorId } });
    return res.status(200).send({
      success: true,
      message: "Donor Record fetched successfully",
      donors,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error in get Donors Records!",
      error,
    });
  }
};

// GET HOSPITAL RECORDS
export const getHospitalController = async (req, res) => {
  try {
    const organization = req.body.decodeID;

    //find hospital id
    const hospitalId = await inventoryModel.distinct("hospital", {
      organization,
    });
    console.log(hospitalId);
    const hospitals = await userModel.find({ _id: { $in: hospitalId } });
    return res.status(200).send({
      success: true,
      message: "Hospital Record fetched successfully",
      hospitals,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error in getting Hospital Records",
      error,
    });
  }
};

// GET DONOR RELATED ORGANIZATION RECORDS
export const getDonorOrganizationController = async (req, res) => {
  try {
    const donor = req.body.decodeID;
    const organizationId = await inventoryModel.distinct("organization", {
      donor,
    });

    // finding organizations
    const organizations = await userModel.find({
      _id: { $in: organizationId },
    });

    return res.status(200).send({
      success: true,
      message: "Organization Record fetched successfully for Donor",
      organizations,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).send({
      success: false,
      message: "Error in getting Organization Records for Donor",
      error,
    });
  }
};

// GET HOSPITAL RELATED ORGANIZATION RECORDS
export const getHospitalOrganizationController = async (req, res) => {
  try {
    const hospital = req.body.decodeID;
    const organizationId = await inventoryModel.distinct("organization", {
      hospital,
    });

    // finding organizations
    const organizations = await userModel.find({
      _id: { $in: organizationId },
    });

    return res.status(200).send({
      success: true,
      message: "Organization Record for Hospital fetched successfully",
      organizations,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).send({
      success: false,
      message: "Error in getting Organization Records for Hospital",
      error,
    });
  }
};

// GET LATEST 3 INVENTORY RECORDS
export const getLatestInventoryController = async (req, res) => {
  try {
    const organization = new mongoose.Types.ObjectId(req.body.decodeID);

    const inventory = await inventoryModel
      .find({
        organization,
      })
      .limit(3)
      .sort({ createdAt: -1 });

    return res.status(200).send({
      success: true,
      message: "Successfully getting all the Inventories",
      inventory,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error  in getting recent 3 inventories",
      error,
    });
  }
};
