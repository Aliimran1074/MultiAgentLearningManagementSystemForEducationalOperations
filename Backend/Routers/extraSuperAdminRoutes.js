const { getDashboardOverview, getSubscriptionManagement, getSuperAdminMonthlyReports } = require('../Controllers/SuperAdminAggregationFunctions/dashboardAggregation')

const router =require('express').Router()

router.get ('/dashboardOverview',getDashboardOverview)
router.get('/subscriptionManagement',getSubscriptionManagement)
router.get('/getSuperAdminReport',getSuperAdminMonthlyReports)
module.exports = router