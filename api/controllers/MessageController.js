const { v4: uuidv4 } = require('uuid');

module.exports = {
    sendMessage: async function (req, res) {
        try {
            const { message, roomKey } = req.allParams();
            const userId = req.session.userId;

            // Save the message to the database
            const newMessage = await Message.create({
                message: message,
                user: userId,
                room: roomKey
            }).fetch();

            const getRoomKey = await Room.findOne({id: roomKey});

            const getUserName = await User.findOne({id: newMessage.user});

            sails.log.debug(`roomKey: ${getRoomKey.roomKey}`);

            // Broadcast the message to the other user in the private room
            sails.sockets.broadcast(getRoomKey.roomKey, 'privateMessage', {
                message: newMessage.message,
                userId: newMessage.user,
                userName: `${getUserName.fname} ${getUserName.lname}`,
                roomId: newMessage.room
            });

            return res.status(200).json({newMessage});
        } catch (err) {
            return res.status(500).json({ error: err.message });
        }
    },

    startChat: async function (req, res) {
        try {
            const userId = req.session.userId;
            // const userId = 1;
            const userId2 = req.param('userId2');
            // const userId2 = 2
            sails.log.debug(`userId2: ${userId2}`);

            // Generating a unique roomkey by joining userId and userId2 eg 1_2. Where 1 = userId and 2 = userId2
            const roomKey = [userId, userId2].sort().join('_');

            // Check if the roomKey already exists in the database
            let room = await Room.findOne({ roomKey: roomKey });

            if (!room) {
                // If the roomKey doesn't exist, create a new room
                room = await Room.create({
                    roomKey: roomKey,
                    users: [userId, userId2]
                }).fetch();
            }
            
            // req.socket.join(room.roomKey);

            // Get the socket ID of the current user
            // const socketId = sails.sockets.getId(req);

            // Join the room for the current socket using `sails.sockets.join()`
            sails.sockets.join(req, room.roomKey);

            sails.log.debug(`Chat started with room ${room.roomKey}`);

            return res.json({ message: `${room.id}` });
        } catch (err) {
            return res.status(500).json({ errorsss: err.message });
        }
    },

    getAllMessages: async function (req, res) {
        try {
            const roomId = req.params.test;
            sails.log.debug(`roomId: ${roomId}`);
            const allMessages = await Message.find({
                room: roomId  // Find messages where room ID is 2
              })
              .populate('user')
              .populate('room');
            
              // Manually filter the fields from user and room
            const filteredMessages = allMessages.map(message => ({
                message: message.message,
                user: {
                fname: message.user.fname,
                lname: message.user.lname,
                id: message.user.id
                },
                room: {
                roomKey: message.room.roomKey
                }
            }));
            return res.status(200).json(filteredMessages);
        } catch (err) {
            return res.status(500).json({ error: err.message });
        }
    }
};