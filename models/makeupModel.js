const mongoose = require('mongoose');
const Joi = require('joi')

const makeupsSchema = new mongoose.Schema({
    name:String,
    info:String,
    category:String,
    price:Number,
    img:String,
    user_id:String,
    date_created:{
      type:Date, default:Date.now()
    },
})

exports.MakeupsModel = mongoose.model("makeups", makeupsSchema);

exports.validateMakeups = (_reqBody) =>{
    let schemaJoi = Joi.object({
        name: Joi.string().min(2).max(20).required(),
        info: Joi.string().min(5).max(99).required(),
        category: Joi.string().min(2).max(50).required(),
        price: Joi.number().min(1).max(999).required(),
        img: Joi.string().min(2).max(500).allow(null,"")
    })
    return schemaJoi.validate(_reqBody);
}
