const express = require('express')
const router = express.Router()

// @type : get
// @route: /api/questions
// @desc: testing 
// @access: PUBLIC
router.get('/', (req, res) => {
    res.json({test: 'question is succes'})
})



module.exports  = router