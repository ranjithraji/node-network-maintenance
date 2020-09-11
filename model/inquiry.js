const mongoose = require('mongoose');
const issue = ['No internet', 'Slow Internet', 'System maintenance'];
const location = ['Lap', 'Department', '101', '102'];
const status = ['NOTASSIGNED', 'ASSIGNED', 'COMPLETED', 'CLOSED'];
const userSchema={
    type:mongoose.Schema.Types.ObjectId,
    ref:'User'
}
const InquirySchema = mongoose.Schema({
    user_Ref:[userSchema],
    issueType: {
        type: String,
        enum: issue
    },
    location: {
        type: String,
        enum: location
    },
    description: {
        type: String,
        required:true
    },
    InquiryStatus: {
        type: String,
        enum: status,
        required: true,
        default: 'NOTASSIGNED'
    },
    taskAssignedTo: [userSchema],
    completedAt:{
        type:Date
    }

}, {
    timestamps: {
        created_at: { type: Date }
        ,updated_at: { type: Date }
    }
})
module.exports = mongoose.model('Inquiry', InquirySchema);