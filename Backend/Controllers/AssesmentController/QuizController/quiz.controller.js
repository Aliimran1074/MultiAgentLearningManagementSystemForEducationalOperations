const quizModel = require("../../../Models/QuizModel/quiz.model")
const subscriptionModel = require("../../../Models/SuperAdminModels/subscription.model")
const staffModel= require('../../../Models/UserModels/staff.model')
const courseModel = require('../../../Models/CourseModels/course.model')
const courseEnrollmentModel = require('../../../Models/CourseModels/courseEnrollment.model')
const quizUploadingModel = require('../../../Models/QuizModel/quizUploading.model')
const {imageKitConfig} =require('../../../ImageKit.IO Setup/setup')

const manualQuizCreation=async()=>{
try {
 const {instituteId,courseId,createdBy,duration,quizFile} = req.body
 if(!req.file){
    console.log("File not Found")
    return res.status(400).json({message:"Quiz File not Found"})
 }
 const createQuiz = await quizModel.create({instituteId:instituteId,courseId:courseId,createdBy:createdBy,duration:duration,quizFile:quizFile})

 if(!createQuiz){
    console.log("Not able to Create Quiz")
    return res.status(404).json({message:"Not able to create Quiz"})
 }
 console.log("Quiz Created Successfully",createQuiz)
 return res.status(200).json({message:"Quiz has been Created Successfully",createQuiz})
 
} catch (error) {
    
    console.log("Not able to create manual Quiz",error)
    return res.status(404).json({message:"Not able to create a manual Quiz",error})
}
}


const manualQuizCreationByPdfUploading = async(req,res)=>{
try{
    if(!req.file){
        console.log("File Not Found")
        return res.status(400).json({message:"File Not Found"})
    }

    
    const {subscriptionId,courseId,staffId,duration}=req.body
    const subscriptionDetails = await subscriptionModel.findById(subscriptionId)
    const instituteId = subscriptionDetails.instituteId
    console.log("Institute Id :",instituteId)

    const getStaffInfo = await staffModel.findById(staffId)
    const getInstituteIdFromStaff = getStaffInfo.instituteId
    
    const courseInfo = await courseModel.findById(courseId)
    const getInstituteIdFromCourse = courseInfo.instituteId
    const instructorAssignedToCourse = courseInfo.instructorTeached

    console.log("Instructor Assign TO Course",instructorAssignedToCourse)
    if(!instructorAssignedToCourse){
        console.log("Cant Upload Quiz Untill Assign Instructor To Course")
        return res.status(400).json({message:"Quiz Creation Failed Due To No Instructor Assigned"})
    }

    // match id of staff with the person who assign to teach course 
    if((instructorAssignedToCourse.toString())!== (staffId.toString()) ){
        console.log("Only Assigned Instructor Can Create Assignement ID Mis Match")
        return res.status(404).json({message:"Only Assigned Instructor Can Create Assignement ID Mis Match"})
    }
    const courseName = courseInfo.name
    
    console.log("Institute Id from Staff",getInstituteIdFromStaff)
    console.log("Institute Id from Course",getInstituteIdFromCourse)
    console.log("Institute Id from Subscription", instituteId)
    
    if(
    instituteId.toString() === getInstituteIdFromStaff.toString() &&
    instituteId.toString() === getInstituteIdFromCourse.toString() 
){
    const checkNoOfQuizOfParticularCourse = await quizModel.find({course:courseId}).countDocuments()
    console.log(checkNoOfQuizOfParticularCourse)
    
    if(checkNoOfQuizOfParticularCourse >= 4){
        console.log("Aleady Four Quiz of Particular Course Uploaded")
        return res.status(200).json({message:"Aleady Four Quiz of Particular Course Uploaded"})
        
    }
    else{
        const createManualQuiz = await quizModel.create({instituteId:instituteId,course:courseId,createdBy:staffId,duration:duration})

        console.log("Manual Quiz Created Successfully",createManualQuiz)
       if(!createManualQuiz){
        console.log("Issue in Creating Manual Quiz ")
        return res.status(400).json({message:"Issue in Creating Manual Quiz"})
       }

        const fileName = `${courseName}_${Date.now()}`
        
                    const imageKitResponse= await imageKitConfig.upload({
                        file:req.file.buffer,
                        fileName:fileName
                    })
                    // console.log("Image kit response",imageKitResponse)
                    const imageKitUrl= imageKitResponse.url
                    console.log('Image kit url ', imageKitResponse.url)
                    if(imageKitUrl.length>0 || imageKitUrl){
                        createManualQuiz.quizFile=imageKitUrl
                        await createManualQuiz.save()
                    }
       
        return res.status(200).json({message:"Quiz Created Successfully",createManualQuiz})
    }
   }

    console.log("Institute Or Instructor ID mismatched")
    return res.status(400).json({message:"Institute Or Instructor ID mismatched"})
    // humay yahan yeh check karwana hai hum usi course ka Quiz bana sake jo is institute ka hai , or wahi staff bana sake jo is institute me yeh course parhata ho , matlab koi dosra banda kisi dosre insitute ka id pass karke na bana or na hi isi institute ka koi dosra teacher jo yeh course na parhata ho

}
catch(error){
    console.log("Error in manual Quiz Creation Function",error)
    return res.status(400).json({message:"Error in Manual Quiz Creation Function",error})
}
}


const quizUploading= async(req,res)=>{
    try {
        
        if(!req.file){
        console.log("File Not Found")
        return res.status(400).json({message:"File Not Found"})
        }
        const {quizId,studentId}= req.body
        const getQuizDetails = await quizModel.findById(quizId)
        
        if(!getQuizDetails){
            console.log("No Quiz Available With This ID")
            return res.status(400).json({message:"No Quiz Available With This ID"})
        }

        const getCourseIdViaQuiz= getQuizDetails.course
        console.log(getCourseIdViaQuiz)
        const getCourseEnrollmentDetails = await courseEnrollmentModel.find({studentId:studentId,courseId:getCourseIdViaQuiz})

        console.log("Get Course Enrollment Details:",getCourseEnrollmentDetails)
        if(getCourseEnrollmentDetails.length<1){
            console.log("Sorry Only Enroll Student Can Upload Quiz")
            return res.status(400).json({message:"Sorry Only Enroll Student Can Upload Quiz"})
        }
        
        // check student already upload Quiz or not
        const checkAlreadyQuizUploading = await quizUploadingModel.find({quizId:quizId,studentId:studentId})

        console.log("Already Quiz Uploading",checkAlreadyQuizUploading.length)
        if(checkAlreadyQuizUploading.length>0){
            console.log("Student Already Uplaod Quiz")
            return res.status(400).json({message:"Student Already Uploaded Quiz"})
        }

        const uploadQuiz = await quizUploadingModel.create({quizId:quizId,studentId:studentId})
        if(!uploadQuiz){
            console.log("Issue in Quiz Uploading")
            return res.status(400).json({message:"Issue in Quiz Uploading"})
        }
         const fileName = `${studentId}_${Date.now()}`
        
                    const imageKitResponse= await imageKitConfig.upload({
                        file:req.file.buffer,
                        fileName:fileName
                    })
                    // console.log("Image kit response",imageKitResponse)
                    const imageKitUrl= imageKitResponse.url
                    console.log('Image kit url ', imageKitResponse.url)
                    if(imageKitUrl.length>0 || imageKitUrl){
                        uploadQuiz.uploadedFile=imageKitUrl
                        await uploadQuiz.save()
                    }
       
        return res.status(200).json({message:"Quiz Uploaded Successfully",uploadQuiz})


    } catch (error) {
        console.log("Error in Quiz Uploading Function",error)
        return res.status(404).json({message:"Error in Quiz Uploading Function",error})
    }
   }

const quizManualMarksUploadingByTeacher= async(req,res)=>{
try {
    const {staffId,quizId,studentId,marks}= req.body
    
    const getMatchInstructor = await quizModel.findOne({_id:quizId,createdBy:staffId})
    
    // console.log("Get Match Instructor",getMatchInstructor)
    if(!getMatchInstructor){
        console.log("Instructor not Match")
        return res.status(400).json({message:'Instructor Not Match'})
    } 
    // console.log("Instructor Matched ")
    // return res.status(200).json({message:"Instructor Matched"})   
    const checkIsQuizUploadedByStudentOrNot = await quizUploadingModel.findOne({quizId:quizId,studentId:studentId})
    if(!checkIsQuizUploadedByStudentOrNot){
        console.log("Student not Uploaded Quiz Yet")
        return res.status(400).json({message:"Student not Uploaded Quiz Yet"})
    }
    // console.log("Uploaded Quiz Found ")
    let assignMarksInfo = checkIsQuizUploadedByStudentOrNot.marksAssigned
    console.log("Assign Marks Info",assignMarksInfo)
    if(assignMarksInfo)
        {
            console.log("Marks Already Assign")
            return res.status(200).json({message:"Marks Already Assign"})
        }
    const maxMarks = checkIsQuizUploadedByStudentOrNot.maxMarks

        if(marks>maxMarks || marks<0){
            console.log("Please Give Marks Between max marks and Zero")
            return res.status(200).json({message:`Please Give Marks Between 0 & ${maxMarks} `})
        }
     checkIsQuizUploadedByStudentOrNot.marks = marks
     checkIsQuizUploadedByStudentOrNot.marksAssigned= true


     checkIsQuizUploadedByStudentOrNot.save()

    return res.status(200).json({message:"Uploaded Quiz Found Successfully",checkIsQuizUploadedByStudentOrNot})

} 
catch (error) {
    console.log("Error in Uploading Manual Marks Function",error)
    return res.status(404).json({message:"Issue in Uploading Maunal Marks Function",error})
}
}

module.exports = {manualQuizCreation,manualQuizCreationByPdfUploading,quizUploading,quizManualMarksUploadingByTeacher}
