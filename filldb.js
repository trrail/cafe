let async = require('async');
let Reservation = require('./models/reservation');
let Table = require('./models/table');
let Waiter = require('./models/waiter');
let Menu = require('./models/menu');

let mongoose = require('mongoose');
let mongoDB = 'mongodb+srv://trail:461017971@cafe.pzdd0.mongodb.net/cafe?retryWrites=true&w=majority';
mongoose.connect(mongoDB);
mongoose.Promise = global.Promise;
mongoose.connection.on('error', console.error.bind(console, 'MongoDB connection error:'));

let tables = [];
let waiters = [];
let menu = [];

function tableCreate(description, waiter, count, reserve_count, callback){
    let table = new Table({
        description: description,
        isReserved: false,
        waiter: waiter,
        count: count,
        reserve_count: reserve_count
    });
    table.save(function (err) {
        if (err) {
            console.log('Error creating table: ' + table);
            callback(err, null);
            return;
        }
        console.log('New table: ' + table);
        tables.push(table);
        callback(null, table);
    });
}

function waiterCreate(name, surname, callback){
    let waiter = new Waiter({name: name, surname: surname});
    waiter.save(function (err) {
        if (err) {
            console.log('Error creating waiter: ' + waiter);
            callback(err, null);
            return;
        }
        console.log('New waiter: ' + waiter);
        waiters.push(waiter);
        callback(null, waiter);
    });
}

function menuCreate(name, description, price, weight, callback){
    let food = new Menu({name: name, description: description, price: price, weight: weight});
    food.save(function (err) {
        if (err) {
            console.log('Error creating food: ' + food);
            callback(err, null);
            return;
        }
        console.log('New food: ' + food);
        menu.push(food);
        callback(null, food);
    });
}

function createWaiters(cb){
    async.parallel([
        function (callback) {
            waiterCreate('Mark', 'Martin', callback)
        },
        function (callback) {
            waiterCreate('Joe', 'Russo', callback)
        },
        function (callback) {
            waiterCreate('Lizy', 'Rose', callback)
        },
        function (callback) {
            waiterCreate('Kira', 'Knightly', callback)
        }
    ], cb);
}

function createTables(cb){
    async.parallel([
        function (callback){
            tableCreate('У окна', waiters[0], 2, 0, callback)
        },
        function (callback){
            tableCreate('Возле камина', waiters[1], 4, 0, callback)
        },
        function (callback){
            tableCreate('По центру', waiters[2], 2, 0, callback)
        },
        function (callback){
            tableCreate('Возле бара', waiters[3], 3, 0, callback)
        },
        function (callback){
            tableCreate('У окна', waiters[2], 2, 0, callback)
        }
    ], cb);
}

function createFood(cb){
    async.parallel([
        function (callback) {
            menuCreate('Ростбиф', 'Очень вкусно', 490, 500, callback)
        },
        function (callback) {
            menuCreate('Борщ', 'Очень вкусно', 320, 250, callback)
        },
        function (callback) {
            menuCreate('Котлетка с пюрешкой', 'Очень вкусно', 370, 300, callback)
        },
        function (callback) {
            menuCreate('Рамен', 'Очень вкусно', 630, 420, callback)
        }
    ], cb);
}

async.series([createWaiters, createTables, createFood],
// Optional callback
    function(err, results) {
        if (err) {
            console.log('Final error: '+err);
        }
        else {
            console.log('Result: '+ results);

        }
        // All done, disconnect from database
        mongoose.connection.close();
    });
