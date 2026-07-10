const mongoose = require("mongoose");

const staffModel = require("../../Models/UserModels/staff.model");
const courseModel = require("../../Models/CourseModels/course.model");
const courseEnrollmentModel = require("../../Models/CourseModels/courseEnrollment.model");
const studentSubjectPerformanceModel = require("../../Models/ResultModels/StudentPerSubjectPerformance.model");
const courseContentModel = require("../../Models/CourseModels/courseContent.model")

const facultyDirectoryAggregation = async (instituteId)=>{
    const instituteObjectId = 
    new mongoose.Types.ObjectId(instituteId);
    const faculty = await staffModel.aggregate([
        // Only institute faculty
        {
            $match:{
                instituteId: instituteObjectId,
                designation:"Instructor"
            }
        },



        // Join courses taught by teacher
        {
            $lookup:{
                from:"coursemodels",
                localField:"_id",
                foreignField:"instructorTeached",
                as:"coursesTeaching"
            }
        },



        // Count students enrolled in teacher courses
        {
            $lookup:{
                from:"courseenrollmentmodels",
                let:{
                    teacherCourses:"$coursesTeaching._id"
                },

                pipeline:[

                    {
                        $match:{
                            $expr:{
                                $in:[
                                    "$courseId",
                                    "$$teacherCourses"
                                ]
                            }
                        }
                    },

                    {
                        $count:"totalStudents"
                    }

                ],

                as:"studentCount"
            }
        },



        // Join performance
        {
            $lookup:{
                from:"studentsubjectperformancemodels",

                localField:"_id",

                foreignField:"teacherId",

                as:"performance"
            }
        },

        {
    $lookup:{
        from:"coursecontentmodels",

        localField:"coursesTeaching._id",

        foreignField:"courseId",

        as:"contents"
    }
},


        // Calculate average success
        {
            $addFields:{


                totalStudents:
                {
                    $ifNull:[
                        {
                            $arrayElemAt:[
                                "$studentCount.totalStudents",
                                0
                            ]
                        },
                        0
                    ]
                },


                avgStudentSuccess:
                {
                    $round:[
                        {
                            $avg:
                            "$performance.percentage"
                        },
                        0
                    ]
                }

            }
        },



        // Final response
        {
            $project:{


                name:1,

                email:1,

                mobileNo:1,

                department:1,

                designation:1,

                contentUploaded:{
    $size:"$contents"
},

                coursesTeaching:{
                    $map:{
                        input:"$coursesTeaching",
                        as:"course",
                        in:"$$course.name"
                    }
                },


                totalStudents:1,


                avgStudentSuccess:
                {
                    $ifNull:[
                        "$avgStudentSuccess",
                        0
                    ]
                }

            }
        }

    ]);
    return faculty;
}




const getFacultyDirectory = async(req,res)=>{

    try{

        const { instituteId } = req.params;


        const faculty =
        await facultyDirectoryAggregation(instituteId);



        res.status(200).json({

            success:true,

            data:{
                faculty
            }

        });



    }
    catch(error){

        console.log(error);

        res.status(500).json({

            success:false,

            message:error.message

        });

    }

}



module.exports={
    getFacultyDirectory
}
