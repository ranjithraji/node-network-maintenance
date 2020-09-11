const mongoose = require('mongoose');
const department = ['MCA', 'MSC-IT', 'MSC-CS', 'BCA', 'BSC CS', 'BSC IT', 'RVSCAS'];
const userSchema = {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
}
const DailyUpdateSchema = mongoose.Schema({
    user_Ref: [userSchema],
    department: {
        type: String,
        enum: department,
        // required:true,
        // default:'RVSCAS'
    },
    description: {
        type: String,
        required: true
    }
}, {
    timestamps: {
        created_at: { type: Date }
        , updated_at: { type: Date }
    }
})

module.exports=mongoose.model('DailyUpdate',DailyUpdateSchema)