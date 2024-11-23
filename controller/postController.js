const Post = require('../models/postModel');

exports.addPost = async (req, res) => {
    try {
        const { title, description, author, sub_heading  } = req.body;

        if (!title) {
            return res.status(500).json({ message: "Title is required" });
        } 
         if (!description) {
            return res.status(500).json({ message: "Description is required" });
        }
         if (!author) {
            return res.status(500).json({ message: "Description is required" });
        }
         if (!sub_heading) {
            return res.status(500).json({ message: "Description is required" });
        }

        // check duplicate title
        const postExist = await Post.findOne({ title });
        if (postExist) {
            return res.status(500).json({ message: "A Post already with same title already exists. Please create new one." });
        } 

        const imageUrl = req.file.path;

        if (!req.file.path) {
            return res.status(500).json({ message: "Image is required" });
        }

        const post = new Post({
            title,
            description,
            imageUrl,
            author,
            sub_heading
        });

        await post.save();
        res.json({ message: 'Post added successfully', data: post });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ err: err.message });
    }
}

exports.postList = async (req, res) => {
    try {
        const page = parseInt(req.query.page);
        const per_page_record = parseInt(req.query.per_page_record);

        let posts;
        let total;

        if (page && per_page_record) {
            const pageInt = parseInt(page);
            const perPageRecordInt = parseInt(per_page_record);
            const startIndex = (pageInt - 1) * perPageRecordInt;
            total = await Post.countDocuments();
            posts = await Post.find()
               
                .sort({ createdAt: -1 })
                .skip(startIndex)
                .limit(perPageRecordInt);
        } else {
            posts = await Post.find().sort({ createdAt: -1 });
            total = posts.length;
        }

        const postsWithCounts = posts.map(post => ({
            ...post._doc

          }));

        return res.json({
            message: "Post list retrieved successfully",
            data: postsWithCounts,
            total: total,
            success: true,
        });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}


exports.editPost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ error: "Post not found" });
        }

        // req body
        const { title, description,author, sub_heading } = req.body;
        const image = req.file ? req.file.path : null;

        // Update post fields only if different from existing
        let isUpdated = false;
        if (title && title !== post.title) {
            post.title = title;
            isUpdated = true;
        }
        if (description && description !== post.description) {
            post.description = description;
            isUpdated = true;
        }
        if (sub_heading && sub_heading !== post.sub_heading) {
            post.sub_heading = sub_heading;
            isUpdated = true;
        }
        if (author && author !== post.author) {
            post.author = author;
            isUpdated = true;
        }
        
        if (image) {
            post.imageUrl = image;
            isUpdated = true;
        }

        if (isUpdated) {
            const savePosts = await post.save();
            return res.json({
                message: "Post updated successfully",
                success: true,
                data: savePosts,
            });
        } else {
            return res.json({
                message: "No changes detected, nothing to update",
                success: true,
            });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: error.message });
    }
}

// delete post by id
// exports.deletePost = async (req, res) => {
//     try {
//         const post = await Post.findByIdAndDelete(req.params.id);
//         if (!post) {
//             return res.status(404).json({ error: "Post not found" });
//         }
//         return res.json({ message: "Post deleted successfully" });
//     } catch (error) {
//         return res.status(500).json({ error: error.message });
//     }
// }

const fs = require("fs");
const path = require("path");

exports.deletePost = async (req, res) => {
  try {
   
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

  
    if (post.image) {
      const imagePath = path.join(__dirname, "../uploads", post.image); // Adjust the path as per your setup
      fs.unlink(imagePath, (err) => {
        if (err) {
          console.error("Error deleting image:", err);
        }
      });
    }

   
    await Post.findByIdAndDelete(req.params.id);

    return res.json({ message: "Post and associated image deleted successfully" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};


// get post by id

exports.getPostById = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ error: "Post not found" });
        }
        
        return res.json({ message: "Post retrieved successfully", data: post });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}
