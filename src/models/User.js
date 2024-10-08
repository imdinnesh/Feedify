import mongoose from 'mongoose';

const MessageSchema= new mongoose.Schema({
    content: {
        type: String,
        required: true,
    },
    space_name:{
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now,
    },
});

// Updated User schema
const UserSchema= new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Username is required'],
        trim: true,
        unique: true,
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        match: [/.+\@.+\..+/, 'Please use a valid email address'],
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
    },
    verifyCode: {
        type: String,
        required: [true, 'Verify Code is required'],
    },
    verifyCodeExpiry: {
        type: Date,
        required: [true, 'Verify Code Expiry is required'],
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    isAcceptingMessages: {
        type: Boolean,
        default: true,
    },
    spaces:{
        type: [String],
        default: [],
    },
    messages: [MessageSchema],
});

const UserModel =
    (mongoose.models.User) ||
    mongoose.model('User', UserSchema);

export default UserModel;