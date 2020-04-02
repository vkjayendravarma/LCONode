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
    profileValues.user = req.user.id
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
                      return
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
// @route: /api/profile/find/userName
// @desc: Individul user profile Update with username
// @access: PUBLIC

router.get("/find/:username", (req, res) => {
    
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


// @type : GET
// @route: /api/profile/everyone
// @desc: All user profile Update with username
// @access: PUBLIC

router.get("/everyone", (req, res) => {
    
    Profile.find()
      .populate('user',['name', 'profilePic'])
      .then(profile => {
        if (!profile) {
          res.status(404).json({ usernotfound: "User not found" });
        }
         
            res.status(200).json(profile);
        
        
      })
      .catch(err => console.log("Error in fetching username " + err));
  });


// @type : DELETE
// @route: /api/profile/delete
// @desc: All user profile Update with username
// @access: PUBLIC

router.delete('/', passport.authenticate('jwt', {session: false}), (req, res) => {
    Profile.findOneAndRemove({user: req.user.id}).then(() => {
        Person.findOneAndRemove({_id: req.user.id}).then(() => res.status(200).json({success:true, message:"delete success"})).catch((err) => console.log(err))
    }).catch(err => console.log(err))
} )


// @type : POST
// @route: /api/profile/work
// @desc: All user profile Update with username
// @access: PUBLIC

router.post('/work',passport.authenticate('jwt', {session: false}), (req, res) => {
    Profile.findOne({user: req.user.id}).then((profile) =>{
        if(!profile){
            res.status(404).json({success:false, message:"profile not found"})
        }
        else{
            let newWork = {
                role: req.body.role,
                company: req.body.company,
                country: req.body.country,
                from: req.body.from,
                to: req.body.to,
                current: req.body.current,
                details: req.body.details
            }
            profile.workRole.unshift(newWork)
            profile.save().then((profile) => res.json({profile})).catch(err => console.log(err))
        }
    }).catch((err) => console.log(err))
})

// @type : DELETE
// @route: /api/profile/work/:w_id
// @desc: All user profile Update with username
// @access: PRIVATE

router.delete('/work/:w_id',passport.authenticate('jwt', {session: false}), (req, res) =>{
    Profile.findOne({user: req.user.id}).then((profile) => {
        if(profile){
            let removeThis = profile.workRole.map(item => item.id).indexOf(req.params.w_id)

            if(removeThis){
                profile.workRole.splice(removeThis, 1)

                profile.save().then((profile) => {
                    res.status(200).json({success:true, message: "delete success", result: profile})
                }).catch(err => console.log(err))
            }

            else{
                res.status(404).json({success:false, message: "not found"})
            }

            
        }
        else{
            res.status(404).json({success:false, message: "not found"})
        }
    }).catch((err) => console.log(err))
})

module.exports = router