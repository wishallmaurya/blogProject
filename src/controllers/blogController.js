const blogModel = require("../models/blogModel")
const authorModel = require("../models/authorModel");
// POST /blogs
// Create a blog document from request body. Get authorId in request body only.

// Make sure the authorId is a valid authorId by checking the author exist in the authors collection.

// Return HTTP status 201 on a succesful blog creation. Also return the blog document. The response should be a JSON object like this

// Create atleast 5 blogs for each author

// Return HTTP status 400 for an invalid request with a response body like this
 
const createBlog = async function (req, res) {
    try {
        let data = req.body
        let iD= data.authorId
        let title= data.title


        
        let authId= await authorModel.findById(iD)
        if(!authId) return res.status(400).send({msg:"The AuthorId That You Have Written Is Invalid"})
        if(data.isPublished==true){
            publishedAt= new Date().toISOString();
            data.publishedAt= publishedAt
        }
        else{
            data.publishedAt=""
        }
        
        let create= await blogModel.create(data)
        res.status(201).send({status:"true",data:create})
    }
    catch (err) {
        res.status(500).send({ status:"false", msg: err.message })
    }
}

///////////////////////////////////////////////////////////////////   GET BLOGS //////////////////////////////////////////////////////
const getBlogs= async function (req,res){
    let query= req.query
    let data= await blogModel.find({$and:[{isDeleted:false},{isPublished:true}]},query)
    if(!data) res.status(404).send({status:"False",msg:"The Data You Found Is nOt Present"})
    res.status(200).send({msg:"true",data:data})
}
////////////////////////////////////////////////////////  updateblog //////////////////////////////////////////////////////////////////////////
const updateBlog= async function(req,res){
    try{

        let id= req.params.blogId
        let findId= await blogModel.findById(id)
        if(!findId) res.status(400).send({status:"False",message:"The Id You Have Entered Doesn't Exists"})
        let data= req.body
        let dataToUpdated= await blogModel.findOneAndUpdate({_id:id},data,{new:true})
        res.status(201).send({staus:"True",data:dataToUpdated})
    }
    catch(err){
        res.status(500).send({status:"False",msg:err.message})
    }
}
//////////////////////////////////////////////////

const deleteBlog = async function(req,res){
    try{
        let blogId =req.params.blogId;
        let find= await blogModel.findById(blogId)
        if(!find && find.isDeleted==true){
            res.status(400).send({msg:"The Id You Have Entered Is already deleted or doesnot exists"})
        }
        let deleteBlog = await blogModel.findOneAndUpdate({ _id:blogId},{$set:{isDeleted:true}},{new:true})
        return res.status(200).send({data:deleteBlog});
 
    }
    catch (err) {
        res.status(500).send({ msg: "Error", error: err.message })
    }
}
module.exports.deleteBlog = deleteBlog
module.exports.updateBlog=updateBlog
module.exports.getBlogs=getBlogs
module.exports.createBlog =createBlog
