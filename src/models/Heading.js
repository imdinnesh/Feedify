import mongoose from 'mongoose';
const HeadingSchema=new mongoose.Schema({
    heading: {
        type: String,
        required: true,
    },
    space_name:{
        type: String,
        required: true,
    },
    username:{
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now,
    },
});


const HeadingModel =
    (mongoose.models.heading) ||
    mongoose.model('Heading', HeadingSchema);

export default HeadingModel;


