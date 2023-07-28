import mongoose from "mongoose";

const adminSchema = mongoose.Schema({

    fullName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        uniqe:true
    },
    password: {
        type: String,
        required: true,
    },
    usertype:{
        type: String,
        enum:['USER','ADMIN'],
        default:'ADMIN'
    },
    phoneNumber:{
        type:String,
        required:true,
    },

})

export default mongoose.model('AdminModel',adminSchema);















