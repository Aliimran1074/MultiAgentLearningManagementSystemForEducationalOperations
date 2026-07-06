const mongoose = require("mongoose");
const assignmentModel = require("../../Models/Assignment/assignment.model");
const assignmentUploadingModel = require("../../Models/Assignment/assignmentUploading.model");

const getTeacherAssignmentSubmissions = async (req, res) => {
  try {

    const { teacherId } = req.params;

    const teacherObjectId = new mongoose.Types.ObjectId(teacherId);

    const submissions = await assignmentUploadingModel.aggregate([

      // Assignment Details
      {
        $lookup: {
          from: "assignmentmodels",
          localField: "assignmentId",
          foreignField: "_id",
          as: "assignment"
        }
      },
      {
        $unwind: "$assignment"
      },

      // Sirf is teacher ke assignments
      {
        $match: {
          "assignment.createdBy": teacherObjectId
        }
      },

      // Student
      {
        $lookup: {
          from: "studentregistrationmodels",
          localField: "studentId",
          foreignField: "_id",
          as: "student"
        }
      },
      {
        $unwind: "$student"
      },

      // Course
      {
        $lookup: {
          from: "coursemodels",
          localField: "assignment.course",
          foreignField: "_id",
          as: "course"
        }
      },
      {
        $unwind: "$course"
      },

      {
        $project: {

          _id: 0,

          submissionId: "$_id",

          assignmentId: "$assignment._id",
          assignmentTitle: "$assignment.title",

          courseId: "$course._id",
          courseName: "$course.name",

          studentId: "$student._id",
          studentName: "$student.name",

          uploadedFile: "$uploadedFile",

          submittedAt: "$submittedAt",

          status: "$status",

          marks: "$marks",

          maxMarks: "$maxMarks",

          marksAssigned: "$marksAssigned"

        }
      },

      {
        $sort: {
          submittedAt: -1
        }
      }

    ]);

    return res.json(submissions);

  }
  catch (error) {

    console.log(error);

    return res.status(500).json({
      message: error.message
    });

  }
};

module.exports = {
  getTeacherAssignmentSubmissions
}