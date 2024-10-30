module.exports = {
    attributes: {
        fname: {type: 'string', required: true},
        lname: {type: 'string', required: true},
        username: {type: 'string', required: true, unique: true},
        email: {type: 'string', required: true, unique: true},
        password: {type: 'string', required: true},
        isActive: {type: 'boolean', defaultsTo: false},
        rooms: {collection: 'room', via: 'users'}
    },
};