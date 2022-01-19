const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Создание схемы
const MenuSchema = new Schema(
    {
        name: {type: String, required: true, max: 100},
        description: {type: String, max: 150},
        price: {type: Number},
        weight: {type: Number}
    }
);

module.exports = mongoose.model('Menu', MenuSchema)