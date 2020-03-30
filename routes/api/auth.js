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


// @type : POST
// @route: /api/auth/login
// @desc: user login 
// @access: PUBLIC

router.post('/login', (req, res)=>{
    const email = req.body.email
    const password = req.body.password

    Person.findOne({email})
    .then((person) =>{

        if(person){
            bcrypt.compare(password, person.password)
            .then(isCorrect =>{
                if(isCorrect) {
                    // res.json({success:true, res:"login"})
                    // Use payload to create token 

                    const payload ={
                        id: person.id,
                        name: person.name,
                        email: person.email
                    }

                    jsonwt.sign(
                        payload,
                        key,
                        {expiresIn:  60*60},
                        (err, token) =>{
                            if(err){
                                res.status(400).json({success: false, message: "login Failed"})
                            }
                            else{
                                res.status(200).json({success: true, token: "Bearer " + token})
                            }
                        }
                    )
                }

                else res.status(400).json({success:false, res:'password incorrect'})
            }).catch(err => console.log(err))
        }
        else{
            return res.status(400).json({success:false, error: "User not found please register"})
        }

    })
    .catch(err => console.log(err))
})

// @type : GET
// @route: /api/auth/profile
// @desc: user profile 
// @access: PRIVATE

router.get('/profile', passport.authenticate('jwt',{session:false}), (req, res) => {
    console.log(req.user);
    res.status(200).json({
        success: true,
        result:{
            id: req.user.id,
            email: req.user.email,
            profilePic: req.user.profilePic,
            name: req.user.name
        }
    })
})

module.exports  = router