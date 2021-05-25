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

// PUT - clear whole list  --------------------------------------
router.put('/clearList/:id', (req, res) => {  
    // validate check
    if(!req.params.id){
      return res.status(400).json({
        message: "No id of list specified"
      })
    }

    // clear all items from array (array - push)
    ShoppingList.updateOne({
      _id: req.params.id
    }, {
        items: []
    })
      .then((user) => {            
        res.json({
          message: "Items added"
        })
      })
      .catch(err => {
        console.log(err)
        res.status(500).json({
          message: "Problem adding items"
        })
      })
  })

  router.put('/addItems/:id', (req, res) => {  
    // validate check
    if(!req.body.items){
      return res.status(400).json({
        message: "No items specified"
      })
    }
    // add items to ingredients array (array - push)
    ShoppingList.updateOne({
      _id: req.params.id
    }, {
      $push: {
        items: req.body.items
      }
    })
      .then((user) => {            
        res.json({
          message: "Items added"
        })
      })
      .catch(err => {
        console.log(err)
        res.status(500).json({
          message: "Problem adding items"
        })
      })
  })


// GET - Get shopping list by ID
router.get('/:id', (req, res) => {
    ShoppingList.findById(req.params.id)
    .then(list => {
        return res.status(201).json(list)
    })
    .catch(err => {
        return res.status(500).send({
            message: "Problem getting list",
            error: err
        })
    })
})


// DELETE - Deletes shopping list only upon user deletion

// Export router
module.exports = router