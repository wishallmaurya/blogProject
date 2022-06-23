const authorModel = require("../models/authorModel");
const jwt= require("jsonwebtoken")
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

                                      //// Author Login ////
const authLogin= async function(req,res){
    let value= req.body
    let userName= value.email
    let password= value.password
                                                    ////// Empty Body Validation /////
    if(!("email" in value) || !("password" in value)) return res.status(400).send({status:"false",msg:"Pls Enter Email And Password"})

                                                /// Empty Username Or Password Validation ////
    if(userName.trim()=="" || password.trim()=="") return res.status(400).send({status:"false",msg:"Pls Provide data in Email And Password"})

                                               /// Email Format Validation ///////
    if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(userName)) return res.status(400).send({ message: "Pls Enter Email in valid Format" })
    let author= await authorModel.findOne({$and:[{email:userName,password:password}]})
    if(!author) return res.status(404).send({status:"false",msg:"Pls Use Valid Credentials"})

    let token= jwt.sign({
        authorId: author._id.toString()
    },"functionup-radon")

    console.log(token)

    res.status(201).send({status:"Succesfully Login",token:token})

}






module.exports.authLogin=authLogin
module.exports.createAuthor = createAuthor