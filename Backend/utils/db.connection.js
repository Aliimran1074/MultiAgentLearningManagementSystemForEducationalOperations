const mongoose = require('mongoose');

let isConnected = false;

const databaseConnection = async () => {
    console.log("Enter in Database Connection Function")
    if (isConnected) {
        console.log(' Using existing database connection');
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