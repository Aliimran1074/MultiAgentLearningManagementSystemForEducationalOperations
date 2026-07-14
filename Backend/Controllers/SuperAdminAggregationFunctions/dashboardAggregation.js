const instituteModel = require("../../Models/InstituteBatchesClasses/Institute.model");
const subscriptionModel = require("../../Models/SuperAdminModels/subscription.model");
const studentRegistrationModel = require("../../Models/UserModels/studentRegistration.model");
const staffModel = require("../../Models/UserModels/staff.model");

const dashboardOverviewAggregation = async () => {

    const totalInstitutes =
    await instituteModel.countDocuments();

    const activeSubscriptions =
    await subscriptionModel.countDocuments({
        status: "Active"
    });

    const totalStudents =
    await studentRegistrationModel.countDocuments();

    const totalStaff =
    await staffModel.countDocuments();

    const totalUsers =
    totalStudents + totalStaff;

    const subscriptionDistribution =
    await subscriptionModel.aggregate([

        {
            $match:{
                status:"Active"
            }
        },

        {
            $group:{
                _id:"$scopeType",
                value:{
                    $sum:1
                }
            }
        },

        {
            $project:{
                _id:0,
                name:{
                    $switch:{
                        branches:[
                            {
                                case:{
                                    $eq:["$_id","institute"]
                                },
                                then:"Institute"
                            },
                            {
                                case:{
                                    $eq:["$_id","batch"]
                                },
                                then:"Batch"
                            },
                            {
                                case:{
                                    $eq:["$_id","individual"]
                                },
                                then:"Individual"
                            }
                        ],
                        default:"Other"
                    }
                },
                value:1
            }
        }

    ]);

    return{

        totalInstitutes,

        activeSubscriptions,

        totalUsers,

        subscriptionDistribution

    };

}

const getDashboardOverview = async(req,res)=>{

try{

const data =
await dashboardOverviewAggregation();

res.json({

success:true,
data

});

}
catch(error){

res.status(500).json({

success:false,
message:error.message

});

}

}


const getSubscriptionManagement = async (req, res) => {

    try {

        const subscriptions = await subscriptionModel.aggregate([

            {
                $lookup: {
                    from: "subscriptionplanmodels",
                    localField: "planId",
                    foreignField: "_id",
                    as: "plan"
                }
            },

            {
                $unwind: "$plan"
            },


            {
                $lookup: {
                    from: "institutemodels",
                    localField: "instituteId",
                    foreignField: "_id",
                    as: "institute"
                }
            },

            {
                $unwind: "$institute"
            },


            {
                $addFields: {

                    daysRemaining: {
                        $ceil: {
                            $divide: [
                                {
                                    $subtract: [
                                        "$endDate",
                                        new Date()
                                    ]
                                },
                                1000 * 60 * 60 * 24
                            ]
                        }
                    },


                    features: {
                        $concatArrays: [
                            {
                                $ifNull: [
                                    "$plan.aiFeatures.features",
                                    []
                                ]
                            },
                            {
                                $ifNull: [
                                    "$plan.manualFeatures",
                                    []
                                ]
                            }
                        ]
                    }

                }
            },


            {
                $project: {

                    _id:1,

                    instituteName: "$institute.name",

                    plan: "$plan.subscriptionName",

                    price: "$plan.price",

                    features:1,
                    scopeType:1,
                    startDate:1,
                    endDate:1,
                    daysRemaining:1,
                    status:1,

                    // temporary because payment module not created yet
                    paymentStatus:{
                        $literal:"Paid"
                    },

                    autoRenew:{
                        $literal:false
                    },
                    aiUsage:1
                }
            }
        ])
        const summary = await subscriptionModel.aggregate([
            {
                $group:{
                    _id:"$status",
                    count:{
                        $sum:1
                    }
                }
            }
        ])
        res.status(200).json({
            success:true,
            data:{
                subscriptions,
                summary
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

const superAdminMonthlyReportModel = require("../../Models/SuperAdminModels/superAdminMonthlyReport");


const getSuperAdminMonthlyReports = async(req,res)=>{

try{
const reports =
await superAdminMonthlyReportModel
.find()
.sort({
year:-1,
month:-1
})
.limit(12);



if(!reports || reports.length===0){

return res.status(200).json({

success:true,
data:[]

})

}



res.status(200).json({

success:true,

data:reports

})


}
catch(error){

console.log(
"Error fetching super admin reports",
error
)


res.status(500).json({

success:false,

message:error.message

})


}


}





module.exports = {getDashboardOverview, getSubscriptionManagement,getSuperAdminMonthlyReports}
