/* Model meaning -> wrapper for Schema -> like interface for querying with database, etc */

/*  Mongoose library used to creates a connection '
between MongoDB and the Express web application framework   */

const mongoose = require('mongoose');

/*  Schema defines structure of data being stored in the mongoDB database   */

const Schema = mongoose.Schema;

// defining what characteristics user needs to have -> Takes in a Schema format

/*  Creating VehicleFull schema   */

const VehFullSchema = new Schema({
    title : {
        type: String,
        unique: true
    },
    desc : {
        type: String,
        unique: true 
    },
    brand : {
        type: String,
        unique: true
    },
    model : {
        type: String,
        unique: true
    },
    variant : {
        type: String,
        unique: true
    },
    img_link : {
        type: String,
        unique: true
    }
})

/* Model meaning -> wrapper for Schema -> like interface for querying with database, etc */

const VehFull = mongoose.model("vehicle-full-details", VehFullSchema);

/* Exporting this schema so that other pages can use this as well. */
module.exports = VehFull;
