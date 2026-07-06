const mongoose = require("mongoose")

const quizModel = require("../../Models/QuizModel/quiz.model")
const quizUploadingModel = require("../../Models/QuizModel/quizUploading.model")


const teacherQuizSubmission= async(req,res)=>{

try {


    const {teacherId} = req.params;


    const teacherObjectId = new mongoose.Types.ObjectId(teacherId);



    const quizzes = await quizModel.aggregate([


        // ==========================
        // TEACHER QUIZ MATCH
        // ==========================

        {
            $match:{
                createdBy:teacherObjectId
            }
        },



        // ==========================
        // COURSE DETAILS
        // ==========================

        {
            $lookup:{
                from:"coursemodels",
                localField:"course",
                foreignField:"_id",
                as:"courseInfo"
            }
        },


        {
            $unwind:"$courseInfo"
        },




        // ==========================
        // QUIZ SUBMISSIONS
        // ==========================


        {
            $lookup:{

                from:"quizuploadingmodels",

                localField:"_id",

                foreignField:"quizId",

                as:"submissions"

            }
        },




        // ==========================
        // ONLY SUBMITTED QUIZ
        // ==========================

        {
            $unwind:"$submissions"
        },





        // ==========================
        // STUDENT INFO
        // ==========================

        {
            $lookup:{

                from:"studentregistrationmodels",

                localField:"submissions.studentId",

                foreignField:"_id",

                as:"student"

            }
        },


        {
            $unwind:"$student"
        },






        // ==========================
        // FINAL RESPONSE
        // ==========================


        {

        $project:{


            submissionId:
            "$submissions._id",


            quizId:
            "$_id",



            quizTitle:
            {
                $concat:[
                    "$courseInfo.name",
                    " Quiz"
                ]
            },



            studentId:
            "$student._id",


            studentName:
            "$student.name",



            courseName:
            "$courseInfo.name",




            uploadedFile:
            "$submissions.uploadedFile",



            submittedAt:
            "$submissions.submittedAt",



            marks:
            "$submissions.marks",



            maxMarks:
            "$submissions.maxMarks",



            marksAssigned:
            "$submissions.marksAssigned",




            status:
            "$submissions.status"

        }

        }



    ]);




    return res.status(200).json(quizzes);



}
catch(error){

console.log(
"Error in Teacher Quiz Submission Checker",
error
);


return res.status(500).json({

message:"Issue in Quiz Submission Checker",
error

});


}

}

module.exports={
teacherQuizSubmission
}