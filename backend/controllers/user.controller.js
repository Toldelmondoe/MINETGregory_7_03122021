exports.AllAccess = (req, res) => {
    res.status(200).send("Public Content.");
};

exports.userBoard = (req, res) => {
    res.status(200).send("User content.");
};

exports.adminBoard = (req, res) => {
    res.status(200).send("Admin content.");
};

exports.moderatorBoard = (req, res) => {
    res.status(200).send("Moderator Content.");
};