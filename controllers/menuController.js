let Menu = require('../models/menu');

let async = require('async');

exports.food_list = function(req, res, next) {
    Menu.find({})
        .exec(function (err, list_food) {
            if (err) {
                debug('Find list of menu error', err);
                return next(err); }
            //Successful, so render
            res.render('food_list', { title: 'Список блюд', food_list: list_food });
        });
};