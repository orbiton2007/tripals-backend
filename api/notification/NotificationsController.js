const NotificationsService = require('./NotificationsService')


module.exports = {
    addRoom,
    getRoom,
    updateRoom
}


async function addRoom(req, res) {
    const newRoom = req.body
    try {
        const room = await NotificationsService.add(newRoom)
        res.json(room)
    } catch (err) {
        res.status(500).send('Could Not Add')
    }

}

async function getRoom(req, res) {
    const id = req.params.id;
    try {
        const room = await NotificationsService.getById(id)
        res.json(room)
    } catch (err) {
        res.status(404).send('Unknown Chat')
    }
}

async function updateRoom(req, res) {
    const room = req.body;
    try {
        const updatedRoom = await NotificationsService.update(room)
        res.json(updatedRoom)
    } catch (err) {
        res.status(500).send('Could Not Update')
    }
}