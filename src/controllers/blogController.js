const blogModel = require("../models/blogModel")
const authorModel = require("../models/authorModel");
// POST /blogs
// Create a blog document from request body. Get authorId in request body only.

// Make sure the authorId is a valid authorId by checking the author exist in the authors collection.

// Return HTTP status 201 on a succesful blog creation. Also return the blog document. The response should be a JSON object like this

// Create atleast 5 blogs for each author

// Return HTTP status 400 for an invalid request with a response body like this


 ////////////////////////////////////////////////////  POST BLOG API
const createBlog = async function (req, res) {
    try {
        let data = req.body
         let iD= data.authorId
        // let title= data.title
        // let body=data.body
        // let category=data.category

        
        //////////////////////////////////////////  Required Fields validation
        if(!("authorId" in data) || !("title" in data) || !("body" in data) || !("category" in data) ) return res.status(400).send({msg:"The (authorId , title , body , category) fields are required"})

        //////////////////////////////////////////  Required field Empty validation
        if(data.authorId.trim() == "" || data.title.trim() == "" || data.body.trim() == "" || data.category.trim() == "") return res.status(400).send({msg:"The required fields must not be empty"})
        
        /////////////////////////////////////////   AuthorId format Validation
        if (!/^[a-f\d]{24}$/i.test(iD) ) return res.status(400).send({msg:"Pls enter AuthorId in required format"})
    

        ////////////////////////////////////////  Category Validation
        if(!/^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/.test(data.category))   return res.status(400).send({msg:"Pls Enter Category In OnLy String"})

        /////////////////////////////////////////// title validation 
        if(!/^[a-zA-Z]+(([',. -][a-zA-Z0-9 ])?[a-zA-Z0-9]*)*$/.test(data.title)) return res.status(400).send({msg:"Pls Use A-Z or a-z or 0-9 While Entering Title "})

        //////////////////////////////////////////  Body Validation
        if(!/^[a-zA-Z]+(([',. -][a-zA-Z0-9 ])?[a-zA-Z0-9]*)*$/.test(data.body)) return res.status(400).send({msg:"Pls Use A-Z or a-z or 0-9 While Entering Body "})

        let authId= await authorModel.findById(iD)
        if(!authId) return res.status(400).send({msg:"The AuthorId That You Have Written Is Invalid"})
        if(data.isPublished==true ){
            publishedAt= new Date().toISOString();
            data.publishedAt= publishedAt
        }
        else{
            data.publishedAt=""
        }
        if (data.isDeleted==true){
            deletedAt= new Date().toISOString();
            data.deletedAt=deletedAt
        }
        else{
            data.deletedAt=""
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
    let authid=req.query.authorId
    let tag= req.query.tags
    if(authid){
    let id= await blogModel.findById(authid)
    if(!id) return res.status(400).send({status:"false",msg:"The Id You Have Entered Is Incorrect"})
    }
    
    
    if(Object.keys(query).length!==0){
    let data= await blogModel.find({$and:[{isDeleted:false},{isPublished:true},query]})
    if(!data) res.status(404).send({status:"False",msg:"The Data You Found Is nOt Present"})
    res.status(200).send({msg:"true",data:data})
    }
    else{
        let data= await blogModel.find({$and:[{isDeleted:false},{isPublished:true}]})
        if(!data) return res.status(400).send({msg:"The author Id that you have entered has no data which is published or not deleted"})
        res.status(200).send({msg:"true",data:data})
    }
}
////////////////////////////////////////////////////////  updateblog //////////////////////////////////////////////////////////////////////////
const updateBlogbyparams= async function(req,res){
    try{

        let id= req.params.blogId
        let findId= await blogModel.findById(id)
        if(!findId) res.status(400).send({status:"False",message:"The Id You Have Entered Doesn't Exists"})
        let data= req.body
        
        if(data.body.trim() == "" || data.category.trim() == "" || data.title.trim() == "" || data.subcategory.trim() == "") return res.status(400).send({msg:"Pls Add Data In Attributes..Dont left it empty"})

        if(Object.keys(data).length==0) return res.status(400).send({status:"false",msg:"Pls Enter Some Data To be updated in body"})

        published= new Date().toISOString()
        let dataToUpdated= await blogModel.findOneAndUpdate({_id:id},
           { $set:{title: data.title,
            body: data.body,
            category: data.category,
            publishedAt: published,  // new Date()
            isPublished: true}},{$push:{
                tags: req.body.tags,
                subcategory: req.body.subcategory
            }},
           {new:true})
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
module.exports.updateBlogbyparams=updateBlogbyparams
module.exports.getBlogs=getBlogs
module.exports.createBlog =createBlog
