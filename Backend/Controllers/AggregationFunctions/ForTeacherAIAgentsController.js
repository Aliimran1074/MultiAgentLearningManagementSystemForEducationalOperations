const assignmentTopicModel = require("../../Models/AssignmentInputModel/assignment.input.model")
const quizTopicModel = require("../../Models/quizInputModel/quiz.input.model")
const subscriptionModel = require("../../Models/SuperAdminModels/subscription.model")
const courseModel = require("../../Models/CourseModels/course.model")


const teacherAIAgentInfo = async (req, res) => {

    try {

        const { teacherId } = req.params


        // ==========================
        // ASSIGNMENT GENERATOR INFO
        // ==========================

        const assignmentTopics =
            await assignmentTopicModel.find({
                instructor: teacherId
            })


        let totalAssignmentTopics = 0


        assignmentTopics.forEach(item => {

            totalAssignmentTopics += item.assignmentTopics.length

        })


        // Assignment limit currently 10
        const assignmentLimit = 10


        const assignmentGenerator = {

            enabled:
                totalAssignmentTopics < assignmentLimit,

            used:
                totalAssignmentTopics,

            limit:
                assignmentLimit,

            remaining:
                assignmentLimit - totalAssignmentTopics
        }



        // ==========================
        // QUIZ GENERATOR INFO
        // ==========================


        const quizTopics =
            await quizTopicModel.find({
                instructor: teacherId
            })


        let totalQuizTopics = 0


        quizTopics.forEach(item => {

            totalQuizTopics += item.quizTopics.length

        })


        // your current quiz limit in backend is 6
        const quizLimit = 6


        const quizGenerator = {

            enabled:
                totalQuizTopics < quizLimit,


            used:
                totalQuizTopics,


            limit:
                quizLimit,


            remaining:
                quizLimit - totalQuizTopics
        }




        // ==========================
        // SUBSCRIPTION AI USAGE
        // ==========================


        const teacherCourse =
            await courseModel.findOne({
                instructorTeached: teacherId
            })


        let subscriptionUsage = {}


        if(teacherCourse){


            const subscription =
                await subscriptionModel.findOne({
                    instituteId: teacherCourse.instituteId
                })


            if(subscription){

                subscriptionUsage =
                    subscription.aiUsage

            }

        }




        // ==========================
        // FINAL RESPONSE
        // ==========================


        return res.status(200).json({

            success:true,


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



    } catch(error){

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