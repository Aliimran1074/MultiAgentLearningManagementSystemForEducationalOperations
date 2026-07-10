const mongoose = require("mongoose");
const studentRegistrationModel = require("../../Models/UserModels/studentRegistration.model");
const staffModel = require("../../Models/UserModels/staff.model");
const courseModel = require("../../Models/CourseModels/course.model");
const assignmentModel = require("../../Models/Assignment/assignment.model");
const quizModel = require("../../Models/QuizModel/quiz.model");
const subscriptionModel = require("../../Models/SuperAdminModels/subscription.model");


const instituteDashboardAggregation = async (instituteId) => {

    const instituteObjectId = new mongoose.Types.ObjectId(instituteId);

    console.log("Institute ID:", instituteObjectId);

    const students = await studentRegistrationModel.find({});

    console.log("All Students:");
    console.log(students);

    const matchedStudents = await studentRegistrationModel.find({
        instituteId: instituteObjectId
    });

    console.log("Matched Students:");
    console.log(matchedStudents);
    const [
        studentStats,
        staffStats,
        courseStats,
        assignmentStats,
        quizStats,
        subscriptionStats
    ] = await Promise.all([


        // Students
    studentRegistrationModel.aggregate([
    {
        $addFields: {
            instituteIdString: {
                $toString: "$instituteId"
            }
        }
    },
    {
        $match: {
            instituteIdString: instituteId
        }
    },
    {
        $group: {
            _id: null,
            totalStudents: {
                $sum: 1
            },
            studying: {
                $sum: {
                    $cond: [
                        { $eq: ["$statusOfStudent", "studying"] },
                        1,
                        0
                    ]
                }
            }
        }
    }
]),


        // Staff
        staffModel.aggregate([
            {
                $match:{
                    instituteId: instituteObjectId
                }
            },
            {
                $group:{
                    _id:null,
                    totalStaff:{
                        $sum:1
                    }
                }
            }
        ]),



        // Courses
        courseModel.aggregate([
            {
                $match:{
                    instituteId: instituteObjectId
                }
            },
            {
                $group:{
                    _id:null,
                    totalCourses:{
                        $sum:1
                    }
                }
            }
        ]),



        // Assignments
        assignmentModel.aggregate([
            {
                $match:{
                    instituteId: instituteObjectId
                }
            },
            {
                $group:{
                    _id:null,
                    totalAssignments:{
                        $sum:1
                    }
                }
            }
        ]),



        // Quizzes
        quizModel.aggregate([
            {
                $match:{
                    instituteId: instituteObjectId
                }
            },
            {
                $group:{
                    _id:null,
                    totalQuizzes:{
                        $sum:1
                    }
                }
            }
        ]),



        // Subscription
        subscriptionModel.aggregate([
            {
                $match:{
                    instituteId: instituteObjectId
                }
            },
            {
                $lookup:{
                    from:"subscriptionplanmodels",
                    localField:"planId",
                    foreignField:"_id",
                    as:"plan"
                }
            },
            {
                $unwind:{
                    path:"$plan",
                    preserveNullAndEmptyArrays:true
                }
            },
            {
                $project:{
                    status:1,
                    startDate:1,
                    endDate:1,
                    planName:"$plan.subscriptionName"
                }
            }
        ])

    ]);



    return {

        students:{
            total: studentStats[0]?.totalStudents || 0,
            studying: studentStats[0]?.studying || 0
        },


        staff:{
            total: staffStats[0]?.totalStaff || 0
        },


        courses:{
            total: courseStats[0]?.totalCourses || 0
        },


        assignments:{
            total: assignmentStats[0]?.totalAssignments || 0
        },


        quizzes:{
            total: quizStats[0]?.totalQuizzes || 0
        },


        subscription:
            subscriptionStats[0] || null

    };

};


module.exports = {instituteDashboardAggregation}
