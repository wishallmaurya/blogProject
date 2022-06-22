const authorModel = require("../models/authorModel");

const createAuthor = async function (req, res) {
    try {
        let data = req.body;
        // let mail = data.email
        if (Object.keys(data).length == 0) {
            return res.status(400).send({ msg: "Body should not be empty" })
        }
        
        if(!("fname" in data) || !("lname" in data) || !("title" in data) || !("email" in data) || !("password" in data) ) return res.status(400).send({msg:"fname,lname,title,email,password are required"})
        
        if (data.password.trim() == "" || data.email.trim() == "" || data.lname.trim() == "" || data.fname.trim() == "" || data.title.trim() == "") return res.status(400).send({msg:"The Required Attributes should not be empty"})
        
        //////////////////////////////////////////  Email Validation 
        if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(data.email)) return res.status(400).send({ message: "Pls Enter Email in valid Format" })
        /////////////////////////////////////// fname validation 
        if(!/^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/.test(data.fname)) return res.status(400).send({msg:"Pls Enter Valid First Name"})

        ////////////////////////////////////// lname validation 
        if(!/^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/.test(data.lname)) return res.status(400).send({msg:"Pls Enter Valid Last Name"})

        ///////////////////////////////////////  Password Validation 
        if(!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$^+=!*()@%&]).{8,10}$/.test(data.password)) return res.status(400).send({msg:"Password must contains 1 upperCaseletter 1 smallCaseLetter 1 special character and 1 digit"})

        let savedData = await authorModel.create(data);
        res.status(201).send({ status: "True", data: savedData });
    }

    catch (error) {
        return res.status(500).send({ status: "False", msg: error.message })
    }
};

module.exports.createAuthor = createAuthor