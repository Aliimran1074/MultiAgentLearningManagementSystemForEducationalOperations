const instituteDashboardAggregation = require("./6th Aggregation");
const facultyPerformanceAggregation = require("./facultyPerformanceAggregation");

// baki aggregations bhi yahan import hongi
const studentProgressAggregation = require("../aggregation/studentProgressAggregation");
const facultyDirectoryAggregation = require("./facultyDirectoryAggregation");



// Dashboard Overview

exports.getDashboardOverview = async(req,res)=>{

    try{

        const {instituteId}=req.params;


        const data = await instituteDashboardAggregation(instituteId);


        res.status(200).json({
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




// Faculty Directory

exports.getFacultyDirectory = async(req,res)=>{

    try{


        const {instituteId}=req.params;


        const data = await facultyDirectoryAggregation(instituteId);



        res.status(200).json({
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




// Faculty Performance

exports.getFacultyPerformance = async(req,res)=>{


    try{


        const {instituteId}=req.params;


        const data = await facultyPerformanceAggregation(instituteId);



        res.status(200).json({
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





// Student Progress

exports.getStudentProgress = async(req,res)=>{


    try{


        const {instituteId}=req.params;


        const data = await studentProgressAggregation(instituteId);



        res.status(200).json({
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