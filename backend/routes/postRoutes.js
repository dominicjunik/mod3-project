const express = require('express')
const router = express.Router()

// import postController here
const postController = require('../controllers/postController')
// import middleware to authorize routes that should only work if you are logged in
const { authorize } = require('../middleware/authMiddleware')

//post routes here
// seed
// router.post('/seed', postController.seed)
// index
router.get('/', postController.index)
// delete
router.delete('/:id', authorize, postController.delete)
// update
router.put('/:id', authorize, postController.update)
// create
router.post('/', authorize, postController.create)
// show
router.get('/:id', postController.show)

module.exports = router
