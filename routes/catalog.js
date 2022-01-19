const express = require('express');
const router = express.Router();

let resController = require('../controllers/reservationController');
let menuController = require('../controllers/menuController');

/* GET home page. */
router.get('/', resController.index);

router.get('/menu', menuController.food_list)

router.get('/free_tables', resController.free_tables)

router.get('/free_tables/:id', resController.reserve_get)

router.post('/free_tables/:id', resController.reserve_post)

router.get('/reserved_tables', resController.reserved_tables)

router.get('/reserved_tables/:id', resController.del_reserve_get)

router.post('/reserved_tables/:id', resController.del_reserve_post)

module.exports = router;