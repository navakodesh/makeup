const express= require("express");
const { auth } = require("../middlewares/auth");
const {MakeupsModel,validateMakeups} = require("../models/makeupModel")
const router = express.Router();

router.get("/" , async(req,res)=> {
  let perPage = req.query.perPage || 10;
  let page = req.query.page || 1;
  let sort = req.query.sort || "_id";
  let reverse = req.query.reverse == "yes" ? -1 : 1;

  try{
    let data = await MakeupsModel.find({})
    .limit(perPage)
    .skip((page - 1) * perPage)
    .sort({[sort]:reverse})
    res.json(data);
  }
  catch(err){
    console.log(err);
    res.status(500).json({msg:"there error try again later",err})
  }
})


// /makeups/search?s=
router.get("/search",async(req,res) => {
    try{
  let queryS=req.query.s;
  let searchReg=new RegExp(queryS,"i");
  let data =await MakeupsModel.find({name:searchReg})
      .limit(50)
      res.json(data);
    }
    catch(err){
      console.log(err);
      res.status(500).json({msg:"there error try again later",err})
    }
  })

// /makeups/category?s=catName=
router.get("/category",async(req,res) => {
  try{
let queryS=req.query.s;
let searchReg=new RegExp(queryS,"i");
 data =await MakeupsModel.find({category:searchReg})
    .limit(50)
    res.json(data);
  }
  catch(err){
    console.log(err);
    res.status(500).json({msg:"there error try again later",err})
  }
})

  // /makeup/byPrice?min&max
  router.get("/byPrice", async(req, res) => {
    const max = req.query.max||40;
    const min = req.query.min||10;

    try {
        if (max && min) {
            let data = await MakeupsModel.find({ $and: [{ price: { $gte: min } }, { price: { $lte: max } }] })
            res.json(data)
        } else if (min) {
            let data = await MakeupsModel.find({ price: { $gte: min } })
            res.json(data)
        } else if (max) {
            let data = await MakeupsModel.find({ price: { $lte: max } })
            res.json(data)
        } else {
            let data = await MakeupsModel.find({})
            res.json(data)

        }
     
    } catch (err) {
        console.log(err);
        res.status(500).json({ msg: "there error try again later", err })
    }
})

  

router.post("/", auth,async(req,res) => {
  let validBody = validateMakeups(req.body);
  if(validBody.error){
    return res.status(400).json(validBody.error.details);
  }
  try{
    let makeups = new MakeupsModel(req.body);
    makeups.user_id = req.tokenData._id;
    await makeups.save();
    res.status(201).json(makeups);
  }
  catch(err){
    console.log(err);
    res.status(500).json({msg:"there error try again later",err})
  }
})

router.put("/:editId",auth, async(req,res) => {
  let validBody = validateMakeups(req.body);
  if(validBody.error){
    return res.status(400).json(validBody.error.details);
  }
  try{
    let editId = req.params.editId;
    let data;
    if(req.tokenData.role == "admin"){
      data = await MakeupsModel.updateOne({_id:editId},req.body)
    }
    else{
       data = await MakeupsModel.updateOne({_id:editId,user_id:req.tokenData._id},req.body)
    }
    res.json(data);
  }
  catch(err){
    console.log(err);
    res.status(500).json({msg:"there error try again later",err})
  }
})

  
  router.delete("/:delId",auth, async(req,res) => {
    try{
      let delId = req.params.delId;
      let data;
      // אם אדמין יכול למחוק כל רשומה אם לא בודק שהמשתמש
      // הרשומה היוזר איי די שווה לאיי די של המשתמש
      if(req.tokenData.role == "admin"){
        data = await MakeupsModel.deleteOne({_id:delId})
      }
      else{
        data = await MakeupsModel.deleteOne({_id:delId,user_id:req.tokenData._id})
      }
      res.json(data);
    }
    catch(err){
      console.log(err);
      res.status(500).json({msg:"there error try again later",err})
    }
  })
  
  
  

module.exports = router;