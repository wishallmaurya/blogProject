// Author APIs /authors
// Create an author - atleast 5 authors
// Create a author document from request body. Endpoint: BASE_URL/authors

const express = require('express');
const router = express.Router();


const authController= require("../controllers/authController")
const blogController= require("../controllers/blogcontroller")
const middl=require("../middlewares/middleware")


router.post("/authors", authController.createAuthor)

router.post("/blogs",middl.authentication, blogController.createBlog)

//The userId is sent by front end
 router.get("/blogs",middl.authentication, blogController.getBlogs)

 router.put("/blogs/:blogId",middl.authentication,middl.authorisation, blogController.updateBlogbyparams)
 router.delete("/blogs/:blogId",middl.authentication,middl.authorisation, blogController.deleteBlog)
 router.delete("/blogs",middl.authentication,middl.authorisation,blogController.deleteBlogByQuery)
 router.post("/login",authController.authLogin)


module.exports = router;