const express = require('express');
const router = express.Router();

let resController = require('../controllers/reservationController');
let menuController = require('../controllers/menuController');

/* GET home page. */
router.get('/', resController.index);

router.get('/menu', menuController.food_list)

router.get('/tables', resController.free_tables)

router.get('/tables/:id', resController.reserve_get)

router.post('/tables/:id', resController.reserve_post)

router.get('/del_reserve', resController.del_reserve_get)

router.post('/del_reserve', resController.del_reserve_post)

module.exports = router;