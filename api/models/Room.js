module.exports = {
    attributes: {
        users: {collection: 'user', via: 'rooms'},
        messages: {collection: 'message', via: 'room'},
        roomKey: {type: 'string', required: true, unique: true}
    }
};