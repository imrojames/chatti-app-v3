module.exports = {
    index: async function (req, res) {
        try {
            return res.view('pages/home', {title: "ChatTi", userId: req.session.userId, userFname: req.session.userFname, userLname: req.session.userLname});
        } catch (err) {
            return res.serverError(err);
        }
    },

    loginPage: async function (req, res) {
        try {
            return res.view('pages/login', {title: "ChatTi"});
        } catch (err) {
            return res.serverError(err); 
        }
    },

    registerPage: async function (req, res) {
        try {
            return res.view('pages/register', {title: "ChatTi"});
        } catch (err) {
            return res.serverError(err);
        }
    },

    chatPage: async function (req, res) {
        try {
            const recieverName = req.params.recieverName;
            const recieverID = req.params.recieverID;
            return res.view('pages/chat', {title: "ChatTi", userId: req.session.userId, userFname: req.session.userFname, userLname: req.session.userLname, recieverName: recieverName, recieverID: recieverID});
        } catch (err) {
            return res.serverError(err);
        }
    }
};