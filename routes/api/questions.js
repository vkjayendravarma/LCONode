const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const passport = require('passport')


// models
const Person = require('../../models/Person')
const Profile = require('../../models/Profile')
const Question = require('../../models/Question')

// @type : GET
// @route: /api/questions
// @desc: get all questions  
// @access: PUBLIC
router.get('/', (req, res) => {
    Question.find().then(question => {
        res.status(200).json({
            success: true,
            result: question
        })
    }).catch(err => console.log("get err question" + err))
})

// @type   : POST
// @route  : /api/questions/
// @desc   : submit questions  
// @access : PRIVATE

router.post('/', passport.authenticate('jwt', {
    session: false
}), (req, res) => {
    let newQuestion = new Question({
        textone: req.body.textone,
        texttwo: req.body.texttwo,
        user: req.user.id,
        name: req.body.name,
    })

    newQuestion.save().then((question) => {
        res.status(200).json({
            success: true,
            result: question
        })
    }).catch((err) => console.log("questions err" + err))
})

// @type   : POST
// @route  : /api/questions/anwer/:id
// @desc   : submit answer for a question
// @access : PRIVATE

router.post('/answer/:id', passport.authenticate('jwt', {
    session: false
}), (req, res) => {

    Question.findById(req.params.id).then(question => {
        let answer = {
            user: req.user.id,
            text: req.body.answer,
            name: req.body.name,
        }

        question.answers.unshift(answer)

        question.save().then((question) => {
            res.status(200).json({
                success: true,
                result: question
            })
        }).catch(err => console.log(err))
    }).catch((err) => console.log(err))
})

// @type   : GET
// @route  : /api/questions/upvote/:id
// @desc   : upvote for a question
// @access : PRIVATE

router.post('/upvote/:id', passport.authenticate('jwt', {
    session: false
}), (req, res) => {
    Question.findById(req.params.id).then(question => {
        if(question){
            let upvote = {
                user: req.user.id,
            }
            if (question.upvotes.filter(user => user.user).length) {
                question.upvotes = question.upvotes.filter((vote) => vote.user != req.user.id)
                
                question.save().then((question) => {
                    res.status(200).json({success: true, message: "Upvote removed", question: question})
                })                            
            }
            else{
                question.upvotes.unshift(upvote)
                question.save().then((question) => {
                    res.status(200).json({
                        success: true,
                        result: question
                    })
                }).catch(err => console.log(err))
            }
        }
        else{
            res.status(404).json({success:false, message: "question not found"})
        }
        
    }).catch((err) => console.log(err))
})


module.exports = router