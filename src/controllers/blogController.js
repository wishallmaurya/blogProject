const blogModel = require("../models/blogModel")
const authorModel = require("../models/authorModel");
const mongoose= require("mongoose")
const { isValidEmail,
    isValidName,
    isValid,isValidPassword,isValidTitle,isValidBody} = require("../validation/validator")



 //................................................................  POST BLOG API
const createBlog = async function (req, res) {
    try {
        let data = req.body
         let iD= data.authorId
        // let title= data.title
        // let body=data.body
        // let category=data.category

        
        //////////////////////////////////////////  Required Fields validation
        if(!("authorId" in data) || !("title" in data) || !("body" in data) || !("category" in data) ) return res.status(400).send({msg:"The (authorId , title , body , category) fields are required"})

        if (!isValid(data.authorId)) return res.status(400).send({status:false,msg:"Pls Add AuthorId In Authorid Attribute"})
        if(!mongoose.isValidObjectId(data.authorId)) return res.status(400).send({status:false,msg:"Pls Enter AuthorId In Valid Format"})
        
        //.......................................... Title Validation
        if(!isValid(data.title)) return res.status(400).send({status:false,msg:"Pls Add Title In Title Attribute"})
        if(!isValidTitle(data.title))return res.status(400).send({status:false,msg:"Pls Use A-Z or a-z and 0-9 While Entering Title "})
    
        //...............................................  Category Validation
        if(!isValid(data.category))  return res.status(400).send({status:false,msg:"Pls Add Category In Category Attribute"})
        if(!isValidName(data.category))return res.status(400).send({ status:false,msg:"Pls Enter Category In OnLy String"})
        
        //................................................  Body Validation
        if(!isValid(data.body))return res.status(400).send({status:false,msg:"Pls Add some Data In Body Attribute"})
        if(!isValidBody(data.body)) return res.status(400).send({status:false,msg:"Pls Use A-Z or a-z and 0-9 While Entering Body "})

        let authId= await authorModel.findById(iD)
        if(!authId) return res.status(400).send({status:false,msg:"The AuthorId That You Have Written Is Invalid"})
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

//...................................................... GET BLOGS 
const getBlogs= async function (req,res){
    let query= req.query
    
    if ("authorId" in query){
        if(! mongoose.isValidObjectId(id)){
          return res.status(400).send({status:false,msg:"Pls Enter AuthorId in valiid format"})
        }
    }
    if(Object.keys(query).length!==0){
    let data= await blogModel.find({$and:[{isDeleted:false},{isPublished:true},query]})
    if(data.length==0) return res.status(404).send({status:"False",msg:"The Data You Found Is nOt Present"})
    return res.status(200).send({msg:"true",data:data})
    }
    else{
        let data= await blogModel.find({$and:[{isDeleted:false},{isPublished:true}]})
        if(!data) return res.status(404).send({msg:"The author Id that you have entered has no data which is published or not deleted"})
        return res.status(200).send({msg:"true",data:data})
    }
}
// const getBlogs= async function (req,res){
//     try{
//         let category= req.query.category
//         let authorId= req.query.authorId
//         let subcategory=req.query.subcategory
//         let tags= req.query.tags
//         let array= tags.replace(/\s+/g,'').trim().split()
//         console.log(array)
//         let obj={
//             isDeleted:false,
//             isPublished:true
//         }
//         if(authorId){
//             obj.authorId= authorId
//         }
//         if(category){
//             obj.category=category
//         }
//         if(tags){
//             obj.tags={$all :[array]}
//         }
//         if(subcategory){
//             obj.subcategory=subcategory
// // //              /no need of db call ,$all use
// //              array=trim,split .map trim
// //              obj.key=$all array
//         }
//         let data= await blogModel.find(obj)
//         if(data.length==0) {
//             return res.status(404).send({status:false,msg:"No Blog Found with provided information...Pls Check The Upper And Lower Cases Of letter"})
//         }
//         else{
            
//             return res.status(200).send({status:true,msg:data})
//         }
//     }
//     catch(err){
//         console.log(err)
//         res.status(500).send({status:false,msg:err.message})
//     }
// }
////////////////////////////////////////////////////////  updateblog //////////////////////////////////////////////////////////////////////////
const updateBlogbyparams= async function(req,res){
    try{

        let id= req.params.blogId
        let findId= await blogModel.findById(id)
        if(!findId) return res.status(400).send({status:"False",message:"The Id You Have Entered Doesn't Exists"})
        if(findId.isDeleted==true) return res.status(400).send({msg:"The Id You Have Entered Is already deleted"})
        let data= req.body
        published= new Date().toISOString()
        if(data.body.trim().length == 0 || data.category.trim().length == 0 || data.title.trim().length == 0 || data.subcategory.trim().length == 0) return res.status(400).send({msg:"Pls Add Data In Attributes..Dont left it empty"})
        if(!/^[a-zA-Z]+(([',. -][a-zA-Z0-9 ])?[a-zA-Z0-9])$/.test(data.title)) return res.status(400).send({msg:"Pls Use A-Z or a-z or 0-9 While Entering Title "})
        if(!/^[a-zA-Z]+(([',. -][a-zA-Z0-9 ])?[a-zA-Z0-9])$/.test(data.tags)) return res.status(400).send({msg:"pleas enter valid tag"})

        if(Object.keys(data).length==0) return res.status(400).send({status:"false",msg:"Pls Enter Some Data To be updated in body"})

        let updatedBlog = await blogModel.findOneAndUpdate({ _id: id }, {
            $set: {
                title: data.title,
                body: data.body,
                category: data.category,
                publishedAt: published,  // new Date()
                isPublished: true
            },
            $push: {
                tags: req.body.tags,
                subcategory: req.body.subcategory
            }
        }, { new: true})
       return res.status(201).send({staus:"True",data:updatedBlog})
    }
    catch(err){
        console.log(err)
      return  res.status(500).send({status:"False",msg:err.message})
    }
}
//////////////////////////////////////////////////  deleteblog by params 

const deleteBlog = async function(req,res){
    try{
        let blogId =req.params.blogId;
        let find= await blogModel.findById(blogId)
        if(!find) return res.status(400).send({msg:"The Id You Have Entered Is doesnot exists"})
        if(find.isDeleted==true) return res.status(400).send({msg:"The Id You have entered is already deleted"})
        let date=new Date().toISOString()
        await blogModel.findOneAndUpdate({ _id:blogId},{$set:{isDeleted:true,deletedAt:date}})
        return res.status(200).send({status:"True",data:"The data Is now deleted"});
 
    }
    catch (err) {
        res.status(500).send({ msg: "Error", error: err.message })
    }
}
///////////////////////////////////////////////// deleteBlogByQuery

// const deleteBlogByQuery= async function(req,res){
//         // try{
        //     let queryData= req.query
        //     let blog = await blogModel.find({$and:[{ isDeleted: false }, queryData]})
        //     if (blog.length == 0) {
        //         return res.status(404).send({ msg: "Already Deleted" })
        //     }
        //     deletedTime= new Date().toISOString();
        //     await blogModel.updateMany(queryData, { $set: { "isDeleted": true , "deletedAt": deletedTime} })
        //     res.status(200).send({msg:"Successfully deleted"})
    
        // } catch(error){
        //     console.log(error.message)  
        //     res.status(500).send({ err: error.message})
        // }

const deleteBlogByQuery= async function(req,res){
    try{
        let authorId= req.query.authorId
        let category= req.query.category
        let tags= req.query.tags
        let subcategory= req.query.subcategory
        let isPublished=req.query.isPublished
        let obj={}
        if (tags){
            obj.tags=tags
        }
        if(category){
            obj.category=category
        }
        if(authorId){
            obj.authorId=authorId
        }
        if(subcategory){
            obj.subcategory=subcategory
        }
        if(isPublished){
            obj.isPublished=isPublished
        }
        deletedTime= Date().now;
        let blog= await blogModel.find(obj)
        if(blog.length>0){
            await blogModel.updateMany(obj,{$set:{"isDeleted":true,"deletedAt":deletedTime}})
            res.status(200).send({status:true,msg:"SuccesFully Deleted"})
        }
        else{
            res.status(400).send({status:false,msg:"No such Blog Found"})
        }

    }

catch(err){
    res.status(500).send({status:false,msg:err.message})
}
}

// }
////////////////////////////////////////////////////////////// Login


module.exports.deleteBlog = deleteBlog
module.exports.updateBlogbyparams=updateBlogbyparams
module.exports.getBlogs=getBlogs
module.exports.createBlog =createBlog
module.exports.deleteBlogByQuery=deleteBlogByQuery


