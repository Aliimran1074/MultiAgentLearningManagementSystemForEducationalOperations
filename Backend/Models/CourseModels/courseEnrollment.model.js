
const mongoose = require ('mongoose')

const courseEnrollmentSchema = new mongoose.Schema({
   studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "studentRegistrationModel",
      required: true
   },
   courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "courseModel",
      required: true
   },
   instituteId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"instituteModel",
    required:true
   },
   enrolledAt: {
      type: Date,
      default: Date.now
   },
   status: {
      type: String,
      enum: ["active", "dropped"],
      default: "active"
   }
})

const courseEnrollmentModel = mongoose.model('courseEnrollmentModel',courseEnrollmentSchema)

module.exports = courseEnrollmentModel