import mongoose from 'mongoose';

const PublicFeedbackSchema = new mongoose.Schema({
    username:{
        type: String,
        required: true,
    },
    space_name:{
        type: String,
        required: true,
    },
    public_feedbacks:{
        type:[String],

    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now,
    },
});

const PublicFeedbackModel = mongoose.models.PublicFeedback || mongoose.model('PublicFeedback', PublicFeedbackSchema);

export default PublicFeedbackModel;