const authorModel = require("../models/authorModel");
const jwt = require("jsonwebtoken")
const { isValidEmail, isValidName,isValid, isValidPassword, } = require("../validation/validator");


const createAuthor = async function (req, res) {
    try {
        let data = req.body;
        let {title} = req.body
        if (Object.keys(data).length == 0) {
            return res.status(400).send({status: false, msg: "Body should not be empty" })
        }

        if (!("fname" in data) || !("lname" in data) || !("title" in data) || !("email" in data) || !("password" in data)) return res.status(400).send({status:false, msg: "fname,lname,title,email,password are required" })

        if (!isValid(data.password)) return res.status(400).send({ status: false, msg: "The Password Attributes should not be empty" })
        if (!isValidPassword(data.password)) return res.status(400).send({ status: false, msg: "Password must contains 1 upperCaseletter 1 smallCaseLetter 1 special character and 1 digit and its only maximum 10 digits long" })

        if (!isValid(data.email)) return res.status(400).send({ status: false, msg: "The email Attributes should not be empty" })
        if (!isValidEmail(data.email)) return res.status(400).send({ status: false, msg: "Pls Enter Email in valid Format" })

        if (!isValid(data.lname)) return res.status(400).send({ status: false, msg: "The lname Attributes should not be empty" })
        if (!isValidName(data.lname)) return res.status(400).send({ status: false, msg: "Pls Enter Valid Last Name" })

        if (!isValid(data.fname)) return res.status(400).send({ status: false, msg: "The fname Attributes should not be empty" })
        if (!isValidName(data.fname)) return res.status(400).send({ status: false, msg: "Pls Enter Valid First Name" })

        if (!isValid(data.title)) return res.status(400).send({ status: false, msg: "The Title Attributes should not be empty" })
        if (title !== "Mr") {
            if (title !== "Mrs") {
                if (title !== "Miss") {
                    return res.status(400).send({ status: false, message: "Should be Mr , Mrs , Miss" })
                }
            }
        }
        let checkunique= await authorModel.findOne({email:req.body.email}) 
        if (checkunique) return res.status(400).send({status:false,msg:"This Email Id Already Exists Pls Use Another"})
        let savedData = await authorModel.create(data);
        res.status(201).send({ status: true, data: savedData });
    }

    catch (error) {
        return res.status(500).send({ status: false, msg: error.message })
    }
};

//........................................................ Author Login 
const authLogin = async function (req, res) {
    let value = req.body
    let userName = value.email
    let password = value.password
    //................................................... Empty Body Validation 
    if (!("email" in value) || !("password" in value)) return res.status(400).send({ status: false, msg: "Pls Enter Email And Password" })

    //....................................................Empty Attributes Validation
    if (!isValid(userName) || !isValid(password)) return res.status(400).send({ status: false, msg: "Pls Provide data in Email And Password" })

    let author = await authorModel.findOne({ $and: [{ email: userName, password: password }] })
    if (!author) return res.status(404).send({ status: false, msg: "Pls Use Valid Credentials" })

    let token = jwt.sign({
        authorId: author._id.toString()
    }, "functionup-radon")

    res.status(200).send({ status: true, token: token ,msg:"Succesfully Login" })

}


module.exports.authLogin = authLogin
module.exports.createAuthor = createAuthor