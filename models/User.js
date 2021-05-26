const mongoose = require('mongoose')
const Schema = mongoose.Schema
const Utils = require('./../utils')
const shoppingList = require('./../routes/shoppingList')
require('mongoose-type-email')

// schema
const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  email: {
    type: mongoose.SchemaTypes.Email,
    required: true    
  },
  password: {
    type: String,
    required: true
  },
  state: {
    type: String,
    required: true
  },
  avatar: {
    type: String    
  },
  accessLevel: {
    type: Number,
    required: true,
    default: 1
  },
  recipes:[
    {type: Schema.Types.ObjectId, ref: 'Recipe'}
  ],
  shoppingList:{
    type: Schema.Types.ObjectId
  },
  newUser: {
    type: Boolean,
    default: true
  }
}, { timestamps: true })

// encrypt password field on save
userSchema.pre('save', function(next) {
  // check if password is present and is modifed  
  if( this.password && this.isModified() ){
      this.password = Utils.hashPassword(this.password);
  }
  next()
})

// model
const userModel = mongoose.model('User', userSchema)

// export
module.exports = userModel




