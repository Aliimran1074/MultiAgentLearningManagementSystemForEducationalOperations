const mongoose = require('mongoose')

const quizUploadingSchema = new mongoose.Schema(
    {
        quizId:{
            type:mongoose.Schema.ObjectId,
            ref:"quizModel",
            required:true
        },
        studentId:{
            type:mongoose.Schema.ObjectId,
            ref:"studentRegistrationModel",
            required:true
        },
        uploadedFile:{
            type:String,
        },
        submittedAt:{
            type:Date,
            default:Date.now()
        },
        marks:{
            type:Number,
            default:0
        },
        marksAssigned:{
            type:Boolean,
            default:false
        },
        maxMarks:{
            type:Number,
            default:5
        },
        status:{
            type:String,
            enum:['checked','uncheck'],
            default:'uncheck'
        }
    }
)

const quizUploadingModel = mongoose.model('quizUploadingModel',quizUploadingSchema)
module.exports = quizUploadingModel