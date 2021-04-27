const mongoose = require('mongoose')
const Schema = mongoose.Schema

//  Create schema
const recipeSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    prepTime: {
        type: String
    },
    cookTime: {
        type: String
    },
    servings: {
        type: Number
    },
    image: {
        type: String
    },
    ingredients: {
        type: [{
            quantity: {
                type: Number,
                required: true
            },
            unit: {
                type: String
            },
            name: {
                type: String,
                required: true
            }
        }]
    },
    directions: {
        type: String,
        required: true
    },
    notes: {
        type: String
    },
    isUserRecipe: {
        type: Boolean,
        required: true,
        default: true
    }
})

// Create the model
const recipeModel = mongoose.model('Recipe', recipeSchema)

// Export the model
module.exports = recipeModel