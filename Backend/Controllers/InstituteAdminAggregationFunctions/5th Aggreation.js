const mongoose = require("mongoose");

const staffModel = require("../../models/UserModels/staff.model");

const facultyPerformanceAggregation = async (instituteId) => {

    const facultyData = await staffModel.aggregate([

        // 1. Only instructors of this institute
        {
            $match: {
                instituteId: new mongoose.Types.ObjectId(instituteId),
                designation: "Instructor"
            }
        },


        // 2. Department information
        {
            $lookup:{
                from:"departmentmodels",
                localField:"department",
                foreignField:"_id",
                as:"departmentInfo"
            }
        },

        {
            $unwind:{
                path:"$departmentInfo",
                preserveNullAndEmptyArrays:true
            }
        },


        // 3. Courses taught by teacher
        {
            $lookup:{
                from:"coursemodels",
                localField:"_id",
                foreignField:"instructorTeached",
                as:"courses"
            }
        },


        // 4. Count students enrolled in teacher courses
        {
            $lookup:{
                from:"courseenrollmentmodels",
                let:{
                    courseIds:"$courses._id"
                },
                pipeline:[
                    {
                        $match:{
                            $expr:{
                                $and:[
                                    {
                                        $in:[
                                            "$courseId",
                                            "$$courseIds"
                                        ]
                                    },
                                    {
                                        $eq:[
                                            "$status",
                                            "active"
                                        ]
                                    }
                                ]
                            }
                        }
                    }
                ],
                as:"studentsEnrollment"
            }
        },


        // 5. Student performance
        {
            $lookup:{
                from:"studentsubjectperformancemodels",
                localField:"_id",
                foreignField:"teacherId",
                as:"studentPerformance"
            }
        },


        // 6. Assignments uploaded
        {
            $lookup:{
                from:"assignmentmodels",
                localField:"_id",
                foreignField:"createdBy",
                as:"assignments"
            }
        },


        // 7. Quiz uploaded
        {
            $lookup:{
                from:"quizmodels",
                localField:"_id",
                foreignField:"createdBy",
                as:"quizzes"
            }
        },


        // 8. Final output
        {
            $project:{


                name:1,

                email:1,

                mobileNo:1,

                department:{
                    $ifNull:[
                        "$departmentInfo.name",
                        "Not Assigned"
                    ]
                },


                coursesTeaching:{
                    $map:{
                        input:"$courses",
                        as:"course",
                        in:{
                            id:"$$course._id",
                            name:"$$course.name"
                        }
                    }
                },


                totalStudents:{
                    $size:"$studentsEnrollment"
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


                avgStudentSuccess:{
                    $round:[
                        {
                            $avg:
                            "$studentPerformance.percentage"
                        },
                        0
                    ]
                },


                totalCourses:{
                    $size:"$courses"
                },


                performance:{
                    $switch:{
                        branches:[

                            {
                                case:{
                                    $gte:[
                                        {
                                            $avg:"$studentPerformance.percentage"
                                        },
                                        80
                                    ]
                                },
                                then:"Excellent"
                            },


                            {
                                case:{
                                    $gte:[
                                        {
                                            $avg:"$studentPerformance.percentage"
                                        },
                                        60
                                    ]
                                },
                                then:"Good"
                            }

                        ],

                        default:"Needs Attention"
                    }
                },


                lastUpdated:{
                    $max:
                    "$studentPerformance.lastUpdated"
                }

            }
        },


        // 9. Sort faculty by performance
        {
            $sort:{
                avgStudentSuccess:-1
            }
        }


    ]);


    return facultyData;

};


module.exports = facultyPerformanceAggregation;