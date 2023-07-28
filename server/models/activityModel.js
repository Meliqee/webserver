import mongoose from "mongoose";

const activitySchema = mongoose.Schema({

    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    image: {
        type: String,     
    },   
    date: {
        type: String, 
        required:true,    
    },

})

export default mongoose.model('ActivityModel',activitySchema);







