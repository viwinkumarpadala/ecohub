/* Model meaning -> wrapper for Schema -> like interface for querying with database, etc */

/*  Mongoose library used to creates a connection '
between MongoDB and the Express web application framework   */

const mongoose = require('mongoose');

/*  Schema defines structure of data being stored in the mongoDB database   */

const Schema = mongoose.Schema;

// defining what characteristics user needs to have -> Takes in a Schema format

/*  Creating User schema   */

const MessageSchema = new Schema({
    email : {
        type: String
    }, 
    type : {
        type : String
    },
    message : {
        type : String
    }
})


// connecting this model to User schema to the collection of the MongoDB "Users" (Name needs to be singular -> Checks for plural)
const Message = mongoose.model('message', MessageSchema);

// Hera after the User is created and linked with the Database.

/* Exporting this schema so that other pages can use this as well. */
module.exports = Message;

