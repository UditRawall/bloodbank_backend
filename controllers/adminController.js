import userModel from "../models/userModel.js";

// DONOR RECORDS
export const getAllDonorController = async (req, res) => {
  try {
    const donorList = await userModel
      .find({
        role: "Donor",
      })
      .sort({ createdAt: -1 });

    return res.status(200).send({
      success: true,
      totalDonors: donorList.length,
      message: "Donor List Fetched Successfully",
      donorList,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error in getting Donor Records",
      error,
    });
  }
};

// HOSPITAL RECORDS
export const getAllHospitalController = async (req, res) => {
  try {
    const hospitalList = await userModel
      .find({
        role: "Hospital",
      })
      .sort({ createdAt: -1 });

    return res.status(200).send({
      success: true,
      totalHospitals: hospitalList.length,
      message: "Hospital List Fetched Successfully",
      hospitalList,
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

// ORGANIZATION RECORDS
export const getAllOrganizationController = async (req, res) => {
  try {
    const organizationList = await userModel
      .find({
        role: "Organization",
      })
      .sort({ createdAt: -1 });

    return res.status(200).send({
      success: true,
      totalOrganizations: organizationList.length,
      message: "Organization List Fetched Successfully",
      organizationList,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error in getting Organization Records",
      error,
    });
  }
};

// DELETE DONOR
export const deleteRecordController = async (req, res) => {
  try {
    await userModel.findByIdAndDelete(req.params.id);
    return res.status(200).send({
      success: true,
      message: "Record has been deleted successfully..!!",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error in deleting Donor",
      error,
    });
  }
};
