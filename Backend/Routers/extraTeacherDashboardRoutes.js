const { getTeacherAssignmentSubmissions } = require('../Controllers/AggregationFunctions/forAssignmentCheckerInTeacherDashboard')
const {teacherDashboardInfo} = require('../Controllers/AggregationFunctions/forTeacherDashboard')
const { teacherQuizSubmission}=require("../Controllers/AggregationFunctions/forQuizCheckerComponent")
const router = require('express').Router()



router.get("/teacherDashboard/:teacherId/quizSubmission",teacherQuizSubmission)
router.route('/teacherDashboardInfo/:teacherId').get(teacherDashboardInfo)
router.route('/teacherDashboard/:teacherId/assignmentSubmission').get(getTeacherAssignmentSubmissions)
module.exports = router