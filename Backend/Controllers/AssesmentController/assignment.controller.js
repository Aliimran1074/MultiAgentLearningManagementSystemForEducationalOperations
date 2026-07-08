const assignmentModel = require('../../Models/Assignment/assignment.model')
const assignmentTopicModel = require('../../Models/AssignmentInputModel/assignment.input.model')
const {uploadforAssessment}= require('../../Multer/multer')
const fs = require('fs')
const pdfDocument= require('pdfkit')
const multer =require('multer')
const FormData = require('form-data')
const axios =require('axios')
const data = require('../../data.json')
const subscriptionModel = require('../../Models/SuperAdminModels/subscription.model')
const courseModel = require('../../Models/CourseModels/course.model')
const staffModel = require('../../Models/UserModels/staff.model')
const {imageKitConfig,fileIdByName}= require('../../ImageKit.IO Setup/setup')
const assignmentUploadingModel = require('../../Models/Assignment/assignmentUploading.model')
const instituteModel = require('../../Models/InstituteBatchesClasses/Institute.model')
// pdf file creating function

// MUlter Storage setting

const checking=async(req,res)=>{
try{
    const{fileName}= req.body
    const document= createPdf(fileName,data)
    if(!document){
        console.log("Issue in Creating Document")
    return res.status(400).json({message:"Issue in Creating Document"})
    }
    return res.status(200).json({message:"Document Created Successfully"})
}
catch(error){
    console.log("Issue in Creating Pdf ",error)
    return res.status(404).json({message:"Issue in Creating Pdf"})
}
}


const createAutoAssignmentByGivingFile = async(req,res)=>{
    try {
        
        console.log('Function Running')
        // const {course} =req.body
        if(!req.file){
            console.log("PDF not Found")
            return res.status(203).json({message:"PDF not Found"})
        }
        
        // will done committed work  
    //     const checkNoOfAssignmentofParticularCourse = await assignmentModel.find({course:course}) 
    //     if(checkNoOfAssignmentofParticularCourse.length>3){
    //     console.log("Already Four Assignment Uplaoded of Particular Subject")
    //     return res.status(201).json({message:'Already 4 assignments uploaded '})
    // }
    // const assignmentDateChecker = await assignmentDateCalculator(course)
    // console.log('Assignment Date Message',assignmentDateChecker)
    // if(!assignmentDateChecker){
    //     console.log("Not 30 Days Completed")
    //     return res.status(202).json({message:"30 Days not Completed"})
    // }

        const formData = new FormData()
        formData.append('pdf',req.file.buffer,req.file.originalname)
    

        // const response = await axios.post("http://localhost:4000/setup/generate-assignment-from-pdf",formData,{headers:formData.getHeaders()})
        const response = await axios.post("https://huggingface-configuration.vercel.app/setup/generate-assignment-from-pdf",formData,{headers:formData.getHeaders()})
        console.log("Response is: ",response)
        if(!response){
            console.log("Issue in API calling From Hugging Face Server")
            return res.status(400).json({message:"Request Failed Here"})
        } 
        const data = response.data
        const parseData =JSON.parse(data.assignment)
        console.log(parseData)
        const fileName = `${Date.now()}file.pdf`
        const document=createPdf(fileName,parseData)
        if(!document){
            console.log("Issue in Creating Document")
            return res.status(402).json({message:"Issue in Creating Assignment"})
        }

        return res.status(200).json({message:"Document Created Successfully"})
        
    } catch (error) {
        console.log("Error in Get Assignment Data function",error)
        return res.status(404).json({message:"Error in Get Assignment Data Function"})
    }
}


const checkAssignmentInput =async()=>{
    try {
        const getPendingAssignment = await assignmentTopicModel.find({status:'pending'})
        // console.log(getPendingAssignment)
       
       const pendingAssignemntCourse= getPendingAssignment.map((currentElement,currentIndex)=>{
                return [currentElement.course.toString(),currentElement]
       })

       const uniquePendingCourse = [
        ... new Map(pendingAssignemntCourse).values() //confused (dry run needed)
       ]

    //  running loop of every unique course and match date first and get only allowed courses
    const allowedCourse=[]
    
       for (const currentElement of uniquePendingCourse){
        const result = await assignmentDateCalculator(currentElement.course)
        // console.log(result)
        if(result.message==true){
            allowedCourse.push(currentElement)
        } 
       }

       console.log("Allowed Array", allowedCourse)
       for(const currentObject of allowedCourse){
        const message = await autoAssignmentCreation(currentObject)
        console.log(message)
       }
       return {message:'Work Completed'}
    
    //  now will push this array into reddis /or if array small will apply function directly
    
    }
     catch (error) {
    console.log('Error in Check Assignment Input ',error)    
    return {message:"Error in check Assignment Input",error}   
    }
}



const createPdfInBuffer = async (text, info) => {
try {
             return new Promise((resolve, reject) => {
            const questions = text.questions
            const document = new pdfDocument()
            const buffers = []
            // collect chunks
            document.on('data', (chunk) => {
                buffers.push(chunk)
            })
            // completed
            document.on('end', () => {
                const pdfBuffer = Buffer.concat(buffers)
                console.log("PDF Buffer Created Successfully")
                resolve(pdfBuffer)
            })
            // error handling
            document.on('error', (error) => {
                reject(error)
            })
            // PDF Formatting
            document
                .fontSize(20)
                .text(`${info.instituteName}`, {
                    align: 'center',
                    underline: true
                })
            document.moveDown(2)
            document
                .fontSize(16)
                .text('Assignment', {
                    align: 'center'
                })
            document.moveDown(1)
            document
    .fontSize(16)
    .text(`Teached By ${info.instructorName}`, {
        align: 'left',
        continued: true
    })
    .text(`Total Marks: ${text.total_marks}`, {
        align: 'right'
    })

            document.moveDown(1)
            document
                .fontSize(16)
                .text(`${text.title}`, {
                    align: 'center'
                })
            document.moveDown(1)
            for (let i = 0; i < questions.length; i++) {
    
                    document.fontSize(12).text(`${questions[i]}`, {align: 'left'})
                    document.moveDown(0.5)
                }
                document.end() }  )
    }
    catch (error) {
        console.log("Error in creating Pdf", error)    }
}
// }
// else{
//     for (let i = 0; i < questions.length; i++) {
//         document.fontSize(12).text(`Q${i + 1} ${questions[i].question}`, {
//                 align: 'left'
//             })
//         document.moveDown(0.5)
//         for (let j =0;j<questions[i].options.length;j++){
//             document.fontSize(12).text(`${j+1} ${questions[i].options[j]}`)
//             document.moveDown(0.2)
//         }
//         document.moveDown(0.8)
//     }
// }


// }

const createPdf = (fileName,text,info)=>{
try {
    

    const questions= text.questions
    console.log("Text is",text)
    console.log("Questions is ",questions)
 
    const document = new pdfDocument()
    document.pipe(fs.createWriteStream(fileName))
    // pdf formatting 
    document.fontSize(20).text(`${info.instituteName}`,{align:'center',underline:true})
    document.moveDown(2)

    document.fontSize(16).text('Assignment',{align:'center'})
    document.moveDown(1)

    document.fontSize(16).text(`Teached By ${info.instructorName}`,{align:'center'})
    document.moveDown(1)

    document.fontSize(16).text(`${text.title}`,{align:'center'})
    document.moveDown(1)

    for(let i=0;i<questions.length;i++){
       document.fontSize(12).text(`Q${i+1} ${questions[i]}`,{align:'left'})
       document.moveDown(0.5)
    }
 
    document.end()
    console.log("PDF created Successfully") 
    return document
} catch (error) {
    console.log("Error in creating Pdf",error)

}
//     }
//     else{
    
//     const document = new pdfDocument()
//     document.pipe(fs.createWriteStream(fileName))
//     // pdf formatting 
//     document.fontSize(20).text("Maryam Ali Amaaz Institute",{align:'center',underline:true})
//     document.moveDown(2)

//     document.fontSize(16).text('Assignment',{align:'center'})
//     document.moveDown(1)

//     text.forEach((data,index)=>{
//     document.fontSize(12).text(`Q${index+1}) ${data.question}`,{align:'left'})
//     document.moveDown(0.5)
// })
//     document.end()
//     return document
// }

}


const assignmentFileCreation = (topic,fileName)=>{
    try {
        // const {topic}=req.body
        let topicToLowerCase = topic.toLowerCase()
        console.log("Lower case topic :",topicToLowerCase)
        const raw =fs.readFileSync('./Question Answer JSON/biology.json',"utf8")
        const data = JSON.parse(raw)
        
        console.log("Here data is ",data)
        const filtered = data.questions.filter((response)=>{
            return response.question.includes(topicToLowerCase)    })        
            // return res.status(200).json({message:"Data get successfully",filtered})
            const pdfFile = createPdf(fileName,filtered) 
            return pdfFile
            // return filtered
        } catch (error) {
            console.log("Error in topic getting function ",error)  
            return error.message  
            // return res.status(404).json({message:"Error in File Creation function"})
        }
    }
    
    // auto assignment setting remain 
    async function assignmentDateCalculator(course){
        try {
            console.log('course',course) 
            const assignment = await assignmentModel.find({course:course})
            if(!assignment || assignment.length<1){
                console.log("No Assignment Found")
                return {message:true}
            }
            let assignmentLength = assignment.length
            // console.log(assignmentLength)
            const generatedDate= assignment[assignmentLength-1].generatedDate 
            // console.log(assignment[assignmentLength-1].generatedDate)

            const generateTime = generatedDate.getTime()
            // console.log(generateTime)

            const currentTime = Date.now()
            // console.log(currentTime)
            // if()

            // const totalMiliSecondCountingInMonth = (30*24*60*60*1000) //will uncomment after testing
            const totalMiliSecondCountingInMonth= 12
            // console.log(currentTime-generateTime)
            if(currentTime-generateTime<totalMiliSecondCountingInMonth){
                return {message:false}
            }
            else{
                return {message:true}
            }

        } catch (error) {
            console.log("Error in assignment Date checker",error)
        }
    }


const autoAssignmentCreation=async(inputObject)=>{
try
    {
        // console.log("Input Object is :",inputObject)
        const topic = inputObject.assignmentTopic
        // console.log("Topic is:",topic)
        const course = inputObject.course
        const fileName = topic+'file.pdf'
        const createdBy = inputObject.instructor
        const assignmentFile = 'abc'
        const duration = 7
const checkNoOfAssignmentofParticularCourse = await assignmentModel.find({course:course}) 
    if(checkNoOfAssignmentofParticularCourse.length>10){ //will change to 3
        console.log("Already Four Assignment Uplaoded of Particular Subject")
        return {message:'Already 4 assignments uploaded '}
    }
    
    const assignment = assignmentFileCreation(topic,fileName)
    const assignmentCreate= await assignmentModel.create({assignmentFile:assignmentFile,course:course,createdBy,duration})

    if(!assignmentCreate){
        console.log("Issue in Creating Assignment ")
        return {message:"Issue in Creating Assignment"}
    }
    const changeInputStatus = await assignmentTopicModel.updateOne({course:course,assignmentTopic:topic},{status:'uploaded'})
        console.log('ChangeInputStatus',changeInputStatus) 
    // console.log("Assignment also created Successfully ",assignment)
    return {message:"Successfully Create Assignment",assignmentCreate }
    
} catch (error) {
    console.log("Error in Assignment Creation Function ",error)
    return {message:'Issue in Create Assignement Function ',error}

} 

}

const assignmentQueueCalling =async (req,res)=>{
try {
    const message = await checkAssignmentInput()
    if(!message){
        return res.status(400).json({message:'Assignment Queue Calling Function having some issue'})
    }
    return res.status(200).json({message:"Done and Dusted",message})
} catch (error) {
    console.log('Issue in Assignment Queue Function',error)
    return res.status(404).json({message:"Issue in Assignment Queue Function",error})
}
}

const createAssignment=async(req,res)=>{
try {
    // 
        const {assignmentFile,course,createdBy,duration,topic,fileName}=req.body
    
    // Auto Assignment Agent Functionality
    
    // check existing assignment of particular subject
    const checkNoOfAssignmentofParticularCourse = await assignmentModel.find({course:course}) 
    if(checkNoOfAssignmentofParticularCourse.length>3){
        console.log("Already Four Assignment Uplaoded of Particular Subject")
        return res.status(201).json({message:'Already 4 assignments uploaded '})
    }

    // Date Calculation work remain??
    const assignment = assignmentFileCreation(topic,fileName)
    const assignmentCreate= await assignmentModel.create({assignmentFile:assignmentFile,course:course,createdBy,duration})

    if(!assignmentCreate){
        console.log("Issue in Creating Assignment ")
        return res.status(400).json({message:"Issue in Creating Assignment"})
    }
    console.log("Assignment also created Successfully ",assignment)
    return res.status(200).json({message:"Successfully Create Assignment",assignmentCreate })
    
} catch (error) {
    console.log("Error in Assignment Creation Function ",error)
    return res.status(404).json({message:'Issue in Create Assignement Function ',error})
} 
}



const manualAssignmentCreationByPdfUploading = async(req,res)=>{
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
        console.log("Cant Upload Assignment Untill Assign Instructor To Course")
        return res.status(400).json({message:"Assignment Creation Failed Due To No Instructor Assigned"})
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
    const checkNoOfAssignmentOfParticularCourse = await assignmentModel.find({course:courseId}).countDocuments()
    console.log(checkNoOfAssignmentOfParticularCourse)
    
    if(checkNoOfAssignmentOfParticularCourse >= 4){
        console.log("Aleady Four Assignment of Particular Course Uploaded")
        return res.status(200).json({message:"Aleady Four Assignment of Particular Course Uploaded"})
        
    }
    else{
        const createManualAssignment = await assignmentModel.create({instituteId:instituteId,course:courseId,createdBy:staffId,duration:duration})

        console.log("Manual Assignment Created Successfully",createManualAssignment)
       if(!createManualAssignment){
        console.log("Issue in Creating Manual Assignment ")
        return res.status(400).json({message:"Issue in Creating Manual Assignment"})
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
                        createManualAssignment.assignmentFile=imageKitUrl
                        await createManualAssignment.save()
                    }
       
        return res.status(200).json({message:"Assignment Created Successfully",createManualAssignment})
        // console.log("You can Upload Assignment ")
        // return res.status(200).json({message:"You can Upload Assignment"})


       
    }
    // console.log("Same Id")
}

    console.log("Institute Or Instructor ID mismatched")
    return res.status(400).json({message:"Institute Or Instructor ID mismatched"})
    // humay yahan yeh check karwana hai hum usi course ka assignment bana sake jo is institute ka hai , or wahi staff bana sake jo is institute me yeh course parhata ho , matlab koi dosra banda kisi dosre insitute ka id pass karke na bana or na hi isi institute ka koi dosra teacher jo yeh course na parhata ho

}
catch(error){
    console.log("Error in manual Assignment Creation Function",error)
    return res.status(400).json({message:"Error in Manual Assignment Creation Function",error})
}
}



const assignmentManualMarksUploadingByTeacher= async(req,res)=>{
try {
    const {staffId,assignmentId,studentId,marks}= req.body
    
    const getMatchInstructor = await assignmentModel.findOne({_id:assignmentId,createdBy:staffId})
    
    // console.log("Get Match Instructor",getMatchInstructor)
    if(!getMatchInstructor){
        console.log("Instructor not Match")
        return res.status(400).json({message:'Instructor Not Match'})
    } 
    
     const checkIsAssignmentUploadedByStudentOrNot = await assignmentUploadingModel.findOne({assignmentId:assignmentId,studentId:studentId})
    if(!checkIsAssignmentUploadedByStudentOrNot){
        console.log("Student not Assignment Quiz Yet")
        return res.status(400).json({message:"Student not Uploaded Assignment Yet"})
    }
    // console.log("Uploaded Quiz Found ")
    let assignMarksInfo = checkIsAssignmentUploadedByStudentOrNot.marksAssigned
    console.log("Assign Marks In    fo",assignMarksInfo)
    if(assignMarksInfo)
        {
            console.log("Marks Already Assign")
            return res.status(200).json({message:"Marks Already Assign"})
        }
    const maxMarks = checkIsAssignmentUploadedByStudentOrNot.maxMarks

        if(marks>maxMarks || marks<0){
            console.log("Please Give Marks Between max marks and Zero")
            return res.status(200).json({message:`Please Give Marks Between 0 & ${maxMarks} `})
        }
     checkIsAssignmentUploadedByStudentOrNot.marks = marks
     checkIsAssignmentUploadedByStudentOrNot.marksAssigned= true

     checkIsAssignmentUploadedByStudentOrNot.save()

    return res.status(200).json({message:"Uploaded Assignment Found Successfully",checkIsAssignmentUploadedByStudentOrNot})

} 
catch (error) {
    console.log("Error in Uploading Manual Marks Function",error)
    return res.status(404).json({message:"Issue in Uploading Maunal Marks Function",error})
}
}


const AIAssignmentCreationByTopic = async(req,res)=>{
try{
    
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
        console.log("Cant Upload Assignment Untill Assign Instructor To Course")
        return res.status(400).json({message:"Assignment Creation Failed Due To No Instructor Assigned"})
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
    const checkNoOfAssignmentOfParticularCourse = await assignmentModel.find({course:courseId}).countDocuments()
    console.log(checkNoOfAssignmentOfParticularCourse)
    
    if(checkNoOfAssignmentOfParticularCourse >= 4){
        console.log("Aleady Four Assignment of Particular Course Uploaded")
        return res.status(200).json({message:"Aleady Four Assignment of Particular Course Uploaded"})
        
    }
    else{
        const createManualAssignment = await assignmentModel.create({instituteId:instituteId,course:courseId,createdBy:staffId,duration:duration})

        console.log("Manual Assignment Created Successfully",createManualAssignment)
       if(!createManualAssignment){
        console.log("Issue in Creating Manual Assignment ")
        return res.status(400).json({message:"Issue in Creating Manual Assignment"})
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
                        createManualAssignment.assignmentFile=imageKitUrl
                        await createManualAssignment.save()
                    }
       
        return res.status(200).json({message:"Assignment Created Successfully",createManualAssignment})
        // console.log("You can Upload Assignment ")
        // return res.status(200).json({message:"You can Upload Assignment"})
    }
    // console.log("Same Id")
}

    console.log("Institute Or Instructor ID mismatched")
    return res.status(400).json({message:"Institute Or Instructor ID mismatched"})
    // humay yahan yeh check karwana hai hum usi course ka assignment bana sake jo is institute ka hai , or wahi staff bana sake jo is institute me yeh course parhata ho , matlab koi dosra banda kisi dosre insitute ka id pass karke na bana or na hi isi institute ka koi dosra teacher jo yeh course na parhata ho

}
catch(error){
    console.log("Error in manual Assignment Creation Function",error)
    return res.status(400).json({message:"Error in Manual Assignment Creation Function",error})
}
}




const createAssignmentsViaTopic =async(data)=>{
    try {
        const {topicsName,noOfQuestions,difficultyLevel,totalMarks} =data

        const response = await axios.post('https://huggingface-configuration.vercel.app/setup/generateAssignmentByTopic',{
            topicsName,
            totalMarks,
            noOfQuestions,
            difficultyLevel,
            format:"JSON"
        })
        if(!response){
            const message="LLM not responding"
            console.log(message)
            return message
        }
           const finalData = response.data
        console.log("LLM give data successfully",finalData)
        return finalData
       
    } catch (error) {
        console.log("Error in Getting Assignment Data from LLM",error)
        return error
    }
}

const functionOfSelectingOfAssignmentTypeForCreation = async (req, res) => {
    try {

        const { mainAssignmentTopicsId } = req.body

        const result = await processAssignmentTopic(mainAssignmentTopicsId)

        if (!result.success) {
            return res.status(400).json(result)
        }

        return res.status(200).json(result)

    } catch (error) {

        console.log("Error in Assignment Selecting Type Function", error)

        return res.status(500).json({
            message: "Error in Assignment Selecting Type Function",
            error: error.message
        })
    }
}

const processAssignmentTopic = async (mainAssignmentTopicsId) => {

    const assignmentTopicsInfo =
        await assignmentTopicModel.findById(mainAssignmentTopicsId)

    if (!assignmentTopicsInfo) {
        return {
            success: false,
            message: "Assignment Topic Record Not Found"
        }
    }

    const getArrayOfAssignmentTopics =
        assignmentTopicsInfo.assignmentTopics

    const filterOnlyPendingAssignment =
        getArrayOfAssignmentTopics.filter((currentElement) => {

            return (
                currentElement.status === "pending" &&
                currentElement.source === "outside"
            )

        })


    if (filterOnlyPendingAssignment.length < 1) {
        assignmentTopicsInfo.job='completed'
        await assignmentTopicsInfo.save()
        return {
            success: false,
            message: "No Topic is Pending to Create Assignment"
        }
    }

    const getDateOfLastAssignmentCreated =
        assignmentTopicsInfo.dateOfLastAssignmentCreated

    if (!getDateOfLastAssignmentCreated) {

        return await createAssignmentFunction(
            assignmentTopicsInfo,
            filterOnlyPendingAssignment
        )
    }

    const todayMilliseconds = Date.now()

    const lastAssignmentMilliseconds =
        new Date(getDateOfLastAssignmentCreated).getTime()

    const assignmentGapDays =
        Number(assignmentTopicsInfo.assignmentGapDuration)

    const assignmentGapMilliseconds =
        assignmentGapDays * 24 * 60 * 60 * 1000

    const difference =
        todayMilliseconds - lastAssignmentMilliseconds

    if (difference < assignmentGapMilliseconds) {

        return {
            success: false,
            message: `${assignmentGapDays} Days Not Completed Yet`
        }
    }

    return await createAssignmentFunction(
        assignmentTopicsInfo,
        filterOnlyPendingAssignment
    )
}

const createAssignmentFunction = async (
    assignmentTopicsInfo,
    filterOnlyPendingAssignment
) => {

    const getFirstTopicFromListOfTopics =
        filterOnlyPendingAssignment[0]

    const topicName =
        getFirstTopicFromListOfTopics.topicName

    const inputData = {
        topicsName: topicName,
        totalMarks: getFirstTopicFromListOfTopics.totalMarks,
        noOfQuestions: getFirstTopicFromListOfTopics.noOfQuestions,
        difficultyLevel: getFirstTopicFromListOfTopics.difficultyLevel
    }

    const assignmentData =
        await createAssignmentsViaTopic(inputData)

    if (
        !assignmentData ||
        assignmentData.message !== "Done"
    ) {
        return {
            success: false,
            message: "Issue in Getting Result from LLM"
        }
    }

    assignmentTopicsInfo.dateOfLastAssignmentCreated =
        new Date()

    for (
        let i = 0;
        i < assignmentTopicsInfo.assignmentTopics.length;
        i++
    ) {

        if (
            assignmentTopicsInfo.assignmentTopics[i].topicName
            === topicName
        ) {

            assignmentTopicsInfo.assignmentTopics[i].status =
                "uploaded"

            break
        }
    }

    await assignmentTopicsInfo.save()

    const instituteInfo =
        await instituteModel.findById(
            assignmentTopicsInfo.instituteId
        )

    if (!instituteInfo) {

        return {
            success: false,
            message: "Institute Not Found"
        }
    }

    const instructorInfo =
        await staffModel.findById(
            assignmentTopicsInfo.instructor
        )

    if (!instructorInfo) {

        return {
            success: false,
            message: "Instructor Not Found"
        }
    }

    const info = {
        instituteName: instituteInfo.name,
        instructorName: instructorInfo.name
    }

    const data = assignmentData.finalResult

    const parseData = JSON.parse(data)

    const fileName =
        `${inputData.topicsName} assignment file.pdf`

    const pdfBuffer =
        await createPdfInBuffer(parseData, info)

    if (!pdfBuffer) {

        return {
            success: false,
            message: "Issue in Creating PDF Buffer"
        }
    }

    const imageKitResponse =
        await imageKitConfig.upload({
            file: pdfBuffer,
            fileName,
            folder: "/assignmentFile"
        })

    const getUrl = imageKitResponse.url

    if (!getUrl) {

        return {
            success: false,
            message: "Issue in Uploading PDF"
        }
    }

    const assignmentQuestions =
        JSON.stringify(parseData)

    const assignmentCreation =
        await assignmentModel.create({
            instituteId: assignmentTopicsInfo.instituteId,
            assignmentFile: getUrl,
            course: assignmentTopicsInfo.course,
            createdBy: assignmentTopicsInfo.instructor,
            duration: 7,
            assignmentQuestions
        })

    if (!assignmentCreation) {

        return {
            success: false,
            message: "Issue in Creating Assignment"
        }
    }

    const findSubscription =
        await subscriptionModel.findOne({
            instituteId: assignmentTopicsInfo.instituteId
        })

    if (!findSubscription) {

        return {
            success: false,
            message:
                "No Subscription Found Against This Institute"
        }
    }

    findSubscription.aiUsage.assignmentGeneratorUsed += 1
    findSubscription.aiUsage.totalAiRequests += 1

    await findSubscription.save()

    return {
        success: true,
        message: "Document Created Successfully",
        data,
        getUrl,
        assignmentCreation
    }
}

module.exports = {createAssignment,assignmentFileCreation,assignmentDateCalculator,autoAssignmentCreation,assignmentQueueCalling,checkAssignmentInput,checking,createAutoAssignmentByGivingFile,manualAssignmentCreationByPdfUploading,assignmentManualMarksUploadingByTeacher,functionOfSelectingOfAssignmentTypeForCreation,processAssignmentTopic}



// const functionOfSelectingOfAssignmentTypeForCreation = async (req, res) => {

//     try {
//         const { mainAssignmentTopicsId } = req.body
//         const assignmentTopicsInfo = await assignmentTopicModel.findById(mainAssignmentTopicsId)
//         if (!assignmentTopicsInfo) {
//             return res.status(404).json({
//                 message: "Assignment Topic Record Not Found"
//             })
//         }
//         const getArrayOfAssignmentTopics = assignmentTopicsInfo.assignmentTopics
//         const filterOnlyPendingAssignment = getArrayOfAssignmentTopics.filter((currentElement) => {
//             return currentElement.status == 'pending'
//                 && currentElement.source == 'outside'

//         })
//         if (filterOnlyPendingAssignment.length < 1) {
//             return res.status(404).json({
//                 message: "No Topic is Pending to Create Assignment"
//             })
//         }
//         const getDateOfLastAssignmentCreated = assignmentTopicsInfo.dateOfLastAssignmentCreated

//         // if first assignment not created
//         if (!getDateOfLastAssignmentCreated) {
//             return await createAssignmentFunction(
//                 assignmentTopicsInfo,
//                 filterOnlyPendingAssignment,
//                 res)}

//         // compare dates
//         const todayMilliseconds = Date.now()
//         const lastAssignmentMilliseconds =new Date(getDateOfLastAssignmentCreated).getTime()
//         console.log("Last Assignment Created Date in Mili Second",lastAssignmentMilliseconds)
//         const assignmentGapDays =Number(assignmentTopicsInfo.assignmentGapDuration)
//         const assignmentGapMilliseconds =assignmentGapDays * 24 * 60 * 60 * 1000
//         console.log("Assignment Gap in Mili Second :",assignmentGapMilliseconds)
//         const difference =todayMilliseconds - lastAssignmentMilliseconds
//         console.log("Difference In Mili Second",difference)
//         if (difference < assignmentGapMilliseconds) {
//             return res.status(400).json({
//                 message: `${assignmentGapDays} Days Not Completed Yet`
//             })
//         }

//         // create next assignment
//         return await createAssignmentFunction(
//             assignmentTopicsInfo,
//             filterOnlyPendingAssignment,
//             res
//         )

//     }

//     catch (error) {

//         console.log("Error in Assignment Selecting Type Function", error)

//         return res.status(500).json({
//             message: "Error in Assignment Selecting Type Function",
//             error: error.message
//         })
//     }
// }

// const createAssignmentFunction = async (assignmentTopicsInfo,filterOnlyPendingAssignment,res) => {

//     const getFirstTopicFromListOfTopics =filterOnlyPendingAssignment[0]

//     const topicName =getFirstTopicFromListOfTopics.topicName
//     const inputData = {
//         topicsName: topicName,
//         totalMarks: getFirstTopicFromListOfTopics.totalMarks,
//         noOfQuestions: getFirstTopicFromListOfTopics.noOfQuestions,
//         difficultyLevel: getFirstTopicFromListOfTopics.difficultyLevel
//     }

//     const assignmentData =await createAssignmentsViaTopic(inputData)

//     if (assignmentData.message !== "Done") {
//         return res.status(400).json({
//             message: "Issue in Getting Result from LLM"
//         })
//     }

//     // save date
//     assignmentTopicsInfo.dateOfLastAssignmentCreated =new Date()

//     // update topic status
//     for (let i = 0; i < assignmentTopicsInfo.assignmentTopics.length; i++) {

//         if (assignmentTopicsInfo.assignmentTopics[i].topicName == topicName) {
//             assignmentTopicsInfo.assignmentTopics[i].status ='uploaded'
//             break
//         }
//     }

//     await assignmentTopicsInfo.save()

//     // institute info
//     const instituteInfo =await instituteModel.findById(assignmentTopicsInfo.instituteId)

//     if (!instituteInfo) { return res.status(404).json({ message: "Institute Not Found" })}

//     // instructor info
//     const instructorInfo =await staffModel.findById( assignmentTopicsInfo.instructor )

//     if (!instructorInfo) {return res.status(404).json({message: "Instructor Not Found"})}

//     const info = {
//         instituteName: instituteInfo.name,
//         instructorName: instructorInfo.name,
//         // assignmentType :getTypeOfAssignment
//     }

//     const data = assignmentData.finalResult

//     const parseData = JSON.parse(data)

//     const fileName =`${inputData.topicsName} assignment file.pdf`

//     // const document = createPdf(fileName, parseData, info) // yeh function file system ki madad se file create kar raha tha lekin humay buffer ka use karna hai is liye humne is function ko commit kardia


//     const pdfBuffer = await createPdfInBuffer(parseData, info)
//     if (!pdfBuffer) {
//         return res.status(400).json({ message: "Issue in Creating PDF in Buffer"})}

// const imageKitResponse= await imageKitConfig.upload({
//                         file:pdfBuffer,
//                         fileName:fileName,
//                         folder:"/assignmentFile"
//                     })
//                     const getUrl = imageKitResponse.url

// if(getUrl.length>0 || getUrl){
//     const assignmentQuestions = JSON.stringify(parseData)
//     const assignmentCreation = await assignmentModel.create({instituteId:assignmentTopicsInfo.instituteId,assignmentFile:getUrl,course:assignmentTopicsInfo.course,createdBy:assignmentTopicsInfo.instructor,duration:7,assignmentQuestions:assignmentQuestions})
//     if(!assignmentCreation){
//         console.log("Issue in Creating Assignment")
//         return res.status(400).json({message:"Issue in Creating Assignment"})
//     }   
//     const findSubscription = await subscriptionModel.findOne({instituteId:assignmentTopicsInfo.instituteId})
//     if(!findSubscription){
//       return res.status(404).json({message:"No Subscription Found Agaisnt This Institute"})
//     }
//     findSubscription.aiUsage.assignmentGeneratorUsed+=1
//     findSubscription.aiUsage.totalAiRequests+=1
//     await findSubscription.save()

// return res.status(200).json({message: "Document Created Successfully",data,getUrl,assignmentCreation,findSubscription})
// }
// // ab yahan humne assignemnt model ke through assignment to upload kardia but ab yahan issue hai  yeh k validations check nhi ki jo hum limit check karte hai k total kitne no of assignments hone chahiye , agr koi manual assignment banaya gya hai to is me or AI wale assignment me kitne din ka gap hona chahiye
// return res.status(200).json({message: "Document Created Successfully, not Uploaded in Assignment Model",data,getUrl})
// }