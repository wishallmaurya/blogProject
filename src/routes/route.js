// Author APIs /authors
// Create an author - atleast 5 authors
// Create a author document from request body. Endpoint: BASE_URL/authors

const express = require('express');
const router = express.Router();


const authController= require("../controllers/authController")
const blogController= require("../controllers/blogcontroller")



router.post("/authors", authController.createAuthor)

router.post("/blogs", blogController.createBlog)

//The userId is sent by front end
 router.get("/blogs", blogController.getBlogs)

 router.put("/blogs/:blogId", blogController.updateBlog)
 router.delete("/blogs/:blogId", blogController.deleteBlog)




module.exports = router;