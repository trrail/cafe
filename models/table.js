const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Создание схемы
const TableSchema = new Schema(
    {
        description: {type: String, required: true},
        isReserved: {type: Boolean, required: true},
        waiter: {type: Schema.ObjectId, ref: 'Waiter'},
        count: {type: Number, required: true},
        reserve_count: {type: Number, required: true}
    }
);

module.exports = mongoose.model('Table', TableSchema)