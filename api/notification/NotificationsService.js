const DBService = require('../../services/DBService')
const ObjectId = require('mongodb').ObjectId

module.exports = {
    add,
    getById,
    update
}

const COLLECTION_NAME = 'notification';

async function add(room) {
    const collection = await DBService.getCollection(COLLECTION_NAME)
    try {
        await collection.insertOne(room);
        return room;
    } catch (err) {
        throw err;
    }
}

async function getById(id) {
    const collection = await DBService.getCollection(COLLECTION_NAME)
    try {
        const room = await collection.findOne({ "_id": ObjectId(id) })
        return room;
    } catch (err) {
        throw err;
    }
}

async function update(room) {
    const collection = await DBService.getCollection(COLLECTION_NAME)
    const id = new ObjectId(room._id)
    room._id = id
    try {
        await collection.updateOne({ "_id": room._id }, { $set: room })
        return room;
    } catch (err) {
        throw err;
    }
}