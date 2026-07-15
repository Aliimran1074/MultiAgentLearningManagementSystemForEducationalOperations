const mongoose = require('mongoose')

const subscriptionSchema = new mongoose.Schema({
   
    instituteId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'instituteModel'
    },
    planId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'subscriptionPlanModel'
    },

    scopeType: {
        type: String,
        enum: ['individual', 'batch', 'institute'],
        // required:true
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        enum: ['Active', 'Expired', 'Cancelled'],
        default: 'Active'
    },
    aiUsage: {
        assignmentGeneratorUsed: { type: Number, default: 0 },
        quizGeneratorUsed: { type: Number, default: 0 },
        examGeneratorUsed: { type: Number, default: 0 },
        contentGeneratorUsed: { type: Number, default: 0 },
        assignmentCheckerUsed: { type: Number, default: 0 },
        quizCheckerUsed: { type: Number, default: 0 },
        totalAiRequests: { type: Number, default: 0 }
    }

})

const subscriptionModel = mongoose.model('subscriptionModel', subscriptionSchema)

module.exports = subscriptionModel