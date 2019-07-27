const express = require('express')
// const requireAuth = require('../../middlewares/requireAuth.middleware')
const { addRoom, getRoom, updateRoom } = require('./NotificationsController')
const router = express.Router()


router.post('/', addRoom)
router.get('/:id', getRoom)
router.put('/:id', updateRoom)


module.exports = router