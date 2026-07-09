const assignmentModel = require("../../Models/Assignment/assignment.model")
const assignmentUploadingModel = require("../../Models/Assignment/assignmentUploading.model")
const  courseEnrollmentModel = require("../../Models/CourseModels/courseEnrollment.model")
const { imageKitConfig} = require('../../ImageKit.IO Setup/setup')



// is function ko run karke test to karlia but kuch problem abhi bhi lag rahi hai khair isko end me test karenge ab aik cheez or is me aik assignment upload deleting function bhi banana hai qk kabhi student galti se galt file upload kardete hai is wajah se  
const assignmentUploading= async(req,res)=>{
    try {
        
        if(!req.file){
        console.log("File Not Found")
        return res.status(400).json({message:"File Not Found"})
        }
        const {assignmentId,studentId}= req.body
        console.log("assignment Id :",assignmentId)
        const getAssignmentDetails = await assignmentModel.findById(assignmentId)
        
        if(!getAssignmentDetails){
            console.log("No Assignment Available With This ID")
            return res.status(400).json({message:"No Assignment Available With This ID"})
        }

        const getCourseIdViaAssignment= getAssignmentDetails.course
        console.log(getCourseIdViaAssignment)
        const getCourseEnrollmentDetails = await courseEnrollmentModel.find({studentId:studentId,courseId:getCourseIdViaAssignment})

        console.log("Get Course Enrollment Details:",getCourseEnrollmentDetails)
        if(getCourseEnrollmentDetails.length<1){
            console.log("Sorry Only Enroll Student Can Upload Assignment")
            return res.status(400).json({message:"Sorry Only Enroll Student Can Upload Assignment"})
        }
        
        // check student already upload assignment or not
        const checkAlreadyAssignmentUploading = await assignmentUploadingModel.find({assignmentId:assignmentId,studentId:studentId})

        console.log("Already Assignment Uploading",checkAlreadyAssignmentUploading.length)
        if(checkAlreadyAssignmentUploading.length>0){
            console.log("Student Already Uplaod Assignment")
            return res.status(400).json({message:"Student Already Uploaded Assignment"})
        }

        const uploadAssignment = await assignmentUploadingModel.create({assignmentId:assignmentId,studentId:studentId})

        if(!uploadAssignment){
            console.log("Issue in Assignment Uploading")
            return res.status(400).json({message:"Issue in Assignment Uploading"})
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
                        uploadAssignment.uploadedFile=imageKitUrl
                        await uploadAssignment.save()
                    }
       
        return res.status(200).json({message:"Assignment Uploaded Successfully",uploadAssignment})



    } catch (error) {
        console.log("Error in Assignment Uploading Function",error)
        return res.status(404).json({message:"Error in Assignment Uploading Function",error})
    }
}


module.exports = {assignmentUploading}



        // // ids match karke upload karna hai bs
        
        
        // // const instituteDetailsViaAssignment = await assignmentModel.findById(assignmentId)
        // // const instituteDetailsViaStudent = await studentRegistrationModel.findById(studentId)
        
        // // const instituteIdViaAssignment = instituteDetailsViaAssignment.instituteId
        // // const instituteIdViaStudent= instituteDetailsViaStudent.instituteId
        

        
        // // if((instituteIdViaAssignment.toString())!== (instituteIdViaStudent.toString())){
        // //     console.log("Only Student of Same Institute Can Upload Assignment")
        // // } 

        // // console.log("Institute Details Via Assignment",instituteDetailsViaAssignment)
        // // console.log("Institute Details Via Student",instituteDetailsViaStudent)

        // return res.status(200).json({message:"Thank you"})
       

