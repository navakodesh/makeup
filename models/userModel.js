const mongoose = require("mongoose");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const {config} =require("../config/secret")

//סכמה בסיסית שתיהיה לכל משתמש
let UserSchema = new mongoose.Schema({
  name:String,
  email:String,
  password:String,
  date_created:{
    type:Date,default:Date.now()
  },
  role:{
    type:String,default:"user"
  }
})

exports.UserModel=mongoose.model("users",UserSchema);

//תוקן
exports.createToken=(_id,role)=>{
  let token=jwt.sign({_id,role},`${config.tokenSecret}`,{expiresIn:"600min"})
  return token;
}

//סכמה מפורטת איך לרשום משתמש 
exports.validUser=(_reqBody)=>{
  let joiSchema=Joi.object({
    name:Joi.string().min(2).max(20).required(),
    email:Joi.string().min(2).max(30).email().required(),
    password:Joi.string().min(6).max(8).required(),
  })
  return joiSchema.validate(_reqBody);
}


//סכמה ללוגין (כניסה של השמתמש לאתר)
exports.validLogin=(_reqBody)=>{
  let joiSchema=Joi.object({
    email:Joi.string().min(2).max(30).email().required(),
    password:Joi.string().min(6).max(8).required()
  })
  return joiSchema.validate(_reqBody);
}