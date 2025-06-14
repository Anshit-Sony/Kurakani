const mongoose=require('mongoose')
const bcrypt=require('bcryptjs')

const UserSchema=mongoose.Schema({
    name:{type:String, require},
    email:{type:String, require,unique:true},
    password:{type:String, require},
    pic:{type:String, default:"https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"}, 
},
{
    timestamps:true,
}
);

UserSchema.methods.matchPassword=async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword,this.password)
}

UserSchema.pre("save",async function(next){
    if(!this.isModified){
        next()
    }
    const salt=await bcrypt.genSalt(10);
    this.password=await bcrypt.hash(this.password,salt)
})

const User=mongoose.model("User",UserSchema);

module.exports=User;