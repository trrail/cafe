let Reservation = require('../models/reservation');
let Table = require('../models/table');
let Waiter = require('../models/waiter');
let Menu = require('../models/menu');
let async = require('async');
var debug = require('debug');

const { body,validationResult } = require('express-validator');

exports.index = function (req, res) {
    async.parallel({
        reservation_count: function (callback) {
            Reservation.countDocuments({}, callback);
        },
        table_count: function (callback) {
            Table.countDocuments({}, callback);
        },
        waiters_count: function (callback) {
            Waiter.countDocuments({}, callback);
        },
        menu_count: function (callback) {
            Menu.countDocuments({}, callback);
        }
    }, function (err, results) {
        res.render('index', {
            title: 'Ресторан "Синтаксический сахар"',
            error: err,
            data: results
        });
    });
};

exports.free_tables = function(req, res, next) {
    Table.find()
        .exec(function (err, free_tables) {
            if (err) {
                debug('Find tables error', err);
                return next(err);}
            res.render('free_tables', {title: 'Свободные столики',
                free_tables: free_tables,
                type: 'free',
                p_tables: 'свободных'
            })
        })
};

exports.reserve_get = function (req, res, next) {
    res.render('reserve_form', {title: 'Резервирование стола'})
};

exports.reserve_post = [
    body('date', 'Неверная дата').trim().isDate().escape(),
    body('name', 'Имя должно быть длинее 4 букв').isLength({min: 4}),
    (req, res, next) => {
        let errors = validationResult(req);
        if (!errors.isEmpty()) {
            // There are errors. Render the form again with sanitized values/error messages.
            res.render('reserve_form', { title: 'Резервирование стола', errors: errors.array()});
        }
        else {
            let now_date = Date.now();
            let res_date = new Date(req.body.date);
            if (now_date < res_date) {
                async.parallel({
                    table: function (callback) {
                        Table.findById(req.params.id).exec(callback);
                    },
                    todays_reservations: function (callback){
                        Reservation.findOne({date: req.body.date, table: req.params.id})
                            .populate('table')
                            .exec(callback)
                    }
                }, function (err, results) {
                    if (err) {
                        debug('Find table by ID error', err);
                        return next(err);
                    }
                    let do_it = false
                    if (results.todays_reservations === null)
                        do_it = true;

                    if (do_it) {
                        let reserve = new Reservation({
                            table: results.table,
                            name: req.body.name,
                            date: req.body.date
                        });
                        results.table.isReserved = true;
                        results.table.reserve_count += 1;
                        results.table.save()
                        reserve.save(function (err) {
                            if (err) {
                                debug('Reserve save error', err);
                                return next(err);
                            }
                            res.render('reserve_status', {title: 'Столик забронирован!'});
                        });
                    }
                    else
                        res.render('reserve_form', {
                            title: 'Резервирование стола',
                            errors: [{msg: 'Стол уже забронирован'}]
                        });
                })
            }
            else
                res.render('reserve_form',
                    { title: 'Резервирование стола', errors: [{msg: 'Нельзя бронировать в прошлом'}]})
        }
    }
];

exports.del_reserve_get = function (req, res, next){
    res.render('del_reserve', {title: 'Отменить бронирование'});
};

exports.del_reserve_post = [
    body('date', 'Неверная дата').trim().isDate().escape(),
    body('name', 'Введите коректное имя бронирования').isLength({min: 4}),
    (req, res, next) => {
        var table = 0;
        async.parallel({
            reserve: function (callback) {
                Reservation.findOne({name: req.body.name, date: req.body.date})
                    .populate('table')
                    .exec(callback)

            }
        }, function (err, results) {
            if (err) {
                debug('Find real reserve error', err);
                return next(err);
            }
            if (results.reserve !== null) {
                results.reserve.table.reserve_count -= 1;
                if (results.reserve.table.reserve_count === 0)
                    results.reserve.table.isReserved = false;
                results.reserve.table.save();
                results.reserve.remove();
                res.render('reserve_status', {title: 'Бронирование успешно отменено!'});
            }
            else
                res.render('del_reserve', {title: 'Отменить бронирование!', errors: [{msg: 'На это имя никто не бронировал стол'}]})
        });
    }
];

exports.reserved_tables = function(req, res, next) {
    Table.find({isReserved: true})
        .exec(function (err, free_tables) {
            if (err) {
                debug('Find tables error', err);
                return next(err);}
            res.render('free_tables', {title: 'Занятые столики',
                free_tables: free_tables,
                type: 'reserved',
                p_tables: 'зерезервированных'
            })
        })
};