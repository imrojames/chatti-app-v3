const bcrypt = require('bcrypt');

module.exports = {
    register: async function (req, res) {
        try {
            const {fname, lname, username, email, password} = req.body;
            const hashedPassword = await bcrypt.hash(password, 10);
            const user = await User.create({fname, lname, username, email, password: hashedPassword}).fetch();
            return res.json(user);
        } catch (err) {
            return res.status(500).json({error: err.message});
        }
    },

    login: async function (req, res) {
        try {
            const { email, password } = req.body;
            const user = await User.findOne({ email });

            if (!user) {
                return res.status(401).json({error: 'Invalid credentials'});
            }
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(401).json({error: 'Invalid credentials'});
            }

            // Create session
            req.session.userId = user.id;
            req.session.userFname = user.fname;
            req.session.userLname = user.lname;

            // mark the user as active in the database
            await User.updateOne({id: user.id}).set({isActive: true});

            // Broadcast active user to all connected socket in the onlineUser room
            sails.sockets.broadcast('onlineUser', 'active', {
                id: user.id, 
                fname: user.fname,
                lname: user.lname
            });

            return res.json(user);
        } catch (err) {
            return res.status(500).json({error: err.message});
        }
    },

    getActiveUsers: async function (req, res) {
        try {
            const users = await User.find({isActive: true});
            return res.json(users);
        } catch (err) {
            return res.status(500).json({error: err.message});
        }
    },

    join: async function (req, res) {
        if (!req.isSocket) {
            return res.badRequest('This action is only available over WebSocket.');
        }

        // Subscribe the socket to the "onlineUser" room
        sails.sockets.join(req, 'onlineUser');
        return res.ok();
    },

    logout: async function (req, res) {
        try {
            req.session.userId = null;

            return res.json({message: 'Logged out successfully'});
        } catch (err) {
            return res.status(500).json({error: err.message});
        }
    },

    updateIsActive: async function (req, res) {
        try {
             userId = req.params.id;
            const isLogout = await User.updateOne({id: userId}).set({isActive: false});

            // Broadcast the deletion event to all connected sockets
            sails.sockets.broadcast('onlineUser', 'inActive', { id: req.session.userId });

            return res.json(isLogout);
        } catch (err) {
            return res.status(500).json({error: err.message});
        }
    }
};