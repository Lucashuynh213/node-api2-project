// implement your posts router here
const express = require("express");
const Post = require("./posts-model");
const router = express.Router();

router.get("/", (req, res) => {
  Post.find()
    .then((found) => {
      res.json(found);
    })
    .catch((err) => {
      res.status(500).json({
        message: "The posts information could not be retrieved",
        error: err.message,
        stack: err.stack,
      });
    });
});
router.get("/:id", async (req, res) => {
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
router.post("/", (req, res) => {
  const { title, contents } = req.body;

  if (!title || !contents) {
    return res.status(400).json({
      message: "Please provide title and content for the post",
    });
  } else {
    Post.insert({ title, contents })
      .then(({ id }) => {
        return Post.findById(id);
      })
      .then((post) => {
        res.status(201).json(post);
      })
      .catch((err) => {
        res.status(500).json({
          message: "The posts information could not be retrieved",
          error: err.message,
          stack: err.stack,
        });
      });
  }
});
router.delete("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
    if(!post) {
        res.status(404).json({
            message: 'The post with the specified ID does not exist',
        })
    }else{
        await Post.remove(req.params.id)
        res.json(post)
    }
  } catch (err) {
    res.status(500).json({
      message: "The posts could not be removed",
      error: err.message,
      stack: err.stack,
    });
  }
});
router.put("/:id", (req, res) => {
    const { title, contents } = req.body;

    if (!title || !contents) {
        return res.status(400).json({
          message: "Please provide title and contents for the post",
        });
      } else {
        Post.findById(req.params.id)
        .then(stuff => {
            if (!stuff){
                res.status(404).json({
                    message: 'The post with the specified ID does not exist'
                });
            }else{
                return Post.update(req.params.id, req.body)
            }
        })
        .then(data => {
            if (data) {
                return Post.findById(req.params.id)
            }
        })
        .then(post => {
            if(post) {
                res.json(post)
            }
        })
        .catch(err => {
            res.status(500).json({
                message: "The posts information could not be retrieved",
                err: err.message,
                stack: err.stack,
            })
        })
    }
});
router.get("/:id/comments", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id); 
    if (!post) {
      // Set the status code before sending the response
      return res.status(404).json({
        message: "The post with the specified ID does not exist",
      });
    } else {
      // If the post exists, retrieve its comments
      const messages = await Post.findPostComments(req.params.id);
      res.json(messages);
    }
  } catch (err) {
    // Handle any errors that occur during the process
    res.status(500).json({
      message: "The comments information could not be retrieved",
      error: err.message,
      stack: err.stack,
    });
  }
});

module.exports = router;
