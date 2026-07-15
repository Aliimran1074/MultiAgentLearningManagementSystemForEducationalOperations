const instituteModel = require("../../Models/InstituteBatchesClasses/Institute.model");
const studentRegistrationModel = require("../../Models/UserModels/studentRegistration.model");
const staffModel = require("../../Models/UserModels/staff.model");
const subscriptionModel = require("../../Models/SuperAdminModels/subscription.model");

const getUserManagementDashboard = async (req, res) => {
  try {

    // ==========================
    // Dashboard Cards
    // ==========================

    const totalInstitutes = await instituteModel.countDocuments();

    const totalStudents = await studentRegistrationModel.countDocuments();

    const totalStaff = await staffModel.countDocuments();

    const totalUsers = totalStudents + totalStaff;

    const activeInstitutes = await subscriptionModel.countDocuments({
      status: "Active"
    });

    const suspendedInstitutes = await subscriptionModel.countDocuments({
      status: "Cancelled"
    });

    // ==========================
    // Institute List
    // ==========================

    const institutes = await instituteModel.aggregate([

      {
        $lookup: {
          from: "subscriptionmodels",
          localField: "_id",
          foreignField: "instituteId",
          as: "subscription"
        }
      },

      {
        $lookup: {
          from: "studentregistrationmodels",
          localField: "_id",
          foreignField: "instituteId",
          as: "students"
        }
      },    

      {
        $lookup: {
          from: "staffmodels",
          localField: "_id",
          foreignField: "instituteId",
          as: "staff"
        }
      },

      {
        $project: {

          instituteName: "$name",

          address: 1,

          contactNo: 1,

          createdAt: 1,

          totalStudents: {
            $size: "$students"
          },

          totalStaff: {
            $size: "$staff"
          },

          subscriptionStatus: {
            $ifNull: [
              {
                $arrayElemAt: [
                  "$subscription.status",
                  0
                ]
              },
              "No Subscription"
            ]
          },

          subscriptionStartDate: {
            $arrayElemAt: [
              "$subscription.startDate",
              0
            ]
          },

          subscriptionEndDate: {
            $arrayElemAt: [
              "$subscription.endDate",
              0
            ]
          }

        }
      }

    ]);

    res.status(200).json({
      success: true,

      dashboard: {
        totalInstitutes,
        totalUsers,
        totalStudents,
        totalStaff,
        activeInstitutes,
        suspendedInstitutes
      },

      institutes

    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};

module.exports = {
  getUserManagementDashboard
};