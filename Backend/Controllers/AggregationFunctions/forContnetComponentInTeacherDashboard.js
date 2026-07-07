const mongoose = require("mongoose")
const courseContentModel = require("../../Models/CourseModels/courseContent.model")


const teacherContentInfo = async(req,res)=>{

    try {

        const {teacherId}=req.params


        const teacherObjectId = new mongoose.Types.ObjectId(teacherId)



        const contents = await courseContentModel.aggregate([


            {
                $lookup:{
                    from:"coursemodels",
                    localField:"courseId",
                    foreignField:"_id",
                    as:"course"
                }
            },


            {
                $unwind:"$course"
            },


            {
                $match:{
                    "course.instructorTeached":teacherObjectId
                }
            },


            {
                $project:{


                    _id:0,

                    id:"$_id",

                    title:"$contentTitle",


                    type:{
                        $literal:"pdf"
                    },


                    courseName:"$course.name",


                    class:"$course.ForClass",


                    semester:"$course.ForSemester",


                    fileUrl:1,


                    uploadDate:"$createdAt"

                }
            }


        ])



        return res.status(200).json({

            totalFiles:contents.length,

            contents

        })


    } catch(error){

        console.log(
            "Teacher Content Error",
            error
        )


        return res.status(500).json({

            message:"Error fetching teacher content",
            error:error.message

        })

    }

}

module.exports={teacherContentInfo}