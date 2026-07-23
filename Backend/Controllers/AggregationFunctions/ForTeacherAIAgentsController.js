const assignmentTopicModel = require("../../Models/AssignmentInputModel/assignment.input.model")
const quizTopicModel = require("../../Models/quizInputModel/quiz.input.model")
const subscriptionModel = require("../../Models/SuperAdminModels/subscription.model")
const courseModel = require("../../Models/CourseModels/course.model")
const staffModel = require("../../Models/UserModels/staff.model")


const teacherAIAgentInfo = async (req, res) => {

    try {

        const { teacherId } = req.params

        const teacherInfo =
            await staffModel.findById(teacherId)

        if(!teacherInfo){
            return res.status(404).json({
                success:false,
                message:"Teacher not found"
            })

        }


        const instituteId =
            teacherInfo.instituteId

        const subscription =
            await subscriptionModel.findOne({
                instituteId,
                status:"Active"
            })


        let subscriptionId = null
        let subscriptionUsage = {}


        if(subscription){

            subscriptionId = subscription._id

            subscriptionUsage =
                subscription.aiUsage

        }

        const courses =
            await courseModel.find({
                instructorTeached:teacherId
            })
            .select("_id name ForClass ForSemester")



        const assignmentTopics =
            await assignmentTopicModel.find({
                instructor: teacherId
            })


        let totalAssignmentTopics = 0


        assignmentTopics.forEach(item=>{

            totalAssignmentTopics +=
            item.assignmentTopics.length

        })


 const assignmentLimit = 20;

const assignmentUsed =
subscriptionUsage.assignmentGeneratorUsed || 0;


const assignmentGenerator = {

    enabled:
    assignmentUsed < assignmentLimit,


    used:
    assignmentUsed,


    limit:
    assignmentLimit,


    remaining:
    Math.max(
        assignmentLimit - assignmentUsed,
        0
    )

}


        const quizTopics =
            await quizTopicModel.find({
                instructor:teacherId
            })


        let totalQuizTopics = 0


        quizTopics.forEach(item=>{

            totalQuizTopics +=
            item.quizTopics.length

        })



        const quizLimit = 6



        const quizGenerator = {


            enabled:
            totalQuizTopics < quizLimit,


            used:
            totalQuizTopics,


            limit:
            quizLimit,


            remaining:
            Math.max(
                quizLimit-totalQuizTopics,
                0
            )

        }

        return res.status(200).json({

            success:true,


            teacherId,


            instituteId,


            subscriptionId,


            courses,



            agents:{


                assignmentGenerator,


                quizGenerator,



                assignmentChecker:{

                    used:
                    subscriptionUsage.assignmentCheckerUsed || 0

                },



                quizChecker:{


                    used:
                    subscriptionUsage.quizCheckerUsed || 0

                }



            }

        })




    }
    catch(error){


        console.log(
            "Teacher AI Agent Error:",
            error
        )


        return res.status(500).json({

            success:false,

            message:error.message

        })

    }

}



module.exports={
    teacherAIAgentInfo
}