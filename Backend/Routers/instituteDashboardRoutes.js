const express=require("express");
const router=express.Router();

const {getInstituteDashboard}=require("../Controllers/InstituteAdminAggregationFunctions/getInstituteDashboard");
const { getFacultyDirectory} = require("../Controllers/InstituteAdminAggregationFunctions/facultyDirectoryAggregation");

router.get("/instituteDashboard/:instituteId",getInstituteDashboard)
router.get("/facultyDirectory/:instituteId",getFacultyDirectory)
module.exports=router