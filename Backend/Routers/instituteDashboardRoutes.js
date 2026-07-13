const express=require("express");
const router=express.Router();

const {getInstituteDashboard}=require("../Controllers/InstituteAdminAggregationFunctions/getInstituteDashboard");
const { getFacultyDirectory} = require("../Controllers/InstituteAdminAggregationFunctions/facultyDirectoryAggregation");
const { getStudentProgress } = require("../Controllers/InstituteAdminAggregationFunctions/studentProgressAggregation");
const { getMasterContent } = require("../Controllers/InstituteAdminAggregationFunctions/MasterContentAggreagation");
const { getAgentCommandCenter } = require("../Controllers/InstituteAdminAggregationFunctions/agentCommandCenterAggreagation");

router.get("/instituteDashboard/:instituteId",getInstituteDashboard)
router.get("/facultyDirectory/:instituteId",getFacultyDirectory)
router.get("/studentProgress/:instituteId",getStudentProgress)
router.get("/masterContent/:instituteId",getMasterContent)
router.get('/getAgentCommander/:instituteId',getAgentCommandCenter)
module.exports=router