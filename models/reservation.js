const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Создание схемы
const ReservationSchema = new Schema(
    {
        table: {type: Schema.ObjectId, ref: 'Table', required: true},
        name: {type: String, requires: true, max: 100},
        date: {type: Date, requires: true},
    }
);

module.exports = mongoose.model('Reservation', ReservationSchema)