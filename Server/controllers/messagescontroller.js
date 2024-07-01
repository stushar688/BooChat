const messagemodel = require("../model/messagemodel")
const multer = require('multer')
const fs=require('fs')

module.exports.addmessage = async (req, res, next) => {
    try {
        const { from, to, message,image } = req.body;
        const data = await messagemodel.insertMany({
            message: { text: message , image: image },
            users: [from, to],
            sender: from,
        }); 
        if (data) return res.json({ msg: "message added successfully" });
        else return res.json({ msg: "failed to add message to the database" });
    } catch (ex) {
        next(ex)
    }
}
module.exports.getallmessage = async (req, res, next) => {
    try {
        const { from, to } = req.body;
        // console.log(req.body); 
        const messages = await messagemodel.find({
            users: {
                $all: [from, to],
            }
        })
        // .sort({updatedAt:1});
        const peojectmessage = messages.map((msg) => {
            return {
                fromself: msg.sender.toString() === from,
                message: msg.message.text
            }
        })
        res.json(peojectmessage)
    } catch (ex) {
        next(ex)
    }

}
module.exports.clearallchats = async (req, res, next) => {
    try {
        const { from, to } = req.body;

        const msgs = await messagemodel.deleteMany({
            users: { $all: [from, to] }
        })
        // console.log(msgs);
        const messages = await messagemodel.find({
            users: {
                $all: [from, to],
            }
        })
        const projectnewmsgs = messages.map((msg) => {
            return {
                fromself: msg.sender.toString() === from,
                message: msg.message.text
            }
        })
        res.json(projectnewmsgs)

    } catch (ex) {
        console.log(ex)
    }
}


module.exports.addimage = async (req, res, next) => {
    try {
        
        res.json(req.file.filename)
        
    } catch (ex) {
        next(ex)
    }
}