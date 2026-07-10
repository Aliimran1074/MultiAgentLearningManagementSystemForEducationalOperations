const mongoose = require("mongoose");

const instituteDashboardAggregation = async (instituteId) => {


    const instituteObjectId = new mongoose.Types.ObjectId(instituteId);


    const result = await mongoose.model("instituteModel").aggregate([


        // Institute find
        {
            $match:{
                _id: instituteObjectId
            }
        },


        // Students count
        {
            $lookup:{
                from:"studentregistrationmodels",
                localField:"_id",
                foreignField:"instituteId",
                as:"students"
            }
        },


        // Staff count
        {
            $lookup:{
                from:"staffmodels",
                localField:"_id",
                foreignField:"instituteId",
                as:"staff"
            }
        },


        // Departments
        {
            $lookup:{
                from:"departmentmodels",
                localField:"_id",
                foreignField:"instituteId",
                as:"departments"
            }
        },


        // Courses
        {
            $lookup:{
                from:"coursemodels",
                localField:"_id",
                foreignField:"instituteId",
                as:"courses"
            }
        },


        // Assignments
        {
            $lookup:{
                from:"assignmentmodels",
                localField:"_id",
                foreignField:"instituteId",
                as:"assignments"
            }
        },


        // Quizzes
        {
            $lookup:{
                from:"quizmodels",
                localField:"_id",
                foreignField:"instituteId",
                as:"quizzes"
            }
        },


        // Subscription information
        {
            $lookup:{
                from:"subscriptionmodels",
                localField:"_id",
                foreignField:"instituteId",
                as:"subscription"
            }
        },


        // Student performance
        {
            $lookup:{
                from:"studentsubjectperformancemodels",
                localField:"_id",
                foreignField:"instituteId",
                as:"performance"
            }
        },


        // Final response
        {
            $project:{


                instituteName:"$name",


                totalStudents:{
                    $size:"$students"
                },


                totalStaff:{
                    $size:"$staff"
                },


                totalFaculty:{

                    $size:{
                        $filter:{
                            input:"$staff",
                            as:"teacher",
                            cond:{
                                $eq:[
                                    "$$teacher.designation",
                                    "Instructor"
                                ]
                            }
                        }
                    }

                },


                totalDepartments:{
                    $size:"$departments"
                },


                totalCourses:{
                    $size:"$courses"
                },


                totalAssignments:{
                    $size:"$assignments"
                },


                totalQuizzes:{
                    $size:"$quizzes"
                },


                averageStudentPerformance:{

                    $round:[

                        {
                            $avg:
                            "$performance.percentage"
                        },

                        2
                    ]

                },


                subscriptionStatus:{

                    $ifNull:[

                        {
                            $arrayElemAt:[
                                "$subscription.status",
                                0
                            ]
                        },

                        "No Subscription"

                    ]

                },


                subscriptionExpiry:{

                    $arrayElemAt:[
                        "$subscription.endDate",
                        0
                    ]

                },


                aiUsage:{


                    $ifNull:[


                        {
                            $arrayElemAt:[
                                "$subscription.aiUsage",
                                0
                            ]
                        },


                        {
                            totalAiRequests:0
                        }

                    ]

                }


            }

        }


    ]);


    return result[0];

};


module.exports = instituteDashboardAggregation;