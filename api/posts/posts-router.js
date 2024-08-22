// implement your posts router here
const express =require('express')
const Post = require ('./posts-model')
const router = express.Router() 

router.get('/', (req,res) => {
    Post.find()
    .then(found => {
        res.json(found)
    })
    .catch(err => {
        res.status(500).json({
            message: "The posts information could not be retrieved",
            error: err.message,
            stack: err.stack,
        })
    })
})
router.get('/:id', async (req, res) => {
    const { id } = req.params; // Extract the ID from the request parameters

    try {
        const post = await Post.findById(id); // Await the result of finding the post by ID

        if (post) {
            res.json(post); // If the post is found, return it as JSON
        } else {
            res.status(404).json({
                message: "The post with the specified ID does not exist",
            });
        }
    } catch (err) {
        res.status(500).json({
            message: "The posts information could not be retrieved",
            error: err.message,
            stack: err.stack,
        });
    }
});
router.post('/', (req,res) => {
    const {title,contents} = req.body;

    if (!title || !contents) {
        return res.status(400).json({
            message: "Please provide title and content for the post",
        });
    } else {
        Post.insert({title, contents})
        .then(({id}) => {
            return Post.findById(id)
        })
        .then(post => {
            res.status(201).json(post)
        })
        .catch(err => {
            res.status(500).json({
                message: "The posts information could not be retrieved",
                error: err.message,
                stack: err.stack,
        })
        })
    }
});

router.put('/:id', (req,res) => {
    const {id} = req.params;
    const newUpdate = req.body;

    Post.findByIdAndUpdate(id, newUpdate, { new:true })
        .then(updatedPost =>{
            if(updatedPost){
                res.status(201).json(updatedPost);
            }else{
                res.status(404).json({message: "The post with the specified ID does not exist"})
            }
        })
        .catch(err => {
            res.status(400).json({
                message: "Please provide title and contents for the post",
                error: err.message,
                stack: err.stack,
            })
        })
})
router.delete('/:id', (req,res) => {

})
router.get('/:id/comments', (req,res) => {

})



module.exports = router