const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const passport = require('passport')


// @type : GET
// @route: /api/profile
// @desc: Individul user profile 
// @access: PRIVATE


// DB models

const Person = require('../../models/Person')
const Profile = require('../../models/Profile')

router.get('/',
    passport.authenticate('jwt', {
        session: false
    }),
    (req, res) => {

        Profile.findOne({
                email: req.user.email
            })
            .then((profile) => {
                if (profile) {
                    res.status(200).json({
                        success: true,
                        responce: profile
                    })
                } else {
                    res.status(404).json({
                        success: false,
                        message: 'No profile'
                    })
                }
            })
            .catch(err => console.log(err))


    })


// @type : POST
// @route: /api/profile
// @desc: Individul user profile Update
// @access: PRIVATE

router.post('/', passport.authenticate('jwt', {
    session: false
}), (req, res) => {
    let profileValues = {}
    profileValues.id = req.user.id
    if (req.body.userName) profileValues.userName = req.body.userName
    if (req.body.website) profileValues.website = req.body.website
    if (req.body.country) profileValues.country = req.body.country
    if (typeof req.body.languages != undefined) profileValues.languages = req.body.languages.split(',')
    if (req.body.portfolio) profileValues.portfolio = req.body.portfolio

    // social
    profileValues.social = {}
    if (req.body.youtube) profileValues.social.youtube = req.body.youtube
    if (req.body.facebook) profileValues.social.facebook = req.body.facebook
    if (req.body.instagram) profileValues.social.instagram = req.body.instagram

    Profile.findOne({
            user: req.body.id
        })
        .then((profile) => {   
            console.log("if profile exixst")                     
            if (profile) {                
                Profile.findOneAndUpdate(
                  { user: req.body.id },
                  { $set: profileValues },
                  { new: true }
                ).then(profileUpdated => { console.log("afterUpdate");
                console.log(profileUpdated);
                
                 res.json(profileUpdated)})
                  .catch(err => console.log("problem in update" + err));
            }
            
            else {
                Profile.findOne({ userName: profileValues.userName })
                  .then(profile => {
                    //Username already exists
                    if (profile) {
                      res.status(400).json({ userName: "Username already exists" });
                    }
                    //save user
                    new Profile(profileValues)
                      .save()
                      .then(profile => res.json(profile))
                      .catch(err => console.log(err));
                  })
                  .catch(err => console.log(err));
              }
        })
        .catch(err => console.log(err))
})


// @type : GET
// @route: /api/profile/userName
// @desc: Individul user profile Update with username
// @access: PUBLIC

router.get("/:username", (req, res) => {
    
    Profile.findOne({ userName: req.params.username })
      .populate('user',['name', 'profilePic'])
      .then(profile => {
        if (!profile) {
          res.status(404).json({ usernotfound: "User not found" });
        }
        else{
            console.log("profile");   
            console.log(profile)     
            res.status(200).json(profile);
        }
        
      })
      .catch(err => console.log("Error in fetching username " + err));
  });


module.exports = router