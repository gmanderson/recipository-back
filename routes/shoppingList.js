const express = require('express')
const router = express.Router()
const ShoppingList = require('./../models/ShoppingList')


// POST - Create a new shopping list
router.post('/', (req, res) => {
    let newList = new ShoppingList()

    newList.save()
    .then((list) => {
        return res.status(201).json(list)
        })
    .catch(err => {
        return res.status(500).send({
            message: "Problem creating shopping list",
            error: err
        })
    })
})

// Export router
module.exports = router