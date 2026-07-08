const { getTeacherAssignmentSubmissions } = require('../Controllers/AggregationFunctions/forAssignmentCheckerInTeacherDashboard')
const {teacherDashboardInfo} = require('../Controllers/AggregationFunctions/forTeacherDashboard')
const { teacherQuizSubmission}=require("../Controllers/AggregationFunctions/forQuizCheckerComponent")
const { teacherContentInfo}=require("../Controllers/AggregationFunctions/forContnetComponentInTeacherDashboard")
const { teacherAIAgentInfo}=require("../Controllers/AggregationFunctions/ForTeacherAIAgentsController")


const router = require('express').Router()
router.get("/teacherDashboard/:teacherId/quizSubmission",teacherQuizSubmission)
router.route('/teacherDashboardInfo/:teacherId').get(teacherDashboardInfo)
router.route('/teacherDashboard/:teacherId/assignmentSubmission').get(getTeacherAssignmentSubmissions)
router.route('/teacherDashboard/:teacherId/content').get(teacherContentInfo)
router.get("/teacherAIAgents/:teacherId",teacherAIAgentInfo)
module.exports = router