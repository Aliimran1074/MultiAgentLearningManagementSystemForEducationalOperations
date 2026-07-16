const mongoose = require('mongoose');

// Global variable connection state ko save karne ke liye (Serverless ke liye)
let isConnected = false;

const databaseConnection = async () => {
    // Agar pehle se connected hai, to dobara connect mat karo
    if (isConnected) {
        console.log('🚀 Using existing database connection');
        return;
    }

    const url = process.env.DB_Setup_New
    if (!url) {
        throw new Error("Database URL is missing in Environment Variables");
    }

    try {
        const db = await mongoose.connect(url, {
            // Serverless environments me buffer commands ko false rakhna behtar hai
            bufferCommands: false, 
        });
        
        isConnected = db.connections[0].readyState === 1;
        console.log(' Database connected Successfully');
    } 
    catch (error) { 
        console.log(" Error in Database Connection", error);
        throw error; // Serverless me process.exit(1) ke bajaye throw karein
    } 
};

module.exports = { databaseConnection };