
const {instituteDashboardAggregation} =require('./instituteAdminDashboardControllers')

const getInstituteDashboard = async(req,res)=>{

    try{

        const { instituteId } = req.params;
        

        const dashboard =
        await instituteDashboardAggregation(instituteId);


        res.status(200).json({
            success:true,
            data:dashboard
        });


    }catch(error){

        console.log(error);

        res.status(500).json({
            success:false,
            message:error.message
        });

    }

};


module.exports={
    getInstituteDashboard
}
