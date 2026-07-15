const { getDashboardOverview, getSubscriptionManagement, getSuperAdminMonthlyReports } = require('../Controllers/SuperAdminAggregationFunctions/dashboardAggregation')
const { getUserManagementDashboard } = require('../Controllers/SuperAdminAggregationFunctions/userManagement')

const router =require('express').Router()

router.get ('/dashboardOverview',getDashboardOverview)
router.get('/subscriptionManagement',getSubscriptionManagement)
router.get('/getSuperAdminReport',getSuperAdminMonthlyReports)
router.get("/user-management", getUserManagementDashboard)
module.exports = router