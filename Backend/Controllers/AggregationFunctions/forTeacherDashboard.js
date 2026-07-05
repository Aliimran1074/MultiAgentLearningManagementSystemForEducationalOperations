// const mongoose = require("mongoose")

// const courseModel = require("../../Models/CourseModels/course.model")
// const studentModel = require("../../Models/UserModels/studentRegistration.model")
// const appointmentModel = require("../../Models/Consuelling Models/appointment.model")
// const quizModel = require("../../Models/QuizModel/quiz.model")
// const assignmentModel = require("../../Models/Assignment/assignment.model")
// const courseContentModel = require("../../Models/CourseModels/courseContent.model")
// const staffAttendanceModel = require("../../Models/Attendence/staffAttendence.model")

// const teacherDashboardInfo = async (req, res) => {
//   try {
//     const { teacherId } = req.params
//     const teacherObjectId = new mongoose.Types.ObjectId(teacherId)

//     // =========================
//     // COURSES
//     // =========================
//     const courses = await courseModel.aggregate([
//       {
//         $match: { instructorTeached: teacherObjectId }
//       },

//       {
//         $lookup: {
//           from: "staffmodels",
//           localField: "instructorTeached",
//           foreignField: "_id",
//           as: "teacher"
//         }
//       },
//       { $unwind: "$teacher" },

//       {
//         $lookup: {
//           from: "courseenrollmentmodels",
//           localField: "_id",
//           foreignField: "courseId",
//           as: "enrollments"
//         }
//       },

//       {
//         $lookup: {
//           from: "studentregistrationmodels",
//           localField: "enrollments.studentId",
//           foreignField: "_id",
//           as: "students"
//         }
//       },

//       {
//         $lookup: {
//           from: "coursecontentmodels",
//           localField: "_id",
//           foreignField: "courseId",
//           as: "content"
//         }
//       },

//       {
//         $lookup: {
//           from: "appointmentrequestmodels",
//           localField: "_id",
//           foreignField: "courseId",
//           as: "appointments"
//         }
//       },

//       {
//         $project: {
//           teacher: {
//             _id: "$teacher._id",
//             name: "$teacher.name",
//             designation: "$teacher.designation",
//             instituteId: "$teacher.instituteId"
//           },

//           course: {
//             _id: "$_id",
//             name: "$name",
//             class: "$ForClass",
//             semester: "$ForSemester"
//           },

//           students: {
//             $map: {
//               input: "$students",
//               as: "s",
//               in: {
//                 _id: "$$s._id",
//                 name: "$$s.name",
//                 status: "$$s.statusOfStudent",
//                 contact:"$$s.contactNo"

//               }
//             }
//           },

//           totalStudents: { $size: "$students" },
//           totalContent: { $size: "$content" },

//           totalAppointments: { $size: "$appointments" },
//           pendingAppointments: {
//             $size: {
//               $filter: {
//                 input: "$appointments",
//                 as: "a",
//                 cond: { $eq: ["$$a.status", "pending"] }
//               }
//             }
//           }
//         }
//       }
//     ])

//     // =========================
//     // UNIQUE STUDENTS (FIXED)
//     // =========================
//     const studentMap = new Map()

//     courses.forEach(course => {
//       course.students.forEach(student => {
//         if (!studentMap.has(student._id.toString())) {
//           studentMap.set(student._id.toString(), student)
//         }
//       })
//     })

//     const uniqueStudents = Array.from(studentMap.values())

//     // =========================
//     // APPOINTMENTS
//     // =========================
//     const appointments = await appointmentModel.find({
//       teacherId: teacherObjectId
//     })

//     // =========================
//     // QUIZ STATS
//     // =========================
//     const quizStats = await quizModel.aggregate([
//       {
//         $match: { createdBy: teacherObjectId }
//       },
//       {
//         $lookup: {
//           from: "quizuploadingmodels",
//           localField: "_id",
//           foreignField: "quizId",
//           as: "submissions"
//         }
//       },
//       {
//         $group: {
//           _id: null,
//           totalQuizzes: { $sum: 1 },
//           totalSubmissions: { $sum: { $size: "$submissions" } },
//           checkedSubmissions: {
//             $sum: {
//               $size: {
//                 $filter: {
//                   input: "$submissions",
//                   as: "s",
//                   cond: { $eq: ["$$s.status", "checked"] }
//                 }
//               }
//             }
//           }
//         }
//       }
//     ])

//     // =========================
//     // ASSIGNMENT STATS
//     // =========================
//     const assignmentStats = await assignmentModel.aggregate([
//       {
//         $match: { createdBy: teacherObjectId }
//       },
//       {
//         $lookup: {
//           from: "assignmentuploadingmodels",
//           localField: "_id",
//           foreignField: "assignmentId",
//           as: "submissions"
//         }
//       },
//       {
//         $group: {
//           _id: null,
//           totalAssignments: { $sum: 1 },
//           totalSubmissions: { $sum: { $size: "$submissions" } },
//           checkedSubmissions: {
//             $sum: {
//               $size: {
//                 $filter: {
//                   input: "$submissions",
//                   as: "s",
//                   cond: { $eq: ["$$s.status", "checked"] }
//                 }
//               }
//             }
//           }
//         }
//       }
//     ])

//     // =========================
//     // CONTENT STATS (FIXED)
//     // =========================
//     const contentStats = await courseContentModel.aggregate([
//       {
//         $lookup: {
//           from: "coursemodels",
//           localField: "courseId",
//           foreignField: "_id",
//           as: "course"
//         }
//       },
//       { $unwind: "$course" },

//       {
//         $match: {
//           "course.instructorTeached": teacherObjectId
//         }
//       },

//       {
//         $group: {
//           _id: "$courseId",
//           totalContent: { $sum: 1 }
//         }
//       }
//     ])

//     // =========================
//     // ATTENDANCE
//     // =========================
//     const attendanceStats = await staffAttendanceModel.find({
//       staffId: teacherObjectId
//     })

//     // =========================
//     // FINAL RESPONSE
//     // =========================
//     return res.json({
//       teacher: courses[0]?.teacher || {},

//       summary: {
//         totalCourses: courses.length,
//         totalStudents: uniqueStudents.length,

//         totalAppointments: appointments.length,
//         pendingAppointments: appointments.filter(a => a.status === "pending").length,

//         totalContent: contentStats.reduce((sum, c) => sum + c.totalContent, 0),

//         totalQuizzes: quizStats[0]?.totalQuizzes || 0,
//         totalQuizSubmissions: quizStats[0]?.totalSubmissions || 0,
//         checkedQuizSubmissions: quizStats[0]?.checkedSubmissions || 0,

//         totalAssignments: assignmentStats[0]?.totalAssignments || 0,
//         totalAssignmentSubmissions: assignmentStats[0]?.totalSubmissions || 0,
//         checkedAssignmentSubmissions: assignmentStats[0]?.checkedSubmissions || 0,

//         attendance: attendanceStats
//       },

//       courses,
//       students: uniqueStudents,
//       appointments,
//       contentStats,
//       quizStats,
//       assignmentStats,
//       attendanceStats
//     })

//   } catch (error) {
//     console.log(error)
//     return res.status(500).json({ message: error.message })
//   }
// }

// module.exports = { teacherDashboardInfo }
// const mongoose = require("mongoose")
// const courseModel = require("../../Models/CourseModels/course.model")
// const studentModel = require("../../Models/UserModels/studentRegistration.model")
// const appointmentModel = require("../../Models/Consuelling Models/appointment.model")
// const quizModel = require("../../Models/QuizModel/quiz.model")
// const assignmentModel = require("../../Models/Assignment/assignment.model")
// const courseContentModel = require("../../Models/CourseModels/courseContent.model")
// const staffAttendanceModel = require("../../Models/Attendence/staffAttendence.model")

// const teacherDashboardInfo = async (req, res) => {
//   try {
//     const { teacherId } = req.params
//     const teacherObjectId = new mongoose.Types.ObjectId(teacherId)

//     // =========================
//     // COURSES + STUDENTS INSIDE
//     // =========================
//     const courses = await courseModel.aggregate([
//       { $match: { instructorTeached: teacherObjectId } },

//       {
//         $lookup: {
//           from: "staffmodels",
//           localField: "instructorTeached",
//           foreignField: "_id",
//           as: "teacher"
//         }
//       },
//       { $unwind: "$teacher" },

//       {
//         $lookup: {
//           from: "courseenrollmentmodels",
//           localField: "_id",
//           foreignField: "courseId",
//           as: "enrollments"
//         }
//       },

//       {
//         $lookup: {
//           from: "studentregistrationmodels",
//           localField: "enrollments.studentId",
//           foreignField: "_id",
//           as: "students"
//         }
//       },

//       {
//         $project: {
//           teacher: {
//             _id: "$teacher._id",
//             name: "$teacher.name",
//             designation: "$teacher.designation",
//             instituteId: "$teacher.instituteId"
//           },

//           course: {
//             _id: "$_id",
//             name: "$name",
//             class: "$ForClass",
//             semester: "$ForSemester"
//           },

//           students: {
//             $map: {
//               input: "$students",
//               as: "s",
//               in: {
//                 _id: "$$s._id",
//                 name: "$$s.name",
//                 contact: "$$s.contactNo",
//                 status: "$$s.statusOfStudent"
//               }
//             }
//           }
//         }
//       }
//     ])

//     // =========================
//     // UNIQUE STUDENTS
//     // =========================
//     const studentMap = new Map()

//     courses.forEach(course => {
//       course.students.forEach(stu => {
//         studentMap.set(stu._id.toString(), stu)
//       })
//     })

//     const uniqueStudents = Array.from(studentMap.values())

//     // =========================
//     // APPOINTMENTS
//     // =========================
//     const appointments = await appointmentModel.find({
//       teacherId: teacherObjectId
//     })

//     // =========================
//     // QUIZ STATS
//     // =========================
//     const quizStats = await quizModel.aggregate([
//       { $match: { createdBy: teacherObjectId } },
//       {
//         $lookup: {
//           from: "quizuploadingmodels",
//           localField: "_id",
//           foreignField: "quizId",
//           as: "submissions"
//         }
//       },
//       {
//         $group: {
//           _id: null,
//           totalQuizzes: { $sum: 1 },
//           totalSubmissions: { $sum: { $size: "$submissions" } },
//           checkedSubmissions: {
//             $sum: {
//               $size: {
//                 $filter: {
//                   input: "$submissions",
//                   as: "s",
//                   cond: { $eq: ["$$s.status", "checked"] }
//                 }
//               }
//             }
//           }
//         }
//       }
//     ])

//     // =========================
//     // ASSIGNMENTS (IMPORTANT FIX)
//     // =========================
//     const assignments = await assignmentModel.aggregate([
//       { $match: { createdBy: teacherObjectId } },
//       {
//         $lookup: {
//           from: "assignmentuploadingmodels",
//           localField: "_id",
//           foreignField: "assignmentId",
//           as: "submissions"
//         }
//       },
//       {
//         $project: {
//           _id: 1,
//           title: 1,
//           course: 1,
//           createdAt: 1,
//           submissions: 1,
//           totalSubmissions: { $size: "$submissions" },
//           checkedSubmissions: {
//             $size: {
//               $filter: {
//                 input: "$submissions",
//                 as: "s",
//                 cond: { $eq: ["$$s.status", "checked"] }
//               }
//             }
//           }
//         }
//       }
//     ])

//     // =========================
//     // CONTENT
//     // =========================
//     const contentStats = await courseContentModel.aggregate([
//       {
//         $lookup: {
//           from: "coursemodels",
//           localField: "courseId",
//           foreignField: "_id",
//           as: "course"
//         }
//       },
//       { $unwind: "$course" },
//       {
//         $match: {
//           "course.instructorTeached": teacherObjectId
//         }
//       },
//       {
//         $group: {
//           _id: "$courseId",
//           totalContent: { $sum: 1 }
//         }
//       }
//     ])

//     // =========================
//     // ATTENDANCE
//     // =========================
//     const attendanceStats = await staffAttendanceModel.find({
//       staffId: teacherObjectId
//     })

//     // =========================
//     // FINAL RESPONSE
//     // =========================
//     return res.json({
//       teacher: courses[0]?.teacher || {},

//       summary: {
//         totalCourses: courses.length,
//         totalStudents: uniqueStudents.length,
//         totalAppointments: appointments.length,
//         pendingAppointments: appointments.filter(a => a.status === "pending").length,

//         totalQuizzes: quizStats[0]?.totalQuizzes || 0,
//         totalQuizSubmissions: quizStats[0]?.totalSubmissions || 0,
//         checkedQuizSubmissions: quizStats[0]?.checkedSubmissions || 0,

//         totalAssignments: assignments.length,
//         totalAssignmentSubmissions: assignments.reduce((a, b) => a + b.totalSubmissions, 0),
//         checkedAssignmentSubmissions: assignments.reduce((a, b) => a + b.checkedSubmissions, 0),

//         totalContent: contentStats.reduce((sum, c) => sum + c.totalContent, 0),
//         attendance: attendanceStats
//       },

//       courses,
//       students: uniqueStudents,
//       appointments,

//       // 🔥 IMPORTANT: FULL ASSIGNMENTS RETURN
//       assignments,

//       quizStats,
//       contentStats,
//       attendanceStats
//     })

//   } catch (error) {
//     console.log(error)
//     return res.status(500).json({ message: error.message })
//   }
// }

// module.exports = { teacherDashboardInfo }

const mongoose = require("mongoose")
const courseModel = require("../../Models/CourseModels/course.model")
const studentModel = require("../../Models/UserModels/studentRegistration.model")
const appointmentModel = require("../../Models/Consuelling Models/appointment.model")
const quizModel = require("../../Models/QuizModel/quiz.model")
const assignmentModel = require("../../Models/Assignment/assignment.model")
const courseContentModel = require("../../Models/CourseModels/courseContent.model")
const staffAttendanceModel = require("../../Models/Attendence/staffAttendence.model")

const teacherDashboardInfo = async (req, res) => {
  try {
    const { teacherId } = req.params
    const teacherObjectId = new mongoose.Types.ObjectId(teacherId)

    // =========================
    // COURSES + STUDENTS
    // =========================
    const courses = await courseModel.aggregate([
      { $match: { instructorTeached: teacherObjectId } },

      {
        $lookup: {
          from: "staffmodels",
          localField: "instructorTeached",
          foreignField: "_id",
          as: "teacher"
        }
      },
      { $unwind: "$teacher" },

      {
        $lookup: {
          from: "courseenrollmentmodels",
          localField: "_id",
          foreignField: "courseId",
          as: "enrollments"
        }
      },

      {
        $lookup: {
          from: "studentregistrationmodels",
          localField: "enrollments.studentId",
          foreignField: "_id",
          as: "students"
        }
      },

      {
        $project: {
          teacher: {
            _id: "$teacher._id",
            name: "$teacher.name",
            designation: "$teacher.designation",
            instituteId: "$teacher.instituteId"
          },

          course: {
            _id: "$_id",
            name: "$name",
            class: "$ForClass",
            semester: "$ForSemester"
          },

          students: {
            $map: {
              input: "$students",
              as: "s",
              in: {
                _id: "$$s._id",
                name: "$$s.name",
                contact: "$$s.contactNo",
                status: "$$s.statusOfStudent"
              }
            }
          }
        }
      }
    ])

    // =========================
    // UNIQUE STUDENTS
    // =========================
    const studentMap = new Map()

    courses.forEach(course => {
      course.students.forEach(stu => {
        studentMap.set(stu._id.toString(), stu)
      })
    })

    const uniqueStudents = Array.from(studentMap.values())

    // =========================
    // APPOINTMENTS
    // =========================
    const appointments = await appointmentModel.find({
      teacherId: teacherObjectId
    })

    // =========================
    // QUIZ STATS
    // =========================
    const quizStats = await quizModel.aggregate([
      { $match: { createdBy: teacherObjectId } },
      {
        $lookup: {
          from: "quizuploadingmodels",
          localField: "_id",
          foreignField: "quizId",
          as: "submissions"
        }
      },
      {
        $group: {
          _id: null,
          totalQuizzes: { $sum: 1 },
          totalSubmissions: { $sum: { $size: "$submissions" } },
          checkedSubmissions: {
            $sum: {
              $size: {
                $filter: {
                  input: "$submissions",
                  as: "s",
                  cond: { $eq: ["$$s.status", "checked"] }
                }
              }
            }
          }
        }
      }
    ])

    // =========================
    // ASSIGNMENTS (FIXED)
    // =========================
    const assignments = await assignmentModel.aggregate([
      { $match: { createdBy: teacherObjectId } },

      {
        $lookup: {
          from: "assignmentuploadingmodels",
          localField: "_id",
          foreignField: "assignmentId",
          as: "submissions"
        }
      },

      {
        $project: {
          _id: 1,
          title: 1,
          course: 1,
          createdAt: 1,
          submissions: 1,

          totalSubmissions: { $size: "$submissions" },

          checkedSubmissions: {
            $size: {
              $filter: {
                input: "$submissions",
                as: "s",
                cond: { $eq: ["$$s.status", "checked"] }
              }
            }
          }
        }
      }
    ])

    // =========================
    // CONTENT
    // =========================
    const contentStats = await courseContentModel.aggregate([
      {
        $lookup: {
          from: "coursemodels",
          localField: "courseId",
          foreignField: "_id",
          as: "course"
        }
      },
      { $unwind: "$course" },

      {
        $match: {
          "course.instructorTeached": teacherObjectId
        }
      },

      {
        $group: {
          _id: "$courseId",
          totalContent: { $sum: 1 }
        }
      }
    ])

    // =========================
    // ATTENDANCE
    // =========================
    const attendanceStats = await staffAttendanceModel.find({
      staffId: teacherObjectId
    })

    // =========================
    // RESPONSE
    // =========================
    return res.json({
      teacher: courses[0]?.teacher || {},

      summary: {
        totalCourses: courses.length,
        totalStudents: uniqueStudents.length,

        totalAppointments: appointments.length,
        pendingAppointments: appointments.filter(a => a.status === "pending").length,

        totalQuizzes: quizStats[0]?.totalQuizzes || 0,
        totalQuizSubmissions: quizStats[0]?.totalSubmissions || 0,
        checkedQuizSubmissions: quizStats[0]?.checkedSubmissions || 0,

        totalAssignments: assignments.length,
        totalAssignmentSubmissions: assignments.reduce((a, b) => a + b.totalSubmissions, 0),
        checkedAssignmentSubmissions: assignments.reduce((a, b) => a + b.checkedSubmissions, 0),

        totalContent: contentStats.reduce((sum, c) => sum + c.totalContent, 0),

        attendance: attendanceStats
      },

      courses,
      students: uniqueStudents,
      appointments,

      // 🔥 IMPORTANT
      assignments,

      quizStats,
      contentStats,
      attendanceStats
    })

  } catch (error) {
    console.log(error)
    return res.status(500).json({ message: error.message })
  }
}

module.exports = { teacherDashboardInfo }