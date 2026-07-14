const instituteModel = require("../../Models/InstituteBatchesClasses/Institute.model");
const subscriptionModel = require("../../Models/SuperAdminModels/subscription.model");
const studentRegistrationModel = require("../../Models/UserModels/studentRegistration.model");
const staffModel = require("../../Models/UserModels/staff.model");
const superAdminMonthlyReportModel = require("../../Models/SuperAdminModels/superAdminMonthlyReport");
const {imageKitConfig} = require("../../ImageKit.IO Setup/setup");

const PDFDocument = require("pdfkit");


const generateSuperAdminPDF = (
data,
aiUsage,
monthName,
year
)=>{


return new Promise((resolve,reject)=>{


try{


const doc = new PDFDocument({
margin:40
});


const buffers=[];


doc.on("data",chunk=>buffers.push(chunk));


doc.on("end",()=>{
resolve(Buffer.concat(buffers))
});



doc.fontSize(22)
.text(
"Super Admin Monthly Report",
{
align:"center"
}
);



doc.moveDown();

doc.fontSize(16)
.text(
`${monthName} ${year}`,
{
align:"center"
}
);



doc.moveDown(2);



doc.fontSize(14)
.text("Institute Statistics");


doc.fontSize(12)
.text(
`Total Institutes: ${data.totalInstitutes}`
)
.text(
`Active Institutes: ${data.activeInstitutes}`
)
.text(
`Expired Institutes: ${data.expiredInstitutes}`
)
.text(
`New Institutes: ${data.newInstitutesThisMonth}`
);



doc.moveDown();


doc.fontSize(14)
.text("User Statistics");


doc.fontSize(12)
.text(
`Total Students: ${data.totalStudents}`
)
.text(
`Total Staff: ${data.totalStaff}`
);



doc.moveDown();


doc.fontSize(14)
.text("Revenue");


doc.fontSize(12)
.text(
`Total Revenue: ${data.totalRevenue}`
);



doc.moveDown();


doc.fontSize(14)
.text("AI Usage");


Object.keys(aiUsage).forEach(key=>{

doc.fontSize(12)
.text(
`${key}: ${aiUsage[key]}`
)

});



doc.end();



}
catch(error){

reject(error)

}


})


}




const generateSuperAdminMonthlyReport = async()=>{


try{


const today = new Date();


const month = today.getMonth()+1;

const year = today.getFullYear();


const monthName = today.toLocaleString(
"default",
{
month:"long"
}
);



// prevent duplicate report

const alreadyExist =
await superAdminMonthlyReportModel.findOne({
month,
year
});


if(alreadyExist){

return {
message:"Report already generated"
}

}




const subscriptions =
await subscriptionModel.find();





let currentAI={

totalAiRequests:0,

assignmentGeneratorUsed:0,

quizGeneratorUsed:0,

examGeneratorUsed:0,

contentGeneratorUsed:0,

assignmentCheckerUsed:0,

quizCheckerUsed:0

};





subscriptions.forEach(sub=>{


const ai=sub.aiUsage || {};


Object.keys(currentAI)
.forEach(key=>{


currentAI[key]+=Number(ai[key] || 0);


})


});







const totalRevenue =
subscriptions.reduce(
(sum,sub)=>{


return sum + Number(
sub.amountPaid || 0
);


},
0
);






const totalInstitutes =
await instituteModel.countDocuments();





const activeInstitutes =
await subscriptionModel.countDocuments({
status:"Active"
});





const expiredInstitutes =
await subscriptionModel.countDocuments({
status:"Expired"
});






const newInstitutesThisMonth =
await instituteModel.countDocuments({

createdAt:{

$gte:new Date(
year,
month-1,
1
),

$lte:new Date(
year,
month,
0,
23,
59,
59
)

}

});






const totalStudents =
await studentRegistrationModel.countDocuments();




const totalStaff =
await staffModel.countDocuments();







const pdfBuffer =
await generateSuperAdminPDF(

{

totalInstitutes,

activeInstitutes,

expiredInstitutes,

newInstitutesThisMonth,

totalStudents,

totalStaff,

totalRevenue

},

currentAI,

monthName,

year

);







const uploadResponse =
await imageKitConfig.upload({

file:pdfBuffer,

fileName:
`superadmin_${month}_${year}.pdf`

});





const report =
await superAdminMonthlyReportModel.create({

month,

year,

totalInstitutes,

activeInstitutes,

expiredInstitutes,

newInstitutesThisMonth,

totalStudents,

totalStaff,

totalRevenue,

aiUsage:currentAI,

reportPdf:uploadResponse.url

});






return {

message:
"Super Admin Report Generated Successfully",

report

};



}
catch(error){

console.log(error);


return {

message:"Error generating report",

error:error.message

}


}


}



module.exports={
generateSuperAdminMonthlyReport
}