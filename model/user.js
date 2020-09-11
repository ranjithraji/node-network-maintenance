const mongoose=require('mongoose');
const department=['MCA','MSC IT','MSC CS','BCA','BSC CS','BSC IT','RVSCAS'];
const position=['Network engineer','Network maintentance','System Maintentance'];
const usertype=['User','Admin'];
const issueSchema={
    type:mongoose.Schema.Types.ObjectId,
    ref:'Inquiry'
}
const UserSchema=mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    department:{
        type:String,
        enum:department,
        // required:true,
        // default:'RVSCAS'
    },
    position:{
        type:String,
        enum:position,
        // required:true,
        // default:'Network'
    },
    phoneNumber:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    usertype:{
        type:String,
        enum:usertype
    },
    issue:[issueSchema]
},{timestamps: { 
    created_at : { type: Date }
, updated_at : { type: Date }
}})
module.exports=User=mongoose.model('User',UserSchema);