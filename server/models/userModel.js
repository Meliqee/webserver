import mongoose from "mongoose";

const userSchema = mongoose.Schema({

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
        default:'USER'
    },
    phoneNumber:{
        type:String,
        required:true,
    },

})

export default mongoose.model('UserModel',userSchema);















