const {imageKitConfig,fileIdByName}= require('../../ImageKit.IO Setup/setup')
const courseContentModel  = require('../../Models/CourseModels/courseContent.model.js')
const courseModel = require('../../Models/CourseModels/course.model.js')
const mongoose = require('mongoose')
const createManualCourseContent = async(req,res)=>{
    try {
        if(!req.file){
            console.log("File not Found in Manual Assignment Creation")
            return res.status(400).json({message:"File Not Found in Manual Assignment"})
        }

// yaha aik kaam karna baki hai jo instructor course ko teach kar raha hai uske according cours content create hoga matlab agr hum pehle check karenge k register teacher for course agr teacher ki match karegi to hi teacher course content create kar sake ga


        const {contentTitle,courseId,instituteId}= req.body
        
        // check total already uploaded content of courseId
        const checkAlreadyContent = await courseContentModel.find({courseId:courseId})
        console.log(checkAlreadyContent)
        const noOfContents= checkAlreadyContent.length
        // console.log(length)
        if(noOfContents>15){
            console.log("Not allowed to upload more than 16 Content Pdfs")
            return res.status(202).json({message:"Not allowed To upload more than 16 Content Pdfs"})
        }
        // return res.status(200).json({message:"Already Uploaded Content Length",noOfContents})
        const createCourseContent = await courseContentModel.create({contentTitle,courseId,instituteId})
        if(!createCourseContent){
            console.log("Issue in Content Creation")
            return res.status(404).json({message:'Issue in Content Creation'})
        }
        const customFileName = contentTitle+Date.now()
        console.log('File Name : ',customFileName)

        const imageKitResponse= await imageKitConfig.upload({
            file:req.file.buffer,
            fileName:customFileName
        })
        console.log("Image kit response",imageKitResponse)
        const imageKitUrl= imageKitResponse.url
        console.log('Image kit url ', imageKitResponse.url)
        if(imageKitUrl.length>0 || imageKitUrl){
            createCourseContent.fileUrl=imageKitUrl
            await createCourseContent.save()
        }
        return res.status(200).json({message:"Content Created Successfully",createCourseContent})

    } catch (error) {
        console.log('Error in Manual Content Creation Function',error)
        return res.status(404).json({message:"Error in Manual Content Creatiion Function",error})
    }
}

const deleteCourseContent = async(req,res)=>{
    try {
        const {id} = req.body
        const getObject = await courseContentModel.findById(id)
        if(!getObject){
            console.log("Object Not accessable")
            return res.status(400).json({message:"Object Not accessable"})
        }
        // console.log('Object Found Successfully',getObject)
        const fileUrl = getObject.fileUrl
        const deleteContent = await courseContentModel.deleteOne({_id:id})
        if(deleteContent.deletedCount<1){
                    console.log("Not able to delete Student")
                    return res.status(400).json({message:"Content Not Deleted"})
                }
                const decodedUrl= decodeURIComponent(fileUrl)
                const fileName=decodedUrl.substring(decodedUrl.lastIndexOf('/')+1).split('?')[0]
                const fileId= await fileIdByName(fileName)
                try {
                    const deleteFile = await imageKitConfig.deleteFile(fileId)
                    console.log(deleteFile)
                    if(!deleteFile){
                        console.log('File Not Deleted')
                    }
                    console.log("File Deleted Successfully")
                } catch (error) {
                    console.log("Issue in deleting file from imagekit",error)
                }

        return res.status(200).json({message:"Content Deleted Successfully",deleteCourseContent})
    } catch (error) {
        console.log("Error in Delete Course Content Function",error)
        return res.status(404).json("Error in Delete Course Content",error)
    }
}

const getTeacherCourseContent = async(req,res)=>{
try {

    const {teacherId}=req.params
    const teacherObjectId = new mongoose.Types.ObjectId(teacherId)

    const content = await courseModel.aggregate([

        {
            $match:{
                instructorTeached:teacherObjectId
            }
        },


        {
            $lookup:{
                from:"coursecontentmodels",
                localField:"_id",
                foreignField:"courseId",
                as:"contents"
            }
        },


        {
            $project:{
                courseId:"$_id",
                courseName:"$name",

                contents:{
                    _id:1,
                    contentTitle:1,
                    fileUrl:1,
                    createdAt:1
                }
            }
        }

    ])


    return res.status(200).json(content)


}
catch(error){

    console.log(
        "Error in Get Teacher Course Content",
        error
    )

    return res.status(500).json({
        message:error.message
    })

}

}
module.exports = {createManualCourseContent,deleteCourseContent,getTeacherCourseContent}