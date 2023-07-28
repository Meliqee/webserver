import mongoose from "mongoose";

const courseSchema = mongoose.Schema({

    title: {
        type: String,
        required: true,
    },
    branche: {
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
        type: Date,
        required: true,
    },
    hour: {
        type: String,
        required: true,
    },
    participants: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "UserModel",
    }]

})

export default mongoose.model('CourseModel', courseSchema);















