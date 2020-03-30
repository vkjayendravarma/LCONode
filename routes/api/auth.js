const express = require('express')
const router = express.Router()

// @type : get
// @route: /api/auth
// @desc: testing 
// @access: PUBLIC

router.get('/', (req, res) => {
    res.json({test: 'auth is succes'})
})



module.exports  = router