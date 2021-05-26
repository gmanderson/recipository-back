const express = require('express')
const router = express.Router()
const Utils = require('./../utils')
const Recipe = require('./../models/Recipe')
const path = require('path')

// must have fixed routes before routes with parameters (eg.:id)

// POST - Create a new recipe
router.post('/', (req, res) => {

    // Move ingredients into correct JSON format
    let i
    let data = []
    for(i=0;i<req.body.quantity.length;i++){
        data.push({quantity: req.body.quantity[i], unit: req.body.unit[i], name: req.body.name[i]})
    }
    req.body.ingredients = data
    console.log(req.body)

    // let newRecipe = new Recipe(req.body)
  
    if(req.files){
 // image file must exist, upload, then create new haircut
 let uploadPath = path.join(__dirname, '..', 'public', 'images')

 Utils.uploadFile(req.files.image, uploadPath, (uniqueFilename) => {
     
   req.body.image = uniqueFilename

   let newRecipe = new Recipe(req.body)

   newRecipe.save()
   .then((recipe) => {
       return res.status(201).json(recipe)
       })
   .catch(err => {
       return res.status(500).send({
           message: "Problem creating recipe",
           error: err
       })
   })
})

    }else{
        req.body.image = 'LogoHolder.svg' // REPLACE WITH RECIPOSITORY IMAGE

        let newRecipe = new Recipe(req.body)

        newRecipe.save()
        .then((recipe) => {
            return res.status(201).json(recipe)
            })
        .catch(err => {
            return res.status(500).send({
                message: "Problem creating recipe",
                error: err
            })
        })

    }


})


// GET - Get all non-user recipes (Explore - Default)
router.get('/explore', (req, res) => {
    Recipe.find({isUserRecipe: false})
    .then(recipe => {
        return res.status(201).json(recipe)
    })
    .catch(err => {
        return res.status(500).send({
            message: "Problem getting recipes",
            error: err
        })
    })
})

// GET - Get recipe by ID
router.get('/:id', (req, res) => {
  
    Recipe.findById(req.params.id)
    .then(recipe => {
        return res.status(201).json(recipe)
    })
    .catch(err => {
        return res.status(500).send({
            message: "Problem getting recipes",
            error: err
        })
    })
  })

// GET - Get recipes in recipebook
router.get('/', (req, res) => {

    Recipe.find()
    .then(recipe => {
        return res.status(201).json(recipe)
    })
    .catch(err => {
        return res.status(500).send({
            message: "Problem getting recipes",
            error: err
        })
    })
})

// GET - Get recipes by search criteria - IMPLEMENTED IN FRONT END

// PUT - Update recipe by ID - NOT IMPLEMENTED

// DELETE - Delete recipe by ID (user recipes only)
router.delete('/:id', Utils.authenticateToken, (req, res) => {
    if(!req.params.id){
        return res.status(400).json({
            message: "Recipe id is missing"
        })
    }

    Recipe.findOneAndDelete({_id: req.params.id})
        .then(() => {
            res.json({
                message: "Recipe deleted"
            })

        })
        .catch(err => {
            console.log("Error deleting recipe", err)
            res.status(500).json({
                message: "Problem deleting recipe",
                error: err
            })
        })
})

module.exports = router