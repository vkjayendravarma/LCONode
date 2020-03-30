const express = require('express')
const router = express.Router()

// @type : get
// @route: /api/profile
// @desc: testing 
// @access: PUBLIC
router.get('/', (req, res) => {
    res.json({test: 'profile is succes'})
})



module.exports  = router