/* Model meaning -> wrapper for Schema -> like interface for querying with database, etc */

/*  Mongoose library used to creates a connection '
between MongoDB and the Express web application framework   */

const mongoose = require('mongoose');

/*  Schema defines structure of data being stored in the mongoDB database   */

const Schema = mongoose.Schema;

// defining what characteristics user needs to have -> Takes in a Schema format

/*  Creating User schema   */

const UserSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    fullname: {
        type: String,
        required: true
    },
    email : {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true
    },
    img_url : {
        type: String,
    },
    gender : {
        type : String
    },
    phone_number : {
        type : String
    }, 
    city : {
        type : String
    }, 
    address : {
        type : String
    },
    cart : []
})


// connecting this model to User schema to the collection of the MongoDB "Users" (Name needs to be singular -> Checks for plural)
const User = mongoose.model('User', UserSchema);

// Hera after the User is created and linked with the Database.

/* Exporting this schema so that other pages can use this as well. */
module.exports = User;

