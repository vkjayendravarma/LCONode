const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const jsonwt = require('jsonwebtoken')
const passport = require('passport')
const key = require('../../setup/dbconfig').secret

// @type : get
// @route: /api/auth
// @desc: testing 
// @access: PUBLIC

router.get('/', (req, res) => {
    res.json({test: 'auth test'})
})


// import regester scheme
const Person = require('../../models/Person')

// @type : POST
// @route: /api/auth/register
// @desc: user registration 
// @access: PUBLIC

router.post('/register', (req, res) => {
    Person
    .findOne({email: req.body.email})
    .then( person => {
        if(person){
            return res.status(400).json({status: false, error: 'email is already registered'})
        }
        else{
            let newperson = new Person({
                name: req.body.name,
                email: req.body.email,
                password: req.body.password
            })

            // let password = newperson.password

            // password encryption 
            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(newperson.password, salt, (err, hash) => {
                    // Store hash in your password DB.
                    if(err) throw err
                    else{
                        newperson.password = hash
                        newperson.save()
                        .then((personRes) => res.status(200).json(personRes))
                        .catch((err) => console.log(err) )
                    }
                });
            });
        }
    })
    .catch(err => {

        console.log(err)
    });
})


module.exports  = router