const express = require('express')
const auth = require('../middleware/auth')
const User = require('../models/user')
const { sendWelcomeEmail } = require('../emails/account')
const router = new express.Router()

// Routes

//------------------------------REGISTRATION AND LOGIN ROUTES---------------------------------------------------

// 1)--------------------REGISTRATION

router.post('/register', async (req, res) => {
    const user = new User(req.body)

    try{
      await user.save()
      const token = await user.generateAuthToken()
      sendWelcomeEmail(user.email, user.name)
      res.status(201).json({
          msg: 'User Created!',
          user: user,
          token: token,
          expiresIn: 3600
        })
    } catch(e) {
      var msg = 'error'

      if (e.keyValue.phone) {
        //console.log(e.keyValue.phone)
        msg = "Phone No already enrolled"
      } else if (e.keyValue.email) {
        console.log(e.keyValue.email)
        msg = "Email already enrolled"
      } else if ((e.keyValue.email) && (e.keyValue.phone)) {
        msg = "Email and Phone No already enrolled"
      } else {
        msg = e
      }

      res.status(400).json({
        msg: msg
      })
    }

})

router.post('/login', async (req, res) => {
    const email = req.body.email
    const password = req.body.password

    try{
      const user = await User.findByCredentials(email, password)
      const token = await user.generateAuthToken()
      res.status(200).json({
        user: user,
        token: token,
        expiresIn: 3600
      })
    } catch(e){
      res.status(400).json({
        error: e,
        msg: 'Auth Failed!..Not Registered'
      })
    }
})


router.post('/users/logout', auth, async (req, res) => {
    //console.log(req.user)
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.user.save()

      res.status(200).json({
        msg: 'You are now logged out!'
      })
    } catch (e) {
      res.status(500).json({
        error: e
      })
    }
})

router.post('/users/logoutAll', auth, async (req, res) => {
    //console.log(req.user)
    try {
        req.user.tokens = []
        await req.user.save()
        res.send()
    } catch (e) {
        res.status(500).send()
    }
})

//-------------------------------------USERS---------------------------------------------------------

//--------PROFILE DETAILS OF 

// 1) VIEW PROFILE ROUTES

router.get('/users', auth, async (req, res) => {
  const users = await User.find({})
  res.json({
    users: users
  })
})


module.exports = router
