const mongoose = require("mongoose");

const assignmentModel = require("../../Models/Assignment/assignment.model");
const quizModel = require("../../Models/QuizModel/quiz.model");
const studentSubjectPerformanceModel = require("../../Models/ResultModels/StudentPerSubjectPerformance.model");
const counsellingModel = require("../../Models/Consuelling Models/counselling.model");
const appointmentRequestModel = require("../../Models/Consuelling Models/appointment.model");


const agentCommandAggregation = async(instituteId)=>{


const instituteObjectId = new mongoose.Types.ObjectId(instituteId);


// ===============================
// Assessment Agent Data
// ===============================


const totalAssignments = await assignmentModel.countDocuments({
    instituteId: instituteObjectId
});


const totalQuizzes = await quizModel.countDocuments({
    instituteId: instituteObjectId
});


const studentsEvaluated = await studentSubjectPerformanceModel.distinct(
    "studentId",
    {
        instituteId: instituteObjectId
    }
);


const weakStudents = await studentSubjectPerformanceModel.countDocuments({
    instituteId: instituteObjectId,
    status:"weak"
});



// ===============================
// Counseling Agent Data
// ===============================


const flaggedStudents = await counsellingModel.distinct(
    "studentId",
    {
        instituteId: instituteObjectId
    }
);


const pendingRequests = await appointmentRequestModel.countDocuments({

    instituteId: instituteObjectId,
    status:"pending"

});


const scheduledMeetings = await appointmentRequestModel.countDocuments({

    instituteId: instituteObjectId,
    status:{
        $in:[
            "accepted",
            "pending"
        ]
    }

});


const completedMeetings = await appointmentRequestModel.countDocuments({

    instituteId: instituteObjectId,
    status:"completed"

});



return {

assessment:{


totalAssignments,

totalQuizzes,

studentsEvaluated:
studentsEvaluated.length,


weakStudents


},



counselling:{


flaggedStudents:
flaggedStudents.length,


pendingRequests,


scheduledMeetings,


completedMeetings


}


}



}



const getAgentCommandCenter = async(req,res)=>{


try{


const data = await agentCommandAggregation(
req.params.instituteId
);



res.json({

success:true,

data

});


}
catch(error){

console.log(error);


res.status(500).json({

success:false,

message:error.message

})


}


}



module.exports={
getAgentCommandCenter
}