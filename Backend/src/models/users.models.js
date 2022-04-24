const mongoose = require('mongoose');
const bcryptjs = require('bcryptjs');
const UserSchema = new mongoose.Schema({
    username:{type:String,required:true,unique:true},
    email:{type:String,required:true,unique:true},
    password:{type:String,required:true,minLength:8,maxLength:20},
    profilePic:{type:String,default:""}
},{
    versionKey:false,
    timestamps:true
});

//create and update the password hashing;

UserSchema.pre("save", function(next) {
    if(! this.isModified("password")) return next();

    const hash = bcryptjs.hashSync(this.password, 8);
    this.password = hash

    return next();
})

UserSchema.methods.checkPassword = function(password) {
    const match = bcryptjs.compareSync(password, this.password);

    return match;
}

module.exports = mongoose.model("User",UserSchema);