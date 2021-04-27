const mongoose = require('mongoose')
const Schema = mongoose.Schema

// Create schema
const shoppingListSchema = new Schema({
    items:[{
        type: String,
        default: "Empty List"
    }]
})

// Create model
const shoppingListModel = mongoose.model('ShoppingList', shoppingListSchema)

// Export model
module.exports = shoppingListModel