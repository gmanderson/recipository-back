const express = require('express')
const router = express.Router()
const Utils = require('./../utils')
const Recipe = require('./../models/Recipe')

// must have fixed routes before routes with parameters (eg.:id)


// POST - Create a new recipe
router.post('/', (req, res) => {
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


// GET - Get all non-user recipes (Explore - Default)
router.get('/', (req, res) => {
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

// GET - Get recipes in recipebook

// GET - Get recipes by search criteria

// PUT - Update recipe by ID

// DELETE - Delete recipe by ID (user recipes only)

module.exports = router