const mongoose = require('mongoose');


const url = process.env.DB_Setup_New || process.env.DATABASE_URL || "mongodb://127.0.0.1:27017/portal_db";

const databaseConnection = async () => { 
    try {
        console.log("URL :",url)
        await mongoose.connect(url);
        console.log('🚀 Database connected Successfully');
    } 
    catch (error) { 
        console.log("❌ Error in Database Connection", error);
        process.exit(1); 
    } 
};

module.exports = { databaseConnection };