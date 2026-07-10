const mongoose = require("mongoose");

const studentRegistrationModel = require("../../Models/UserModels/studentRegistration.model");
const studentSubjectPerformanceModel = require("../../Models/ResultModels/StudentPerSubjectPerformance.model");
const counsellingModel = require("../../Models/Consuelling Models/counselling.model");


const studentProgressAggregation = async(instituteId)=>{


    const instituteObjectId =
    new mongoose.Types.ObjectId(instituteId);



    const students = await studentRegistrationModel.aggregate([


        // Institute ke students
    {
    $addFields:{
        instituteIdString:{
            $toString:"$instituteId"
        }
    }
},  
{
    $match:{
        instituteIdString: instituteId
    }
},



        // Student Performance
        {
            $lookup:{
                from:"studentsubjectperformancemodels",
                localField:"_id",
                foreignField:"studentId",
                as:"performance"
            }
        },



        // Counselling Data
        {
            $lookup:{
                from:"counsellingmodels",
                localField:"_id",
                foreignField:"studentId",
                as:"counselling"
            }
        },



        // Average Marks Calculate
        {
            $addFields:{


                currentAverage:{
                    $round:[
                        {
                            $avg:"$performance.percentage"
                        },
                        0
                    ]
                },


                counsellingInfo:{
                    $arrayElemAt:[
                        "$counselling",
                        0
                    ]
                }


            }
        },



        // Final Response
        {
            $project:{


                name:1,

                contactNo:1,

                statusOfStudent:1,


                currentAverage:{
                    $ifNull:[
                        "$currentAverage",
                        0
                    ]
                },


                counselling:{

                    status:
                    "$counsellingInfo.status",

                    reason:
                    "$counsellingInfo.reason"

                }


            }
        }


    ]);


    return students;

}



const getStudentProgress = async(req,res)=>{

try{

const {instituteId}=req.params;
const students =
await studentProgressAggregation(instituteId);
res.status(200).json({
success:true,
data:{
students
}

})

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
getStudentProgress
}