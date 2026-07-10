const mongoose = require("mongoose");

const staffModel = require("../../models/UserModels/staff.model");

const getFacultyPerformanceAggregation = async (instituteId) => {

    const facultyData = await staffModel.aggregate([

        // 1. Get only teaching staff
        {
            $match: {
                instituteId: new mongoose.Types.ObjectId(instituteId),
                designation: "Instructor"
            }
        },


        // 2. Lookup courses taught by teacher
        {
            $lookup: {
                from: "coursemodels",
                localField: "_id",
                foreignField: "instructorTeached",
                as: "courses"
            }
        },


        // 3. Lookup student enrollments in those courses
        {
            $lookup: {
                from: "courseenrollmentmodels",
                let: {
                    courseIds: "$courses._id"
                },
                pipeline: [

                    {
                        $match: {
                            $expr: {
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
                as:"studentEnrollments"
            }
        },


        // 4. Lookup student performance
        {
            $lookup:{
                from:"studentsubjectperformancemodels",
                localField:"_id",
                foreignField:"teacherId",
                as:"studentPerformance"
            }
        },


        // 5. Lookup assignments created by teacher
        {
            $lookup:{
                from:"assignmentmodels",
                localField:"_id",
                foreignField:"createdBy",
                as:"assignments"
            }
        },


        // 6. Lookup quizzes created by teacher
        {
            $lookup:{
                from:"quizmodels",
                localField:"_id",
                foreignField:"createdBy",
                as:"quizzes"
            }
        },


        // 7. Calculate metrics
        {
            $addFields:{


                totalStudents:{
                    $size:"$studentEnrollments"
                },


                totalCourses:{
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


                avgStudentSuccess:{
                    $round:[
                        {
                            $avg:
                            "$studentPerformance.percentage"
                        },
                        0
                    ]
                },


                lastActive:{
                    $max:[
                        "$assignments.generatedDate",
                        "$quizzes.generatedDate"
                    ]
                }

            }
        },


        // 8. Select required fields only
        {
            $project:{


                name:1,
                cnicNo:1,
                mobileNo:1,
                department:1,
                designation:1,
                imageUrl:1,


                totalStudents:1,

                totalCourses:1,

                contentUploaded:1,

                avgStudentSuccess:{
                    $ifNull:[
                        "$avgStudentSuccess",
                        0
                    ]
                },


                lastActive:1

            }
        },


        // 9. Sort best performing teachers first
        {
            $sort:{
                avgStudentSuccess:-1
            }
        }

    ]);


    return facultyData;

};


module.exports = getFacultyPerformanceAggregation;