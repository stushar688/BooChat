const { addmessage,getallmessage, clearallchats, addimage} = require("../controllers/messagescontroller")
// const  {upload} =require('../index')
const router = require("express").Router();

// const up=upload
router.post("/addmsg", addmessage);
router.post("/getmsg", getallmessage);
router.post("/clrmsg", clearallchats);
// router.post("/addimage",up.single("image"),(req,res)=>{console.log(req.file)});

module.exports = router;      