const user = require("../model/usermodel");
const bcrypt = require("bcrypt");

module.exports.register = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;

        const ifUser = await user.findOne({ username });
        // console.log(ifUser)
        if (!ifUser) {
            const hashedpassword = await bcrypt.hash(password, 10);
            const collection = await user.create({
                username,
                email,
                password: hashedpassword,
                profilePic:''
            })
            delete collection.password;
            const User = await user.findOne({ username });
            // console.log(User)
            return res.json({ status: true, User })
        }
        else {
            return res.json({ status: false, ifUser })
        }
    }
    catch (ex) {
        next(ex);
    }
}

module.exports.login = async (req, res, next) => {
    try {
        const { username, password } = req.body;
        const User = await user.findOne({ username });
        if (!User) {
            return res.json({ msg: "incorrect username or password", status: false })
        }
        const ispassword = await bcrypt.compare(password, User.password)
        if (!ispassword) {
            return res.json({ msg: "incorrect username or password", status: false });
        }
        delete User.password;

        return res.json({ status: true, User })
    }
    catch (ex) {
        next(ex);
    }
}

module.exports.getallusers = async (req, res, next) => {
    try {
        const { searchcontact } = req.body;
        const users = await user.findOne({ username: searchcontact })
        res.json(users);
    } catch (ex) {
        next(ex);
    }
}

module.exports.adduser = async (req, res, next) => {
    try {
        const { currentuser, contacttobeadded } = req.body;
        const curruser = await user.findOne({ username: currentuser });
    
        let array = curruser.addedContacts;
        let present = array.find((x) => x.username == contacttobeadded.username)
        if (present != undefined) return (res.json("error"));
        else {
            let add = [...array];
            add.reverse();
            add.push({ _id: contacttobeadded._id, username: contacttobeadded.username, profilePic: contacttobeadded.profilePic })
            add.reverse();

            let updatedcontacts = { $set: { addedContacts: add } };
            await user.updateOne(curruser, updatedcontacts)

            let array2 = contacttobeadded.addedContacts;
            let add2 = [...array2];
            add2.reverse();
            add2.push({ _id: curruser._id, username: curruser.username, profilePic: curruser.profilePic })
            add2.reverse();
            let updatedcontacts2 = { $set: { addedContacts: add2 } };
            await user.updateOne(contacttobeadded, updatedcontacts2)
            
            res.json(curruser.addedContacts)
        }
    } catch (ex) {
        next(ex);
    }
}

module.exports.showuser = async (req, res, next) => {
    try {
        const { currentuser } = req.body;
        const users = await user.findOne({ username: currentuser })
        res.json(users);
        // console.log(users)
    } catch (ex) {
        next(ex);
    }
}
module.exports.showcurrentuser = async (req, res, next) => {
    try {
        const { currentuser } = req.body;
        const users = await user.findOne({ username: currentuser })
        res.json(users);
        // console.log(currentuser)
    } catch (ex) {
        next(ex);
    }
}

module.exports.addpfp = async (req, res, next) => {
    try {

        res.json(req.file.filename)
        // console.log(req.file)
    } catch (ex) {
        next(ex)
    }
}
module.exports.addpfptodb = async (req, res, next) => {
    try {
        const { username, profilePic } = req.body;
        console.log(username)
        console.log(profilePic)
        let updated = { $set: { profilePic: profilePic } };
        await user.updateOne(username, updated)
res.json(username)
    } catch (ex) {
        next(ex)
    }
}

module.exports.dltcontact = async (req, res, next) => {
    try {
        const { currentuser, contacttobeadded } = req.body;
        const curruser = await user.findOne({ username: currentuser });
        let array = curruser.addedContacts;
        console.log(contacttobeadded)
        const newArr = array.filter(object => {
            return object.username !== contacttobeadded.username ;
        });

            let updatedcontacts = { $set: { addedContacts: newArr } };
            await user.updateOne(curruser, updatedcontacts)
            
            res.json(curruser.addedContacts)
        
    } catch (ex) {
        next(ex);
    }
}