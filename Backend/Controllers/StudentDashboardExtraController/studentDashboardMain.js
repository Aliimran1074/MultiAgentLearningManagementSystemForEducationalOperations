const mongoose = require("mongoose");
const studentRegistrationModel = require("../../Models/UserModels/studentRegistration.model");
const courseEnrollmentModel = require("../../Models/CourseModels/courseEnrollment.model");

const studentDashboardInfo = async(req,res)=>{

try{
const {studentId}=req.params;

const dashboardInfo = await studentRegistrationModel.aggregate([

{
$match:{
_id:new mongoose.Types.ObjectId(studentId)
}
},



// Student Courses

{
$lookup:{
from:"courseenrollmentmodels",
localField:"_id",
foreignField:"studentId",
as:"enrolledCourses"
}
},



{
$unwind:{
path:"$enrolledCourses",
preserveNullAndEmptyArrays:true
}
},



// Course Detail

{
$lookup:{
from:"coursemodels",
localField:"enrolledCourses.courseId",
foreignField:"_id",
as:"courseInfo"
}
},



{
$unwind:{
path:"$courseInfo",
preserveNullAndEmptyArrays:true
}
},




// Assignments

{
$lookup:{
from:"assignmentmodels",
localField:"courseInfo._id",
foreignField:"course",
as:"assignments"
}
},




// Quiz

{
$lookup:{
from:"quizmodels",
localField:"courseInfo._id",
foreignField:"course",
as:"quizzes"
}
},




// Course Content

{
$lookup:{
from:"coursecontentmodels",
localField:"courseInfo._id",
foreignField:"courseId",
as:"contents"
}
},




// Submitted Assignments

{
$lookup:{
from:"assignmentuploadingmodels",
let:{
student:"$_id",
assignmentIds:"$assignments._id"
},
pipeline:[

{
$match:{
$expr:{
$and:[

{
$eq:[
"$studentId",
"$$student"
]
},


{
$in:[
"$assignmentId",
"$$assignmentIds"
]
}


]
}
}

}

],
as:"submittedAssignments"

}
},





// Submitted Quiz

{
$lookup:{
from:"quizuploadingmodels",
let:{
student:"$_id",
quizIds:"$quizzes._id"
},

pipeline:[

{
$match:{
$expr:{
$and:[

{
$eq:[
"$studentId",
"$$student"
]
},


{
$in:[
"$quizId",
"$$quizIds"
]
}


]
}
}
}


],

as:"submittedQuizzes"

}
},




// Final Response Structure

{
$group:{


_id:"$_id",


name:{
$first:"$name"
},


imageUrl:{
$first:"$imageUrl"
},


contactNo:{
$first:"$contactNo"
},


courses:{


$push:{


courseId:"$courseInfo._id",

courseName:"$courseInfo.name",


content:"$contents",


assignments:"$assignments",


quizzes:"$quizzes",


submittedAssignments:
"$submittedAssignments",


submittedQuizzes:
"$submittedQuizzes"


}


}



}

}



])





if(!dashboardInfo.length){

return res.status(404).json({

success:false,

message:"Student not found"

})

}




res.status(200).json({

success:true,

data:dashboardInfo[0]

})



}
catch(error){

console.log(error)

res.status(500).json({

success:false,

message:error.message

})

}


}



module.exports={
studentDashboardInfo
}