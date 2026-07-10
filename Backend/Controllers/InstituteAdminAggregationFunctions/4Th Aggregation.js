
const courseEnrollmentModel = require("../../Models/CourseModels/courseEnrollment.model");
const studentRegistrationModel = require("../../models/UserModels/studentRegistration.model");
const staffModel = require("../../models/UserModels/staff.model");
const courseModel = require("../../models/CourseModels/course.model");
const assignmentModel = require("../../models/Assignment/assignment.model");
const quizModel = require("../../models/QuizModel/quiz.model");
const studentSubjectPerformanceModel = require("../../models/ResultModels/StudentPerSubjectPerformance.model");
const counsellingModel = require("../../models/Consuelling Models/counselling.model");
const subscriptionModel = require("../../models/SuperAdminModels/subscription.model");
const mongoose = require("mongoose");


const getFacultyDirectory = async (instituteId) => {

    const facultyData = await staffModel.aggregate([

        // Only instructors
        {
            $match:{
                instituteId: instituteId,
                designation:"Instructor"
            }
        },


        // Join courses taught by teacher
        {
            $lookup:{
                from:"coursemodels",
                localField:"_id",
                foreignField:"instructorTeached",
                as:"courses"
            }
        },


        // Join student performance
        {
            $lookup:{
                from:"studentsubjectperformancemodels",
                localField:"_id",
                foreignField:"teacherId",
                as:"performance"
            }
        },


        // Assignments created by teacher
        {
            $lookup:{
                from:"assignmentmodels",
                localField:"_id",
                foreignField:"createdBy",
                as:"assignments"
            }
        },


        // Quizzes created by teacher
        {
            $lookup:{
                from:"quizmodels",
                localField:"_id",
                foreignField:"createdBy",
                as:"quizzes"
            }
        },


        // Calculate metrics
        {
            $addFields:{


                coursesTeaching:{
                    $size:"$courses"
                },


                contentUploaded:{
                    $add:[
                        {
                            $size:"$assignments"
                        },
                        {
                            $size:"$quizzes"
                        }
                    ]
                },


                totalStudents:{
                    $size:{
                        $setUnion:[
                            "$performance.studentId"
                        ]
                    }
                },


                avgStudentSuccess:{
                    $round:[
                        {
                            $avg:"$performance.percentage"
                        },
                        0
                    ]
                },


                successTrend:{
                    $round:[
                        {
                            $avg:{
                                $subtract:[
                                    "$performance.percentage",
                                    50
                                ]
                            }
                        },
                        1
                    ]
                }

            }
        },


        // Final response format
        {
            $project:{


                name:1,

                email:1,

                mobileNo:1,

                department:1,


                coursesTeaching:1,

                totalStudents:1,

                avgStudentSuccess:{
                    $ifNull:[
                        "$avgStudentSuccess",
                        0
                    ]
                },


                successTrend:{
                    $ifNull:[
                        "$successTrend",
                        0
                    ]
                },


                contentUploaded:1,


                performance:{
                    $cond:[

                        {
                            $gte:[
                                "$avgStudentSuccess",
                                80
                            ]
                        },

                        "Excellent",


                        {
                            $cond:[
                                {
                                    $gte:[
                                        "$avgStudentSuccess",
                                        60
                                    ]
                                },

                                "Good",

                                "Needs Attention"
                            ]
                        }

                    ]
                }

            }

        },


        // Sort highest performer first
        {
            $sort:{
                avgStudentSuccess:-1
            }
        }


    ])


    return facultyData;

}



module.exports = {
    getFacultyDirectory
}