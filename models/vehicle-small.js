/* Model meaning -> wrapper for Schema -> like interface for querying with database, etc */

/*  Mongoose library used to creates a connection '
between MongoDB and the Express web application framework   */

const mongoose = require('mongoose');

/*  Schema defines structure of data being stored in the mongoDB database   */

const Schema = mongoose.Schema;

// defining what characteristics user needs to have -> Takes in a Schema format

/*  Creating VehicleSmall schema   */

const VehSmallSchema = new Schema({
    title: {
        type: String,
        required: true,
        unique : true
    },
    range: {
        type: String,
        required: true
    },
    speed: {
        type: String,
        required: true
    },
    max_speed: {
        type: String,
        required: true
    },
    p_power: {
        type: String,
        required: true
    },
    img_link : {
        type: String,
        required: true
    },
    expand_link : {
        type: String,
        required: true
    }
})

/* Model meaning -> wrapper for Schema -> like interface for querying with database, etc */

const VehSmall = mongoose.model("vehicle-small-details", VehSmallSchema);

/* Exporting this schema so that other pages can use this as well. */
module.exports = VehSmall;