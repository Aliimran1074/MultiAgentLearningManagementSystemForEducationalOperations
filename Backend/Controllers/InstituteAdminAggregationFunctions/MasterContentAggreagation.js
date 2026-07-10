const mongoose = require("mongoose");

const courseModel = require("../../Models/CourseModels/course.model");
const assignmentModel = require("../../Models/Assignment/assignment.model");
const quizModel = require("../../Models/QuizModel/quiz.model");


const masterContentAggregation = async(instituteId)=>{


const instituteObjectId = new mongoose.Types.ObjectId(instituteId);



const courses = await courseModel.aggregate([

{
    $match:{
        instituteId: instituteObjectId
    }
},


{
    $lookup:{
        from:"staffmodels",
        localField:"instructorTeached",
        foreignField:"_id",
        as:"teacher"
    }
},


{
    $unwind:{
        path:"$teacher",
        preserveNullAndEmptyArrays:true
    }
},


{
    $project:{

        courseTitle:"$name",

        courseCode:"$deprtmentName",

        teacher:{
            $ifNull:[
                "$teacher.name",
                "Not Assigned"
            ]
        },

        contentType:{
            $literal:"Course"
        },

        lifecycleStatus:{
            $literal:"Live"
        }

    }
}


]);



const assignments = await assignmentModel.aggregate([

{
    $match:{
        instituteId: instituteObjectId
    }
},

{
    $lookup:{
        from:"coursemodels",
        localField:"courseId",
        foreignField:"_id",
        as:"course"
    }
},

{
    $unwind:{
        path:"$course",
        preserveNullAndEmptyArrays:true
    }
},


{
    $project:{

        courseTitle:{
            $ifNull:[
                "$course.name",
                "Assignment"
            ]
        },

        courseCode:{
            $literal:"Assignment"
        },

        teacher:{
            $literal:"Assigned Teacher"
        },


        contentType:{
            $literal:"Assignment"
        },


        lifecycleStatus:{
            $literal:"Live"
        }

    }
}

]);


const quizzes = await quizModel.aggregate([

{
    $match:{
        instituteId: instituteObjectId
    }
},


{
    $lookup:{
        from:"coursemodels",
        localField:"courseId",
        foreignField:"_id",
        as:"course"
    }
},


{
    $unwind:{
        path:"$course",
        preserveNullAndEmptyArrays:true
    }
},


{
    $project:{

        courseTitle:{
            $ifNull:[
                "$course.name",
                "Quiz"
            ]
        },


        courseCode:{
            $literal:"Quiz"
        },


        teacher:{
            $literal:"Assigned Teacher"
        },


        contentType:{
            $literal:"Quiz"
        },


        lifecycleStatus:{
            $literal:"Live"
        }

    }
}

]);


return [
    ...courses,
    ...assignments,
    ...quizzes
];


}


const getMasterContent = async(req,res)=>{

try{


const data =
await masterContentAggregation(
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
getMasterContent
}