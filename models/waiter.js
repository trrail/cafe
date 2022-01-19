const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create schema
const WaiterSchema = new Schema(
    {
        name: {type: String, required: true, max: 50},
        surname: {type: String, required: true, max: 50}
    }
);

module.exports = mongoose.model('Waiter', WaiterSchema)