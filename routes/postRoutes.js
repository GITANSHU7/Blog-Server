const express = require('express');
const router = express.Router();

const postController = require('../controller/postController');
const upload = require('../middleware/multerConfig');

router.post('/', postController.postList);
router.post('/create',upload.single('image'), postController.addPost);
router.put('/update/:id',upload.single('image'), postController.editPost);
router.delete('/delete/:id',  postController.deletePost);
router.get('/:id', postController.getPostById);


module.exports = router;
