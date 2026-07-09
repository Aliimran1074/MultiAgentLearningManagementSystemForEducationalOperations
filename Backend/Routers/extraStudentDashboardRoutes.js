const router = require('express').Router()
const {studentDashboardInfo} = require('../Controllers/StudentDashboardExtraController/studentDashboardMain')

router.get("/studentDashboardInfo/:studentId",studentDashboardInfo)

module.exports = router