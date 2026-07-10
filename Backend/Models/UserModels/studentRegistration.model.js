const mongoose = require ('mongoose')

const studentRegistrationSchema= new mongoose.Schema ({
    name:{
        type:String,
        required:true
    },
    instituteId :{
    type: mongoose.Schema.Types.ObjectId,
    ref: "instituteModel",
    required: true
    },
    cnicNo:
    {
        type:String,
        required:true
    },
    contactNo:{
        type:String,
        required:true
    },
     statusOfStudent:{
        type:String,
        enum:['studying','semester Freeze','degree completed','leave university','pending'],
        default:'studying'
    },
     enrolledAt: {
      type: Date,
      default: Date.now
   },
    imageUrl:{
        type:String,
        },
    qrCode:{
        type:String,
        
    }
})

const studentRegistrationModel = mongoose.model("studentRegistrationModel",studentRegistrationSchema)

module.exports= studentRegistrationModel