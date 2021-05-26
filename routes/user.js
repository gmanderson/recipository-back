const express = require('express')
const router = express.Router()
const Utils = require('./../utils')
const User = require('./../models/User')
const path = require('path')

// GET - get single user -------------------------------------------------------
router.get('/:id', Utils.authenticateToken, (req, res) => {
  if(req.user._id != req.params.id){
    return res.status(401).json({
      message: "Not authorised"
    })
  }

  User.findById(req.params.id)
    .populate({path: 'recipes', model: 'Recipe'})
    .populate({path: 'shoppingList', model: 'ShoppingList'})
    .then(user => {
      res.json(user)
    })
    .catch(err => {
      console.log(err)
      res.status(500).json({
        message: "Couldn't get user",
        error: err
      })
    })
})

  // PUT - collect recipe --------------------------------------
  router.put('/collectRecipe', Utils.authenticateToken, (req, res) => {  
    // validate check
    if(!req.body.recipeId){
      return res.status(400).json({
        message: "No recipe ID specified"
      })
    }
    // add recipeId to recipes field (array - push)
    User.updateOne({
      _id: req.user._id
    }, {
      $push: {
        recipes: req.body.recipeId
      }
    })
      .then((user) => {            
        res.json({
          message: "Recipe collected"
        })
      })
      .catch(err => {
        console.log(err)
        res.status(500).json({
          message: "Problem collecting recipe"
        })
      })
  })

    // PUT - remove recipe --------------------------------------
    router.put('/removeRecipe', Utils.authenticateToken, (req, res) => {  
      // validate check
      if(!req.body.recipeId){
        return res.status(400).json({
          message: "No recipe ID specified"
        })
      }
      // remove recipeId from recipes field (array - push)
      User.updateOne({
        _id: req.user._id
      }, {
        $pull: {
          recipes: req.body.recipeId
        }
      })
        .then((user) => {            
          res.json({
            message: "Recipe removed"
          })
        })
        .catch(err => {
          console.log(err)
          res.status(500).json({
            message: "Problem removing recipe"
          })
        })
    })

// PUT - update user ---------------------------------------------
router.put('/:id', Utils.authenticateToken, (req, res) => {
  // validate request
  if(!req.body) return res.status(400).send("Task content can't be empty")
  
  let avatarFilename = null

  // if avatar image exists, upload!
  if(req.files && req.files.avatar){
    // upload avater image then update user
    let uploadPath = path.join(__dirname, '..', 'public', 'images')
    Utils.uploadFile(req.files.avatar, uploadPath, (uniqueFilename) => {
      avatarFilename = uniqueFilename
      // update user with all fields including avatar
      updateUser({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        avatar: avatarFilename        
      })
    })
  }else{
    // update user without avatar   
      updateUser(req.body)
  }

    // update User
    function updateUser(update){    
      User.findByIdAndUpdate(req.params.id, update, {new: true})
      .then(user => res.json(user))
      .catch(err => {
        res.status(500).json({
          message: 'Problem updating user',
          error: err
        })
      }) 
    }
  })

// PUT - update password
router.put('/password/:id', Utils.authenticateToken, (req, res) => {
  // validate request
  if(!req.body) return res.status(400).send("Task content can't be empty")

      // Check new password is correctly entered
      if(req.body.newPassword === req.body.confirmNewPassword){
        // Hash the new password
        const hashedPassword = Utils.hashPassword(req.body.newPassword)

        User.findByIdAndUpdate(req.params.id, {password: hashedPassword}, {new: true})
        .then(user => res.json(user))
        .catch(err => {
          res.status(500).json({
            message: 'Problem updating user',
            error: err
          })
        }) 

      }


  })

// POST - create new user --------------------------------------
router.post('/', (req, res) => {
  // validate request
  if(Object.keys(req.body).length === 0){   
    return res.status(400).send({message: "User content can not be empty"})
  }

  // check account with email doen't already exist
  User.findOne({email: req.body.email})
  .then(user => {
    if( user != null ){
      return res.status(400).json({
        message: "email already in use, use different email address"
      })
    }
  // create new user       
  let newUser = new User(req.body)
  newUser.save()
    .then(user => {        
      // success!  
      // return 201 status with user object
      return res.status(201).json(user)
    })
    .catch(err => {
      console.log(err)
      return res.status(500).send({
        message: "Problem creating account",
        error: err
      })
    })
  })
})

// ------- DELETE:- DELETE USED BY ID -------
    router.delete('/:id', (req, res) => {
      if(!req.params.id){
          return res.status(400).json({
              message: "User id is missing"
          })
      }
  
      User.findOneAndDelete({_id: req.params.id})
          .then(() => {
              res.json({
                  message: "User deleted"
              })
  
          })
          .catch(err => {
              console.log("Error deleting user", err)
              res.status(500).json({
                  message: "Problem deleting user",
                  error: err
              })
          })
  })

module.exports = router