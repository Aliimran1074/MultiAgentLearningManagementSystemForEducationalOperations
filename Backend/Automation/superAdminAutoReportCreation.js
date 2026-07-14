const cron = require('node-cron')
const {generateSuperAdminMonthlyReport} = require('../Controllers/SuperAdminReportController/mainSuperAdminMonthlyReport.controller')


        cron.schedule('0 1 1 * *',async()=>{
        console.log("Super Admin Report Creation Function Running")
        await generateSuperAdminMonthlyReport()
    })

