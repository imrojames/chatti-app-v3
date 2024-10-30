module.exports = {
    attributes: {
        message: {type: 'string', required: true},
        user: {model: 'user', required: true},
        room: {model: 'room', required: true},
        timeStampt: {type: 'number', autoCreatedAt: true}
    }
};